import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Character3D } from './Character3D';
import { createFurnitureMesh } from './Furniture3D';
import { CharacterAppearance, PlacedFurniture, FurnitureItem } from '../types/game';
import { sound } from '../utils/audio';

interface Room3DSceneProps {
  appearance: CharacterAppearance;
  placedFurniture: PlacedFurniture[];
  catalog: FurnitureItem[];
  characterAction: string; // 'idle' | 'walk' | 'sit' | 'sleep' | 'dance' | 'bath' | 'toilet' | 'study' | 'relax'
  nepaOff: boolean;
  onSelectFurniture: (furniture: PlacedFurniture, item: FurnitureItem) => void;
  onCharacterClick: () => void;
  buyModeItem: FurnitureItem | null;
  onPlaceFurniture: (item: FurnitureItem, x: number, z: number) => void;
}

export const Room3DScene: React.FC<Room3DSceneProps> = ({
  appearance,
  placedFurniture,
  catalog,
  characterAction,
  nepaOff,
  onSelectFurniture,
  onCharacterClick,
  buyModeItem,
  onPlaceFurniture,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<Character3D | null>(null);

  // Scene state refs for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const charPosRef = useRef({ x: 0, z: 0 });
  const targetPosRef = useRef<{ x: number; z: number } | null>(null);
  const isWalkingRef = useRef(false);
  const clickRingRef = useRef<THREE.Mesh | null>(null);
  const furnitureMeshesRef = useRef<Map<string, THREE.Group>>(new Map());

  // Mouse orbit
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef(Math.PI / 4);

  // Setup Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xdce7ec); // Pleasant soft ambient sky

    // Isometric Orthographic Camera
    const aspect = width / height;
    const d = 5.2;
    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      0.1,
      100
    );
    cameraRef.current = camera;
    updateCameraPosition();

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Build Room Environment
    buildRoomStructure(scene);

    // Character
    const character = new Character3D(appearance);
    character.group.position.set(charPosRef.current.x, 0, charPosRef.current.z);
    scene.add(character.group);
    characterRef.current = character;

    // Click indicator ring
    const ringGeo = new THREE.RingGeometry(0.25, 0.35, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0 });
    const clickRing = new THREE.Mesh(ringGeo, ringMat);
    clickRing.rotation.x = -Math.PI / 2;
    clickRing.position.y = 0.02;
    scene.add(clickRing);
    clickRingRef.current = clickRing;

    // Animation Loop
    let animationId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Handle Character Movement towards targetPos
      if (targetPosRef.current && characterRef.current) {
        const dx = targetPosRef.current.x - charPosRef.current.x;
        const dz = targetPosRef.current.z - charPosRef.current.z;
        const dist = Math.hypot(dx, dz);

        if (dist > 0.08) {
          isWalkingRef.current = true;
          const speed = 3.2; // units per sec
          const moveDist = Math.min(dist, speed * delta);
          const angle = Math.atan2(dx, dz);

          charPosRef.current.x += Math.sin(angle) * moveDist;
          charPosRef.current.z += Math.cos(angle) * moveDist;

          characterRef.current.group.position.x = charPosRef.current.x;
          characterRef.current.group.position.z = charPosRef.current.z;

          // Smooth turn towards walking direction
          characterRef.current.group.rotation.y = angle;
          characterRef.current.update(delta, 'walk');
        } else {
          // Reached target
          isWalkingRef.current = false;
          targetPosRef.current = null;
          if (clickRingRef.current) {
            (clickRingRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
          }
          characterRef.current.update(delta, characterAction);
        }
      } else if (characterRef.current) {
        characterRef.current.update(delta, characterAction);
      }

      // Pulse click ring if visible
      if (clickRingRef.current && (clickRingRef.current.material as THREE.MeshBasicMaterial).opacity > 0) {
        clickRingRef.current.scale.setScalar(1 + Math.sin(time * 0.01) * 0.1);
      }

      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const asp = w / h;
      cameraRef.current.left = -d * asp;
      cameraRef.current.right = d * asp;
      cameraRef.current.top = d;
      cameraRef.current.bottom = -d;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  function updateCameraPosition() {
    if (!cameraRef.current) return;
    const radius = 10;
    const angle = cameraAngleRef.current;
    cameraRef.current.position.set(
      Math.cos(angle) * radius,
      7.5,
      Math.sin(angle) * radius
    );
    cameraRef.current.lookAt(0, 0.4, 0);
  }

  function buildRoomStructure(scene: THREE.Scene) {
    // Room dimensions: 8x8 units
    const roomSize = 8;
    const wallHeight = 3.6;

    // 1. Floor with stylish tile grid
    const floorGeo = new THREE.PlaneGeometry(roomSize, roomSize);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887, // Warm terracotta / cream tiled floor
      roughness: 0.5,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor grid lines
    const gridHelper = new THREE.GridHelper(roomSize, 8, 0xc2a688, 0xd4bc9d);
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // 2. Circular outdoor grass garden pedestal beneath room (as in video)
    const gardenGeo = new THREE.CylinderGeometry(6.2, 6.2, 0.4, 36);
    const gardenMat = new THREE.MeshStandardMaterial({ color: 0x86a873, roughness: 0.9 });
    const garden = new THREE.Mesh(gardenGeo, gardenMat);
    garden.position.y = -0.22;
    garden.receiveShadow = true;
    scene.add(garden);

    // 3. Back-Left Wall
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x4682b4, // Vibrant Nigerian student hostel blue/teal
      roughness: 0.8,
    });

    const wallLeftGeo = new THREE.BoxGeometry(0.18, wallHeight, roomSize);
    const wallLeft = new THREE.Mesh(wallLeftGeo, wallMat);
    wallLeft.position.set(-roomSize / 2, wallHeight / 2, 0);
    wallLeft.castShadow = true;
    wallLeft.receiveShadow = true;
    scene.add(wallLeft);

    // 4. Back-Right Wall
    const wallBackGeo = new THREE.BoxGeometry(roomSize, wallHeight, 0.18);
    const wallBack = new THREE.Mesh(wallBackGeo, wallMat);
    wallBack.position.set(0, wallHeight / 2, -roomSize / 2);
    wallBack.castShadow = true;
    wallBack.receiveShadow = true;
    scene.add(wallBack);

    // Wooden door on Left Wall
    const doorGeo = new THREE.BoxGeometry(0.22, 2.4, 1.2);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x5c2c16, roughness: 0.6 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(-roomSize / 2 + 0.02, 1.2, 1.8);
    door.castShadow = true;
    scene.add(door);

    // Door knob (gold brass)
    const knobGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.position.set(-roomSize / 2 + 0.15, 1.15, 1.4);
    scene.add(knob);

    // Window on Back Wall with daylight & blinds
    const windowFrameGeo = new THREE.BoxGeometry(1.8, 1.4, 0.22);
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrame.position.set(1.8, 2.1, -roomSize / 2 + 0.02);
    scene.add(windowFrame);

    // Window glass pane
    const glassGeo = new THREE.PlaneGeometry(1.6, 1.2);
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(1.8, 2.1, -roomSize / 2 + 0.14);
    scene.add(glass);

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    ambientLight.name = 'ambient_light';
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.1);
    dirLight.name = 'dir_light';
    dirLight.position.set(8, 12, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    const shadowD = 6;
    dirLight.shadow.camera.left = -shadowD;
    dirLight.shadow.camera.right = shadowD;
    dirLight.shadow.camera.top = shadowD;
    dirLight.shadow.camera.bottom = -shadowD;
    scene.add(dirLight);

    // Warm ceiling room pendant light
    const roomLight = new THREE.PointLight(0xfef08a, 0.9, 10);
    roomLight.name = 'room_light';
    roomLight.position.set(0, 3.2, 0);
    scene.add(roomLight);
  }

  // Handle NEPA power on / off lighting
  useEffect(() => {
    if (!sceneRef.current) return;
    const ambient = sceneRef.current.getObjectByName('ambient_light') as THREE.AmbientLight | null;
    const dir = sceneRef.current.getObjectByName('dir_light') as THREE.DirectionalLight | null;
    const room = sceneRef.current.getObjectByName('room_light') as THREE.PointLight | null;

    if (nepaOff) {
      // NEPA blackout! Dim room, romantic yellow lantern glow
      if (ambient) ambient.intensity = 0.25;
      if (dir) dir.intensity = 0.3;
      if (room) {
        room.color.setHex(0xf97316); // Amber glow from emergency light
        room.intensity = 0.5;
      }
    } else {
      if (ambient) ambient.intensity = 0.75;
      if (dir) dir.intensity = 1.1;
      if (room) {
        room.color.setHex(0xfef08a);
        room.intensity = 0.9;
      }
    }
  }, [nepaOff]);

  // Update Appearance
  useEffect(() => {
    if (characterRef.current) {
      characterRef.current.setAppearance(appearance);
    }
  }, [appearance]);

  // Sync Placed Furniture Meshes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove old meshes
    furnitureMeshesRef.current.forEach((mesh) => {
      scene.remove(mesh);
    });
    furnitureMeshesRef.current.clear();

    // Create and add updated meshes
    placedFurniture.forEach((placed) => {
      const item = catalog.find((c) => c.id === placed.furnitureId);
      if (!item) return;

      const mesh = createFurnitureMesh(item);
      mesh.position.set(placed.x, 0, placed.z);
      mesh.rotation.y = placed.rotation;
      mesh.userData = { placed, item };

      scene.add(mesh);
      furnitureMeshesRef.current.set(placed.instanceId, mesh);
    });
  }, [placedFurniture, catalog]);

  // Canvas Mouse / Tap Interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || e.buttons !== 1) return;
    const dx = e.clientX - prevMouseRef.current.x;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    // Orbit angle
    cameraAngleRef.current += dx * 0.006;
    // Clamp to 10° to 80° for pleasant isometric look
    cameraAngleRef.current = Math.max(0.15, Math.min(Math.PI * 0.45, cameraAngleRef.current));
    updateCameraPosition();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const wasDragging = Math.hypot(e.clientX - prevMouseRef.current.x, e.clientY - prevMouseRef.current.y) > 6;
    isDraggingRef.current = false;

    if (wasDragging) return; // User was just panning

    // Raycast click
    if (!sceneRef.current || !cameraRef.current || !mountRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // 1. Check if Character was clicked
    if (characterRef.current) {
      const charIntersects = raycaster.intersectObjects(characterRef.current.group.children, true);
      if (charIntersects.length > 0) {
        sound.playClick();
        onCharacterClick();
        return;
      }
    }

    // 2. Check if Placed Furniture was clicked
    const furnitureGroups = Array.from(furnitureMeshesRef.current.values());
    const furnIntersects = raycaster.intersectObjects(furnitureGroups, true);

    if (furnIntersects.length > 0) {
      let current: THREE.Object3D | null = furnIntersects[0].object;
      while (current && !current.userData.placed) {
        current = current.parent;
      }

      if (current && current.userData.placed) {
        const { placed, item } = current.userData as { placed: PlacedFurniture; item: FurnitureItem };
        sound.playClick();

        // Walk over to the furniture!
        targetPosRef.current = { x: placed.x * 0.8, z: placed.z * 0.8 + 0.5 };
        sound.playStep();

        // Trigger interaction modal
        onSelectFurniture(placed, item);
        return;
      }
    }

    // 3. Check if Floor was clicked (Move character OR Buy Mode Place)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const target = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, target)) {
      // Clamp inside room
      const clampedX = Math.max(-3.5, Math.min(3.5, target.x));
      const clampedZ = Math.max(-3.5, Math.min(3.5, target.z));

      if (buyModeItem) {
        // Place new item here!
        sound.playCoin();
        onPlaceFurniture(buyModeItem, clampedX, clampedZ);
      } else {
        // Walk character to spot
        targetPosRef.current = { x: clampedX, z: clampedZ };
        sound.playStep();

        if (clickRingRef.current) {
          clickRingRef.current.position.set(clampedX, 0.02, clampedZ);
          (clickRingRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85;
        }
      }
    }
  };

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full cursor-pointer select-none overflow-hidden touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Helper guide badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white/90 text-xs font-medium flex items-center gap-2 pointer-events-none shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Tap anywhere to walk · Drag to rotate view</span>
      </div>
    </div>
  );
};
