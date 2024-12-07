import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Moon Component
const Moon = ({ planetPosition }: { planetPosition: THREE.Vector3 }) => {
    const moonRef = useRef<THREE.Mesh>(null!);
    const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  
    const moonTexture = textureLoader.load('/moon.jpg');
    const tiltAngle = Math.PI / 6; // 30 degrees
  
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const radius = 6; // Orbit radius
      const x = planetPosition.x + radius * Math.cos(t * 0.3);
      const z = planetPosition.z + radius * Math.sin(t * 0.3);
      const y = planetPosition.y + radius * Math.sin(t * 0.3) * Math.sin(tiltAngle); // Incline
  
      if (moonRef.current) moonRef.current.position.set(x, y, z);
    });
  
    return (
      <mesh ref={moonRef} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial map={moonTexture} />
      </mesh>
    );
};

export default Moon;