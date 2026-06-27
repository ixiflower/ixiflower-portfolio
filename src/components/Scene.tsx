"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Soft circle particle texture ───
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.1, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.3, "rgba(255,255,255,0.6)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0.25)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Spiral galaxy generator ───
function generateGalaxy(
  count: number,
  arms: number,
  radius: number,
  twist: number,
  thickness: number,
  spread: number
): Float32Array {
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const purpleCore = new THREE.Color(0.55, 0.25, 0.95);
  const pinkMid = new THREE.Color(0.95, 0.35, 0.65);
  const blueOuter = new THREE.Color(0.25, 0.45, 0.95);

  for (let i = 0; i < count; i++) {
    // Distance from center (more particles clustered near center)
    const dist = Math.pow(Math.random(), 1.5) * radius;
    const distNorm = dist / radius;

    // Spiral arm angle
    const armIndex = Math.floor(Math.random() * arms);
    const armAngle = (armIndex / arms) * Math.PI * 2;
    const angle = armAngle + dist * twist + (Math.random() - 0.5) * spread * (1 - distNorm * 0.5);

    // Position
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    const y = (Math.random() - 0.5) * thickness * (1 - distNorm * 0.7);

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;

    // Color: purple core → pink mid → blue outer
    let col: THREE.Color;
    if (distNorm < 0.3) {
      const t = distNorm / 0.3;
      col = purpleCore.clone().lerp(pinkMid, t);
    } else {
      const t = (distNorm - 0.3) / 0.7;
      col = pinkMid.clone().lerp(blueOuter, t);
    }

    // Random brightness variation
    const brightness = 0.7 + Math.random() * 0.3;
    colors[i * 3] = col.r * brightness;
    colors[i * 3 + 1] = col.g * brightness;
    colors[i * 3 + 2] = col.b * brightness;

    // Size: larger in center, smaller at edges
    sizes[i] = (0.03 + 0.06 * (1 - distNorm)) * (0.5 + Math.random() * 0.5);
  }

  return pos;
}

// ─── Star field ───
function generateStars(count: number, bound: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * bound;
    pos[i * 3 + 1] = (Math.random() - 0.5) * bound * 0.4;
    pos[i * 3 + 2] = (Math.random() - 0.5) * bound * 0.6 - bound * 0.3;
  }
  return pos;
}

// ─── Neural connections ───
function generateConnections(
  pos: Float32Array,
  count: number,
  maxDist: number,
  maxLines: number
): { indices: number[]; alphas: number[] } {
  const indices: number[] = [];
  const alphas: number[] = [];

  // Only check a subset for performance
  const step = Math.max(1, Math.floor(count / 300));
  const points: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < count; i += step) {
    points.push({
      x: pos[i * 3],
      y: pos[i * 3 + 1],
      z: pos[i * 3 + 2],
    });
  }

  for (let i = 0; i < points.length && indices.length < maxLines * 2; i++) {
    for (let j = i + 1; j < points.length && indices.length < maxLines * 2; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dz = points[i].z - points[j].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < maxDist) {
        indices.push(i * step, j * step);
        alphas.push(1 - dist / maxDist);
      }
    }
  }

  return { indices, alphas };
}

// ─── Main galaxy component ───
function NebulaGalaxy() {
  const galaxyRef = useRef<THREE.Points>(null);
  const starRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Mouse tracking
  const mouseRef = useRef({ x: 0, y: 0 });

  const tex = useMemo(() => createGlowTexture(), []);

  // Galaxy particles
  const galaxyData = useMemo(() => {
    const count = 6000;
    const pos = generateGalaxy(count, 3, 6, 3.5, 0.3, 0.6);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    // Colors
    const colors = new Float32Array(count * 3);
    const purpleCore = new THREE.Color(0.55, 0.25, 0.95);
    const pinkMid = new THREE.Color(0.95, 0.35, 0.65);
    const blueOuter = new THREE.Color(0.25, 0.45, 0.95);

    for (let i = 0; i < count; i++) {
      const x = pos[i * 3];
      const z = pos[i * 3 + 2];
      const dist = Math.sqrt(x * x + z * z);
      const distNorm = Math.min(1, dist / 6);

      let col: THREE.Color;
      if (distNorm < 0.3) {
        const t = distNorm / 0.3;
        col = purpleCore.clone().lerp(pinkMid, t);
      } else {
        const t = (distNorm - 0.3) / 0.7;
        col = pinkMid.clone().lerp(blueOuter, t);
      }
      const brightness = 0.7 + Math.random() * 0.3;
      colors[i * 3] = col.r * brightness;
      colors[i * 3 + 1] = col.g * brightness;
      colors[i * 3 + 2] = col.b * brightness;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Sizes
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = pos[i * 3];
      const z = pos[i * 3 + 2];
      const dist = Math.sqrt(x * x + z * z);
      const distNorm = Math.min(1, dist / 6);
      sizes[i] = (0.03 + 0.07 * (1 - distNorm)) * (0.5 + Math.random() * 0.5);
    }
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    return { pos, geo };
  }, []);

  // Stars
  const starGeo = useMemo(() => {
    const pos = generateStars(800, 30);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  // Neural connections
  const lineData = useMemo(() => {
    const { indices, alphas } = generateConnections(
      galaxyData.pos,
      galaxyData.pos.length / 3,
      0.8,
      200
    );

    if (indices.length === 0) return null;

    const positions = new Float32Array(indices.length * 3);
    for (let i = 0; i < indices.length; i++) {
      positions[i * 3] = galaxyData.pos[indices[i] * 3];
      positions[i * 3 + 1] = galaxyData.pos[indices[i] * 3 + 1];
      positions[i * 3 + 2] = galaxyData.pos[indices[i] * 3 + 2];
    }

    const color = new Float32Array(indices.length * 3);
    for (let i = 0; i < indices.length; i++) {
      const alpha = alphas[Math.floor(i / 2)];
      const c = new THREE.Color(0.45, 0.2, 0.85).lerp(
        new THREE.Color(0.8, 0.3, 0.6),
        Math.random()
      );
      color[i * 3] = c.r * alpha * 0.5;
      color[i * 3 + 1] = c.g * alpha * 0.5;
      color[i * 3 + 2] = c.b * alpha * 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(color, 3));
    return geo;
  }, [galaxyData]);

  // Individual particle speeds (for orbital motion)
  const speeds = useMemo(() => {
    const arr = new Float32Array(galaxyData.pos.length / 3);
    for (let i = 0; i < arr.length; i++) {
      const x = galaxyData.pos[i * 3];
      const z = galaxyData.pos[i * 3 + 2];
      const dist = Math.sqrt(x * x + z * z);
      // Inner particles orbit faster (Keplerian)
      arr[i] = 0.3 / (0.3 + dist * 0.2) + (Math.random() - 0.5) * 0.2;
    }
    return arr;
  }, [galaxyData]);

  // Mouse listener
  const onPointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mouse = mouseRef.current;

    // Galaxy rotation + mouse parallax
    if (groupRef.current) {
      // Slow base rotation
      groupRef.current.rotation.y += 0.002;
      // Mouse parallax (subtle tilt)
      groupRef.current.rotation.x += (mouse.y * 0.08 - groupRef.current.rotation.x) * 0.005;
      groupRef.current.rotation.z += (-mouse.x * 0.05 - groupRef.current.rotation.z) * 0.005;
    }

    // Individual particle orbital motion (differential rotation)
    if (galaxyRef.current) {
      const pos = galaxyRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < speeds.length; i++) {
        const speed = speeds[i] * 0.003;
        const x = pos[i * 3];
        const z = pos[i * 3 + 2];
        const dist = Math.sqrt(x * x + z * z);
        if (dist < 0.01) continue;
        const angle = Math.atan2(z, x) + speed;
        pos[i * 3] = Math.cos(angle) * dist;
        pos[i * 3 + 2] = Math.sin(angle) * dist;
        // Gentle Y wobble
        pos[i * 3 + 1] += (Math.sin(t * 0.3 + i * 0.01) * 0.001 - pos[i * 3 + 1] * 0.001);
      }
      galaxyRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Star twinkle
    if (starRef.current) {
      (starRef.current.material as THREE.PointsMaterial).opacity =
        0.3 + Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Background stars */}
      <points ref={starRef} geometry={starGeo}>
        <pointsMaterial
          size={0.02}
          color="#888899"
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Neural connections */}
      {lineData && (
        <lineSegments ref={lineRef as any} geometry={lineData}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* Galaxy particles */}
      <points
        ref={galaxyRef}
        geometry={galaxyData.geo}
        onPointerMove={onPointerMove}
      >
        <pointsMaterial
          size={0.1}
          map={tex}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Bright core glow */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color="#7744ff"
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

// ─── Scene ───
function SceneContent() {
  return (
    <>
      <color attach="background" args={["#09090b"]} />
      <fog attach="fog" args={["#09090b", 10, 18]} />
      <NebulaGalaxy />
    </>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "#09090b" }}>
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 55, near: 0.1, far: 25 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ touchAction: "none" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
