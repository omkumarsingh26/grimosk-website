"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Icosahedron,
  Points,
  PointMaterial,
} from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribute in a spherical shell
      const r = 4 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.04;
      ref.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a5b4fc"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function Core() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    // gentle pointer parallax
    const { x, y } = state.pointer;
    group.current.rotation.y += (x * 0.4 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-y * 0.3 - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.1}>
        {/* solid distorted core */}
        <Icosahedron args={[1.55, 12]}>
          <MeshDistortMaterial
            color="#4f46e5"
            emissive="#1e1b4b"
            emissiveIntensity={0.6}
            roughness={0.18}
            metalness={0.85}
            distort={0.38}
            speed={1.6}
          />
        </Icosahedron>

        {/* wireframe shell */}
        <Icosahedron args={[2.1, 2]}>
          <meshBasicMaterial
            color="#f9a8d4"
            wireframe
            transparent
            opacity={0.14}
          />
        </Icosahedron>
      </Float>
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={120} color="#818cf8" />
      <pointLight position={[-6, -3, 2]} intensity={90} color="#fb7185" />
      <Core />
      <ParticleField />
    </Canvas>
  );
}
