import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Planet Component
const Planet = (props: ThreeElements['mesh']) => {
    const planetRef = useRef<THREE.Mesh>(null!);
    const cloudRef = useRef<THREE.Mesh>(null!);
    const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  
    // Load textures
    const earthDayMap = textureLoader.load('/earth_daymap.jpg');
    const earthNightMap = textureLoader.load('/earth_nightmap.jpg');
    const earthBumpMap = textureLoader.load('/earth_bump.jpg');
    const earthSpecularMap = textureLoader.load('/earth_specularmap.tif');
    const cloudMap = textureLoader.load('/earth_clouds.jpg');
  
    useFrame(() => {
      if (planetRef.current) planetRef.current.rotation.y += 0.001;
      if (cloudRef.current) cloudRef.current.rotation.y += 0.0015;
    });
  
    return (
      <>
        <mesh {...props} ref={planetRef} castShadow receiveShadow>
          <sphereGeometry args={[2, 64, 64]} />
          <meshPhongMaterial
            map={earthDayMap}
            emissiveMap={earthNightMap}
            emissiveIntensity={0.5}
            emissive={new THREE.Color(0x111111)}
            bumpMap={earthBumpMap}
            bumpScale={0.05}
            specularMap={earthSpecularMap}
            specular={new THREE.Color(0x222222)}
          />
        </mesh>
        {/* Cloud Sphere */}
        <mesh ref={cloudRef} position={props.position} castShadow>
          <sphereGeometry args={[2.05, 64, 64]} />
          <meshPhongMaterial
            map={cloudMap}
            transparent={true}
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>
      </>
    );
};

export default Planet;