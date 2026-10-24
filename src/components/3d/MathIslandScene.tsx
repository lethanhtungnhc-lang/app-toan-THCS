import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Eye, EyeOff, Sparkles, Navigation, RotateCcw, MapPin, Compass } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface MathIslandSceneProps {
  activeZoneId?: string;
  onSelectZone?: (zoneId: string) => void;
  characterId?: 'tri' | 'duong' | 'long' | 'vy';
  celebrateTrigger?: number;
  lowGraphics?: boolean;
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

export const MathIslandScene: React.FC<MathIslandSceneProps> = ({
  activeZoneId = 'valley',
  onSelectZone,
  characterId = 'tri',
  celebrateTrigger = 0,
  lowGraphics = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [cameraView, setCameraView] = useState<'orbit' | 'valley' | 'forest' | 'mountain' | 'boss'>('orbit');
  const [webGlSupported, setWebGlSupported] = useState<boolean>(() => checkWebGLSupport());

  useEffect(() => {
    if (!mountRef.current || lowGraphics || !webGlSupported) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    let renderer: THREE.WebGLRenderer | null = null;
    let animFrameId = 0;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 1. Scene & Renderer with safe try/catch
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 18, 32);
    camera.lookAt(0, 2, 0);

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL context creation failed, falling back to 2.5D interactive scene:', err);
      setWebGlSupported(false);
      return;
    }

    // 2. Studio Environment (PMREM)
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Ignore if PMREM fails in constrained env
    }

    // 3. Lighting Rig (Key, Fill, Rim)
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.6);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#67e8f9', '#1e1b4b', 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight('#fef08a', 1.8);
    dirLight.position.set(16, 28, 14);
    if (!isSoftwareGl) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 70;
      dirLight.shadow.camera.left = -22;
      dirLight.shadow.camera.right = 22;
      dirLight.shadow.camera.top = 22;
      dirLight.shadow.camera.bottom = -22;
      dirLight.shadow.bias = -0.0005;
    }
    scene.add(dirLight);

    // 4. Procedural Low-Poly Island Base
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Main Floating Island Terrain
    const terrainGeo = new THREE.CylinderGeometry(18, 14, 3.5, 9);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = -1.75;
    terrain.receiveShadow = true;
    islandGroup.add(terrain);

    // Sea water disc around island
    const waterGeo = new THREE.CylinderGeometry(36, 36, 0.4, 24);
    const waterMat = new THREE.MeshStandardMaterial({
      color: '#0369a1',
      roughness: 0.2,
      metalness: 0.3,
      transparent: true,
      opacity: 0.65,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = -3.2;
    islandGroup.add(water);

    // --- ZONE 1: Thung Lũng Hệ Phương Trình (Left: X = -9, Z = 3) ---
    const valleyGroup = new THREE.Group();
    valleyGroup.position.set(-9, 0, 3);
    islandGroup.add(valleyGroup);

    const hexMat = new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.4, flatShading: true });
    for (let i = 0; i < 5; i++) {
      const h = 1.2 + i * 0.4;
      const hex = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, h, 6), hexMat);
      hex.position.set(Math.cos(i * 1.3) * 2.2, h / 2, Math.sin(i * 1.3) * 2.2);
      hex.castShadow = true;
      valleyGroup.add(hex);
    }
    const archMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.2, emissive: '#0284c7', emissiveIntensity: 0.3 });
    const archPillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.5, 0.5), archMat);
    archPillar1.position.set(-1.8, 1.75, 0);
    const archPillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.5, 0.5), archMat);
    archPillar2.position.set(1.8, 1.75, 0);
    const archCross = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.5, 0.6), archMat);
    archCross.position.set(0, 3.5, 0);
    valleyGroup.add(archPillar1, archPillar2, archCross);

    // --- ZONE 2: Rừng Bất Đẳng Thức (Right: X = 9, Z = 3) ---
    const forestGroup = new THREE.Group();
    forestGroup.position.set(9, 0, 3);
    islandGroup.add(forestGroup);

    const pineTrunkMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9, flatShading: true });
    const pineNeedleMat = new THREE.MeshStandardMaterial({ color: '#059669', roughness: 0.6, flatShading: true });
    const pinePositions = [
      [0, 0], [-1.8, -1.2], [1.6, -1.4], [-1.4, 1.6], [1.5, 1.5]
    ];
    pinePositions.forEach(([px, pz], idx) => {
      const tree = new THREE.Group();
      tree.position.set(px, 0, pz);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1, 5), pineTrunkMat);
      trunk.position.y = 0.5;
      const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.3 - idx * 0.1, 1.6, 6), pineNeedleMat);
      cone1.position.y = 1.6;
      const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.95 - idx * 0.1, 1.4, 6), pineNeedleMat);
      cone2.position.y = 2.4;
      tree.add(trunk, cone1, cone2);
      tree.castShadow = true;
      forestGroup.add(tree);
    });

    // --- ZONE 3: Núi Tam Giác Vuông (Back-Right: X = 5, Z = -8) ---
    const mountainGroup = new THREE.Group();
    mountainGroup.position.set(5, 0, -8);
    islandGroup.add(mountainGroup);

    const rockMat = new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.7, flatShading: true });
    const snowMat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.3, flatShading: true });
    const peak = new THREE.Mesh(new THREE.ConeGeometry(3.5, 6.5, 4), rockMat);
    peak.position.set(0, 3.25, 0);
    peak.rotation.y = Math.PI / 4;
    peak.castShadow = true;
    const peakTip = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.2, 4), snowMat);
    peakTip.position.set(0, 5.4, 0);
    peakTip.rotation.y = Math.PI / 4;
    mountainGroup.add(peak, peakTip);

    // --- ZONE 4: Hang Boss (Back-Left: X = -6, Z = -8) ---
    const bossGroup = new THREE.Group();
    bossGroup.position.set(-6, 0, -8);
    islandGroup.add(bossGroup);

    const bossCaveMat = new THREE.MeshStandardMaterial({
      color: '#4c0519',
      roughness: 0.7,
      flatShading: true,
      emissive: '#be123c',
      emissiveIntensity: 0.2
    });
    const caveDome = new THREE.Mesh(new THREE.DodecahedronGeometry(3.4), bossCaveMat);
    caveDome.position.set(0, 1.6, 0);
    caveDome.castShadow = true;
    bossGroup.add(caveDome);

    const crystalMat = new THREE.MeshStandardMaterial({
      color: '#fb7185',
      roughness: 0.1,
      metalness: 0.6,
      emissive: '#f43f5e',
      emissiveIntensity: 0.6,
      flatShading: true,
    });
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.3), crystalMat);
    crystal.position.set(0, 4.8, 0);
    bossGroup.add(crystal);

    // --- HERO CHARACTER ---
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 0, 2);
    islandGroup.add(heroGroup);

    const charColors: Record<string, { body: string; secondary: string }> = {
      tri: { body: '#2563eb', secondary: '#93c5fd' },
      duong: { body: '#db2777', secondary: '#fbcfe8' },
      long: { body: '#059669', secondary: '#6ee7b7' },
      vy: { body: '#7c3aed', secondary: '#c4b5fd' },
    };
    const cConfig = charColors[characterId] || charColors.tri;

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 1.2, 8), new THREE.MeshStandardMaterial({ color: cConfig.body, roughness: 0.5 }));
    torso.position.y = 1.3;
    torso.castShadow = true;

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), new THREE.MeshStandardMaterial({ color: '#fed7aa', roughness: 0.6 }));
    head.position.y = 2.2;
    head.castShadow = true;

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), new THREE.MeshStandardMaterial({ color: '#1c1917', roughness: 0.8 }));
    hair.position.set(0, 2.35, -0.05);

    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 0.4), new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.6 }));
    bag.position.set(0, 1.3, -0.45);

    const pantMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.7 });
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.75, 6), pantMat);
    leftLeg.position.set(-0.25, 0.45, 0);
    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.75, 6), pantMat);
    rightLeg.position.set(0.25, 0.45, 0);

    heroGroup.add(torso, head, hair, bag, leftLeg, rightLeg);

    // --- MASCOT: CÚ PI ---
    const owlGroup = new THREE.Group();
    owlGroup.position.set(1.4, 2.6, 1.8);
    islandGroup.add(owlGroup);

    const owlBody = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), new THREE.MeshStandardMaterial({ color: '#6366f1', roughness: 0.4, flatShading: true }));
    const owlBelly = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 }));
    owlBelly.position.set(0, -0.1, 0.28);

    const eyeMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.1 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), eyeMat);
    eyeL.position.set(-0.16, 0.1, 0.4);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), eyeMat);
    eyeR.position.set(0.16, 0.1, 0.4);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 4), new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.3 }));
    beak.position.set(0, 0, 0.48);
    beak.rotation.x = Math.PI / 2;

    const capMat = new THREE.MeshStandardMaterial({ color: '#1e1b4b', roughness: 0.3 });
    const capSquare = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 0.65), capMat);
    capSquare.position.set(0, 0.5, 0);
    const capBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 8), capMat);
    capBase.position.set(0, 0.42, 0);

    owlGroup.add(owlBody, owlBelly, eyeL, eyeR, beak, capSquare, capBase);

    // 5. Interactive Raycaster for clicking Zones
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      if (!renderer) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(islandGroup.children, true);
      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && obj !== islandGroup) {
          if (obj === valleyGroup) {
            onSelectZone?.('valley');
            soundManager.playClick();
            break;
          }
          if (obj === forestGroup) {
            onSelectZone?.('forest');
            soundManager.playClick();
            break;
          }
          if (obj === mountainGroup) {
            onSelectZone?.('mountain');
            soundManager.playClick();
            break;
          }
          if (obj === bossGroup) {
            onSelectZone?.('boss');
            soundManager.playClick();
            break;
          }
          obj = obj.parent;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 6. Animation Loop
    let clock = new THREE.Clock();
    let celebrateCounter = 0;

    const targetCamPos = new THREE.Vector3(0, 18, 30);
    const targetLookAt = new THREE.Vector3(0, 2, 0);

    const tick = () => {
      if (!renderer) return;
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      islandGroup.rotation.y = Math.sin(time * 0.25) * 0.08;
      owlGroup.position.y = 2.6 + Math.sin(time * 2.5) * 0.2;
      owlGroup.rotation.y = Math.sin(time * 1.5) * 0.3;

      crystal.rotation.y += delta * 1.2;
      crystal.position.y = 4.8 + Math.sin(time * 2) * 0.25;

      if (celebrateTrigger > celebrateCounter) {
        celebrateCounter = celebrateTrigger;
        heroGroup.position.y = Math.abs(Math.sin(time * 8)) * 0.8;
      } else {
        heroGroup.position.y = THREE.MathUtils.damp(heroGroup.position.y, 0, 4, delta);
      }

      if (cameraView === 'valley') {
        targetCamPos.set(-14, 10, 14);
        targetLookAt.set(-9, 2, 3);
      } else if (cameraView === 'forest') {
        targetCamPos.set(14, 10, 14);
        targetLookAt.set(9, 2, 3);
      } else if (cameraView === 'mountain') {
        targetCamPos.set(10, 12, -2);
        targetLookAt.set(5, 4, -8);
      } else if (cameraView === 'boss') {
        targetCamPos.set(-8, 11, -1);
        targetLookAt.set(-6, 3, -8);
      } else {
        targetCamPos.set(0, 19, 32);
        targetLookAt.set(0, 2, 0);
      }

      camera.position.lerp(targetCamPos, 0.04);
      camera.lookAt(targetLookAt);

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer) {
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      cancelAnimationFrame(animFrameId);
    };
  }, [characterId, celebrateTrigger, lowGraphics, cameraView, webGlSupported]);

  // Graceful 2.5D Interactive Fallback (Always reliable in sandboxes, headless VMs, and low-end mobile)
  if (lowGraphics || !webGlSupported) {
    const charNames: Record<string, string> = {
      tri: 'Minh Trí',
      duong: 'Ánh Dương',
      long: 'Bảo Long',
      vy: 'Thảo Vy',
    };
    const charColors: Record<string, string> = {
      tri: '#2563eb',
      duong: '#db2777',
      long: '#059669',
      vy: '#7c3aed',
    };

    return (
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-slate-950 p-4 sm:p-6 flex flex-col justify-between">
        {/* Background Gradients & Ocean Waves */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(99,102,241,0.2),transparent_70%)] pointer-events-none" />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Đảo Toán Học 9 • Bản Đồ Trực Quan Tương Tác
          </div>
          <div className="text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 hidden sm:block">
            Nhấn vào vùng đất để thám hiểm
          </div>
        </div>

        {/* Interactive 2.5D Island Map with 4 Regions */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 my-auto py-2">
          {/* Region 1: Valley of Linear Systems */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectZone?.('valley');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group text-left ${
              activeZoneId === 'valley'
                ? 'bg-sky-950/80 border-sky-400 ring-2 ring-sky-500/40 shadow-xl scale-[1.03]'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-sky-500/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 mb-2 font-mono font-bold text-sm">
              {'x + y'}
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-sky-400">Chương I</div>
            <h4 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
              Thung Lũng Hệ PT
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              Khái niệm nghiệm (x; y), phương pháp thế, cộng & bài toán thực tế.
            </p>
          </div>

          {/* Region 2: Forest of Inequalities */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectZone?.('forest');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group text-left ${
              activeZoneId === 'forest'
                ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/40 shadow-xl scale-[1.03]'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-2 font-mono font-bold text-sm">
              {'a < b'}
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Chương II</div>
            <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
              Rừng Bất Đẳng Thức
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              PT tích, ĐKXĐ phân thức & giải BPT không quên đổi chiều số âm.
            </p>
          </div>

          {/* Region 3: Mountain of Right Triangles */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectZone?.('mountain');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group text-left ${
              activeZoneId === 'mountain'
                ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-500/40 shadow-xl scale-[1.03]'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-amber-500/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2 font-mono font-bold text-sm">
              {'sin α'}
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Chương IV</div>
            <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
              Núi Tam Giác Vuông
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              Hệ thức lượng sin, cos, tan, cot & ứng dụng đo chiều cao thực tế.
            </p>
          </div>

          {/* Region 4: Boss Cavern */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectZone?.('boss');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group text-left ${
              activeZoneId === 'boss'
                ? 'bg-rose-950/80 border-rose-400 ring-2 ring-rose-500/40 shadow-xl scale-[1.03]'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-rose-500/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 mb-2 font-mono font-bold text-sm">
              {'9+'}
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-rose-400">Đấu Trường Boss</div>
            <h4 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
              Quái Vật Sai Lầm
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              Bài toán tổng hợp liên chương trình mô phỏng đề kiểm tra giữa kì.
            </p>
          </div>
        </div>

        {/* Bottom Explorer & Owl Mascot Status Banner */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-md"
              style={{ backgroundColor: charColors[characterId] || '#2563eb' }}
            >
              {(charNames[characterId] || 'T')[0]}
            </div>
            <div>
              <span className="text-xs text-slate-400">Thám hiểm cùng:</span>{' '}
              <strong className="text-xs text-white">{charNames[characterId] || 'Minh Trí'}</strong>
              <span className="text-xs text-indigo-300 ml-2">& Trợ lý Cú Pi</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-indigo-300/90 font-medium">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>Chế độ tương tác tối ưu cho mọi trình duyệt</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-slate-950">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Banner / Spec Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 text-xs font-semibold text-indigo-200">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        Đảo Toán Học 9 • Trực Quan Low-Poly 3D
      </div>

      {/* Unified Bottom Control Dock */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-xl transition-all duration-300 ${
          hudCollapsed ? 'translate-y-[calc(100%-2.25rem)]' : 'translate-y-0'
        }`}
      >
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-slate-900/90 border-t border-x border-indigo-500/40 text-xs text-indigo-300 hover:text-white shadow-lg transition-colors cursor-pointer"
          >
            {hudCollapsed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{hudCollapsed ? 'Mở Bảng Điều Khiển Camera' : 'Thu Gọn Thanh Điều Khiển'}</span>
          </button>
        </div>

        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl flex items-center justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => {
                setCameraView('orbit');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                cameraView === 'orbit'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              Toàn Cảnh
            </button>
            <button
              onClick={() => {
                setCameraView('valley');
                onSelectZone?.('valley');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraView === 'valley'
                  ? 'bg-sky-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Vùng 1 (Đại 1)
            </button>
            <button
              onClick={() => {
                setCameraView('forest');
                onSelectZone?.('forest');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraView === 'forest'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Vùng 2 (Đại 2)
            </button>
            <button
              onClick={() => {
                setCameraView('mountain');
                onSelectZone?.('mountain');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraView === 'mountain'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Vùng 3 (Hình 4)
            </button>
            <button
              onClick={() => {
                setCameraView('boss');
                onSelectZone?.('boss');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraView === 'boss'
                  ? 'bg-pink-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Hang Boss
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-300/80 pl-2 border-l border-slate-700 shrink-0">
            <Navigation className="w-3.5 h-3.5 text-indigo-400" />
            <span>Chạm vùng để thám hiểm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
