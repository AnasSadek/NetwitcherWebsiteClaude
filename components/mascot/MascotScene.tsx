"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * WITCH — das Netwitcher-Maskottchen als echtes 3D-Objekt.
 *
 * Bewusst parametrisch aus Primitiven gebaut statt als GLB: dadurch kann der
 * Kopf wirklich zum Cursor schauen (Feder-Physik, keine vorgerenderte Sequenz),
 * das Gehäuse bleibt ein paar Kilobyte gross und die Marken-Farben stammen
 * direkt aus den offiziellen Werten.
 *
 * Die einzigen Bilddaten sind das ECHTE Logo (star/wordmark als PNG-Textur)
 * fuer Objektiv und Brust — nichts daran ist nachgezeichnet.
 */

/* Offizielle Logo-Farben + abgeleitete Gehäusetöne */
const C = {
  violet: "#8b5cf6",
  mint: "#2ee6c8",
  sky: "#0fb9f2",
  pink: "#f468a8",
  sun: "#f5d33d",
  shell: "#f6f2ea", // cremeweisse Oberschale
  bodyPurple: "#6e42d6",
  barrel: "#7b4be8",
  mount: "#5a32c0",
  hood: "#6a3fe0",
  hoodDeep: "#5127b5",
  dark: "#150a2e",
  cord: "#ece7ff",
} as const;

/* Feder-Integrator: echte Masse/Dämpfung statt lerp — überschwingt leicht. */
class Spring {
  v = 0;
  constructor(public x = 0, public k = 90, public c = 14) {}
  step(target: number, dt: number) {
    const d = Math.min(dt, 1 / 30);
    const a = (target - this.x) * this.k - this.v * this.c;
    this.v += a * d;
    this.x += this.v * d;
    return this.x;
  }
}

type Input = {
  /** Zielblickrichtung in NDC (-1..1). */
  target: React.MutableRefObject<{ x: number; y: number }>;
  /** true = grobe Eingabe (Touch): eigenständiges Umschauen. */
  coarse: boolean;
  reduce: boolean;
};

function Witch({ target, coarse, reduce }: Input) {
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const lens = useRef<THREE.Group>(null);
  const iris = useRef<THREE.Mesh>(null);
  const starMat = useRef<THREE.MeshBasicMaterial>(null);
  const root = useRef<THREE.Group>(null);

  const [starTex, wordTex] = useTexture([
    "/brand/star-512.png",
    "/brand/wordmark-white-1024.png",
  ]);
  starTex.colorSpace = THREE.SRGBColorSpace;
  wordTex.colorSpace = THREE.SRGBColorSpace;

  const s = useMemo(
    () => ({
      yaw: new Spring(0, 78, 13),
      pitch: new Spring(0, 78, 13),
      bodyYaw: new Spring(0, 30, 11),
      bodyPitch: new Spring(0, 30, 11),
      focus: new Spring(0, 120, 16),
    }),
    []
  );
  const last = useRef({ x: 0, y: 0, blink: 2.4 });

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;

    // --- Zielrichtung -------------------------------------------------
    let tx = target.current.x;
    let ty = target.current.y;
    if (coarse) {
      // Ohne Maus schaut die Figur selbständig umher (nicht-repetitive Bahn)
      tx = Math.sin(t * 0.31) * 0.62 + Math.sin(t * 0.13 + 1.7) * 0.3;
      ty = Math.sin(t * 0.24 + 0.6) * 0.34 + Math.sin(t * 0.11) * 0.16;
    }

    // Ruhe-Atmung: mikroskopische Drift, damit sie nie „eingefroren" wirkt
    const idleYaw = Math.sin(t * 0.29) * 0.045 + Math.sin(t * 0.17 + 2.1) * 0.028;
    const idlePitch = Math.sin(t * 0.23 + 1.1) * 0.032;

    if (reduce) {
      if (head.current) head.current.rotation.set(0, 0, 0);
      if (torso.current) torso.current.rotation.set(0, 0, 0);
      if (starMat.current) starMat.current.opacity = 1;
      return;
    }

    // --- Kopf folgt dem Cursor ---------------------------------------
    const yaw = s.yaw.step(tx * 0.46 + idleYaw, dt);
    const pitch = s.pitch.step(-ty * 0.32 + idlePitch, dt);
    if (head.current) {
      head.current.rotation.y = yaw;
      head.current.rotation.x = pitch;
      head.current.rotation.z = -yaw * 0.12; // leichte Kopfneigung mit
      head.current.position.y = Math.sin(t * 1.05) * 0.022; // Atmen
    }

    // --- Körper zieht verzögert nach (sekundäre Bewegung) -------------
    const by = s.bodyYaw.step(tx * 0.16, dt);
    const bp = s.bodyPitch.step(-ty * 0.06, dt);
    if (torso.current) {
      torso.current.rotation.y = by;
      torso.current.rotation.x = bp;
      torso.current.position.y = -2.25 + Math.sin(t * 1.05 - 0.5) * 0.014;
      torso.current.scale.y = 1 + Math.sin(t * 1.05 - 0.5) * 0.008;
    }
    if (root.current) {
      // Ganz leichter Parallax des gesamten Charakters
      root.current.position.x = yaw * 0.16;
    }

    // --- Objektiv „fokussiert" bei schneller Mausbewegung -------------
    const speed = Math.hypot(tx - last.current.x, ty - last.current.y) / Math.max(dt, 0.001);
    last.current.x = tx;
    last.current.y = ty;
    const f = s.focus.step(Math.min(1, speed * 0.22), dt);
    if (lens.current) {
      lens.current.position.z = 0.62 + f * 0.09;
      lens.current.scale.setScalar(1 + f * 0.035);
    }

    // --- Verschluss-Blinzeln, pseudo-zufällig aber deterministisch ----
    last.current.blink -= dt;
    let shutter = 1;
    if (last.current.blink < 0.16) {
      const k = Math.max(0, last.current.blink) / 0.16;
      shutter = 0.12 + 0.88 * Math.abs(Math.cos(k * Math.PI));
      if (last.current.blink <= 0) {
        last.current.blink = 3.6 + Math.abs(Math.sin(t * 12.9898) * 43758.5453) % 3.4;
      }
    }
    if (iris.current) iris.current.scale.set(shutter, shutter, 1);
    if (starMat.current) starMat.current.opacity = 0.35 + 0.65 * shutter;
  });

  const shellMat = { roughness: 0.42, metalness: 0.03 };
  const softMat = { roughness: 0.62, metalness: 0.02 };

  return (
    <group ref={root} position={[0, 0.06, 0]} scale={0.9}>
      {/* ================= TORSO / HOODIE ================= */}
      <group ref={torso} position={[0, -2.25, 0]}>
        {/* Kapuze hinter dem Hals */}
        <RoundedBox args={[2.95, 0.86, 1.35]} radius={0.36} smoothness={5} position={[0, 0.86, -0.24]}>
          <meshStandardMaterial color={C.hoodDeep} {...softMat} />
        </RoundedBox>
        {/* Schultern */}
        <RoundedBox args={[3.55, 1.75, 1.7]} radius={0.58} smoothness={5} position={[0, -0.12, 0]}>
          <meshStandardMaterial color={C.hood} {...softMat} />
        </RoundedBox>
        {/* Kordeln */}
        {[-0.3, 0.3].map((x) => (
          <group key={x} position={[x, 0.3, 0.84]} rotation={[0.12, 0, x > 0 ? -0.06 : 0.06]}>
            <mesh>
              <capsuleGeometry args={[0.045, 0.6, 4, 10]} />
              <meshStandardMaterial color={C.cord} roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.16, 12]} />
              <meshStandardMaterial color={C.sun} roughness={0.35} metalness={0.15} />
            </mesh>
          </group>
        ))}
        {/* Echtes Logo auf der Brust */}
        <mesh position={[0, -0.35, 0.87]}>
          <planeGeometry args={[0.68, 0.68]} />
          <meshBasicMaterial map={starTex} transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.78, 0.87]}>
          <planeGeometry args={[1.28, 0.166]} />
          <meshBasicMaterial map={wordTex} transparent toneMapped={false} opacity={0.95} />
        </mesh>
      </group>

      {/* Hals */}
      <mesh position={[0, -1.18, 0]}>
        <cylinderGeometry args={[0.44, 0.5, 0.72, 20]} />
        <meshStandardMaterial color={C.dark} roughness={0.7} />
      </mesh>

      {/* ================= KAMERA-KOPF ================= */}
      <group ref={head}>
        {/* Oberschale */}
        <RoundedBox args={[2.6, 0.92, 1.52]} radius={0.26} smoothness={5} position={[0, 0.44, 0]}>
          <meshStandardMaterial color={C.shell} {...shellMat} />
        </RoundedBox>
        {/* Unterschale */}
        <RoundedBox args={[2.6, 1.0, 1.52]} radius={0.26} smoothness={5} position={[0, -0.42, 0]}>
          <meshStandardMaterial color={C.bodyPurple} {...shellMat} />
        </RoundedBox>

        {/* Sucher-Höcker */}
        <RoundedBox args={[1.02, 0.46, 0.76]} radius={0.13} smoothness={4} position={[0, 1.03, -0.1]}>
          <meshStandardMaterial color={C.shell} {...shellMat} />
        </RoundedBox>
        {/* Prismenfenster — echtes Iridescence-Material */}
        <RoundedBox args={[0.82, 0.26, 0.06]} radius={0.03} smoothness={3} position={[0, 1.03, 0.28]}>
          <meshPhysicalMaterial
            color="#6a4bd0"
            roughness={0.12}
            metalness={0.2}
            iridescence={1}
            iridescenceIOR={1.6}
            iridescenceThicknessRange={[120, 780]}
            clearcoat={1}
          />
        </RoundedBox>

        {/* Bedienelemente oben links */}
        <mesh position={[-0.78, 0.96, 0.12]}>
          <cylinderGeometry args={[0.115, 0.115, 0.13, 20]} />
          <meshStandardMaterial color={C.mint} roughness={0.3} />
        </mesh>
        <mesh position={[-0.46, 0.97, 0.12]}>
          <cylinderGeometry args={[0.105, 0.105, 0.15, 20]} />
          <meshStandardMaterial color={C.pink} roughness={0.3} />
        </mesh>
        {/* Wählrad + Auslöser rechts */}
        <mesh position={[0.82, 0.99, 0.02]}>
          <cylinderGeometry args={[0.28, 0.28, 0.2, 24]} />
          <meshStandardMaterial color={C.sun} roughness={0.34} metalness={0.1} />
        </mesh>
        <mesh position={[0.45, 0.96, 0.16]}>
          <cylinderGeometry args={[0.1, 0.1, 0.14, 18]} />
          <meshStandardMaterial color={C.sun} roughness={0.3} />
        </mesh>

        {/* Kleines Wählrad auf der Front links */}
        <group position={[-0.94, 0.2, 0.77]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.17, 0.055, 10, 28]} />
            <meshStandardMaterial color={C.shell} {...shellMat} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.07, 20]} />
            <meshStandardMaterial color={C.violet} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color={C.dark} roughness={0.5} />
          </mesh>
        </group>
        {/* Lichtleiste rechts */}
        <RoundedBox args={[0.52, 0.14, 0.06]} radius={0.06} smoothness={3} position={[0.86, 0.26, 0.77]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.55} roughness={0.3} />
        </RoundedBox>

        {/* ---------------- OBJEKTIV ---------------- */}
        <group ref={lens} position={[0, -0.08, 0.62]}>
          <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.88, 0.9, 0.2, 40]} />
            <meshStandardMaterial color={C.mount} roughness={0.45} />
          </mesh>
          {/* Griffring — kantig, damit die Riffelung liest */}
          <mesh position={[0, 0, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.85, 0.85, 0.3, 26]} />
            <meshStandardMaterial color={C.barrel} roughness={0.5} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.47]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.83, 0.28, 40]} />
            <meshStandardMaterial color={C.violet} roughness={0.38} />
          </mesh>
          {/* Innentubus */}
          <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.66, 0.66, 0.5, 32, 1, true]} />
            <meshStandardMaterial color="#0d0620" roughness={0.9} side={THREE.BackSide} />
          </mesh>
          {/* Glas */}
          <mesh position={[0, 0, 0.63]}>
            <circleGeometry args={[0.66, 48]} />
            <meshPhysicalMaterial
              color="#0b0520"
              roughness={0.08}
              metalness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.05}
            />
          </mesh>
          {/* Blende: schliesst beim „Blinzeln" */}
          <mesh ref={iris} position={[0, 0, 0.655]}>
            <ringGeometry args={[0.44, 0.68, 40]} />
            <meshBasicMaterial color="#0a041c" transparent opacity={0.92} toneMapped={false} />
          </mesh>
          {/* Das echte Logo als leuchtendes Auge */}
          <mesh position={[0, 0, 0.665]}>
            <planeGeometry args={[0.82, 0.82]} />
            <meshBasicMaterial
              ref={starMat}
              map={starTex}
              transparent
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
          {/* Glanzkante + Reflex */}
          <mesh position={[0, 0, 0.64]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.66, 0.018, 8, 48]} />
            <meshBasicMaterial color="#b9a6ff" transparent opacity={0.5} toneMapped={false} />
          </mesh>
          <mesh position={[-0.24, 0.24, 0.668]} rotation={[0, 0, 0.7]}>
            <circleGeometry args={[0.12, 24]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.16} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Rig({ target, coarse, reduce }: Input) {
  const { camera } = useThree();
  const cam = useMemo(() => ({ x: new Spring(0, 26, 10), y: new Spring(0, 26, 10) }), []);
  useFrame((_, dt) => {
    if (reduce) return;
    // Kamera-Parallax gegenläufig zum Blick — erzeugt echte Raumtiefe
    const x = cam.x.step(target.current.x * -0.34, dt);
    const y = cam.y.step(target.current.y * 0.2, dt);
    camera.position.x = x;
    camera.position.y = y - 0.25;
    camera.lookAt(0, -0.85, 0);
  });
  return null;
}

export default function MascotScene({
  target,
  coarse,
  reduce,
  dpr,
}: Input & { dpr: [number, number] }) {
  return (
    <Canvas
      dpr={dpr}
      camera={{ fov: 30, position: [0, -0.35, 13], near: 1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.85} />
      {/* Führungslicht von vorn rechts oben */}
      <directionalLight position={[4.5, 5.5, 6]} intensity={2.1} color="#fffaf0" />
      {/* Violettes Fülllicht von links */}
      <pointLight position={[-5, 1.2, 4]} intensity={38} color={C.violet} distance={22} />
      {/* Türkiser Kantenreflex von hinten */}
      <pointLight position={[3.4, -1.6, -4.5]} intensity={30} color={C.sky} distance={20} />
      {/* Pinker Bodenreflex */}
      <pointLight position={[-2.2, -4.2, 2.5]} intensity={16} color={C.pink} distance={16} />

      <Witch target={target} coarse={coarse} reduce={reduce} />
      <Rig target={target} coarse={coarse} reduce={reduce} />

      <ContactShadows
        position={[0, -2.92, 0]}
        opacity={0.42}
        scale={12}
        blur={3.2}
        far={5}
        color="#2b1466"
      />
    </Canvas>
  );
}
