import * as THREE from 'three';
import { CharacterAppearance } from '../types/game';

export class Character3D {
  public group: THREE.Group;
  private appearance: CharacterAppearance;

  // Node references for articulation
  private torsoGroup!: THREE.Group;
  private headGroup!: THREE.Group;
  private leftArmGroup!: THREE.Group;
  private rightArmGroup!: THREE.Group;
  private leftLegGroup!: THREE.Group;
  private rightLegGroup!: THREE.Group;
  private leftLowerLegGroup!: THREE.Group;
  private rightLowerLegGroup!: THREE.Group;
  private leftForearmGroup!: THREE.Group;
  private rightForearmGroup!: THREE.Group;

  private animTimer: number = 0;
  private currentState: string = 'idle';

  constructor(appearance: CharacterAppearance) {
    this.appearance = appearance;
    this.group = new THREE.Group();
    this.buildCharacter();
  }

  public setAppearance(newAppearance: CharacterAppearance) {
    this.appearance = newAppearance;
    // Clear and rebuild
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
    this.buildCharacter();
  }

  private createAnkaraTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Rich African Ankara wax print pattern
    ctx.fillStyle = '#d97706'; // Mustard base
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = '#0d9488'; // Teal geometric shapes
    for (let x = 0; x < 256; x += 64) {
      for (let y = 0; y < 256; y += 64) {
        ctx.beginPath();
        ctx.arc(x + 32, y + 32, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e11d48'; // Crimson diamonds
        ctx.beginPath();
        ctx.moveTo(x + 32, y + 8);
        ctx.lineTo(x + 56, y + 32);
        ctx.lineTo(x + 32, y + 56);
        ctx.lineTo(x + 8, y + 32);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#0d9488';
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  private buildCharacter() {
    const skinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.appearance.skinTone),
      roughness: 0.6,
      metalness: 0.05
    });

    const isAnkara = this.appearance.outfit === 'ankara';
    const shirtMat = isAnkara
      ? new THREE.MeshStandardMaterial({
          map: this.createAnkaraTexture(),
          roughness: 0.7,
        })
      : new THREE.MeshStandardMaterial({
          color: new THREE.Color(this.appearance.shirtColor || (this.appearance.outfit === 'office' ? '#f8fafc' : '#0284c7')),
          roughness: 0.65,
        });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.appearance.pantsColor || (this.appearance.outfit === 'office' ? '#0f172a' : '#1e293b')),
      roughness: 0.7,
    });

    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
    });

    const shoeSoleMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.5,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.appearance.hairColor || '#1c1917'),
      roughness: 0.85,
    });

    // 1. Torso Group
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 0.95;
    this.group.add(this.torsoGroup);

    // Torso body
    const torsoGeo = new THREE.BoxGeometry(0.38, 0.48, 0.24);
    const torsoMesh = new THREE.Mesh(torsoGeo, shirtMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.torsoGroup.add(torsoMesh);

    // Collar / Details
    if (this.appearance.outfit === 'office') {
      const tieGeo = new THREE.BoxGeometry(0.06, 0.28, 0.02);
      const tieMat = new THREE.MeshStandardMaterial({ color: 0x991b1b });
      const tieMesh = new THREE.Mesh(tieGeo, tieMat);
      tieMesh.position.set(0, 0.04, 0.13);
      this.torsoGroup.add(tieMesh);
    }

    // Pelvis / Belt
    const pelvisGeo = new THREE.BoxGeometry(0.36, 0.14, 0.22);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, pantsMat);
    pelvisMesh.position.y = -0.28;
    pelvisMesh.castShadow = true;
    this.torsoGroup.add(pelvisMesh);

    // 2. Neck & Head
    const neckGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.12, 12);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.y = 0.28;
    neckMesh.castShadow = true;
    this.torsoGroup.add(neckMesh);

    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 0.44;
    this.torsoGroup.add(this.headGroup);

    // Head base (curved cube)
    const headGeo = new THREE.BoxGeometry(0.26, 0.28, 0.26);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Face features (Eyes / Sunglasses)
    if (this.appearance.accessories === 'sunglasses') {
      const glassesGeo = new THREE.BoxGeometry(0.24, 0.07, 0.04);
      const glassesMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1 });
      const glassesMesh = new THREE.Mesh(glassesGeo, glassesMat);
      glassesMesh.position.set(0, 0.02, 0.14);
      this.headGroup.add(glassesMesh);
    } else {
      // Stylized eyes
      const eyeGeo = new THREE.BoxGeometry(0.04, 0.03, 0.02);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(-0.065, 0.02, 0.132);
      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeR.position.set(0.065, 0.02, 0.132);
      this.headGroup.add(eyeL);
      this.headGroup.add(eyeR);

      // Smile
      const smileGeo = new THREE.BoxGeometry(0.08, 0.015, 0.01);
      const smileMat = new THREE.MeshBasicMaterial({ color: 0x451a03 });
      const smile = new THREE.Mesh(smileGeo, smileMat);
      smile.position.set(0, -0.06, 0.132);
      this.headGroup.add(smile);
    }

    // Hair Models
    this.buildHair(hairMat);

    // 3. Arms
    // Left Arm
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.25, 0.18, 0);
    this.torsoGroup.add(this.leftArmGroup);

    const upperArmGeo = new THREE.BoxGeometry(0.1, 0.24, 0.1);
    const leftUpperArm = new THREE.Mesh(upperArmGeo, shirtMat);
    leftUpperArm.position.y = -0.12;
    leftUpperArm.castShadow = true;
    this.leftArmGroup.add(leftUpperArm);

    this.leftForearmGroup = new THREE.Group();
    this.leftForearmGroup.position.y = -0.24;
    this.leftArmGroup.add(this.leftForearmGroup);

    const forearmGeo = new THREE.BoxGeometry(0.09, 0.22, 0.09);
    const leftForearm = new THREE.Mesh(forearmGeo, skinMat);
    leftForearm.position.y = -0.11;
    leftForearm.castShadow = true;
    this.leftForearmGroup.add(leftForearm);

    // Hand
    const handGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.y = -0.24;
    this.leftForearmGroup.add(leftHand);

    // Right Arm
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.25, 0.18, 0);
    this.torsoGroup.add(this.rightArmGroup);

    const rightUpperArm = new THREE.Mesh(upperArmGeo, shirtMat);
    rightUpperArm.position.y = -0.12;
    rightUpperArm.castShadow = true;
    this.rightArmGroup.add(rightUpperArm);

    this.rightForearmGroup = new THREE.Group();
    this.rightForearmGroup.position.y = -0.24;
    this.rightArmGroup.add(this.rightForearmGroup);

    const rightForearm = new THREE.Mesh(forearmGeo, skinMat);
    rightForearm.position.y = -0.11;
    rightForearm.castShadow = true;
    this.rightForearmGroup.add(rightForearm);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.y = -0.24;
    this.rightForearmGroup.add(rightHand);

    // 4. Legs
    // Left Leg
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.11, -0.35, 0);
    this.torsoGroup.add(this.leftLegGroup);

    const upperLegGeo = new THREE.BoxGeometry(0.13, 0.32, 0.13);
    const leftUpperLeg = new THREE.Mesh(upperLegGeo, pantsMat);
    leftUpperLeg.position.y = -0.16;
    leftUpperLeg.castShadow = true;
    this.leftLegGroup.add(leftUpperLeg);

    this.leftLowerLegGroup = new THREE.Group();
    this.leftLowerLegGroup.position.y = -0.32;
    this.leftLegGroup.add(this.leftLowerLegGroup);

    const lowerLegGeo = new THREE.BoxGeometry(0.12, 0.32, 0.12);
    const leftLowerLeg = new THREE.Mesh(lowerLegGeo, pantsMat);
    leftLowerLeg.position.y = -0.16;
    leftLowerLeg.castShadow = true;
    this.leftLowerLegGroup.add(leftLowerLeg);

    // Left Shoe
    const shoeGeo = new THREE.BoxGeometry(0.13, 0.1, 0.22);
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(0, -0.34, 0.03);
    leftShoe.castShadow = true;
    this.leftLowerLegGroup.add(leftShoe);

    const shoeSoleGeo = new THREE.BoxGeometry(0.14, 0.03, 0.23);
    const leftSole = new THREE.Mesh(shoeSoleGeo, shoeSoleMat);
    leftSole.position.set(0, -0.38, 0.03);
    this.leftLowerLegGroup.add(leftSole);

    // Right Leg
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.11, -0.35, 0);
    this.torsoGroup.add(this.rightLegGroup);

    const rightUpperLeg = new THREE.Mesh(upperLegGeo, pantsMat);
    rightUpperLeg.position.y = -0.16;
    rightUpperLeg.castShadow = true;
    this.rightLegGroup.add(rightUpperLeg);

    this.rightLowerLegGroup = new THREE.Group();
    this.rightLowerLegGroup.position.y = -0.32;
    this.rightLegGroup.add(this.rightLowerLegGroup);

    const rightLowerLeg = new THREE.Mesh(lowerLegGeo, pantsMat);
    rightLowerLeg.position.y = -0.16;
    rightLowerLeg.castShadow = true;
    this.rightLowerLegGroup.add(rightLowerLeg);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0, -0.34, 0.03);
    rightShoe.castShadow = true;
    this.rightLowerLegGroup.add(rightShoe);

    const rightSole = new THREE.Mesh(shoeSoleGeo, shoeSoleMat);
    rightSole.position.set(0, -0.38, 0.03);
    this.rightLowerLegGroup.add(rightSole);
  }

  private buildHair(hairMat: THREE.Material) {
    const hairStyle = this.appearance.hairstyle;
    if (hairStyle === 'bald') return;

    if (hairStyle === 'afro') {
      const afroGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const afroMesh = new THREE.Mesh(afroGeo, hairMat);
      afroMesh.position.set(0, 0.12, -0.02);
      this.headGroup.add(afroMesh);
    } else if (hairStyle === 'braids' || hairStyle === 'locs') {
      // Crown cap
      const capGeo = new THREE.BoxGeometry(0.28, 0.12, 0.28);
      const capMesh = new THREE.Mesh(capGeo, hairMat);
      capMesh.position.set(0, 0.11, 0);
      this.headGroup.add(capMesh);

      // Hanging dreads / braids strands
      const strandGeo = new THREE.CylinderGeometry(0.02, 0.018, 0.35, 8);
      const strandOffsets = [
        [-0.14, -0.05, 0.05],
        [0.14, -0.05, 0.05],
        [-0.14, -0.05, -0.05],
        [0.14, -0.05, -0.05],
        [-0.08, -0.05, -0.14],
        [0.08, -0.05, -0.14],
        [0, -0.05, -0.15],
      ];
      strandOffsets.forEach(([x, y, z]) => {
        const strand = new THREE.Mesh(strandGeo, hairMat);
        strand.position.set(x, y, z);
        strand.rotation.x = 0.15;
        this.headGroup.add(strand);
      });
    } else if (hairStyle === 'curls') {
      const curlsGeo = new THREE.BoxGeometry(0.28, 0.14, 0.28);
      const curlsMesh = new THREE.Mesh(curlsGeo, hairMat);
      curlsMesh.position.set(0, 0.1, 0);
      this.headGroup.add(curlsMesh);
    } else {
      // low_cut / classic
      const hairGeo = new THREE.BoxGeometry(0.27, 0.09, 0.27);
      const hairMesh = new THREE.Mesh(hairGeo, hairMat);
      hairMesh.position.set(0, 0.11, -0.01);
      this.headGroup.add(hairMesh);
    }
  }

  public update(delta: number, state: string = 'idle') {
    this.animTimer += delta;
    this.currentState = state;
    const t = this.animTimer;

    // Reset default transforms
    this.torsoGroup.position.y = 0.95;
    this.torsoGroup.rotation.set(0, 0, 0);
    this.headGroup.rotation.set(0, 0, 0);

    if (state === 'walk') {
      const walkFreq = 9.0;
      const swing = Math.sin(t * walkFreq);

      // Leg swing (alternating)
      this.leftLegGroup.rotation.x = swing * 0.65;
      this.rightLegGroup.rotation.x = -swing * 0.65;

      // Lower leg bend on back-swing
      this.leftLowerLegGroup.rotation.x = swing < 0 ? Math.abs(swing) * 0.5 : 0;
      this.rightLowerLegGroup.rotation.x = swing > 0 ? Math.abs(swing) * 0.5 : 0;

      // Arm swing (opposite of legs)
      this.leftArmGroup.rotation.x = -swing * 0.55;
      this.rightArmGroup.rotation.x = swing * 0.55;

      this.leftForearmGroup.rotation.x = -0.2;
      this.rightForearmGroup.rotation.x = -0.2;

      // Hip bounce & body tilt
      this.torsoGroup.position.y = 0.95 + Math.abs(Math.sin(t * walkFreq)) * 0.05;
      this.torsoGroup.rotation.y = swing * 0.08;
      this.torsoGroup.rotation.z = Math.sin(t * walkFreq) * 0.03;

    } else if (state === 'sit') {
      // Seated pose (on sofa or chair)
      this.torsoGroup.position.y = 0.55;
      this.leftLegGroup.rotation.x = -Math.PI / 2 + 0.1;
      this.rightLegGroup.rotation.x = -Math.PI / 2 + 0.1;

      this.leftLowerLegGroup.rotation.x = Math.PI / 2 - 0.1;
      this.rightLowerLegGroup.rotation.x = Math.PI / 2 - 0.1;

      this.leftArmGroup.rotation.x = -0.4;
      this.rightArmGroup.rotation.x = -0.4;
      this.leftForearmGroup.rotation.x = -0.5;
      this.rightForearmGroup.rotation.x = -0.5;

    } else if (state === 'sleep') {
      // Lying down flat on mattress
      this.torsoGroup.position.y = 0.2;
      this.torsoGroup.rotation.x = -Math.PI / 2;
      this.leftLegGroup.rotation.set(0, 0, 0);
      this.rightLegGroup.rotation.set(0, 0, 0);
      this.leftLowerLegGroup.rotation.set(0, 0, 0);
      this.rightLowerLegGroup.rotation.set(0, 0, 0);

      this.leftArmGroup.rotation.x = 0;
      this.rightArmGroup.rotation.x = 0;
      // Gentle breathing on chest
      this.torsoGroup.position.z = Math.sin(t * 2) * 0.02;

    } else if (state === 'dance') {
      // Joyful Afrobeats dance moves!
      const danceFreq = 7.0;
      const hipShift = Math.sin(t * danceFreq) * 0.18;
      this.torsoGroup.rotation.z = hipShift;
      this.torsoGroup.rotation.y = Math.cos(t * danceFreq * 0.5) * 0.25;
      this.torsoGroup.position.y = 0.95 + Math.abs(Math.sin(t * danceFreq)) * 0.07;

      // Arm wave
      this.leftArmGroup.rotation.x = -Math.PI / 2 + Math.sin(t * danceFreq) * 0.5;
      this.rightArmGroup.rotation.x = -Math.PI / 2 - Math.sin(t * danceFreq) * 0.5;
      this.leftArmGroup.rotation.z = -0.4 + Math.cos(t * danceFreq) * 0.3;
      this.rightArmGroup.rotation.z = 0.4 - Math.cos(t * danceFreq) * 0.3;

      this.leftLegGroup.rotation.x = Math.sin(t * danceFreq) * 0.3;
      this.rightLegGroup.rotation.x = -Math.sin(t * danceFreq) * 0.3;

    } else if (state === 'bath') {
      // Bucket bath scrubbing gesture
      this.torsoGroup.position.y = 0.88;
      this.leftArmGroup.rotation.x = -1.2 + Math.sin(t * 8) * 0.3;
      this.rightArmGroup.rotation.x = -1.2 + Math.cos(t * 8) * 0.3;
      this.leftForearmGroup.rotation.x = -1.0;
      this.rightForearmGroup.rotation.x = -1.0;

      this.headGroup.rotation.x = 0.2;

    } else if (state === 'study') {
      // Typing / reading forward
      this.torsoGroup.position.y = 0.55;
      this.torsoGroup.rotation.x = 0.15;
      this.leftLegGroup.rotation.x = -Math.PI / 2;
      this.rightLegGroup.rotation.x = -Math.PI / 2;
      this.leftLowerLegGroup.rotation.x = Math.PI / 2;
      this.rightLowerLegGroup.rotation.x = Math.PI / 2;

      this.leftArmGroup.rotation.x = -0.8;
      this.rightArmGroup.rotation.x = -0.8;
      this.leftForearmGroup.rotation.x = -0.8 + Math.sin(t * 12) * 0.1;
      this.rightForearmGroup.rotation.x = -0.8 + Math.cos(t * 12) * 0.1;

    } else {
      // Idle: Gentle breathing and natural relaxed posture
      const breath = Math.sin(t * 2.5);
      this.torsoGroup.position.y = 0.95 + breath * 0.015;
      this.headGroup.rotation.y = Math.sin(t * 0.8) * 0.08;
      this.headGroup.rotation.x = breath * 0.02;

      this.leftArmGroup.rotation.x = breath * 0.03;
      this.rightArmGroup.rotation.x = breath * 0.03;
      this.leftArmGroup.rotation.z = 0.08;
      this.rightArmGroup.rotation.z = -0.08;

      this.leftForearmGroup.rotation.x = -0.15;
      this.rightForearmGroup.rotation.x = -0.15;

      this.leftLegGroup.rotation.set(0, 0, 0);
      this.rightLegGroup.rotation.set(0, 0, 0);
      this.leftLowerLegGroup.rotation.set(0, 0, 0);
      this.rightLowerLegGroup.rotation.set(0, 0, 0);
    }
  }
}
