"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

/**
 * Der Kamera-Kopf als ECHTES 3D-Objekt: camera-head.glb, per Multi-View
 * image-to-3D aus der freigegebenen Kunden-Referenz rekonstruiert und
 * mit three.js gerendert.
 *
 * Beim Drehen wird echte Geometrie sichtbar — Seitenflächen, Objektiv-
 * Tiefe, Ober-/Unterseite — kein verzerrtes Flachbild. Yaw/Pitch kommen
 * als gefederte MotionValues aus HeroStage (Maus-Ziel); gezeichnet wird
 * NUR bei Wertänderung (render-on-demand, kein Dauerloop).
 *
 * Die Ebene ist rein kopflokal: der Körper darunter bleibt unberührt.
 * Bis zum ersten gerenderten Frame (und überall ohne WebGL) zeigt
 * HeroStage das Poster mit gemaltem Kopf — der Wechsel passiert erst
 * nach onReady, es steht also nie eine kopflose Figur im Bild.
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

        // Licht auf den weichen Toy-Look des Posters abgestimmt
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
        const gltf = await loader.loadAsync("/mascot/camera-head.glb");
        if (disposed) {
          renderer.dispose();
          return;
        }
        const model = gltf.scene;
        // Zentrieren + normieren; Drehpunkt = Objektmitte
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);
        const scale = 2.0 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        pivot.add(model);

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
          pivot.rotation.y = (yaw.get() * Math.PI) / 180;
          pivot.rotation.x = (-pitch.get() * Math.PI) / 180;
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
