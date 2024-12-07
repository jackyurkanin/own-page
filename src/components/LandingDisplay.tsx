import * as THREE from 'three';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { TextureLoader } from 'three';

// Planet Component
const Planet = (props: ThreeElements['mesh']) => {
  const planetRef = useRef<THREE.Mesh>(null!);
  const cloudRef = useRef<THREE.Mesh>(null!);
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

// Moon Component
const Moon = ({ planetPosition }: { planetPosition: THREE.Vector3 }) => {
    const moonRef = useRef<THREE.Mesh>(null!);
    const textureLoader = useMemo(() => new TextureLoader(), []);
  
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
  

// Stars Component
const Stars = (props: ThreeElements['mesh']) => {
  const textureLoader = useMemo(() => new TextureLoader(), []);
  const starMap = textureLoader.load('/stars_milky_way.jpg');

  return (
    <mesh {...props}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={starMap} side={THREE.BackSide} />
    </mesh>
  );
};

// Sun Component
const Sun = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const lightRef = useRef<THREE.PointLight>(null!);
    const textureLoader = useMemo(() => new TextureLoader(), []);
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
  

// Main LandingDisplay Component
const LandingDisplay = () => {
    const planetPosition = new THREE.Vector3(0, 0, 0);
  
    return (
      <Canvas
        shadows
        camera={{ position: [0, 5, 20], fov: 45 }}
        className="min-w-screen min-h-screen"
      >
        {/* Background */}
        <Stars position={[0, 0, 0]} />
  
        {/* Lights */}
        <ambientLight intensity={0.3} />
        <Sun />
  
        {/* Planet and Moon */}
        <Planet position={[0, 0, 0]} />
        <Moon planetPosition={planetPosition} />
  
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      </Canvas>
    );
};
  
export default LandingDisplay;
  