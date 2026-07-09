"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, RoundedBox, Sparkles } from "@react-three/drei";
import {
  ARROW_HEX,
  arrowAnchors,
  cameraZ,
  envelope,
  lerp,
  phase,
  rand,
  sampleAnchors,
} from "./story-config";
import { media } from "@/lib/media";

type ProgressRef = React.MutableRefObject<number>;
type MouseRef = React.MutableRefObject<{ x: number; y: number }>;

/* ------------------------------------------------------------------ */
/* Die echten 3D-Pfeil-Renderings (aus der hochgeladenen arrows_3d.ai) */
/* ------------------------------------------------------------------ */

/** Textur-Dateien in Stern-Reihenfolge (mint, violet, pink, sun, sky). */
const ARROW_TEXTURES = [
  "/brand/arrow3d-mint.png",
  "/brand/arrow3d-violet.png",
  "/brand/arrow3d-pink.png",
  "/brand/arrow3d-sun.png",
  "/brand/arrow3d-sky.png",
];

/** Seitenverhältnis der Renderings: 800×512. */
const ARROW_W = 1.62;
const ARROW_H = 1.04;

/* ------------------------------------------------------------------ */
/* Hilfen                                                              */
/* ------------------------------------------------------------------ */

/** Textur laden, bei Fehler still auf Markenfarbe zurückfallen. */
function useSoftTexture(url?: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    new THREE.TextureLoader().load(
      url,
      (t) => {
        if (!alive) return;
        t.colorSpace = THREE.SRGBColorSpace;
        setTex(t);
      },
      undefined,
      () => {} // Fehler ignorieren → Farb-Fallback bleibt
    );
    return () => {
      alive = false;
    };
  }, [url]);
  return tex;
}

/** Weiches radiales Glow-Sprite (Canvas-Textur, kein Postprocessing). */
function useGlowTexture(hex: string): THREE.Texture {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, `${hex}cc`);
    g.addColorStop(0.4, `${hex}44`);
    g.addColorStop(1, `${hex}00`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [hex]);
}

/* ------------------------------------------------------------------ */
/* Kamera-Rig: Scroll-Dolly + Maus-Parallax                            */
/* ------------------------------------------------------------------ */

function Rig({ progress, mouse }: { progress: ProgressRef; mouse: MouseRef }) {
  const { camera, viewport } = useThree();
  useFrame(() => {
    const p = progress.current;
    // Schmale Screens: Kamera weiter zurück, damit die Szene komplett sichtbar bleibt
    const aspectBoost = viewport.aspect < 0.7 ? 1.5 : viewport.aspect < 1 ? 1.22 : 1;
    camera.position.z = lerp(camera.position.z, cameraZ(p) * aspectBoost, 0.08);
    camera.position.x = lerp(camera.position.x, mouse.current.x * 0.45, 0.06);
    camera.position.y = lerp(camera.position.y, -mouse.current.y * 0.3, 0.06);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Die fünf Logo-Pfeile                                                */
/* ------------------------------------------------------------------ */

function ArrowObject({
  index,
  progress,
  mouse,
}: {
  index: number;
  progress: ProgressRef;
  mouse: MouseRef;
}) {
  const group = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const tex = useSoftTexture(ARROW_TEXTURES[index]);
  const glowTex = useGlowTexture(ARROW_HEX[index]);
  const anchors = useMemo(() => arrowAnchors(index), [index]);
  const i = index;

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current;
    const t = clock.elapsedTime;
    const chaosSpin = envelope(p, 0.14, 0.3, 0.35); // Taumeln nur im Chaos
    const heroPhase = 1 - phase(p, 0.1, 0.18); // Maus-Einfluss im Hero
    const burst = phase(p, 0.88, 1);
    const tf = sampleAnchors(anchors, p);
    const float = Math.sin(t * (0.5 + i * 0.13) + i * 2.1) * 0.1 * (1 - burst);

    g.position.set(
      tf.pos[0] + mouse.current.x * (0.18 + i * 0.05) * heroPhase,
      tf.pos[1] + float + mouse.current.y * -(0.12 + i * 0.04) * heroPhase,
      tf.pos[2]
    );
    // Die Original-Renderings zeigen mit der Spitze nach unten -> Pi-Versatz zu den
    // (aufwaerts gedachten) Ankern. Kippwinkel klein halten, damit die gebackene
    // 3D-Perspektive der echten Assets glaubwuerdig bleibt.
    g.rotation.set(
      (tf.rot[0] + Math.sin(t * 0.4 + i) * 0.08 * (1 - burst)) * 0.4 + chaosSpin * Math.sin(t * 0.5 + i) * 0.35,
      (tf.rot[1] + Math.cos(t * 0.35 + i * 1.7) * 0.1 * (1 - burst)) * 0.4 + chaosSpin * Math.cos(t * 0.4 + i) * 0.3,
      tf.rot[2] + Math.PI + chaosSpin * Math.sin(t * 0.3 + i * 2) * 0.5
    );
    const pulse = 1 + Math.sin(t * 2.2 + i) * 0.015;
    g.scale.setScalar(tf.scale * pulse);
    if (glowRef.current) {
      (glowRef.current.material as THREE.SpriteMaterial).opacity =
        0.26 * heroPhase + 0.16 + burst * 0.4;
    }
  });

  return (
    <group ref={group}>
      <sprite ref={glowRef} scale={[2.6, 2.6, 1]} position={[0, 0, -0.25]}>
        <spriteMaterial
          map={glowTex}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <mesh>
        <planeGeometry args={[ARROW_W, ARROW_H]} />
        <meshBasicMaterial
          map={tex ?? undefined}
          color={tex ? "#ffffff" : ARROW_HEX[index]}
          transparent
          alphaTest={0.08}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Arrows({ progress, mouse }: { progress: ProgressRef; mouse: MouseRef }) {
  return (
    <group>
      {ARROW_HEX.map((hex, i) => (
        <ArrowObject key={hex} index={i} progress={progress} mouse={mouse} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Szene 2→3: Fragment-Kacheln (Chaos → geordneter Fluss)              */
/* ------------------------------------------------------------------ */

const FRAG_COUNT = 36;

function Fragments({ progress }: { progress: ProgressRef }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    return Array.from({ length: FRAG_COUNT }, (_, i) => {
      const a = rand(i * 11 + 1) * Math.PI * 2;
      const r = 2 + rand(i * 7 + 3) * 3;
      const lane = i % 3;
      return {
        chaos: [Math.cos(a) * r, (rand(i * 5 + 2) - 0.5) * 4.6, -1.5 - rand(i * 3 + 4) * 3] as const,
        chaosRot: [rand(i) * 3, rand(i + 50) * 3, rand(i + 90) * 3] as const,
        flow: [-3.4 + (Math.floor(i / 3) / (FRAG_COUNT / 3 - 1)) * 6.8, -0.85 + lane * 0.85 - 0.2, -0.6] as const,
        stagger: rand(i * 19 + 8) * 0.12,
        color: new THREE.Color(ARROW_HEX[i % 5]),
      };
    });
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    []
  );

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    data.forEach((d, i) => mesh.setColorAt(i, d.color));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [data]);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const p = progress.current;
    const t = clock.elapsedTime;
    const vis = envelope(p, 0.125, 0.47, 0.22);
    material.opacity = vis * 0.55;
    mesh.visible = vis > 0.01;
    if (!mesh.visible) return;

    data.forEach((d, i) => {
      const m = phase(p, 0.29 + d.stagger, 0.41 + d.stagger); // Chaos → Fluss
      const wob = (1 - m) * 0.35;
      dummy.position.set(
        lerp(d.chaos[0], d.flow[0], m) + Math.sin(t * 0.7 + i) * wob,
        lerp(d.chaos[1], d.flow[1], m) + Math.cos(t * 0.6 + i * 1.3) * wob + m * Math.sin(t * 1.4 + i) * 0.05,
        lerp(d.chaos[2], d.flow[2], m)
      );
      dummy.rotation.set(d.chaosRot[0] * (1 - m) + t * 0.15 * (1 - m), d.chaosRot[1] * (1 - m), d.chaosRot[2] * (1 - m));
      dummy.scale.setScalar(0.8 + m * 0.2);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, material, FRAG_COUNT]}>
      <planeGeometry args={[0.5, 0.32]} />
    </instancedMesh>
  );
}

/** Leuchtende Route durch den geordneten Fluss (Szene 3). */
function FlowLine({ progress }: { progress: ProgressRef }) {
  const ref = useRef<any>(null);
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.6, -1.1, -0.4),
      new THREE.Vector3(-1.6, 0.3, -0.4),
      new THREE.Vector3(0.4, -0.5, -0.4),
      new THREE.Vector3(2.2, 0.5, -0.4),
      new THREE.Vector3(3.7, 0.1, -0.4),
    ]);
    return curve.getPoints(80);
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const vis = envelope(progress.current, 0.3, 0.45, 0.3);
    ref.current.material.opacity = vis * 0.9;
    ref.current.visible = vis > 0.01;
  });

  return <Line ref={ref} points={points} color="#8B5CF6" lineWidth={2.5} transparent opacity={0} />;
}

/* ------------------------------------------------------------------ */
/* Szene 4: Studio-Galerie (echte Produktionsbilder als 3D-Panels)     */
/* ------------------------------------------------------------------ */

function ImagePanel({
  url,
  fallback,
  width,
  height,
}: {
  url?: string;
  fallback: string;
  width: number;
  height: number;
}) {
  const tex = useSoftTexture(url);
  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={tex ?? undefined}
          color={tex ? "#ffffff" : fallback}
          toneMapped={false}
          transparent
        />
      </mesh>
      {/* dezenter Neon-Rahmen */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width + 0.06, height + 0.06]} />
        <meshBasicMaterial color={fallback} transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

function StudioGallery({ progress }: { progress: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const panels = useMemo(
    () => [
      { url: media.studio.src, fallback: "#8B5CF6", w: 2.6, h: 1.5, to: [0, 0.35, 0] as const, from: [0, 0.4, -7] as const },
      { url: media.product.src, fallback: "#F468A8", w: 1.25, h: 1.66, to: [-2.15, -0.15, 0.35] as const, from: [-5, -0.4, -5] as const },
      { url: media.reels.src, fallback: "#0FB9F2", w: 1.9, h: 1.08, to: [2.1, -0.5, 0.3] as const, from: [5, -0.8, -5] as const },
      { url: media.studioClose.src, fallback: "#F5D33D", w: 1.15, h: 1.53, to: [1.9, 1.15, -0.4] as const, from: [4.5, 2.5, -6] as const },
      { url: undefined, fallback: "#2EE6C8", w: 1.05, h: 0.62, to: [-2.05, 1.25, -0.3] as const, from: [-4.5, 2.6, -6] as const },
    ],
    []
  );
  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const p = progress.current;
    const vis = envelope(p, 0.42, 0.6, 0.2);
    group.current.visible = vis > 0.01;
    if (!group.current.visible) return;
    const t = clock.elapsedTime;

    panels.forEach((panel, i) => {
      const g = refs.current[i];
      if (!g) return;
      const m = phase(p, 0.43 + i * 0.012, 0.5 + i * 0.012);
      const out = phase(p, 0.575, 0.6); // sanft nach hinten abtreten
      g.position.set(
        lerp(panel.from[0], panel.to[0], m),
        lerp(panel.from[1], panel.to[1], m) + Math.sin(t * 0.8 + i * 1.4) * 0.035,
        lerp(panel.from[2], panel.to[2], m) - out * 3
      );
      g.rotation.y = (1 - m) * (i % 2 ? 0.6 : -0.6);
      g.scale.setScalar(m * (1 - out * 0.3));
    });
  });

  return (
    <group ref={group} visible={false}>
      {panels.map((panel, i) => (
        <group
          key={i}
          ref={(g) => {
            refs.current[i] = g;
          }}
        >
          <ImagePanel url={panel.url} fallback={panel.fallback} width={panel.w} height={panel.h} />
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Szene 5: Kampagnen-Boards mit wachsenden Charts & Conversion-Pulsen */
/* ------------------------------------------------------------------ */

function CampaignBoards({ progress }: { progress: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const barRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const perfTex = useSoftTexture(media.performance.src);

  const boards = [
    { x: -1.55, color: "#0FB9F2" },
    { x: 0.35, color: "#8B5CF6" },
    { x: 2.25, color: "#F468A8" },
  ];
  const barHeights = [0.45, 0.8, 0.6, 1.05];

  useFrame(({ clock }) => {
    if (!group.current) return;
    const p = progress.current;
    const vis = envelope(p, 0.58, 0.735, 0.2);
    group.current.visible = vis > 0.01;
    if (!group.current.visible) return;
    const t = clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.7) * 0.04;

    // Balken wachsen gestaffelt
    barRefs.current.forEach((bar, idx) => {
      if (!bar) return;
      const grow = phase(p, 0.6 + idx * 0.008, 0.675 + idx * 0.008);
      const h = barHeights[idx % 4] * grow * vis;
      bar.scale.y = Math.max(h, 0.001);
      bar.position.y = -0.55 + (barHeights[idx % 4] * grow) / 2;
    });

    // Conversion-Pulse: expandierende Ringe
    ringRefs.current.forEach((ring, idx) => {
      if (!ring) return;
      const cycle = (t * 0.55 + idx * 0.5) % 1;
      ring.scale.setScalar(0.3 + cycle * 2.4);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - cycle) * 0.5 * vis;
    });
  });

  return (
    <group ref={group} visible={false}>
      {/* Hintergrund: Performance-Environment */}
      <mesh position={[0.35, 0.9, -1.6]}>
        <planeGeometry args={[5.4, 3]} />
        <meshBasicMaterial map={perfTex ?? undefined} color={perfTex ? "#ffffff" : "#121226"} transparent opacity={0.85} toneMapped={false} />
      </mesh>

      {boards.map((board, b) => (
        <group key={b} position={[board.x, -0.1, 0]}>
          <RoundedBox args={[1.5, 1.7, 0.06]} radius={0.07}>
            <meshStandardMaterial color="#121226" metalness={0.2} roughness={0.6} />
          </RoundedBox>
          <mesh position={[0, 0.62, 0.05]}>
            <planeGeometry args={[1.24, 0.16]} />
            <meshBasicMaterial color={board.color} transparent opacity={0.9} toneMapped={false} />
          </mesh>
          {barHeights.map((_, i) => (
            <mesh
              key={i}
              ref={(m) => {
                barRefs.current[b * 4 + i] = m;
              }}
              position={[-0.45 + i * 0.3, -0.55, 0.05]}
            >
              <boxGeometry args={[0.18, 1, 0.05]} />
              <meshBasicMaterial color={board.color} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}

      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            ringRefs.current[i] = m;
          }}
          position={[0.35, -0.1, 0.4]}
        >
          <ringGeometry args={[0.46, 0.5, 48]} />
          <meshBasicMaterial color="#2EE6C8" transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Szene 6: Website-Layout baut sich aus UI-Karten zusammen            */
/* ------------------------------------------------------------------ */

function WebLayout({ progress }: { progress: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  const cards = useMemo(
    () => [
      { to: [0, 1.55, 0], w: 4.4, h: 0.34, color: "#1A1A33", op: 0.95 }, // Header
      { to: [0, 0.55, 0], w: 4.4, h: 1.35, color: "#8B5CF6", op: 0.28 }, // Hero
      { to: [-1.5, -0.75, 0], w: 1.36, h: 0.95, color: "#121226", op: 0.95 },
      { to: [0, -0.75, 0], w: 1.36, h: 0.95, color: "#121226", op: 0.95 },
      { to: [1.5, -0.75, 0], w: 1.36, h: 0.95, color: "#121226", op: 0.95 },
      { to: [0, -1.7, 0], w: 1.7, h: 0.4, color: "#2EE6C8", op: 0.95 }, // CTA
      { to: [-1.35, 0.55, 0.06], w: 1.3, h: 0.7, color: "#0FB9F2", op: 0.35 },
      { to: [1.2, 0.4, 0.08], w: 1.1, h: 0.28, color: "#F468A8", op: 0.6 },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const p = progress.current;
    const vis = envelope(p, 0.72, 0.875, 0.2);
    group.current.visible = vis > 0.01;
    if (!group.current.visible) return;
    const t = clock.elapsedTime;

    cards.forEach((card, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const m = phase(p, 0.725 + i * 0.012, 0.8 + i * 0.012);
      const from = [(rand(i * 3 + 2) - 0.5) * 8, (rand(i * 5 + 6) - 0.5) * 6, -5];
      mesh.position.set(
        lerp(from[0], card.to[0], m),
        lerp(from[1], card.to[1], m) + Math.sin(t * 0.9 + i) * 0.02,
        lerp(from[2], card.to[2], m)
      );
      mesh.rotation.x = (1 - m) * 0.8;
      (mesh.material as THREE.MeshBasicMaterial).opacity = card.op * m * vis;
    });
  });

  return (
    <group ref={group} visible={false}>
      {cards.map((card, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
        >
          <planeGeometry args={[card.w, card.h]} />
          <meshBasicMaterial color={card.color} transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Zentrales Glühen (Hero sanft, Conversion-Burst stark)               */
/* ------------------------------------------------------------------ */

function CenterGlow({ progress }: { progress: ProgressRef }) {
  const ref = useRef<THREE.Sprite>(null);
  const tex = useGlowTexture("#8B5CF6");
  useFrame(() => {
    if (!ref.current) return;
    const p = progress.current;
    const hero = 1 - phase(p, 0.1, 0.2);
    const burst = phase(p, 0.87, 0.98);
    const s = 3 + burst * 4;
    ref.current.scale.set(s, s, 1);
    ref.current.position.y = burst * 0.55;
    (ref.current.material as THREE.SpriteMaterial).opacity = 0.4 * hero + burst * 0.55;
  });
  return (
    <sprite ref={ref} position={[0, 0, -1.2]}>
      <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

/* ------------------------------------------------------------------ */
/* Canvas-Einstieg                                                     */
/* ------------------------------------------------------------------ */

export default function StoryScene({
  progress,
  mouse,
}: {
  progress: ProgressRef;
  mouse: MouseRef;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 42, position: [0, 0, 6.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 8]} intensity={1.1} />
      <pointLight position={[-5, -2, 3]} intensity={14} color="#8B5CF6" />
      <pointLight position={[5, 3, 2]} intensity={10} color="#0FB9F2" />

      <Rig progress={progress} mouse={mouse} />
      <CenterGlow progress={progress} />
      <Arrows progress={progress} mouse={mouse} />
      <Fragments progress={progress} />
      <FlowLine progress={progress} />
      <StudioGallery progress={progress} />
      <CampaignBoards progress={progress} />
      <WebLayout progress={progress} />

      <Sparkles count={160} scale={[12, 7, 6]} size={1.6} speed={0.25} opacity={0.5} color="#a3a3c2" />
    </Canvas>
  );
}
