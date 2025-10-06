'use client';

import React, { Suspense, useMemo, useEffect, useState, useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  scene?: 'particles' | 'geometric' | 'minimal';
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  responsive?: boolean;
}

// Particles scene component - memoized for performance
const ParticlesScene = memo(function ParticlesScene({ color, intensity }: { color: string; intensity: string }) {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = intensity === 'high' ? 1000 : intensity === 'medium' ? 500 : 200;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, velocities };
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += particles.velocities[i * 3] * delta * 60;
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1] * delta * 60;
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2] * delta * 60;
      
      // Wrap particles around
      if (Math.abs(positions[i * 3]) > 10) positions[i * 3] *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 10) positions[i * 3 + 1] *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 10) positions[i * 3 + 2] *= -1;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y += 0.001;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        transparent
        opacity={intensity === 'high' ? 0.1 : intensity === 'medium' ? 0.06 : 0.03}
        sizeAttenuation
      />
    </points>
  );
});

// Geometric shapes scene component - memoized for performance
const GeometricScene = memo(function GeometricScene({ color, intensity }: { color: string; intensity: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const shapeCount = intensity === 'high' ? 8 : intensity === 'medium' ? 5 : 3;
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    groupRef.current.rotation.x += 0.002;
    groupRef.current.rotation.y += 0.003;
    
    groupRef.current.children.forEach((child, index) => {
      child.rotation.x += 0.01 * (index + 1);
      child.rotation.z += 0.005 * (index + 1);
    });
  });

  const shapes = useMemo(() => {
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.5, 8, 6),
      new THREE.ConeGeometry(0.5, 1, 6),
      new THREE.OctahedronGeometry(0.6),
      new THREE.TetrahedronGeometry(0.7),
    ];
    
    return Array.from({ length: shapeCount }, (_, i) => ({
      geometry: geometries[i % geometries.length],
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.4,
    }));
  }, [shapeCount]);

  return (
    <group ref={groupRef}>
      {shapes.map((shape, index) => (
        <mesh key={index} position={shape.position} scale={shape.scale}>
          <primitive object={shape.geometry} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={intensity === 'high' ? 0.08 : intensity === 'medium' ? 0.05 : 0.03}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
});

// Minimal scene component - very subtle background effect - memoized for performance
const MinimalScene = memo(function MinimalScene({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.02}
        side={2}
      />
    </mesh>
  );
});

// Enhanced performance detection hook
function usePerformanceLevel() {
  const [performanceLevel, setPerformanceLevel] = useState<'low' | 'medium' | 'high'>('low');

  useEffect(() => {
    // Check for reduced motion preference first
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPerformanceLevel('low');
      return;
    }

    // Enhanced performance detection
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    
    if (!gl) {
      setPerformanceLevel('low');
      return;
    }

    let score = 0;

    // Check WebGL capabilities
    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
        // Check for dedicated GPU indicators
        if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Intel Iris')) {
          score += 2;
        } else if (renderer.includes('Intel')) {
          score += 1;
        }
      }
    } catch (error) {
      // Ignore WebGL extension errors
    }

    // Device memory check (if available)
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory) {
      if (deviceMemory >= 8) score += 2;
      else if (deviceMemory >= 4) score += 1;
    }

    // Hardware concurrency (CPU cores)
    if (navigator.hardwareConcurrency) {
      if (navigator.hardwareConcurrency >= 8) score += 2;
      else if (navigator.hardwareConcurrency >= 4) score += 1;
    }

    // Connection speed (if available)
    const connection = (navigator as any).connection;
    if (connection) {
      if (connection.effectiveType === '4g' || connection.downlink > 10) {
        score += 1;
      }
    }

    // Mobile device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      score = Math.max(0, score - 2); // Reduce score for mobile devices
    }

    // Determine performance level based on score
    if (score >= 5) {
      setPerformanceLevel('high');
    } else if (score >= 2) {
      setPerformanceLevel('medium');
    } else {
      setPerformanceLevel('low');
    }

    // Cleanup
    canvas.remove();
  }, []);

  return performanceLevel;
}

export default function ThreeBackground({
  scene = 'minimal',
  intensity = 'low',
  color,
  responsive = true,
}: ThreeBackgroundProps) {
  const { theme } = useTheme();
  const detectedPerformance = usePerformanceLevel();
  const [mounted, setMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }
  
  // Use detected performance level if intensity is not explicitly set to high
  const effectiveIntensity = intensity === 'low' ? 'low' : 
                           intensity === 'high' ? detectedPerformance : 
                           detectedPerformance;
  
  // Determine color based on theme if not provided
  const effectiveColor = color || (theme === 'dark' ? '#ffffff' : '#000000');

  // Force minimal scene if reduced motion is preferred
  const effectiveScene = isReducedMotion ? 'minimal' : scene;

  // Select scene component based on scene type and performance
  const SceneComponent = () => {
    switch (effectiveScene) {
      case 'particles':
        return <ParticlesScene color={effectiveColor} intensity={effectiveIntensity} />;
      case 'geometric':
        return <GeometricScene color={effectiveColor} intensity={effectiveIntensity} />;
      case 'minimal':
      default:
        return <MinimalScene color={effectiveColor} />;
    }
  };

  // Adjust canvas settings based on performance
  const canvasSettings = {
    camera: { position: [0, 0, 5] as [number, number, number], fov: 60 },
    dpr: responsive ? (effectiveIntensity === 'high' ? [1, 2] as [number, number] : [1, 1.5] as [number, number]) : 1,
    performance: { 
      min: effectiveIntensity === 'high' ? 0.7 : 0.5,
      max: effectiveIntensity === 'low' ? 0.8 : 1
    },
    gl: { 
      antialias: effectiveIntensity === 'high',
      alpha: true,
      powerPreference: (effectiveIntensity === 'high' ? 'high-performance' : 'default') as WebGLPowerPreference
    }
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
      role="presentation"
    >
      <Suspense fallback={null}>
        <Canvas
          {...canvasSettings}
          style={{ 
            background: 'transparent',
            width: '100%',
            height: '100%',
          }}
        >
          <SceneComponent />
        </Canvas>
      </Suspense>
    </div>
  );
}