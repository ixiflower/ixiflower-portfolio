"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Rasterize "donat" text to sample pixel positions for 3D particles
function sampleTextParticles(text: string, count: number): THREE.Vector3[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Use a large canvas for high-res sampling
  const size = 256;
  canvas.width = size;
  canvas.height = size;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);

  // Big bold monospace text
  const fontSize = 180;
  ctx.font = `bold ${fontSize}px "Geist Mono", "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, size / 2, size / 2);

  // Sample white pixels
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  const whitePixels: { x: number; y: number }[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Only take pixels above threshold
      if (data[idx] > 128) {
        whitePixels.push({ x, y });
      }
    }
  }

  // If too many, subsample; if too few, repeat
  const step = Math.max(1, Math.floor(whitePixels.length / count));
  const selected = whitePixels.filter((_, i) => i % step === 0).slice(0, count);

  // Map to 3D space [-5, 5] with depth spread
  const scale = 10;
  const depthSpread = 1.5;
  const cx = size / 2;
  const cy = size / 2;

  return selected.map((p) => {
    const px = ((p.x - cx) / cx) * scale;
    const py = -((p.y - cy) / cy) * scale; // flip Y
    const pz = (Math.random() - 0.5) * depthSpread;
    return new THREE.Vector3(px, py, pz);
  });
}

// Donut ring particles for the torus (ASCII donut style)
function generateDonutRing(count: number, radius: number, tubeRadius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2;
    const v = ((i * 7) / count) * Math.PI * 2; // extra twist
    const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
    const y = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
    const z = tubeRadius * Math.sin(v);
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

function ParticleDonat({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
  const groupRef = useRef<THREE.Group>(null);
  const textPoints = useRef<THREE.Points>(null);
  const ringPoints = useRef<THREE.Points>(null);

  // Generate the "donat" text particles
  const textParticles = useMemo(() => {
    const positions = sampleTextParticles("donat", 1500);
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(positions.flatMap((v) => [v.x, v.y, v.z]));
    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    return geometry;
  }, []);

  // Generate donut ring around the text
  const ringParticles = useMemo(() => {
    const positions = generateDonutRing(800, 4.2, 1.2);
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(positions.flatMap((v) => [v.x, v.y, v.z]));
    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    return geometry;
  }, []);

  // Random small stars in background
  const starParticles = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < 400; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20 - 10
        )
      );
    }
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(positions.flatMap((v) => [v.x, v.y, v.z]));
    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    return geometry;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.15;
      groupRef.current.rotation.y += 0.003;
      // Subtle float
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* "donat" text particles */}
      <points ref={textPoints} geometry={textParticles}>
        <pointsMaterial
          size={0.12}
          color="#999999"
          sizeAttenuation
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Donut ring */}
      <points ref={ringPoints} geometry={ringParticles}>
        <pointsMaterial
          size={0.08}
          color="#666666"
          sizeAttenuation
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Background stars */}
      <points geometry={starParticles}>
        <pointsMaterial
          size={0.04}
          color="#444444"
          sizeAttenuation
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function SceneContent({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
  return (
    <>
      <color attach="background" args={["#09090b"]} />
      <ambientLight intensity={0.5} />
      <ParticleDonat mouse={mouse} />
    </>
  );
}

export default function Scene() {
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ background: "#09090b" }}
      >
        <SceneContent mouse={mouseRef} />
      </Canvas>
    </div>
  );
}
