"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

/**
 * Der Kamera-Kopf als ECHTES 3D-Objekt: das GELIEFERTE Modell
 * netwitcher_camera_head_v1.glb (public/mascot/witch-head.glb),
 * gerendert mit three.js.
 *
 * Aufbau des gelieferten Modells: vertex-colorierte Low-Poly-Teile
 * (Gehäuse, Sucher, Knöpfe, Objektiv) plus zwei "exact art"-Decals mit
 * dem Original-Artwork. Das Front-Decal ist in Ruhe voll sichtbar
 * (Frontansicht = pixelgenaues Original) und blendet in den ersten
 * Grad der Drehung aus — darunter dreht die echte Geometrie. Das
 * Linsen-Decal (Neon-Stern) bleibt immer an.
 *
 * Beim Drehen wird echte Geometrie sichtbar: die Seitenflächen des
 * Gehäuses, die Objektiv-Wölbung, die Ober-/Unterseite — kein
 * verzerrtes Flachbild. Yaw/Pitch kommen als gefederte MotionValues
 * aus HeroStage (Maus-Ziel); gerendert wird NUR bei Wertänderung
 * (render-on-demand, kein Dauerloop) für flüssige 60 fps.
 *
 * Die Ebene ist rein kopflokal: der Körper darunter bleibt unberührt.
 * Bis das Modell geladen ist (und überall ohne WebGL) zeigt HeroStage
 * das statische Kopf-Bild — der Wechsel passiert erst nach dem ersten
 * gerenderten Frame (onReady).
 */
export function Head3D({
  yaw,
  pitch,
  enabled,
  onReady,
}: {
  /** Grad, gefedert (positiv = nach rechts schauen) */
  yaw: MotionValue<number>;
  /** Grad, gefedert (positiv = nach oben schauen) */
  pitch: MotionValue<number>;
  enabled: boolean;
  onReady?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled || failed) return;
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(22, 1, 0.01, 50);
        camera.position.set(0, 0, 5.8);
        camera.lookAt(0, 0, 0);

        // Licht auf den weichen Plush-Look des Assets abgestimmt
        scene.add(new THREE.AmbientLight(0xffffff, 1.4));
        const key = new THREE.DirectionalLight(0xffffff, 1.5);
        key.position.set(-1.2, 2.4, 3);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xb9a4ff, 0.7);
        fill.position.set(-2, -1, 2);
        scene.add(fill);

        const pivot = new THREE.Group();
        scene.add(pivot);

        const loader = new GLTFLoader();
        const draco = new DRACOLoader();
        draco.setDecoderPath("/draco/gltf/");
        loader.setDRACOLoader(draco);
        const gltf = await loader.loadAsync("/mascot/witch-head.glb");
        if (disposed) {
          renderer.dispose();
          return;
        }
        const model = gltf.scene;
        // Gelieferte Datei: Z-oben / −Y-vorn → auf Y-oben / +Z-vorn drehen
        model.rotation.x = -Math.PI / 2;
        let frontArt: { material: { opacity: number } } | null = null;
        model.traverse((o) => {
          const mesh = o as unknown as {
            isMesh?: boolean;
            name?: string;
            scale: { z: number };
            renderOrder: number;
            geometry: { getAttribute(n: string): { count: number; getX(i: number): number; getY(i: number): number; getZ(i: number): number; setXYZ(i: number, x: number, y: number, z: number): void; needsUpdate: boolean } | undefined };
            material: { side: number; transparent: boolean; depthWrite: boolean; opacity: number; vertexColors?: boolean };
          };
          if (!mesh.isMesh) return;
          if (mesh.name === "front_exact_art") {
            // Original-Artwork-Decal: vertikal gespiegelt geliefert
            mesh.scale.z = -1;
            mesh.material.side = THREE.DoubleSide;
            mesh.material.transparent = true;
            mesh.material.depthWrite = false;
            mesh.renderOrder = 10;
            frontArt = mesh as unknown as { material: { opacity: number } };
          } else if (mesh.name === "lens_exact_art") {
            mesh.material.transparent = true;
            mesh.material.depthWrite = false;
            mesh.renderOrder = 9;
          } else {
            const col = mesh.geometry.getAttribute("color");
            if (col) {
              // Vertex-Farben sind als sRGB gebacken → nach Linear wandeln
              const c = new THREE.Color();
              for (let i = 0; i < col.count; i++) {
                c.setRGB(col.getX(i), col.getY(i), col.getZ(i));
                c.convertSRGBToLinear();
                col.setXYZ(i, c.r, c.g, c.b);
              }
              col.needsUpdate = true;
              (o as unknown as { material: unknown }).material = new THREE.MeshStandardMaterial({
                vertexColors: true,
                roughness: 0.6,
                metalness: 0,
              });
            }
          }
        });
        // Zentrieren + normieren; Drehpunkt = Objektmitte (≈ Linse)
        const holder = new THREE.Group();
        holder.add(model);
        const box = new THREE.Box3().setFromObject(holder);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const scale = 2.0 / Math.max(size.x, size.y, size.z);
        holder.scale.setScalar(scale);
        holder.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        pivot.add(holder);

        host.appendChild(renderer.domElement);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";

        const fit = () => {
          const r = host.getBoundingClientRect();
          if (r.width < 4 || r.height < 4) return;
          renderer.setSize(r.width, r.height, false);
          camera.aspect = r.width / r.height;
          camera.updateProjectionMatrix();
          schedule();
        };

        // Render-on-demand: nur bei Wertänderung/Resize zeichnen
        let raf = 0;
        let announced = false;
        const draw = () => {
          raf = 0;
          const yv = yaw.get();
          const pv = pitch.get();
          pivot.rotation.y = (yv * Math.PI) / 180;
          pivot.rotation.x = (-pv * Math.PI) / 180;
          // Front-Decal: in Ruhe = pixelgenaues Original, blendet über
          // die ersten Grad der Drehung aus (Geometrie übernimmt)
          if (frontArt) {
            const mag = Math.hypot(yv, pv);
            frontArt.material.opacity = Math.max(0, Math.min(1, 1 - (mag - 1) / 5.5));
          }
          renderer.render(scene, camera);
          if (!announced) {
            announced = true;
            onReady?.();
          }
        };
        const schedule = () => {
          if (!raf) raf = requestAnimationFrame(draw);
        };
        const unY = yaw.on("change", schedule);
        const unP = pitch.on("change", schedule);
        const ro = new ResizeObserver(fit);
        ro.observe(host);
        fit();
        schedule();

        cleanup = () => {
          unY();
          unP();
          ro.disconnect();
          if (raf) cancelAnimationFrame(raf);
          renderer.dispose();
          renderer.domElement.remove();
          scene.traverse((o) => {
            const m = o as unknown as {
              geometry?: { dispose(): void };
              material?: { dispose(): void; map?: { dispose(): void } };
            };
            m.geometry?.dispose?.();
            if (m.material) {
              m.material.map?.dispose?.();
              m.material.dispose?.();
            }
          });
        };
      } catch {
        if (!disposed) setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, failed]);

  if (!enabled || failed) return null;
  return <div ref={hostRef} className="h-full w-full" />;
}
