import { ThreeElements } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Mesh, BackSide, TextureLoader} from "three";


// Stars Component
const Stars = (props: ThreeElements['mesh']) => {
    const stars = useRef<Mesh>(null!);
    const textureLoader = useMemo(() => new TextureLoader(), []);
    const starMap = textureLoader.load('/stars_milky_way.jpg');
  
    return (
      <mesh {...props}>
        <sphereGeometry args={[50, 64, 64]} />
        <meshBasicMaterial map={starMap} side={BackSide} />
      </mesh>
    );
};

export default Stars;