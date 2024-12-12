// DiamondText.tsx
import { useRef } from "react";
import { Mesh, MeshPhysicalMaterial } from "three";
import { Text3D, Center } from "@react-three/drei";
import { ThreeElements, useThree } from "@react-three/fiber";

const DiamondText = (props: ThreeElements["mesh"]) => {
  const textRef = useRef<Mesh>(null!);

  const state = useThree();

  // Crystal-like material properties
  const crystalMaterial = new MeshPhysicalMaterial({
    depthTest: true,
    transmission: 0.97, // Glass-like transparency
    roughness: 0, // Smooth surface
    metalness: 0, // Non-metallic
    clearcoat: 1, // Reflective clear coat
    clearcoatRoughness: 0,
    reflectivity: 1,
    ior: 1.5, // Refraction index for glass
    specularIntensity: 0.5,
    envMap: state.scene.environment,
    thickness: 2, // Physical thickness for realistic refraction
    envMapIntensity: 1, // Intensity of environment reflections
    color: 0xffffff, // Base color of the crystal
    depthWrite: false,
    transparent: true,
    opacity: 1, // Fully opaque since transmission handles transparency
  });

  return (
    <>
      {/* Crystal Text */}
      <Center position={props.position}>
        <Text3D
          ref={textRef}
          font="/Helvetiker_Regular_Typeface.json" // Font JSON file
          size={2} // Size of the text
          height={0.1} // Thickness of the letters
          curveSegments={12} // Smoothness of curves
          bevelEnabled
          bevelThickness={0.1}
          bevelSize={0.02}
        >
          WELCOME
          <primitive attach="material" object={crystalMaterial} />
        </Text3D>
      </Center>
    </>
  );
};

export default DiamondText;
