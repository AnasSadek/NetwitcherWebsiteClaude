"use client";

import { createContext, useContext, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import {
  BRAND,
  SCENE,
  clamp01,
  damp,
  easeInOut,
  easeOut,
  lerp,
  seg,
  settle,
  smoothstep,
} from "@/lib/film";

/**
 * Der komplette 3D-Film. Eine Szene, ein Canvas, keine Modelle von der Stange:
 * Kamera und Studio sind parametrisch aus Primitiven gebaut, die Pfeile sind
 * die ECHTEN Marken-Assets (arrow3d-*.png) als texturierte Ebenen.
 *
 * Jeder Zustand ist eine reine Funktion des Scroll-Fortschritts — vorwärts
 * wie rückwärts identisch. Gedämpft wird nur die Anzeige (damp), nie der Zustand.
 */

type Ctx = { p: React.MutableRefObject<number>; mobile: boolean };
const FilmCtx = createContext<Ctx>(null!);
const useFilm = () => useContext(FilmCtx);

const ARROW_ASPECT = 420 / 269;

/* ------------------------------------------------------------------ */
/* Bausteine                                                           */
/* ------------------------------------------------------------------ */

/** Echter Marken-Pfeil als texturierte Ebene. */
function Arrow({
  color,
  width = 1,
  ...props
}: { color: "mint" | "violet" | "pink" | "sun" | "sky"; width?: number } & ThreeElements["group"]) {
  const tex = useTexture(`/brand/arrow3d-${color}.png`);
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[width, width / ARROW_ASPECT]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Foto-Ebene mit Cover-Zuschnitt und RAW→Final-Grading (Sättigung/Belichtung). */
function MediaPlane({
  src,
  w,
  h,
  sat = 1,
  exposure = 1,
  opacity = 1,
  ...props
}: {
  src: string;
  w: number;
  h: number;
  sat?: number;
  exposure?: number;
  opacity?: number;
} & ThreeElements["group"]) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = useRef<THREE.ShaderMaterial>(null);
  // Cover-Crop wie object-fit:cover
  const img = tex.image as { width: number; height: number };
  const ta = img.width / img.height;
  const pa = w / h;
  const rep = new THREE.Vector2(1, 1);
  const off = new THREE.Vector2(0, 0);
  if (ta > pa) {
    rep.x = pa / ta;
    off.x = (1 - rep.x) / 2;
  } else {
    rep.y = ta / pa;
    off.y = (1 - rep.y) / 2;
  }
  useFrame(() => {
    if (!mat.current) return;
    mat.current.uniforms.uSat.value = sat;
    mat.current.uniforms.uExp.value = exposure;
    mat.current.uniforms.uOpacity.value = opacity;
  });
  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <shaderMaterial
          ref={mat}
          transparent
          uniforms={{
            map: { value: tex },
            uRep: { value: rep },
            uOff: { value: off },
            uSat: { value: sat },
            uExp: { value: exposure },
            uOpacity: { value: opacity },
          }}
          vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
          fragmentShader={`
            uniform sampler2D map; uniform vec2 uRep; uniform vec2 uOff;
            uniform float uSat; uniform float uExp; uniform float uOpacity;
            varying vec2 vUv;
            void main(){
              vec4 c = texture2D(map, vUv * uRep + uOff);
              float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
              vec3 rgb = mix(vec3(g), c.rgb, uSat) * uExp;
              gl_FragColor = vec4(rgb, c.a * uOpacity);
            }`}
        />
      </mesh>
      {/* feine Rahmenkante */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} />
        <lineBasicMaterial color={"#ffffff"} transparent opacity={0.22 * opacity} />
      </lineSegments>
    </group>
  );
}

/** Räumliche EP-Boxi-Typografie. */
function SpaceWord({
  children,
  size = 0.34,
  color = BRAND.snow,
  opacity = 1,
  ...props
}: {
  children: string;
  size?: number;
  color?: string;
  opacity?: number;
} & ThreeElements["group"]) {
  return (
    <group {...props}>
      <Text
        font="/fonts/epboxi-display.woff"
        fontSize={size}
        letterSpacing={0.06}
        color={color}
        fillOpacity={opacity}
        anchorX="center"
        anchorY="middle"
      >
        {children}
      </Text>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Kamera-Führung + Licht                                              */
/* ------------------------------------------------------------------ */

function Director() {
  const { p, mobile } = useFilm();
  const { camera, pointer } = useThree();
  const drift = useRef({ x: 0, y: 0 });

  useFrame((_, dt) => {
    const t = p.current;
    // Dolly: ruhig -> näher an der Kamera-Szene -> zurück zur Bühne
    const zBase =
      8.6 -
      0.8 * smoothstep(seg(t, ...SCENE.attention)) -
      1.4 * smoothstep(seg(t, SCENE.camera[0], 0.3)) +
      1.6 * smoothstep(seg(t, 0.34, SCENE.editing[1])) +
      0.4 * smoothstep(seg(t, ...SCENE.star));
    // Maus nur als sekundäre, gedämpfte Drift — nie gegen den Scroll
    const amp = mobile ? 0 : 0.16;
    drift.current.x = damp(drift.current.x, pointer.x * amp, 3, dt);
    drift.current.y = damp(drift.current.y, pointer.y * amp * 0.6, 3, dt);
    camera.position.set(drift.current.x, 0.15 + drift.current.y * 0.4, zBase);
    camera.lookAt(0, 0, 0);
  });

  const key = useRef<THREE.SpotLight>(null);
  const warm = useRef<THREE.PointLight>(null);
  const cool = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const t = p.current;
    if (key.current) {
      // Szene 1: fast dunkel; Studio-Aufbau dreht das Licht auf
      key.current.intensity = 2.6 * (0.18 + 0.82 * smoothstep(seg(t, 0.1, 0.2)));
    }
    if (warm.current) {
      warm.current.intensity = 1.1 * smoothstep(seg(t, 0.12, 0.2)) * (1 - smoothstep(seg(t, 0.55, 0.66)));
    }
    if (cool.current) {
      cool.current.intensity =
        0.9 * smoothstep(seg(t, 0.58, 0.68)) * (1 - smoothstep(seg(t, 0.9, 0.96)));
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#8888c8" />
      <spotLight ref={key} position={[3.5, 4.5, 5]} angle={0.75} penumbra={0.9} intensity={2} decay={0} />
      <pointLight ref={warm} position={[-2.6, 1.6, 2.5]} color={BRAND.sun} intensity={0} decay={0} />
      <pointLight ref={cool} position={[2.6, -0.5, 2.5]} color={BRAND.sky} intensity={0} decay={0} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Szene 1+2 — Leere Bühne, dann Studio-Aufbau                         */
/* ------------------------------------------------------------------ */

function StageScene() {
  const { p } = useFilm();
  const root = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.Group>(null);
  const beaconMat = useRef<THREE.MeshStandardMaterial>(null);
  const softbox = useRef<THREE.Group>(null);
  const backdrop = useRef<THREE.Group>(null);
  const frame = useRef<THREE.Group>(null);
  const sunArrow = useRef<THREE.Group>(null);
  const pinkArrow = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = p.current;
    const wake = smoothstep(seg(t, 0.015, 0.08)); // das Zeichen glimmt auf
    const build = seg(t, ...SCENE.attention);
    const out = smoothstep(seg(t, 0.21, 0.26)); // Bühne räumt für die Kamera

    if (root.current) {
      root.current.visible = t < 0.262;
      root.current.position.x = -6.5 * easeInOut(out);
      root.current.position.z = -1.5 * easeInOut(out);
    }
    if (beacon.current) {
      beacon.current.rotation.y = 0.35 + t * 1.2;
      const s = 1 + 0.12 * smoothstep(build);
      beacon.current.scale.setScalar(s);
    }
    if (beaconMat.current) {
      beaconMat.current.emissiveIntensity = 0.15 + 1.1 * wake + 0.9 * smoothstep(build);
    }
    // Softbox fährt von links oben ein — der SUN-Pfeil schiebt sie
    const sIn = easeOut(seg(build, 0.05, 0.45));
    if (softbox.current) {
      softbox.current.position.set(lerp(-6, -1.75, sIn), lerp(4.2, 1.05, sIn), 0);
      softbox.current.rotation.z = lerp(-0.6, -0.3, sIn);
      softbox.current.rotation.y = 0.35;
      softbox.current.visible = sIn > 0.001;
    }
    if (sunArrow.current) {
      sunArrow.current.position.set(lerp(-7.2, -2.55, sIn), lerp(5.0, 1.65, sIn), 0.3);
      sunArrow.current.rotation.z = -0.5;
      const o = sIn * (1 - smoothstep(seg(build, 0.75, 1)));
      sunArrow.current.scale.setScalar(0.9);
      sunArrow.current.visible = o > 0.01;
    }
    // Hintergrund wächst hinter dem Zeichen hoch
    const bIn = easeOut(seg(build, 0.2, 0.6));
    if (backdrop.current) {
      backdrop.current.scale.y = Math.max(0.001, bIn);
      backdrop.current.visible = bIn > 0.001;
    }
    // PINK rahmt: ein präziser Kamera-Rahmen zieht sich ums Motiv zusammen
    const fIn = easeOut(seg(build, 0.45, 0.85));
    if (frame.current) {
      frame.current.scale.setScalar(lerp(1.28, 1, fIn));
      frame.current.visible = fIn > 0.001;
      frame.current.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
        m.opacity = fIn * 0.9;
      });
    }
    if (pinkArrow.current) {
      const a = seg(build, 0.4, 0.9);
      pinkArrow.current.position.set(lerp(4.8, 1.75, easeOut(a)), lerp(-2.6, 1.15, easeOut(a)), 0.6);
      pinkArrow.current.rotation.z = lerp(-0.9, -2.4, easeOut(a));
      pinkArrow.current.visible = a > 0.001 && a < 0.999;
    }
  });


  return (
    <group ref={root}>
      {/* Boden-Andeutung */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.6, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#101020" roughness={0.95} metalness={0} />
      </mesh>

      {/* Das Marken-Zeichen: abstrakter Monolith, bewusst branchenneutral */}
      <group ref={beacon} position={[0, -0.25, 0]}>
        <mesh>
          <boxGeometry args={[1.05, 1.5, 0.34]} />
          <meshStandardMaterial color="#1e1e3c" roughness={0.5} metalness={0.35} />
        </mesh>
        <mesh position={[0, 0.28, 0.18]}>
          <boxGeometry args={[0.72, 0.34, 0.02]} />
          <meshStandardMaterial
            ref={beaconMat}
            color="#0c0c1c"
            emissive={BRAND.snow}
            emissiveIntensity={0.15}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Hintergrund-Kartonage */}
      <group ref={backdrop} position={[0, -1.6, -1.6]}>
        <mesh position={[0, 2.2, 0]}>
          <planeGeometry args={[6.5, 4.4]} />
          <meshStandardMaterial color="#181834" roughness={0.9} />
        </mesh>
      </group>

      {/* Softbox: Rahmen + Leuchtfläche */}
      <group ref={softbox}>
        <mesh>
          <boxGeometry args={[1.5, 1.1, 0.08]} />
          <meshStandardMaterial color="#0c0c18" roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.3, 0.9]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.6} />
        </mesh>
        {/* Stativ zum Boden */}
        <mesh position={[0, -1.35, 0]}>
          <cylinderGeometry args={[0.035, 0.05, 2.7, 10]} />
          <meshStandardMaterial color="#191930" roughness={0.5} metalness={0.6} />
        </mesh>
      </group>

      {/* Pink rahmt das Motiv: dünner Suchrahmen */}
      <group ref={frame} position={[0, -0.1, 0.45]}>
        {[
          [0, 1.15, 2.6, 0.05],
          [0, -1.35, 2.6, 0.05],
          [-1.3, -0.1, 0.05, 2.55],
          [1.3, -0.1, 0.05, 2.55],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0]}>
            <planeGeometry args={[w, h]} />
            <meshBasicMaterial color={BRAND.pink} transparent opacity={0} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <group ref={sunArrow}>
        <Arrow color="sun" width={0.9} />
      </group>
      <group ref={pinkArrow}>
        <Arrow color="pink" width={0.75} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Szene 3 — Die Kamera und ihre Explosionszeichnung                   */
/* ------------------------------------------------------------------ */

const CAM_WORDS = ["IDEE", "LICHT", "STORY", "MOTION", "SOUND", "SCHNITT"];

function CameraScene() {
  const { p, mobile } = useFilm();
  const root = useRef<THREE.Group>(null);
  const parts = {
    body: useRef<THREE.Group>(null),
    grip: useRef<THREE.Group>(null),
    mount: useRef<THREE.Group>(null),
    lensRear: useRef<THREE.Group>(null),
    ringFocus: useRef<THREE.Group>(null),
    lensMid: useRef<THREE.Group>(null),
    ringZoom: useRef<THREE.Group>(null),
    lensFront: useRef<THREE.Group>(null),
    hood: useRef<THREE.Group>(null),
    sensor: useRef<THREE.Group>(null),
    finder: useRef<THREE.Group>(null),
    shoe: useRef<THREE.Group>(null),
  };
  const words = useRef<THREE.Group>(null);
  const framePlane = useRef<THREE.Group>(null);
  const frameMat = useRef<THREE.MeshBasicMaterial>(null);

  // Explosions-Offsets: Linsenstrang nach +Z (zum Betrachter), Anbauten quer
  const explode: Record<keyof typeof parts, [number, number, number]> = {
    body: [0, 0, -1.5],
    grip: [1.1, -0.25, -1.7],
    mount: [0, 0, -0.7],
    lensRear: [0, 0, 0.0],
    ringFocus: [0, 0, 0.7],
    lensMid: [0, 0, 1.4],
    ringZoom: [0, 0, 2.1],
    lensFront: [0, 0, 2.8],
    hood: [0, 0, 3.6],
    sensor: [0, 0.05, -2.4],
    finder: [0, 1.0, -1.8],
    shoe: [0, 1.5, -1.3],
  };

  useFrame(() => {
    const t = p.current;
    const local = seg(t, ...SCENE.camera);
    const enter = easeOut(seg(local, 0, 0.22)); // Kamera fährt heran
    const e = easeInOut(seg(local, 0.28, 0.78)); // Explosionsgrad — direkt am Scroll
    const leave = smoothstep(seg(t, 0.37, 0.41)); // zieht nach links ab

    if (root.current) {
      root.current.visible = t > 0.18 && t < 0.412;
      root.current.position.set(
        lerp(0, -4.6, easeInOut(leave)),
        lerp(-2.6, 0.1, enter),
        lerp(-4, 0.6, enter) - 0.6 * e
      );
      root.current.rotation.y = lerp(0.65, 0.32, enter) - 0.1 * e;
      root.current.rotation.x = lerp(0.14, 0.02, enter);
      const s = (mobile ? 0.82 : 1) * lerp(0.6, 1, enter);
      root.current.scale.setScalar(s);
    }
    (Object.keys(parts) as (keyof typeof parts)[]).forEach((k) => {
      const g = parts[k].current;
      if (!g) return;
      const [ex, ey, ez] = explode[k];
      g.position.set(ex * e, ey * e, ez * 0.8 * e);
    });
    if (words.current) {
      words.current.visible = e > 0.03 && leave < 0.98;
      words.current.children.forEach((c, i) => {
        const w = c as THREE.Group;
        const wo = clamp01(e * 1.5 - i * 0.08) * (1 - leave);
        w.scale.setScalar(0.92 + 0.08 * wo);
        w.children.forEach((cc) => {
          const anyc = cc as unknown as { fillOpacity?: number };
          if ("fillOpacity" in anyc) anyc.fillOpacity = 0.85 * wo;
        });
      });
    }
    // Der Frame — das kontinuierliche Objekt — entsteht aus der Linse
    const born = easeOut(seg(local, 0.85, 1));
    if (framePlane.current) {
      framePlane.current.visible = born > 0.001 && t < 0.4;
      framePlane.current.position.set(0, 0, 3.2 + 1.4 * born);
      framePlane.current.scale.setScalar(lerp(0.15, 1, born));
    }
    if (frameMat.current) frameMat.current.opacity = born * 0.9;
  });

  const dark = { color: "#101016", roughness: 0.38, metalness: 0.82 } as const;
  const darker = { color: "#0a0a10", roughness: 0.45, metalness: 0.75 } as const;
  const ring = { color: "#1a1a22", roughness: 0.3, metalness: 0.9 } as const;

  return (
    <group ref={root}>
      {/* Gehäuse */}
      <group ref={parts.body}>
        <mesh>
          <boxGeometry args={[2.0, 1.35, 0.85]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[-0.55, 0.1, 0.44]}>
          <boxGeometry args={[0.5, 0.35, 0.04]} />
          <meshStandardMaterial color="#15151d" roughness={0.2} metalness={0.6} />
        </mesh>
      </group>
      <group ref={parts.grip}>
        <mesh position={[1.05, -0.05, 0.1]}>
          <boxGeometry args={[0.45, 1.15, 0.75]} />
          <meshStandardMaterial {...darker} />
        </mesh>
      </group>
      <group ref={parts.finder}>
        <mesh position={[-0.2, 0.82, -0.05]}>
          <boxGeometry args={[0.8, 0.35, 0.5]} />
          <meshStandardMaterial {...darker} />
        </mesh>
      </group>
      <group ref={parts.shoe}>
        <mesh position={[-0.2, 1.05, -0.05]}>
          <boxGeometry args={[0.35, 0.08, 0.35]} />
          <meshStandardMaterial {...ring} />
        </mesh>
      </group>
      {/* Sensor */}
      <group ref={parts.sensor}>
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[0.9, 0.62, 0.06]} />
          <meshStandardMaterial color="#0c2a24" roughness={0.15} metalness={0.5} emissive={BRAND.mint} emissiveIntensity={0.25} />
        </mesh>
      </group>
      {/* Mount + Linsenstrang */}
      <group ref={parts.mount}>
        <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.5]}>
          <torusGeometry args={[0.5, 0.09, 12, 40]} />
          <meshStandardMaterial {...ring} />
        </mesh>
      </group>
      <group ref={parts.lensRear}>
        <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.85]}>
          <cylinderGeometry args={[0.46, 0.5, 0.55, 40]} />
          <meshStandardMaterial {...dark} />
        </mesh>
      </group>
      <group ref={parts.ringFocus}>
        <mesh rotation-x={Math.PI / 2} position={[0, 0, 1.2]}>
          <cylinderGeometry args={[0.5, 0.5, 0.22, 40]} />
          <meshStandardMaterial color="#1e1e28" roughness={0.7} metalness={0.5} />
        </mesh>
      </group>
      <group ref={parts.lensMid}>
        <mesh rotation-x={Math.PI / 2} position={[0, 0, 1.55]}>
          <cylinderGeometry args={[0.44, 0.48, 0.45, 40]} />
          <meshStandardMaterial {...dark} />
        </mesh>
      </group>
      <group ref={parts.ringZoom}>
        <mesh rotation-x={Math.PI / 2} position={[0, 0, 1.9]}>
          <cylinderGeometry args={[0.48, 0.48, 0.2, 40]} />
          <meshStandardMaterial color="#1e1e28" roughness={0.7} metalness={0.5} />
        </mesh>
      </group>
      <group ref={parts.lensFront}>
        <mesh rotation-x={Math.PI / 2} position={[0, 0, 2.2]}>
          <cylinderGeometry args={[0.42, 0.45, 0.3, 40]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        {/* Frontglas */}
        <mesh rotation-x={Math.PI / 2} position={[0, 0, 2.36]}>
          <cylinderGeometry args={[0.36, 0.36, 0.04, 40]} />
          <meshPhysicalMaterial color="#0b1030" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
        </mesh>
      </group>
      <group ref={parts.hood}>
        <mesh rotation-x={Math.PI / 2} position={[0, 0, 2.62]}>
          <cylinderGeometry args={[0.52, 0.44, 0.35, 40, 1, true]} />
          <meshStandardMaterial {...darker} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Raumtypografie zwischen den Teilen */}
      <group ref={words}>
        {CAM_WORDS.map((w, i) => (
          <SpaceWord
            key={w}
            size={mobile ? 0.26 : 0.34}
            position={[
              i % 2 === 0 ? -1.7 : 1.7,
              0.9 - i * 0.38,
              -1.1 + i * 0.62,
            ]}
            rotation-y={i % 2 === 0 ? 0.35 : -0.35}
            opacity={0}
          >
            {w}
          </SpaceWord>
        ))}
      </group>

      {/* Das erste Bild entsteht aus der Linse */}
      <group ref={framePlane}>
        <mesh>
          <planeGeometry args={[1.9, 1.2]} />
          <meshBasicMaterial ref={frameMat} color="#e8e8f4" transparent opacity={0} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Szene 4 — Schnitt: Timeline in der Tiefe                            */
/* ------------------------------------------------------------------ */

const CLIPS = ["/media/studio.webp", "/media/reels.webp", "/media/studio-close.webp", "/media/product.webp"];

function EditingScene() {
  const { p, mobile } = useFilm();
  const root = useRef<THREE.Group>(null);
  const hero = useRef<THREE.Group>(null);
  const playhead = useRef<THREE.Mesh>(null);
  const pinkArrow = useRef<THREE.Group>(null);
  const state = useRef({ sat: 0, exp: 0.75, op: 0 });

  useFrame(() => {
    const t = p.current;
    const local = seg(t, ...SCENE.editing);
    const enter = easeOut(seg(local, 0, 0.2));
    const grade = smoothstep(seg(local, 0.35, 0.85)); // RAW -> FINAL
    const leave = smoothstep(seg(t, 0.495, 0.53));

    state.current.sat = grade;
    state.current.exp = lerp(0.72, 1.05, grade);
    state.current.op = enter * (1 - leave);

    if (root.current) {
      root.current.visible = t > 0.36 && t < 0.54;
      root.current.position.y = lerp(-0.6, 0, enter);
    }
    if (hero.current) {
      hero.current.position.set(lerp(0, 1.15, enter), 0.42, lerp(-1.5, 0.5, enter));
      hero.current.scale.setScalar(lerp(0.7, 1, enter) * (1 - 0.12 * leave));
    }
    // Playhead wandert mit dem Scroll durch die Timeline
    const ph = seg(local, 0.15, 0.9);
    if (playhead.current) {
      playhead.current.position.x = lerp(-2.4, 2.4, ph);
    }
    if (pinkArrow.current) {
      pinkArrow.current.position.set(lerp(-2.4, 2.4, ph), -2.0, 1.3);
      pinkArrow.current.visible = local > 0.1 && local < 0.95;
    }
  });

  return (
    <group ref={root}>
      {/* Hauptframe: das kontinuierliche Objekt, jetzt mit echtem Material */}
      <group ref={hero}>
        <GradedHero state={state} mobile={mobile} />
      </group>

      {/* Timeline-Clips in der Tiefe */}
      {CLIPS.map((src, i) => (
        <TimelineClip key={src} src={src} i={i} state={state} />
      ))}

      {/* Playhead */}
      <mesh ref={playhead} position={[0, -1.35, 1.1]}>
        <boxGeometry args={[0.035, 0.75, 0.02]} />
        <meshBasicMaterial color={BRAND.pink} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.35, 1.05]}>
        <boxGeometry args={[5.2, 0.02, 0.02]} />
        <meshBasicMaterial color="#2a2a44" toneMapped={false} />
      </mesh>

      <group ref={pinkArrow} rotation-z={Math.PI}>
        <Arrow color="pink" width={0.3} />
      </group>
    </group>
  );
}

function GradedHero({ state, mobile }: { state: React.MutableRefObject<{ sat: number; exp: number; op: number }>; mobile: boolean }) {
  const g = useRef<THREE.Group>(null);
  const [vals, setVals] = [state.current, null];
  // MediaPlane liest die Werte pro Frame über Props-Refs — hier via Wrapper
  return (
    <group ref={g}>
      <LiveMediaPlane
        src="/media/studio.webp"
        w={mobile ? 2.6 : 3.4}
        h={mobile ? 1.62 : 2.12}
        state={state}
      />
    </group>
  );
}

/** MediaPlane, deren Grading pro Frame aus einem Ref gelesen wird. */
function LiveMediaPlane({
  src,
  w,
  h,
  state,
  ...props
}: {
  src: string;
  w: number;
  h: number;
  state: React.MutableRefObject<{ sat: number; exp: number; op: number }>;
} & ThreeElements["group"]) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = useRef<THREE.ShaderMaterial>(null);
  const img = tex.image as { width: number; height: number };
  const ta = img.width / img.height;
  const pa = w / h;
  const rep = new THREE.Vector2(1, 1);
  const off = new THREE.Vector2(0, 0);
  if (ta > pa) {
    rep.x = pa / ta;
    off.x = (1 - rep.x) / 2;
  } else {
    rep.y = ta / pa;
    off.y = (1 - rep.y) / 2;
  }
  useFrame(() => {
    if (!mat.current) return;
    mat.current.uniforms.uSat.value = state.current.sat;
    mat.current.uniforms.uExp.value = state.current.exp;
    mat.current.uniforms.uOpacity.value = state.current.op;
  });
  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <shaderMaterial
          ref={mat}
          transparent
          uniforms={{
            map: { value: tex },
            uRep: { value: rep },
            uOff: { value: off },
            uSat: { value: 0 },
            uExp: { value: 0.75 },
            uOpacity: { value: 0 },
          }}
          vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
          fragmentShader={`
            uniform sampler2D map; uniform vec2 uRep; uniform vec2 uOff;
            uniform float uSat; uniform float uExp; uniform float uOpacity;
            varying vec2 vUv;
            void main(){
              vec4 c = texture2D(map, vUv * uRep + uOff);
              float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
              vec3 rgb = mix(vec3(g), c.rgb, uSat) * uExp;
              gl_FragColor = vec4(rgb, c.a * uOpacity);
            }`}
        />
      </mesh>
    </group>
  );
}

function TimelineClip({
  src,
  i,
  state,
}: {
  src: string;
  i: number;
  state: React.MutableRefObject<{ sat: number; exp: number; op: number }>;
}) {
  const g = useRef<THREE.Group>(null);
  const { p } = useFilm();
  useFrame(() => {
    const t = p.current;
    const local = seg(t, ...SCENE.editing);
    const enter = easeOut(clamp01(seg(local, 0.05, 0.35) * 1.4 - i * 0.12));
    if (g.current) {
      g.current.position.set(-1.65 + i * 1.3, -1.38, lerp(-2.5, 0.4 - i * 0.35, enter));
      g.current.visible = enter > 0.01;
      g.current.scale.setScalar(enter);
    }
  });
  return (
    <group ref={g}>
      <LiveClip src={src} state={state} />
    </group>
  );
}

function LiveClip({ src, state }: { src: string; state: React.MutableRefObject<{ sat: number; exp: number; op: number }> }) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    if (mat.current) mat.current.opacity = state.current.op * 0.9;
  });
  return (
    <mesh>
      <planeGeometry args={[1.05, 0.62]} />
      <meshBasicMaterial ref={mat} map={tex} transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Szene 5 — Ein Frame wird vier Formate                               */
/* ------------------------------------------------------------------ */

const FORMATS: { src: string; w: number; h: number; x: number; y: number; rz: number }[] = [
  { src: "/media/reels.webp", w: 1.05, h: 1.87, x: -2.45, y: 0.2, rz: 0.06 }, // 9:16
  { src: "/media/product.webp", w: 1.35, h: 1.69, x: -0.88, y: -0.05, rz: -0.03 }, // 4:5
  { src: "/media/studio-close.webp", w: 1.4, h: 1.4, x: 0.72, y: 0.28, rz: 0.04 }, // 1:1
  { src: "/media/performance.webp", w: 2.5, h: 1.4, x: 2.3, y: 0.0, rz: -0.05 }, // 16:9
];

function FormatsScene() {
  const { p, mobile } = useFilm();
  const root = useRef<THREE.Group>(null);
  const skyArrow = useRef<THREE.Group>(null);
  const planes = useRef<(THREE.Group | null)[]>([]);
  const mats = useRef<(THREE.ShaderMaterial | null)[]>([]);

  useFrame(() => {
    const t = p.current;
    const local = seg(t, ...SCENE.formats);
    const split = easeInOut(seg(local, 0.1, 0.7)); // der eigentliche WOW-Moment
    const leave = smoothstep(seg(t, 0.6, 0.66));

    if (root.current) {
      root.current.visible = t > 0.48 && t < 0.68;
      root.current.position.z = -0.4 * leave;
      root.current.scale.setScalar(mobile ? 0.62 : 1);
    }
    planes.current.forEach((g, i) => {
      if (!g) return;
      const f = FORMATS[i];
      const d = clamp01(split * 1.35 - i * 0.09);
      const e = easeOut(d);
      g.position.set(lerp(0, f.x, e), lerp(0.35, f.y, e), lerp(0.5, 1.1 + i * 0.12, e) - 2.2 * leave * (i % 2 ? 1 : 0.6));
      g.rotation.z = f.rz * e;
      g.rotation.y = lerp(0, (i - 1.5) * 0.14, e) + 1.1 * leave * (i % 2 ? 1 : -0.7);
      g.scale.setScalar(lerp(0.55, 1, e));
      const m = mats.current[i];
      if (m) m.uniforms.uOpacity.value = easeOut(seg(local, 0.02, 0.18)) * (1 - smoothstep(seg(t, 0.655, 0.695)));
    });
    if (skyArrow.current) {
      const a = seg(local, 0.15, 0.8);
      skyArrow.current.position.set(lerp(-4.5, 4.5, easeInOut(a)), 1.5, 1.6);
      skyArrow.current.visible = a > 0.001 && a < 0.999;
    }
  });

  return (
    <group ref={root}>
      {FORMATS.map((f, i) => (
        <group key={f.src} ref={(el) => (planes.current[i] = el)}>
          <FormatPlane f={f} onMat={(m) => (mats.current[i] = m)} />
        </group>
      ))}
      <group ref={skyArrow} rotation-z={-Math.PI / 2}>
        <Arrow color="sky" width={0.8} />
      </group>
    </group>
  );
}

function FormatPlane({ f, onMat }: { f: (typeof FORMATS)[number]; onMat: (m: THREE.ShaderMaterial) => void }) {
  const tex = useTexture(f.src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const img = tex.image as { width: number; height: number };
  const ta = img.width / img.height;
  const pa = f.w / f.h;
  const rep = new THREE.Vector2(1, 1);
  const off = new THREE.Vector2(0, 0);
  if (ta > pa) {
    rep.x = pa / ta;
    off.x = (1 - rep.x) / 2;
  } else {
    rep.y = ta / pa;
    off.y = (1 - rep.y) / 2;
  }
  return (
    <mesh>
      <planeGeometry args={[f.w, f.h]} />
      <shaderMaterial
        ref={(m) => m && onMat(m)}
        transparent
        uniforms={{
          map: { value: tex },
          uRep: { value: rep },
          uOff: { value: off },
          uSat: { value: 1 },
          uExp: { value: 1 },
          uOpacity: { value: 0 },
        }}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={`
          uniform sampler2D map; uniform vec2 uRep; uniform vec2 uOff;
          uniform float uSat; uniform float uExp; uniform float uOpacity;
          varying vec2 vUv;
          void main(){
            vec4 c = texture2D(map, vUv * uRep + uOff);
            gl_FragColor = vec4(c.rgb, c.a * uOpacity);
          }`}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Szene 6+7 — Distribution und Zielgruppe                             */
/* ------------------------------------------------------------------ */

function DistributionScene() {
  const { p, mobile } = useFilm();
  const root = useRef<THREE.Group>(null);
  const inst = useRef<THREE.InstancedMesh>(null);
  const skyArrow = useRef<THREE.Group>(null);
  const violetArrow = useRef<THREE.Group>(null);
  const N = mobile ? 14 : 26;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => ({
        lane: i % 4,
        off: (i * 0.37) % 1,
        y: -1 + ((i * 0.73) % 2),
        s: 0.35 + ((i * 0.29) % 0.4),
      })),
    [N]
  );

  useFrame(() => {
    const t = p.current;
    const local = seg(t, ...SCENE.distribution);
    const on = smoothstep(seg(local, 0, 0.2)) * (1 - smoothstep(seg(t, 0.7, 0.74)));

    if (root.current) root.current.visible = t > 0.58 && t < 0.76;
    if (inst.current) {
      seeds.forEach((sd, i) => {
        // Bahnen: von der Mitte nach außen, vier Richtungen
        const prog = (sd.off + local * 1.6) % 1;
        const dir = [
          [-1, 0.35],
          [1, 0.35],
          [-1, -0.35],
          [1, -0.35],
        ][sd.lane];
        const x = dir[0] * lerp(0.4, 5.4, prog);
        const y = sd.y * 0.7 + dir[1] * lerp(0, 2.2, prog);
        dummy.position.set(x, y, -0.5 - prog * 2.2);
        dummy.scale.setScalar(sd.s * on * (1 - prog * 0.55));
        dummy.rotation.set(0, prog * 1.2 * dir[0], 0);
        dummy.updateMatrix();
        inst.current!.setMatrixAt(i, dummy.matrix);
      });
      inst.current.instanceMatrix.needsUpdate = true;
      (inst.current.material as THREE.MeshBasicMaterial).opacity = 0.85 * on;
    }
    if (skyArrow.current) {
      skyArrow.current.position.set(-2.9, 1.5 - local * 0.5, 0.8);
      skyArrow.current.rotation.z = -0.5;
      skyArrow.current.visible = on > 0.02;
    }
    if (violetArrow.current) {
      violetArrow.current.position.set(2.9, -1.3 + local * 0.5, 0.8);
      violetArrow.current.rotation.z = Math.PI + 0.5;
      violetArrow.current.visible = on > 0.02;
    }
  });

  return (
    <group ref={root}>
      <instancedMesh ref={inst} args={[undefined, undefined, N]}>
        <planeGeometry args={[0.9, 0.56]} />
        <meshBasicMaterial color="#c9d4ff" transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
      </instancedMesh>
      <group ref={skyArrow}>
        <Arrow color="sky" width={1.0} />
      </group>
      <group ref={violetArrow}>
        <Arrow color="violet" width={1.0} />
      </group>
    </group>
  );
}

function AudienceScene() {
  const { p, mobile } = useFilm();
  const root = useRef<THREE.Group>(null);
  const inst = useRef<THREE.InstancedMesh>(null);
  const violetArrow = useRef<THREE.Group>(null);
  const N = mobile ? 160 : 460;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const seeds = useMemo(() => {
    // Deterministisches Pseudozufalls-Feld
    const rnd = (i: number, k: number) => {
      const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: N }, (_, i) => ({
      x: (rnd(i, 1) - 0.5) * 11,
      y: (rnd(i, 2) - 0.5) * 5.5,
      z: -1.5 - rnd(i, 3) * 4,
      relevant: rnd(i, 4) < 0.3,
      phase: rnd(i, 5),
    }));
  }, [N]);

  useFrame(() => {
    const t = p.current;
    const local = seg(t, ...SCENE.audience);
    const on = smoothstep(seg(t, 0.66, 0.72)) * (1 - smoothstep(seg(t, 0.78, 0.83)));
    const wave = seg(local, 0.15, 0.85); // Aktivierungswelle von links nach rechts

    if (root.current) root.current.visible = on > 0.005;
    if (inst.current) {
      seeds.forEach((sd, i) => {
        const act = sd.relevant ? smoothstep(clamp01((wave * 14 - (sd.x + 5.5)) / 2.5)) : 0;
        dummy.position.set(sd.x, sd.y, sd.z);
        dummy.scale.setScalar(on * (0.045 + 0.075 * act));
        dummy.updateMatrix();
        inst.current!.setMatrixAt(i, dummy.matrix);
        color.set(sd.relevant ? BRAND.violet : "#2c2c4a");
        if (!sd.relevant) color.multiplyScalar(0.9);
        else color.lerp(new THREE.Color("#3a3a5c"), 1 - act);
        inst.current!.setColorAt(i, color);
      });
      inst.current.instanceMatrix.needsUpdate = true;
      if (inst.current.instanceColor) inst.current.instanceColor.needsUpdate = true;
    }
    if (violetArrow.current) {
      const a = easeInOut(seg(local, 0.1, 0.9));
      violetArrow.current.position.set(lerp(-5, 5, a), 1.55, -0.5);
      violetArrow.current.visible = on > 0.02;
    }
  });

  return (
    <group ref={root}>
      <instancedMesh ref={inst} args={[undefined, undefined, N]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <group ref={violetArrow} rotation-z={-Math.PI / 2}>
        <Arrow color="violet" width={0.9} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Szene 8+9 — Digitales Ziel und Handlung                             */
/* ------------------------------------------------------------------ */

const UI_BLOCKS: { w: number; h: number; tx: number; ty: number; from: [number, number, number, number] }[] = [
  { w: 3.2, h: 0.38, tx: 0, ty: 1.35, from: [-2.5, 2.8, -1.4, 0.7] }, // Header
  { w: 1.9, h: 1.5, tx: -0.65, ty: 0.1, from: [-3.4, -0.8, -2.2, -0.5] }, // Hero-Fläche
  { w: 1.1, h: 1.5, tx: 0.9, ty: 0.1, from: [3.2, 1.6, -1.8, 0.6] }, // Seitenkarte
  { w: 3.2, h: 0.5, tx: 0, ty: -1.05, from: [2.6, -2.6, -1.2, -0.6] }, // CTA-Zeile
];

function WebsiteScene() {
  const { p, mobile } = useFilm();
  const root = useRef<THREE.Group>(null);
  const blocks = useRef<(THREE.Group | null)[]>([]);
  const mintArrow = useRef<THREE.Group>(null);
  const ctaGlow = useRef<THREE.MeshBasicMaterial>(null);
  const chip = useRef<THREE.Group>(null);
  const chipMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const t = p.current;
    const local = seg(t, ...SCENE.website);
    const align = easeInOut(seg(local, 0.05, 0.75));
    const actionLocal = seg(t, ...SCENE.action);
    const calm = smoothstep(seg(actionLocal, 0, 0.5)); // Szene 9: alles beruhigt sich
    const gone = smoothstep(seg(t, 0.915, 0.945));

    if (root.current) {
      root.current.visible = t > 0.755 && t < 0.955;
      root.current.scale.setScalar((mobile ? 0.72 : 1) * (1 - 0.35 * calm) * (1 - 0.6 * gone));
      root.current.position.y = -0.15 * calm;
      root.current.position.z = -1.2 * gone;
    }
    blocks.current.forEach((g, i) => {
      if (!g) return;
      const b = UI_BLOCKS[i];
      const d = easeOut(clamp01(align * 1.3 - i * 0.09));
      g.position.set(lerp(b.from[0], b.tx, d), lerp(b.from[1], b.ty, d), lerp(b.from[2], 0, d));
      g.rotation.y = lerp(b.from[3], 0, d);
      g.rotation.x = lerp(b.from[3] * 0.4, 0, d);
      (g.children[0] as THREE.Mesh & { material: THREE.MeshStandardMaterial }).material.opacity =
        smoothstep(seg(local, 0, 0.25)) * (1 - gone);
    });
    if (ctaGlow.current) {
      ctaGlow.current.opacity = (0.5 + 0.5 * smoothstep(seg(local, 0.7, 1))) * (1 - gone);
    }
    if (mintArrow.current) {
      const a = easeOut(seg(local, 0.55, 0.95));
      mintArrow.current.position.set(lerp(3.6, 1.1, a), lerp(-2.4, -1.05, a), 0.8);
      mintArrow.current.rotation.z = Math.PI + 0.4 * (1 - a);
      mintArrow.current.visible = local > 0.4 && t < 0.9;
    }
    // Szene 9: die eine Handlung
    const chipIn = easeOut(seg(actionLocal, 0.25, 0.6));
    if (chip.current) {
      chip.current.visible = chipIn > 0.01 && gone < 0.9;
      chip.current.position.set(0, lerp(-1.05, -0.2, chipIn), 1.2);
      chip.current.scale.setScalar(lerp(0.7, 1, chipIn));
    }
    if (chipMat.current) chipMat.current.opacity = chipIn * (1 - gone);
  });

  return (
    <group ref={root}>
      {UI_BLOCKS.map((b, i) => (
        <group key={i} ref={(el) => (blocks.current[i] = el)}>
          <mesh>
            <planeGeometry args={[b.w, b.h]} />
            <meshStandardMaterial color="#181838" roughness={0.55} metalness={0.25} transparent opacity={0} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(b.w, b.h)]} />
            <lineBasicMaterial color={BRAND.mint} transparent opacity={0.55} />
          </lineSegments>
          {i === 1 && (
            <group position={[-0.35, 0.25, 0.01]}>
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[0.95, 0.09]} />
                <meshBasicMaterial color="#34346a" toneMapped={false} />
              </mesh>
              <mesh position={[-0.12, -0.22, 0]}>
                <planeGeometry args={[0.7, 0.07]} />
                <meshBasicMaterial color="#26264e" toneMapped={false} />
              </mesh>
              <mesh position={[-0.22, -0.42, 0]}>
                <planeGeometry args={[0.5, 0.07]} />
                <meshBasicMaterial color="#26264e" toneMapped={false} />
              </mesh>
            </group>
          )}
          {i === 3 && (
            <mesh position={[1.15, 0, 0.01]}>
              <planeGeometry args={[0.7, 0.3]} />
              <meshBasicMaterial ref={ctaGlow} color={BRAND.mint} transparent opacity={0} toneMapped={false} />
            </mesh>
          )}
        </group>
      ))}
      <group ref={mintArrow}>
        <Arrow color="mint" width={0.85} />
      </group>
      {/* Handlung: ein bestätigtes Signal — bewusst abstrakt */}
      <group ref={chip}>
        <mesh>
          <planeGeometry args={[1.6, 0.42]} />
          <meshBasicMaterial ref={chipMat} color="#0e2e28" transparent opacity={0} toneMapped={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.6, 0.42)]} />
          <lineBasicMaterial color={BRAND.mint} transparent opacity={0.8} />
        </lineSegments>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Szene 10 — Die fünf Pfeile werden der Stern                         */
/* ------------------------------------------------------------------ */

const STAR_COLORS = ["pink", "sun", "sky", "mint", "violet"] as const;

function StarScene() {
  const { p, mobile } = useFilm();
  const root = useRef<THREE.Group>(null);
  const arms = useRef<(THREE.Group | null)[]>([]);

  useFrame(() => {
    const t = p.current;
    const local = seg(t, ...SCENE.star);
    if (root.current) {
      root.current.visible = t > 0.9;
      root.current.scale.setScalar(mobile ? 0.58 : 0.8);
      root.current.position.y = 1.32;
    }
    arms.current.forEach((g, i) => {
      if (!g) return;
      // Jeder Arm hat eine eigene Flugbahn und rastet mit Überschwinger ein
      const d = settle(clamp01(seg(local, 0.05, 0.75) * 1.35 - i * 0.075), 0.1);
      const ang = (-90 + i * 72) * (Math.PI / 180);
      const rFrom = 7.5;
      const rTo = 0.62;
      const r = lerp(rFrom, rTo, d);
      g.position.set(Math.cos(ang) * r, Math.sin(ang) * r, (1 - d) * (i % 2 ? 1.6 : -1.2));
      // Ausrichtung: Spitze zeigt nach außen, wie im offiziellen Stern
      g.rotation.z = ang + Math.PI / 2 + (1 - d) * (i % 2 ? 1.4 : -1.1);
      g.scale.setScalar(lerp(1.5, 1, d));
      g.visible = local > 0.02;
    });
  });

  return (
    <group ref={root}>
      {STAR_COLORS.map((c, i) => (
        <group key={c} ref={(el) => (arms.current[i] = el)}>
          <Arrow color={c} width={0.95} />
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Canvas-Einstieg                                                     */
/* ------------------------------------------------------------------ */

export default function FilmCanvas({
  progress,
  mobile,
  active,
}: {
  progress: MotionValue<number>;
  mobile: boolean;
  active: boolean;
}) {
  const p = useRef(0);
  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 35, position: [0, 0.15, 8.6], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <FilmCtx.Provider value={{ p, mobile }}>
        <ProgressBridge progress={progress} p={p} />
        <Director />
        <StageScene />
        <CameraScene />
        <EditingScene />
        <FormatsScene />
        <DistributionScene />
        <AudienceScene />
        <WebsiteScene />
        <StarScene />
        <fog attach="fog" args={[BRAND.night, 9, 22]} />
      </FilmCtx.Provider>
    </Canvas>
  );
}

function ProgressBridge({ progress, p }: { progress: MotionValue<number>; p: React.MutableRefObject<number> }) {
  useFrame(() => {
    p.current = progress.get();
  });
  return null;
}
