import { ThreeElements } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

// Stars Component
const Stars = (props: ThreeElements['mesh']) => {
    const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
    const starMap = textureLoader.load('/stars_milky_way.jpg');
  
    return (
      <mesh {...props}>
        <sphereGeometry args={[50, 64, 64]} />
        <meshBasicMaterial map={starMap} side={THREE.BackSide} />
      </mesh>
    );
};

export default Stars;