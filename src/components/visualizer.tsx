"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "./theme-provider";
import { 
  MeshDistortMaterial, 
  Sphere, 
  Box, 
  Torus, 
  Icosahedron, 
  OrbitControls, 
  Float, 
  Environment, 
  ContactShadows, 
  MeshWobbleMaterial,
  MeshTransmissionMaterial,
  Stars
} from "@react-three/drei";
import * as THREE from "three";

const Scene = () => {
  const { tokens } = useTheme();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1 * tokens.visuals.animationSpeed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2 * tokens.visuals.animationSpeed;
      meshRef.current.rotation.z = time * 0.3 * tokens.visuals.animationSpeed;
    }
  });

  const Geometry = ({ type, scale = 1, children }: { type: string, scale?: number, children?: React.ReactNode }) => {
    switch (type) {
      case 'sphere': return <Sphere args={[scale, 64, 64]}>{children}</Sphere>;
      case 'torus': return <Torus args={[scale, scale * 0.4, 64, 100]}>{children}</Torus>;
      case 'icosahedron': return <Icosahedron args={[scale, 0]}>{children}</Icosahedron>;
      default: return <Box args={[scale * 1.5, scale * 1.5, scale * 1.5]}>{children}</Box>;
    }
  };

  const getMaterial = (color: string) => {
    if (tokens.threeJs.material === 'physical') {
      return (
        <MeshTransmissionMaterial 
          color={color}
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          thickness={1.5}
          ior={1.5}
        />
      );
    }
    if (tokens.threeJs.material === 'normal') {
      return <meshNormalMaterial />;
    }
    
    // Default to Distort/Wobble based on vibe
    if (tokens.visuals.vibe === 'playful' || tokens.visuals.vibe === 'minimal') {
       return (
         <MeshWobbleMaterial
           color={color}
           factor={tokens.threeJs.complexity / 10}
           speed={tokens.visuals.animationSpeed * 2}
         />
       );
    }

    return (
      <MeshDistortMaterial
        color={color}
        speed={tokens.visuals.animationSpeed * 2}
        distort={tokens.threeJs.complexity / 10}
        radius={1}
      />
    );
  };

  // Generate satellite objects based on complexity
  const satellites = useMemo(() => {
    const items = [];
    const count = Math.min(tokens.threeJs.complexity, 8); // Max 8 satellites
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.5 + Math.random();
      items.push({
        position: [Math.cos(angle) * radius, (Math.random() - 0.5) * 2, Math.sin(angle) * radius] as [number, number, number],
        scale: 0.2 + Math.random() * 0.4,
        color: i % 2 === 0 ? tokens.colors.secondary : tokens.colors.accent
      });
    }
    return items;
  }, [tokens.threeJs.complexity, tokens.colors.secondary, tokens.colors.accent]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color={tokens.colors.primary} />
      <directionalLight position={[-10, -10, -5]} intensity={1} color={tokens.colors.accent} />
      
      {/* Optional environment effects based on vibe */}
      {tokens.visuals.vibe === 'futuristic' && (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      )}
      
      <group ref={groupRef}>
        <Float speed={2 * tokens.visuals.animationSpeed} rotationIntensity={1} floatIntensity={1}>
          <mesh ref={meshRef}>
            <Geometry type={tokens.threeJs.geometry} scale={1.2}>
              {getMaterial(tokens.colors.primary)}
            </Geometry>
          </mesh>
        </Float>

        {satellites.map((sat, i) => (
          <Float key={i} speed={3 + i} rotationIntensity={2} floatIntensity={2} position={sat.position}>
            <mesh>
               <Geometry type={tokens.threeJs.geometry === 'box' ? 'icosahedron' : 'sphere'} scale={sat.scale}>
                 <meshStandardMaterial 
                   color={sat.color} 
                   roughness={0.2} 
                   metalness={0.8}
                 />
               </Geometry>
            </mesh>
          </Float>
        ))}
      </group>

      <ContactShadows 
        position={[0, -3.5, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={4.5} 
        color={tokens.colors.foreground} 
      />
      <Environment preset="city" />
      <OrbitControls enableZoom={true} minDistance={3} maxDistance={15} autoRotate autoRotateSpeed={tokens.visuals.animationSpeed} />
    </>
  );
};

export const Visualizer = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
};
