"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "./theme-provider";
import { MeshDistortMaterial, Sphere, Box, Torus, Icosahedron, OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

const Scene = () => {
  const { tokens } = useTheme();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * tokens.visuals.animationSpeed;
      meshRef.current.rotation.y += 0.01 * tokens.visuals.animationSpeed;
    }
  });

  const Geometry = ({ children }: { children: React.ReactNode }) => {
    switch (tokens.threeJs.geometry) {
      case 'sphere': return <Sphere ref={meshRef} args={[1, 64, 64]}>{children}</Sphere>;
      case 'torus': return <Torus ref={meshRef} args={[1, 0.4, 32, 100]}>{children}</Torus>;
      case 'icosahedron': return <Icosahedron ref={meshRef} args={[1, 0]}>{children}</Icosahedron>;
      default: return <Box ref={meshRef} args={[1.5, 1.5, 1.5]}>{children}</Box>;
    }
  };

  const Material = () => {
    if (tokens.threeJs.material === 'physical') {
      return (
        <meshPhysicalMaterial 
          color={tokens.colors.primary} 
          emissive={tokens.colors.accent}
          roughness={0.1}
          metalness={0.8}
        />
      );
    }
    if (tokens.threeJs.material === 'normal') {
      return <meshNormalMaterial />;
    }
    return (
      <MeshDistortMaterial
        color={tokens.colors.primary}
        speed={tokens.visuals.animationSpeed * 2}
        distort={tokens.threeJs.complexity / 10}
      />
    );
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Geometry>
          <Material />
        </Geometry>
      </Float>
      <OrbitControls enableZoom={false} />
    </>
  );
};

export const Visualizer = () => {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden brand-card p-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
};
