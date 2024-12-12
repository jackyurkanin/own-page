import { Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import Sun from './design/sun';
import Planet from './design/planet';
import Moon from './design/moon';
import DiamondText from './design/welcome';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense } from 'react';
import MovingSpotlight from './design/Spots';


// Main LandingDisplay Component
const LandingDisplay = () => {
    const planetPosition = new Vector3(0, 0, 0);
  
    return (
      <Canvas
        shadows
        camera={{ position: [0, 0, 18], fov: 70 }}
        className="min-w-screen min-h-screen"
      >
        <Environment files={'/stars_milky_way.hdr'}  background={true} />

        <Suspense>
          <DiamondText position={[0, 0, 10]} />
          <Planet position={[0, 0, 0]} />
          <Moon planetPosition={planetPosition} />
          <Sun /> {/* main light source */}

        </Suspense>
        
        <MovingSpotlight
          targetPosition={[0, 0, 10]} // Position of DiamondText
          initialPosition={[0, 0, 5]} // Starting position of the spotlight
          movementRange={{ x: 9, y: 2, speed: 1 }} // Adjust movement range and speed
          color="#ffffff" // Spotlight color
          intensity={10}
          distance={10}
          angle={Math.PI / 2}
          penumbra={0.5}
          decay={1}
        />

        {/* 1 Light */}
        <ambientLight intensity={0.5} />

        

        <EffectComposer>
          <Bloom luminanceThreshold={0.5} intensity={2} levels={8} mipmapBlur />
        </EffectComposer>
        <OrbitControls/>
      </Canvas>
    );
};
  
export default LandingDisplay;
  