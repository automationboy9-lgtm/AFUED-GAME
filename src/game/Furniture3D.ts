import * as THREE from 'three';
import { FurnitureItem } from '../types/game';

export function createFurnitureMesh(item: FurnitureItem): THREE.Group {
  const group = new THREE.Group();
  group.name = `furniture_${item.id}`;

  const mainColor = item.color ? new THREE.Color(item.color) : new THREE.Color(0x3b82f6);

  switch (item.modelType) {
    case 'sofa': {
      // Velvet Sofa: base cushion, backrest, armrests
      const mat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.65 });
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });

      // Base seat cushion
      const seatGeo = new THREE.BoxGeometry(1.6, 0.35, 0.85);
      const seat = new THREE.Mesh(seatGeo, mat);
      seat.position.y = 0.28;
      seat.castShadow = true;
      seat.receiveShadow = true;
      group.add(seat);

      // Backrest
      const backGeo = new THREE.BoxGeometry(1.6, 0.65, 0.22);
      const back = new THREE.Mesh(backGeo, mat);
      back.position.set(0, 0.65, -0.32);
      back.castShadow = true;
      group.add(back);

      // Left armrest
      const armGeo = new THREE.BoxGeometry(0.2, 0.45, 0.88);
      const armL = new THREE.Mesh(armGeo, mat);
      armL.position.set(-0.9, 0.45, 0);
      armL.castShadow = true;
      group.add(armL);

      // Right armrest
      const armR = new THREE.Mesh(armGeo, mat);
      armR.position.set(0.9, 0.45, 0);
      armR.castShadow = true;
      group.add(armR);

      // Wooden legs
      const legGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.15, 8);
      const legOffsets = [[-0.8, -0.35], [0.8, -0.35], [-0.8, 0.35], [0.8, 0.35]];
      legOffsets.forEach(([x, z]) => {
        const leg = new THREE.Mesh(legGeo, woodMat);
        leg.position.set(x, 0.075, z);
        leg.castShadow = true;
        group.add(leg);
      });
      break;
    }

    case 'bed': {
      // Foam Mattress on floor / student bed frame
      const foamMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.8 });
      const sheetMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.6 });
      const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

      // Mattress block
      const matGeo = new THREE.BoxGeometry(1.4, 0.25, 2.0);
      const mattress = new THREE.Mesh(matGeo, foamMat);
      mattress.position.y = 0.13;
      mattress.castShadow = true;
      mattress.receiveShadow = true;
      group.add(mattress);

      // Blanket cover
      const sheetGeo = new THREE.BoxGeometry(1.36, 0.04, 1.3);
      const sheet = new THREE.Mesh(sheetGeo, sheetMat);
      sheet.position.set(0, 0.27, 0.3);
      sheet.castShadow = true;
      group.add(sheet);

      // Pillows
      const pillowGeo = new THREE.BoxGeometry(0.55, 0.1, 0.35);
      const pillow1 = new THREE.Mesh(pillowGeo, pillowMat);
      pillow1.position.set(-0.35, 0.3, -0.7);
      pillow1.castShadow = true;
      const pillow2 = new THREE.Mesh(pillowGeo, pillowMat);
      pillow2.position.set(0.35, 0.3, -0.7);
      pillow2.castShadow = true;
      group.add(pillow1);
      group.add(pillow2);
      break;
    }

    case 'chair': {
      // Classic Nigerian Plastic Chair
      const plasticMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.45 });

      // Seat
      const seatGeo = new THREE.BoxGeometry(0.5, 0.06, 0.5);
      const seat = new THREE.Mesh(seatGeo, plasticMat);
      seat.position.y = 0.4;
      seat.castShadow = true;
      group.add(seat);

      // Backrest
      const backGeo = new THREE.BoxGeometry(0.48, 0.5, 0.05);
      const back = new THREE.Mesh(backGeo, plasticMat);
      back.position.set(0, 0.68, -0.22);
      back.castShadow = true;
      group.add(back);

      // 4 Legs
      const legGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.4, 8);
      const legOffsets = [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]];
      legOffsets.forEach(([x, z]) => {
        const leg = new THREE.Mesh(legGeo, plasticMat);
        leg.position.set(x, 0.2, z);
        leg.castShadow = true;
        group.add(leg);
      });
      break;
    }

    case 'table': {
      // Round Dining / Study Table
      const woodMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.6 });
      const topGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.08, 24);
      const top = new THREE.Mesh(topGeo, woodMat);
      top.position.y = 0.72;
      top.castShadow = true;
      top.receiveShadow = true;
      group.add(top);

      // Center pillar & base
      const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.68, 12);
      const pillar = new THREE.Mesh(pillarGeo, woodMat);
      pillar.position.y = 0.36;
      pillar.castShadow = true;
      group.add(pillar);

      const baseGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.05, 16);
      const base = new THREE.Mesh(baseGeo, woodMat);
      base.position.y = 0.025;
      group.add(base);

      // Plate of Jollof rice with fried plantain!
      const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const plateGeo = new THREE.CylinderGeometry(0.2, 0.16, 0.03, 16);
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.set(0.1, 0.77, 0.1);
      group.add(plate);

      const riceMat = new THREE.MeshStandardMaterial({ color: 0xea580c }); // reddish orange jollof
      const riceGeo = new THREE.SphereGeometry(0.14, 12, 8);
      const rice = new THREE.Mesh(riceGeo, riceMat);
      rice.scale.set(1, 0.4, 1);
      rice.position.set(0.1, 0.8, 0.1);
      group.add(rice);

      // Fried dodo (plantain slices)
      const dodoMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
      const dodoGeo = new THREE.BoxGeometry(0.08, 0.02, 0.04);
      const dodo = new THREE.Mesh(dodoGeo, dodoMat);
      dodo.position.set(0.2, 0.81, 0.1);
      dodo.rotation.y = 0.4;
      group.add(dodo);
      break;
    }

    case 'bucket': {
      // Bucket & Bowl (Hostel ritual)
      const bucketMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
      const waterMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });

      // Blue bucket
      const bucketGeo = new THREE.CylinderGeometry(0.3, 0.22, 0.55, 16, 1, true);
      const bucket = new THREE.Mesh(bucketGeo, bucketMat);
      bucket.position.y = 0.28;
      bucket.castShadow = true;
      group.add(bucket);

      // Water surface
      const waterGeo = new THREE.CircleGeometry(0.26, 16);
      const water = new THREE.Mesh(waterGeo, waterMat);
      water.rotation.x = -Math.PI / 2;
      water.position.y = 0.5;
      group.add(water);

      // Small bath bowl
      const bowlGeo = new THREE.CylinderGeometry(0.14, 0.08, 0.12, 12);
      const bowlMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);
      bowl.position.set(0.35, 0.06, 0.15);
      bowl.castShadow = true;
      group.add(bowl);
      break;
    }

    case 'toilet': {
      // WC Toilet
      const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });

      // Bowl base
      const bowlGeo = new THREE.CylinderGeometry(0.22, 0.16, 0.42, 16);
      const bowl = new THREE.Mesh(bowlGeo, ceramicMat);
      bowl.position.set(0, 0.21, 0.1);
      bowl.castShadow = true;
      group.add(bowl);

      // Seat lid
      const seatGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.04, 16);
      const seat = new THREE.Mesh(seatGeo, ceramicMat);
      seat.position.set(0, 0.43, 0.1);
      group.add(seat);

      // Tank
      const tankGeo = new THREE.BoxGeometry(0.44, 0.5, 0.24);
      const tank = new THREE.Mesh(tankGeo, ceramicMat);
      tank.position.set(0, 0.55, -0.15);
      tank.castShadow = true;
      group.add(tank);
      break;
    }

    case 'fan': {
      // Standing Fan
      const metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 });
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });

      // Base
      const baseGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.04, 16);
      const base = new THREE.Mesh(baseGeo, metalMat);
      base.position.y = 0.02;
      group.add(base);

      // Pole
      const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 12);
      const pole = new THREE.Mesh(poleGeo, metalMat);
      pole.position.y = 0.62;
      pole.castShadow = true;
      group.add(pole);

      // Motor & Cage
      const cageGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16);
      const cageMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, wireframe: true });
      const cage = new THREE.Mesh(cageGeo, cageMat);
      cage.rotation.x = Math.PI / 2;
      cage.position.set(0, 1.25, 0);
      group.add(cage);

      // Blades
      const bladeGeo = new THREE.BoxGeometry(0.6, 0.08, 0.02);
      const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
      blade1.position.set(0, 1.25, 0);
      group.add(blade1);
      break;
    }

    case 'desk': {
      // Study Desk with Laptop
      const deskMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
      const deskGeo = new THREE.BoxGeometry(1.4, 0.06, 0.8);
      const deskTop = new THREE.Mesh(deskGeo, deskMat);
      deskTop.position.y = 0.72;
      deskTop.castShadow = true;
      group.add(deskTop);

      // Metal legs
      const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.72, 8);
      const legOffsets = [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]];
      legOffsets.forEach(([x, z]) => {
        const leg = new THREE.Mesh(legGeo, deskMat);
        leg.position.set(x, 0.36, z);
        leg.castShadow = true;
        group.add(leg);
      });

      // Laptop
      const laptopMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // Glowing blue screen

      const baseGeo = new THREE.BoxGeometry(0.35, 0.015, 0.25);
      const laptopBase = new THREE.Mesh(baseGeo, laptopMat);
      laptopBase.position.set(0, 0.76, 0);
      group.add(laptopBase);

      const screenGeo = new THREE.BoxGeometry(0.35, 0.24, 0.015);
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 0.87, -0.11);
      screen.rotation.x = 0.2;
      group.add(screen);
      break;
    }

    case 'lantern': {
      // Rechargeable Emergency Lantern
      const yellowMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
      const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

      const bodyGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.35, 12);
      const body = new THREE.Mesh(bodyGeo, yellowMat);
      body.position.y = 0.18;
      body.castShadow = true;
      group.add(body);

      const glowGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.16, 12);
      const glow = new THREE.Mesh(glowGeo, lightMat);
      glow.position.y = 0.24;
      group.add(glow);
      break;
    }

    case 'generator': {
      // Tiger mini generator ("I better pass my neighbor")
      const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b });

      const tankGeo = new THREE.BoxGeometry(0.6, 0.45, 0.45);
      const tank = new THREE.Mesh(tankGeo, redMat);
      tank.position.y = 0.35;
      tank.castShadow = true;
      group.add(tank);

      const frameGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8);
      const bar = new THREE.Mesh(frameGeo, blackMat);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, 0.58, 0);
      group.add(bar);
      break;
    }

    default: {
      const geo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const mat = new THREE.MeshStandardMaterial({ color: mainColor });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = 0.4;
      mesh.castShadow = true;
      group.add(mesh);
    }
  }

  // Visual selection ring indicator (hidden by default)
  const ringGeo = new THREE.RingGeometry(0.6, 0.7, 24);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide, transparent: true, opacity: 0 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.name = 'selection_ring';
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  group.add(ring);

  return group;
}
