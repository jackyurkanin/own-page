import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import Stars from './design/stars';
import Sun from './design/sun';
import Planet from './design/planet';
import Moon from './design/moon';

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
      </Canvas>
    );
};
  
export default LandingDisplay;
  