import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Sun Component
const Sun = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const lightRef = useRef<THREE.PointLight>(null!);
    const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
    const sunTexture = textureLoader.load('/sun.jpg');
    const tiltAngle = Math.PI / 6; // 30 degrees
  
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const radius = 15;
      const x = radius * Math.cos(t * 0.2);
      const z = radius * Math.sin(t * 0.2);
      const y = radius * Math.sin(t * 0.2) * Math.sin(tiltAngle); // Incline
  
      if (meshRef.current) meshRef.current.position.set(x, y, z);
      if (lightRef.current) lightRef.current.position.set(x, y, z);
    });
  
    return (
      <>
        <mesh ref={meshRef} castShadow>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial
            map={sunTexture}
          />
        </mesh>
        <pointLight ref={lightRef} intensity={2.5} distance={100} castShadow />
      </>
    );
};

export default Sun;