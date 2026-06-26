"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Rasterize text to sample pixel positions for 3D particles
function sampleTextParticles(text: string, count: number): THREE.Vector3[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const size = 256;
  canvas.width = size;
  canvas.height = size;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);

  // Use Geist Mono or Courier New
  const fontSize = 180;
  ctx.font = `bold ${fontSize}px "Geist Mono", "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, size / 2, size / 2);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  const whitePixels: { x: number; y: number }[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      if (data[idx] > 128) {
        whitePixels.push({ x, y });
      }
    }
  }

  const step = Math.max(1, Math.floor(whitePixels.length / count));
  const selected = whitePixels.filter((_, i) => i % step === 0).slice(0, count);

  const scale = 10;
  const depthSpread = 1.5;
  const cx = size / 2;
  const cy = size / 2;

  return selected.map((p) => {
    const px = ((p.x - cx) / cx) * scale;
    const py = -((p.y - cy) / cy) * scale;
    const pz = (Math.random() - 0.5) * depthSpread;
    return new THREE.Vector3(px, py, pz);
  });
}

// Generate donut ring particles around the text
function generateDonutRing(count: number, radius: number, tubeRadius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2;
    const v = ((i * 7) / count) * Math.PI * 2;
    const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
    const y = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
    const z = tubeRadius * Math.sin(v);
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

function ParticleDonat({ scale }: { scale: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate particles with scale factor
  const textParticles = useMemo(() => {
    const positions = sampleTextParticles("donat", Math.round(1500 * Math.min(1, scale)));
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(positions.flatMap((v) => [v.x * scale, v.y * scale, v.z * scale]));
    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    return geometry;
  }, [scale]);

  const ringParticles = useMemo(() => {
    const scaledCount = Math.round(800 * Math.min(1, scale));
    const positions = generateDonutRing(scaledCount, 4.2 * scale, 1.2 * scale);
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(positions.flatMap((v) => [v.x, v.y, v.z]));
    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    return geometry;
  }, [scale]);

  const starParticles = useMemo(() => {
    const count = Math.round(400 * Math.min(1, scale));
    const starBound = 15 * scale + 10;
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * starBound * 2,
          (Math.random() - 0.5) * starBound * 2,
          (Math.random() - 0.5) * 20 - 10
        )
      );
    }
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(positions.flatMap((v) => [v.x, v.y, v.z]));
    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    return geometry;
  }, [scale]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.15;
      groupRef.current.rotation.y += 0.003 * scale;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.2) * (0.2 * scale);
    }
  });

  const ps = 0.12 * (scale < 1 ? Math.max(0.07, scale * 0.12) : 0.12);

  return (
    <group ref={groupRef}>
      <points geometry={textParticles}>
        <pointsMaterial
          size={ps}
          color="#999999"
          sizeAttenuation
          transparent
          opacity={Math.min(0.8, scale * 0.6 + 0.2)}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points geometry={ringParticles}>
        <pointsMaterial
          size={ps * 0.7}
          color="#666666"
          sizeAttenuation
          transparent
          opacity={Math.min(0.4, scale * 0.3 + 0.1)}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points geometry={starParticles}>
        <pointsMaterial
          size={ps * 0.35}
          color="#444444"
          sizeAttenuation
          transparent
          opacity={Math.min(0.3, scale * 0.2 + 0.1)}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function SceneContent() {
  const { viewport } = useThree();
  // Calculate scale based on viewport width
  // Base viewport is ~8 units wide on desktop, on mobile it gets smaller
  const scale = Math.min(1, Math.max(0.35, viewport.width / 8));

  return (
    <>
      <color attach="background" args={["#09090b"]} />
      <ParticleDonat scale={scale} />
    </>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ background: "#09090b" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
