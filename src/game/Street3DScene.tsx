import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Character3D } from './Character3D';
import { CharacterAppearance, StreetNPC } from '../types/game';
import { STREET_NPCS } from '../data/gameData';
import { sound } from '../utils/audio';
import { ArrowLeft, MessageSquare, ShoppingBag, Bike } from 'lucide-react';

interface Street3DSceneProps {
  appearance: CharacterAppearance;
  onBackToHostel: () => void;
  onNPCAction: (npc: StreetNPC) => void;
}

export const Street3DScene: React.FC<Street3DSceneProps> = ({
  appearance,
  onBackToHostel,
  onNPCAction
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<Character3D | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<StreetNPC | null>(null);

  // Player position along avenue (x = across road/sidewalk, z = along avenue length)
  const playerPosRef = useRef({ x: 0, z: 0 });
  const playerAngleRef = useRef(0);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const clickTargetRef = useRef<{ x: number; z: number } | null>(null);

  const danfoBusesRef = useRef<THREE.Group[]>([]);
  const okadaBikesRef = useRef<THREE.Group[]>([]);
  const npcsRef = useRef<Map<string, THREE.Group>>(new Map());

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x93c5fd); // Clear Lagos/Ondo daytime sky
    scene.fog = new THREE.Fog(0x93c5fd, 30, 85);

    // Perspective Camera behind player
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 150);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.2);
    sunLight.position.set(20, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Build Campus Boulevard Street & Buildings
    buildStreetEnvironment(scene);

    // Player 3D Character
    const player = new Character3D(appearance);
    player.group.position.set(playerPosRef.current.x, 0, playerPosRef.current.z);
    scene.add(player.group);
    characterRef.current = player;

    // Build NPCs along sidewalk
    STREET_NPCS.forEach((npc) => {
      const npcGroup = buildNPCMesh(npc);
      npcGroup.position.set(npc.x, 0, npc.z);
      scene.add(npcGroup);
      npcsRef.current.set(npc.id, npcGroup);
    });

    // Danfo Minibuses & Okada Bikes on Road
    buildTrafficVehicles(scene);

    // Keyboard handlers
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update Traffic
      danfoBusesRef.current.forEach((bus) => {
        bus.position.x -= delta * 7;
        if (bus.position.x < -60) bus.position.x = 60;
      });

      okadaBikesRef.current.forEach((bike) => {
        bike.position.x += delta * 12;
        if (bike.position.x > 60) bike.position.x = -60;
      });

      // Player Movement Logic (Keyboard or Click Target)
      let isMoving = false;
      let moveX = 0;
      let moveZ = 0;

      const keys = keysPressed.current;
      if (keys['w'] || keys['arrowup']) moveZ -= 1;
      if (keys['s'] || keys['arrowdown']) moveZ += 1;
      if (keys['a'] || keys['arrowleft']) moveX -= 1;
      if (keys['d'] || keys['arrowright']) moveX += 1;

      if (moveX !== 0 || moveZ !== 0) {
        // Clear click target
        clickTargetRef.current = null;
        isMoving = true;
        const length = Math.hypot(moveX, moveZ);
        const speed = 4.2;
        playerPosRef.current.x += (moveX / length) * speed * delta;
        playerPosRef.current.z += (moveZ / length) * speed * delta;

        // Face movement direction
        playerAngleRef.current = Math.atan2(moveX, moveZ);
      } else if (clickTargetRef.current) {
        // Move towards click
        const dx = clickTargetRef.current.x - playerPosRef.current.x;
        const dz = clickTargetRef.current.z - playerPosRef.current.z;
        const dist = Math.hypot(dx, dz);

        if (dist > 0.15) {
          isMoving = true;
          const speed = 4.2;
          const step = Math.min(dist, speed * delta);
          playerPosRef.current.x += (dx / dist) * step;
          playerPosRef.current.z += (dz / dist) * step;
          playerAngleRef.current = Math.atan2(dx, dz);
        } else {
          clickTargetRef.current = null;
        }
      }

      // Clamp player within street sidewalk & roadway bounds
      playerPosRef.current.x = Math.max(-45, Math.min(45, playerPosRef.current.x));
      playerPosRef.current.z = Math.max(-4, Math.min(4, playerPosRef.current.z));

      // Update player model
      if (characterRef.current) {
        characterRef.current.group.position.x = playerPosRef.current.x;
        characterRef.current.group.position.z = playerPosRef.current.z;
        characterRef.current.group.rotation.y = playerAngleRef.current;
        characterRef.current.update(delta, isMoving ? 'walk' : 'idle');
      }

      // Camera smoothly follows player in third person
      const camTargetX = playerPosRef.current.x;
      const camTargetZ = playerPosRef.current.z + 5.5;
      camera.position.x += (camTargetX - camera.position.x) * 0.1;
      camera.position.y += (3.5 - camera.position.y) * 0.1;
      camera.position.z += (camTargetZ - camera.position.z) * 0.1;
      camera.lookAt(playerPosRef.current.x, 1.4, playerPosRef.current.z);

      // Check proximity to NPCs
      let nearestNPC: StreetNPC | null = null;
      STREET_NPCS.forEach((npc) => {
        const dist = Math.hypot(npc.x - playerPosRef.current.x, npc.z - playerPosRef.current.z);
        if (dist < 2.5) {
          nearestNPC = npc;
        }
      });
      setSelectedNPC(nearestNPC);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [appearance]);

  function buildStreetEnvironment(scene: THREE.Scene) {
    // 1. Asphalt Roadway (spanning along X axis from -60 to 60)
    const roadGeo = new THREE.PlaneGeometry(120, 8);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.8 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -1);
    road.receiveShadow = true;
    scene.add(road);

    // Yellow and White Road Markings
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    for (let x = -55; x < 55; x += 6) {
      const lineGeo = new THREE.PlaneGeometry(3, 0.25);
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.01, -1);
      scene.add(line);
    }

    // 2. Sidewalks (North & South)
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });

    const sidewalkSouthGeo = new THREE.BoxGeometry(120, 0.25, 4.5);
    const sidewalkSouth = new THREE.Mesh(sidewalkSouthGeo, curbMat);
    sidewalkSouth.position.set(0, 0.12, 4.25);
    sidewalkSouth.receiveShadow = true;
    scene.add(sidewalkSouth);

    const sidewalkNorthGeo = new THREE.BoxGeometry(120, 0.25, 4.5);
    const sidewalkNorth = new THREE.Mesh(sidewalkNorthGeo, curbMat);
    sidewalkNorth.position.set(0, 0.12, -6.25);
    sidewalkNorth.receiveShadow = true;
    scene.add(sidewalkNorth);

    // 3. Buildings along the avenue
    const buildingColors = [0xfef08a, 0xfecaca, 0xbfdbfe, 0xbbf7d0, 0xfbcfe8, 0xe2e8f0];
    const shopNames = [
      'Peace Cyber Café & Xerox',
      'Mama Put Bukka (Hot Amala)',
      'Sobo Textiles & Ankara',
      'Aure Hair & Braids',
      'Victory Phones & Accessories',
      'AFUED Cooperative Bank',
      'Chop & Chill Suya Spot',
      'First Class Bookstore'
    ];

    shopNames.forEach((name, i) => {
      const bx = -48 + i * 14;
      const bHeight = 5 + (i % 3) * 2.5;
      const bGeo = new THREE.BoxGeometry(11, bHeight, 7);
      const bMat = new THREE.MeshStandardMaterial({
        color: buildingColors[i % buildingColors.length],
        roughness: 0.6,
      });
      const building = new THREE.Mesh(bGeo, bMat);
      building.position.set(bx, bHeight / 2, -11.5);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);

      // Signboard canvas
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, 256, 75);

      const signTex = new THREE.CanvasTexture(canvas);
      const signGeo = new THREE.PlaneGeometry(9, 2.2);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.set(bx, 2.4, -7.9);
      scene.add(sign);

      // Windows
      const winMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });
      for (let wy = 3.8; wy < bHeight - 1; wy += 2.2) {
        for (let wx = -3.5; wx <= 3.5; wx += 3.5) {
          const winGeo = new THREE.BoxGeometry(1.6, 1.4, 0.1);
          const win = new THREE.Mesh(winGeo, winMat);
          win.position.set(bx + wx, wy, -7.95);
          scene.add(win);
        }
      }
    });

    // 4. Giant 3D Billboards featuring generated asset
    const billboardTexLoader = new THREE.TextureLoader();
    billboardTexLoader.load(
      '/src/assets/images/afued_campus_billboard_1791386121734.jpg',
      (tex) => {
        const boardGeo = new THREE.PlaneGeometry(9, 5);
        const boardMat = new THREE.MeshBasicMaterial({ map: tex });
        const board = new THREE.Mesh(boardGeo, boardMat);
        board.position.set(-6, 6.5, -7.8);
        scene.add(board);

        // Frame and poles
        const frameGeo = new THREE.BoxGeometry(9.4, 5.4, 0.3);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x18181b });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(-6, 6.5, -7.9);
        scene.add(frame);
      }
    );

    // Street Lamps
    for (let lx = -45; lx <= 45; lx += 22) {
      const lampGeo = new THREE.CylinderGeometry(0.08, 0.1, 5, 8);
      const lampMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const pole = new THREE.Mesh(lampGeo, lampMat);
      pole.position.set(lx, 2.5, 2.2);
      scene.add(pole);

      const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.3), lampMat);
      lampHead.position.set(lx, 5, 1.8);
      scene.add(lampHead);
    }
  }

  function buildTrafficVehicles(scene: THREE.Scene) {
    // 1. Classic Yellow Danfo Minibus (Lagos/Ondo Icon)
    for (let i = 0; i < 3; i++) {
      const busGroup = new THREE.Group();

      const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
      const stripeMat = new THREE.MeshStandardMaterial({ color: 0x18181b }); // Black racing stripe
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1c1917 });

      // Body
      const bodyGeo = new THREE.BoxGeometry(5.2, 1.8, 2.1);
      const body = new THREE.Mesh(bodyGeo, yellowMat);
      body.position.y = 1.2;
      body.castShadow = true;
      busGroup.add(body);

      // Black Stripe
      const stripeGeo = new THREE.BoxGeometry(5.22, 0.35, 2.12);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.y = 1.1;
      busGroup.add(stripe);

      // Windows
      const winGeo = new THREE.BoxGeometry(4.2, 0.7, 2.14);
      const win = new THREE.Mesh(winGeo, glassMat);
      win.position.y = 1.6;
      busGroup.add(win);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.35, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelOffsets = [
        [-1.6, -1.1],
        [1.6, -1.1],
        [-1.6, 1.1],
        [1.6, 1.1]
      ];
      wheelOffsets.forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(wx, 0.38, wz);
        busGroup.add(wheel);
      });

      busGroup.position.set(i * 35 - 30, 0, -2.8);
      busGroup.rotation.y = Math.PI; // Heading west
      scene.add(busGroup);
      danfoBusesRef.current.push(busGroup);
    }

    // 2. Okada Motorcycle
    for (let i = 0; i < 2; i++) {
      const bikeGroup = new THREE.Group();
      const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 });

      // Frame & seat
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 0.4), redMat);
      seat.position.y = 0.85;
      bikeGroup.add(seat);

      // Wheels
      const tireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 16);
      tireGeo.rotateZ(Math.PI / 2);
      const wFront = new THREE.Mesh(tireGeo, frameMat);
      wFront.position.set(0.8, 0.35, 0);
      bikeGroup.add(wFront);

      const wRear = new THREE.Mesh(tireGeo, frameMat);
      wRear.position.set(-0.8, 0.35, 0);
      bikeGroup.add(wRear);

      bikeGroup.position.set(i * 45 - 20, 0, 0.8);
      scene.add(bikeGroup);
      okadaBikesRef.current.push(bikeGroup);
    }
  }

  function buildNPCMesh(npc: StreetNPC): THREE.Group {
    const group = new THREE.Group();

    // Humanoid model
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x5c3317 });
    const clothColors = [0x0284c7, 0x16a34a, 0xe11d48, 0xd97706, 0x9333ea];
    const clothMat = new THREE.MeshStandardMaterial({
      color: clothColors[Math.floor(Math.random() * clothColors.length)],
    });

    // Body
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.55, 0.22), clothMat);
    torso.position.y = 0.95;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.24), skinMat);
    head.position.y = 1.38;
    group.add(head);

    // Legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.12), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    legL.position.set(-0.1, 0.35, 0);
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.12), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    legR.position.set(0.1, 0.35, 0);
    group.add(legR);

    // If Hawker, add tray on head with pure water / snacks!
    if (npc.role.includes('Hawker') || npc.role.includes('Vendor')) {
      const trayMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.1, 16), trayMat);
      tray.position.y = 1.58;
      group.add(tray);

      // Water pouches / snacks on tray
      const pouchMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
      for (let p = 0; p < 5; p++) {
        const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.14), pouchMat);
        pouch.position.set((Math.random() - 0.5) * 0.3, 1.68, (Math.random() - 0.5) * 0.3);
        group.add(pouch);
      }
    }

    // Overhead indicator bubble
    const bubbleGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    bubble.position.y = 1.9;
    group.add(bubble);

    return group;
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Tap on road/sidewalk to steer towards point
    if (!mountRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    // Map screen tap to street coordinates
    const targetX = playerPosRef.current.x + (xRatio - 0.5) * 16;
    const targetZ = playerPosRef.current.z + (yRatio - 0.5) * 8;
    clickTargetRef.current = { x: targetX, z: targetZ };
    sound.playStep();
  };

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full cursor-pointer select-none overflow-hidden touch-none"
      onPointerDown={handlePointerDown}
    >
      {/* Top Banner Navigation */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onBackToHostel();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hostel</span>
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white/90 text-xs font-medium flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Use WASD / Arrow Keys or Tap to Walk</span>
      </div>

      {/* Street NPC Encounter Prompt (Floating over screen bottom) */}
      {selectedNPC && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-md bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                {selectedNPC.role}
              </span>
              <h4 className="text-sm font-bold text-slate-900">{selectedNPC.name}</h4>
            </div>
            <p className="text-xs text-slate-600 mt-1 italic">"{selectedNPC.dialogue}"</p>
          </div>

          {selectedNPC.actionLabel && (
            <button
              onClick={() => {
                sound.playCoin();
                onNPCAction(selectedNPC);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              {selectedNPC.actionLabel}
            </button>
          )}
        </div>
      )}

      {/* Touch On-Screen D-Pad / Steering for mobile & quick control */}
      <div className="absolute bottom-6 right-6 z-20 grid grid-cols-3 gap-1 bg-black/40 p-2 rounded-2xl backdrop-blur-md pointer-events-auto">
        <div />
        <button
          onPointerDown={() => {
            keysPressed.current['w'] = true;
            sound.playStep();
          }}
          onPointerUp={() => { keysPressed.current['w'] = false; }}
          className="w-10 h-10 bg-white/20 active:bg-white/40 text-white rounded-lg flex items-center justify-center font-bold text-sm"
        >
          ▲
        </button>
        <div />
        <button
          onPointerDown={() => {
            keysPressed.current['a'] = true;
            sound.playStep();
          }}
          onPointerUp={() => { keysPressed.current['a'] = false; }}
          className="w-10 h-10 bg-white/20 active:bg-white/40 text-white rounded-lg flex items-center justify-center font-bold text-sm"
        >
          ◀
        </button>
        <button
          onPointerDown={() => {
            keysPressed.current['s'] = true;
            sound.playStep();
          }}
          onPointerUp={() => { keysPressed.current['s'] = false; }}
          className="w-10 h-10 bg-white/20 active:bg-white/40 text-white rounded-lg flex items-center justify-center font-bold text-sm"
        >
          ▼
        </button>
        <button
          onPointerDown={() => {
            keysPressed.current['d'] = true;
            sound.playStep();
          }}
          onPointerUp={() => { keysPressed.current['d'] = false; }}
          className="w-10 h-10 bg-white/20 active:bg-white/40 text-white rounded-lg flex items-center justify-center font-bold text-sm"
        >
          ▶
        </button>
      </div>
    </div>
  );
};
