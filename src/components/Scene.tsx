"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Soft circle particle texture ──
function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ── Rasterize text to particle positions ──
function rasterizeText(text: string, maxCount: number, spread: number): THREE.Vector3[] {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.font = `bold 180px "Geist Mono", "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, size / 2, size / 2);

  const data = ctx.getImageData(0, 0, size, size).data;
  const pixels: number[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[(y * size + x) * 4] > 128) pixels.push(x, y);
    }
  }

  const step = Math.max(2, Math.floor(pixels.length / 2 / maxCount));
  const cx = size / 2;
  const cy = size / 2;
  const result: THREE.Vector3[] = [];

  for (let i = 0; i < pixels.length && result.length < maxCount; i += step * 2) {
    result.push(
      new THREE.Vector3(
        ((pixels[i] - cx) / cx) * spread,
        -((pixels[i + 1] - cy) / cy) * spread,
        (Math.random() - 0.5) * spread * 0.15
      )
    );
  }
  return result;
}

// ── Generate torus ring ──
function generateRing(count: number, radius: number, tube: number, twist: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const u = t + twist * Math.sin(t * 3);
    const v = ((i * 13) / count) * Math.PI * 2;
    pts.push(
      new THREE.Vector3(
        (radius + tube * Math.cos(v)) * Math.cos(u),
        (radius + tube * Math.cos(v)) * Math.sin(u),
        tube * Math.sin(v)
      )
    );
  }
  return pts;
}

// ── Orbit ring ──
function generateOrbit(count: number, radius: number, spreadZ: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = radius + (Math.random() - 0.5) * 0.5;
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * spreadZ));
  }
  return pts;
}

// ── Stars ──
function generateStars(count: number, bound: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    pts.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * bound,
        (Math.random() - 0.5) * bound,
        (Math.random() - 0.5) * bound * 0.4 - 8
      )
    );
  }
  return pts;
}

// ── Color helper: gray → purple gradient via position ──
function grayToPurple(vecs: THREE.Vector3[], s: number): Float32Array {
  const c = new Float32Array(vecs.length * 3);
  const purple = new THREE.Color(0.35, 0.15, 0.75);
  const gray = new THREE.Color(0.5, 0.5, 0.5);
  for (let i = 0; i < vecs.length; i++) {
    const x = vecs[i].x / (5.5 * s);
    const y = vecs[i].y / (5.5 * s);
    const t = Math.min(1, Math.sqrt(x * x + y * y) / 1.5);
    const col = gray.clone().lerp(purple, t);
    c[i * 3] = col.r;
    c[i * 3 + 1] = col.g;
    c[i * 3 + 2] = col.b;
  }
  return c;
}

// ── Make Points geometry from vector array ──
function makePointsGeo(vecs: THREE.Vector3[], colors?: Float32Array): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(vecs.length * 3);
  vecs.forEach((v, i) => { pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z; });
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  if (colors) geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

// ── Particle Donat ──
function ParticleDonat({ scale }: { scale: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Points>(null);
  const orbitRef = useRef<THREE.Points>(null);

  const tex = useMemo(() => createParticleTexture(), []);

  const s = Math.max(0.35, scale) * 0.85;
  const textCount = Math.round(3000 * s);

  // ── Memoized geometries ──
  const { textVecs, textColors, ringVecs, ringColors, orbitVecs, starVecs } = useMemo(() => {
    const tv = rasterizeText("donat", textCount, 5.5 * s);
    const tc = grayToPurple(tv, s);
    const rv = generateRing(Math.round(600 * s), 4.2 * s, 0.6 * s, 0.4);
    const rc = grayToPurple(rv.map(v => new THREE.Vector3(v.x / (4.2 * s), v.y / (4.2 * s), 0)), s);
    const ov = generateOrbit(Math.round(120 * s), 5.8 * s, 1.5 * s);
    const sv = generateStars(Math.round(300 * s), 30 * s + 10);

    // Boost ring colors toward purple
    const boostedColors = new Float32Array(rc.length);
    const purpleBoost = new THREE.Color(0.4, 0.2, 0.8);
    for (let i = 0; i < rc.length / 3; i++) {
      const alpha = i / (rc.length / 3);
      const col = purpleBoost.clone().lerp(new THREE.Color(0.6, 0.5, 0.8), 1 - alpha);
      boostedColors[i * 3] = col.r * 0.9;
      boostedColors[i * 3 + 1] = col.g * 0.9;
      boostedColors[i * 3 + 2] = col.b * 0.9;
    }

    return {
      textVecs: tv,
      textColors: tc,
      ringVecs: rv,
      ringColors: boostedColors,
      orbitVecs: ov,
      starVecs: sv,
    };
  }, [textCount, s]);

  const textGeo = useMemo(() => makePointsGeo(textVecs, textColors), [textVecs, textColors]);
  const ringGeo = useMemo(() => makePointsGeo(ringVecs, ringColors), [ringVecs, ringColors]);
  const orbitGeo = useMemo(() => makePointsGeo(orbitVecs), [orbitVecs]);
  const starGeo = useMemo(() => makePointsGeo(starVecs), [starVecs]);

  const ps = Math.max(0.05, 0.09 * s);

  // ── Animation ──
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004 * s;
      groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.12;
      groupRef.current.rotation.z = Math.sin(t * 0.08) * 0.06;
      groupRef.current.position.y = Math.sin(t * 0.15) * (0.3 * s);
    }

    // Wave on text
    if (textRef.current) {
      const pos = textRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < textVecs.length; i++) {
        pos[i * 3 + 2] = textVecs[i].z + Math.sin(t * 0.8 + textVecs[i].x * 2) * 0.06 * s;
      }
      textRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Ring pulse
    if (ringRef.current) {
      (ringRef.current.material as THREE.PointsMaterial).opacity = 0.35 + Math.sin(t * 0.5) * 0.1;
    }

    // Orbit spin
    if (orbitRef.current) {
      orbitRef.current.rotation.y += 0.01 * s;
      orbitRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Stars background */}
      <points geometry={starGeo}>
        <pointsMaterial size={0.03} color="#555555" sizeAttenuation transparent opacity={0.3} depthWrite={false} />
      </points>

      {/* Torus ring with soft glow */}
      <points ref={ringRef} geometry={ringGeo}>
        <pointsMaterial
          size={ps * 1.5}
          map={tex}
          sizeAttenuation
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>

      {/* Orbit dots */}
      <points ref={orbitRef} geometry={orbitGeo}>
        <pointsMaterial
          size={ps * 0.8}
          color="#7777bb"
          map={tex}
          sizeAttenuation
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* "donat" text */}
      <points ref={textRef} geometry={textGeo}>
        <pointsMaterial
          size={ps}
          map={tex}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>
    </group>
  );
}

// ── Scene ──
function SceneContent() {
  const { viewport } = useThree();
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
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "#09090b" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
