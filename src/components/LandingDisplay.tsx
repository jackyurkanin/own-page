import { Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import Stars from './design/stars';
import Sun from './design/sun';
import Planet from './design/planet';
import Moon from './design/moon';
import CrystalText from './design/welcome';

// Main LandingDisplay Component
const LandingDisplay = () => {
    const planetPosition = new Vector3(0, 0, 0);
  
    return (
      <Canvas
        shadows
        camera={{ position: [0, 0, 20], fov: 75 }}
        className="min-w-screen min-h-screen"
      >
        <CrystalText position={[0, 0, 5]} />

        {/* Background */}
        <Stars position={[0, 0, 0]} />
  
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <Sun />
  
        {/* Planet and Moon */}
        <Planet position={[0, 0, 0]} />
        <Moon planetPosition={planetPosition} />
      </Canvas>
    );
};
  
export default LandingDisplay;
  