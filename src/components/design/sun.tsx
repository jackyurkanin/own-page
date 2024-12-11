import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Mesh, TextureLoader, DirectionalLight} from "three";

// Sun Component
const Sun = () => {
    const meshRef = useRef<Mesh>(null!);
    const lightRef = useRef<DirectionalLight>(null!);
    const textureLoader = useMemo(() => new TextureLoader(), []);
    const sunTexture = textureLoader.load('/sun.jpg');
    const tiltAngle = Math.PI / 4; 
  
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const radius = 18;
      const x = radius * Math.cos(t * 0.05);
      const z = radius * Math.sin(t * 0.05);
      const y = radius * Math.sin(t * 0.05) * Math.sin(tiltAngle); // Incline
  
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
        <directionalLight ref={lightRef} intensity={10}/>
      </>
    );
};

export default Sun;