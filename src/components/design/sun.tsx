import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Mesh, TextureLoader, DirectionalLight} from "three";

// Sun Component
const Sun = () => {
    const meshRef = useRef<Mesh>(null!);
    const lightRef = useRef<DirectionalLight>(null!);
    const textureLoader = useMemo(() => new TextureLoader(), []);
    const sunTexture = textureLoader.load('/sun.jpg');
    const tiltAngle = Math.PI / 6; // 30 degrees
  
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const radius = 18;
      const x = radius * Math.cos(t/2 * 0.2);
      const z = radius * Math.sin(t/2 * 0.2);
      const y = radius * Math.sin(t/2 * 0.2) * Math.sin(tiltAngle); // Incline
  
      if (meshRef.current) meshRef.current.position.set(x, y, z);
      if (lightRef.current) lightRef.current.position.set(x, y, z);
    });
  
    return (
      <>
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.5, 64, 64]} />
            <meshStandardMaterial
                map={sunTexture}
                emissiveMap={sunTexture} // Glow effect
                emissive={0xffff33} // Bright yellow light emission
                emissiveIntensity={1.0}
            />
        </mesh>
        <directionalLight ref={lightRef} intensity={5} />
      </>
    );
};

export default Sun;