import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Mesh, Color, TextureLoader, DoubleSide, NormalBlending} from "three";

// Planet Component
const Planet = (props: ThreeElements['mesh']) => {
    const planetRef = useRef<Mesh>(null!);
    const cloudRef = useRef<Mesh>(null!);
    const textureLoader = useMemo(() => new TextureLoader(), []);
  
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
        <mesh {...props} ref={planetRef} castShadow={true} receiveShadow={true}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshPhongMaterial
            map={earthDayMap}
            emissiveMap={earthNightMap}
            emissiveIntensity={0.5}
            emissive={new Color(0x111111)}
            bumpMap={earthBumpMap}
            bumpScale={0.05}
            specularMap={earthSpecularMap}
            specular={new Color(0x222222)}
          />
        </mesh>
        {/* Cloud Sphere */}
        <mesh ref={cloudRef} position={props.position} castShadow={true} receiveShadow={true} renderOrder={0}>
          <sphereGeometry args={[2.05, 64, 64]} />
          <meshPhongMaterial
            map={cloudMap}
            transparent={true}
            opacity={0.6}
            depthWrite={false}
            side={DoubleSide}
            alphaTest={0.5} // Discards low-alpha pixels for cleaner edges
            blending={NormalBlending} // Standard blending mode
          />
        </mesh>
      </>
    );
};

export default Planet;