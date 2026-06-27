"use client";

import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Float,
  Environment,
  useCursor,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Soft glow particle texture ───
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Main 3D Object ───
function HeroObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  const tex = useMemo(() => createGlowTexture(), []);

  // Orbiting particles around the object
  const particleCount = 800;
  const particlePos = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Distribute on a sphere surface
      const radius = 1.2 + Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  const particleColors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3);
    const purple = new THREE.Color(0.5, 0.2, 0.9);
    const pink = new THREE.Color(0.9, 0.3, 0.6);
    const blue = new THREE.Color(0.2, 0.5, 1.0);
    for (let i = 0; i < particleCount; i++) {
      const t = Math.random();
      let col: THREE.Color;
      if (t < 0.5) col = purple.clone().lerp(pink, t * 2);
      else col = pink.clone().lerp(blue, (t - 0.5) * 2);
      colors[i * 3] = col.r * (0.6 + Math.random() * 0.4);
      colors[i * 3 + 1] = col.g * (0.6 + Math.random() * 0.4);
      colors[i * 3 + 2] = col.b * (0.6 + Math.random() * 0.4);
    }
    return colors;
  }, []);

  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
    return geo;
  }, [particlePos, particleColors]);

  // Mouse handler
  const onPointerMove = useCallback((e: any) => {
    mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  // Random orbital parameters for each particle
  const particleData = useMemo(() => {
    const speeds = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      speeds[i] = 0.2 + Math.random() * 0.8;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return { speeds, offsets };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mouse = mouseRef.current;

    // Smooth mouse follow for the group
    targetRot.current.y += (mouse.x * 0.5 - targetRot.current.y) * 0.03;
    targetRot.current.x += (-mouse.y * 0.3 - targetRot.current.x) * 0.03;

    if (groupRef.current) {
      groupRef.current.rotation.y = targetRot.current.y + t * 0.15;
      groupRef.current.rotation.x = targetRot.current.x + Math.sin(t * 0.1) * 0.05;
    }

    // Pulse the object slightly
    if (meshRef.current) {
      const scale = 1 + Math.sin(t * 0.5) * 0.015;
      meshRef.current.scale.setScalar(scale);
    }

    // Animate orbiting particles
    if (orbRef.current) {
      const pos = orbRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const speed = particleData.speeds[i] * 0.005;
        const offset = particleData.offsets[i];
        const radius = Math.sqrt(
          particlePos[i * 3] ** 2 +
          particlePos[i * 3 + 1] ** 2 +
          particlePos[i * 3 + 2] ** 2
        );

        // Simple rotation around Y axis with individual speeds
        const theta = Math.atan2(particlePos[i * 3 + 2], particlePos[i * 3]) + speed;
        const phi = Math.acos(
          Math.min(1, Math.max(-1, particlePos[i * 3 + 1] / radius))
        ) + speed * 0.3 * Math.sin(offset + t * 0.2);

        pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = radius * Math.cos(phi);
      }
      orbRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerMove={onPointerMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main glass torus knot */}
      <Float
        speed={2}
        rotationIntensity={0.3}
        floatIntensity={0.8}
      >
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[0.7, 0.25, 256, 64]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.6}
            chromaticAberration={0.08}
            anisotropy={0.5}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.05}
            color="#8855ff"
            metalness={0.1}
            roughness={0.2}
            ior={1.5}
          />
        </mesh>
      </Float>

      {/* Inner core glow */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color="#aa66ff"
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Orbiting particles */}
      <points ref={orbRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.025}
          map={tex}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ─── Background stars ───
function StarField() {
  const count = 1000;
  const pos = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
    }
    return p;
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [pos]);

  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.015}
        color="#8888aa"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Scene ───
function SceneContent() {
  const { viewport } = useThree();

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 8, 15]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, -3, -5]} intensity={1} color="#6644ff" />

      {/* Environment for reflections */}
      <Environment preset="city" />

      <HeroObject />
      <StarField />
    </>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "#000000" }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50, near: 0.1, far: 20 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ touchAction: "none" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
