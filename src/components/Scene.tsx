"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Soft circle texture ──
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

// ── Rasterize text ──
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

// ── Ring ──
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

// ── Orbit ──
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
    pts.push(new THREE.Vector3(
      (Math.random() - 0.5) * bound,
      (Math.random() - 0.5) * bound,
      (Math.random() - 0.5) * bound * 0.4 - 8
    ));
  }
  return pts;
}

// ── Gray → Purple gradient ──
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

// ── Make Points geometry ──
function makePointsGeo(vecs: THREE.Vector3[], colors?: Float32Array): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(vecs.length * 3);
  vecs.forEach((v, i) => {
    pos[i * 3] = v.x;
    pos[i * 3 + 1] = v.y;
    pos[i * 3 + 2] = v.z;
  });
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  if (colors) geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

// ── Main particle system ──
function ParticleDonat({ scale, scrollProgress }: { scale: number; scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Points>(null);
  const orbitRef = useRef<THREE.Points>(null);

  const tex = useMemo(() => createParticleTexture(), []);

  const s = Math.max(0.35, scale) * 0.85;
  const textCount = Math.round(3000 * s);

  const { textVecs, textColors, ringVecs, ringColors, orbitVecs, starVecs } = useMemo(() => {
    const tv = rasterizeText("donat", textCount, 5.5 * s);
    const tc = grayToPurple(tv, s);
    const rv = generateRing(Math.round(600 * s), 4.2 * s, 0.6 * s, 0.4);
    const rcGray = grayToPurple(rv.map(v => new THREE.Vector3(v.x / (4.2 * s), v.y / (4.2 * s), 0)), s);
    const boostedColors = new Float32Array(rcGray.length);
    for (let i = 0; i < rcGray.length / 3; i++) {
      const alpha = i / (rcGray.length / 3);
      const col = new THREE.Color(0.4, 0.2, 0.8).lerp(new THREE.Color(0.6, 0.5, 0.8), 1 - alpha);
      boostedColors[i * 3] = col.r * 0.9;
      boostedColors[i * 3 + 1] = col.g * 0.9;
      boostedColors[i * 3 + 2] = col.b * 0.9;
    }
    const ov = generateOrbit(Math.round(120 * s), 5.8 * s, 1.5 * s);
    const sv = generateStars(Math.round(300 * s), 30 * s + 10);
    return {
      textVecs: tv, textColors: tc,
      ringVecs: rv, ringColors: boostedColors,
      orbitVecs: ov, starVecs: sv,
    };
  }, [textCount, s]);

  const textGeo = useMemo(() => makePointsGeo(textVecs, textColors), [textVecs, textColors]);
  const ringGeo = useMemo(() => makePointsGeo(ringVecs, ringColors), [ringVecs, ringColors]);
  const orbitGeo = useMemo(() => makePointsGeo(orbitVecs), [orbitVecs]);
  const starGeo = useMemo(() => makePointsGeo(starVecs), [starVecs]);

  const ps = Math.max(0.05, 0.09 * s);

  // ── Scroll-driven animation ──
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // ScrollProgress drives additional effects:
    // 0 = top of page, 1 = bottom
    // Hero is ~0 to ~0.2 (300vh out of ~1500vh total)
    const sp = Math.max(0, Math.min(1, scrollProgress));
    // Map scroll to effects: hero area = 0-0.25, rest = 0.25-1
    const heroPhase = Math.max(0, Math.min(1, (sp - 0.25) / 0.75)); // 0 in hero, 1 after hero

    if (groupRef.current) {
      // Base rotation slows as scroll progresses
      const baseRotSpeed = 0.004 * s * (1 - heroPhase * 0.6);
      groupRef.current.rotation.y += baseRotSpeed;

      // Wobble dampens after hero
      const wobbleAmount = 0.12 * (1 - heroPhase * 0.7);
      groupRef.current.rotation.x = Math.sin(t * 0.12) * wobbleAmount;
      groupRef.current.rotation.z = Math.sin(t * 0.08) * (wobbleAmount * 0.5);

      // Float height changes with scroll
      const floatAmp = (0.3 * s) * (1 - heroPhase * 0.5);
      groupRef.current.position.y = Math.sin(t * 0.15) * floatAmp + heroPhase * 0.5 * s;
    }

    // Text wave — gets more intense after hero
    if (textRef.current) {
      const pos = textRef.current.geometry.attributes.position.array as Float32Array;
      const waveAmp = (0.06 * s) * (1 + heroPhase * 2);
      const waveFreq = 0.8 + heroPhase * 0.5;
      for (let i = 0; i < textVecs.length; i++) {
        pos[i * 3 + 2] = textVecs[i].z + Math.sin(t * waveFreq + textVecs[i].x * 2) * waveAmp;
      }
      textRef.current.geometry.attributes.position.needsUpdate = true;

      // Text sparkle on scroll
      if (heroPhase > 0.3) {
        (textRef.current.material as THREE.PointsMaterial).opacity =
          0.75 + Math.sin(t * 2 + sp * 5) * 0.1;
      } else {
        (textRef.current.material as THREE.PointsMaterial).opacity = 0.85;
      }
    }

    // Ring pulse + scroll reaction
    if (ringRef.current) {
      const ringPulse = 0.35 + Math.sin(t * (0.5 + sp * 0.3)) * 0.12;
      (ringRef.current.material as THREE.PointsMaterial).opacity = ringPulse;
    }

    // Orbit speeds up with scroll
    if (orbitRef.current) {
      orbitRef.current.rotation.y += (0.01 * s) * (1 + heroPhase);
      orbitRef.current.rotation.x = Math.sin(t * 0.1) * (0.05 + heroPhase * 0.06);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Stars */}
      <points geometry={starGeo}>
        <pointsMaterial size={0.03} color="#555555" sizeAttenuation transparent opacity={0.3} depthWrite={false} />
      </points>

      {/* Ring */}
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

      {/* Orbit */}
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

      {/* Text */}
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

// ── Scene content ──
function SceneContent({ scrollProgress }: { scrollProgress: number }) {
  const { viewport } = useThree();
  const scale = Math.min(1, Math.max(0.35, viewport.width / 8));

  return (
    <>
      <color attach="background" args={["#09090b"]} />
      <ParticleDonat scale={scale} scrollProgress={scrollProgress} />
    </>
  );
}

export default function Scene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "#09090b" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <SceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
