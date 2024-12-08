import { useRef } from "react";
import { MeshPhysicalMaterial, PointLight } from "three";
import { Text3D, Center, Environment } from "@react-three/drei";
import { ThreeElements, useLoader, useFrame } from "@react-three/fiber";

const CrystalText = (props: ThreeElements["mesh"]) => {
  const textRef = useRef(null!);
  const lightRef = useRef<PointLight>(null!);

  // Crystal-like material properties
  const crystalMaterial = new MeshPhysicalMaterial({
    depthTest: true,
    transmission: 1, // Glass-like transparency
    roughness: 0, // Smooth surface
    metalness: 0, // Non-metallic
    clearcoat: 1, // Reflective clear coat
    clearcoatRoughness: 0,
    reflectivity: 1,
    ior: 1.5, // Refraction index for glass
  });

  // Animate light position to circle around the text
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const radius = 2; // Distance of the light from the text

    // Calculate X, Y, and Z for the light's orbit
    const x = radius * Math.cos(t * 0.5); // Circular movement along X
    const y = radius * Math.sin(t * 0.5); // Circular movement along Y
    const z = radius * Math.sin(t * 0.5); // Optional slight depth (Z axis)

    if (lightRef.current) {
      lightRef.current.position.set(x, y, z);
    }
  });

  return (
    <>
      {/* HDRI Environment */}
      <Environment preset="sunset" background={false} />

      {/* Point Light Orbiting Around the Text */}
      <pointLight ref={lightRef} color={"#ffffff"} intensity={5} />

      {/* Crystal Text */}
      <Center position={props.position || [0, 0, 0]}>
        <Text3D
          ref={textRef}
          font="/Helvetiker_Regular_Typeface.json" // Font JSON file
          size={2} // Size of the text
          height={0.5} // Thickness of the letters
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

export default CrystalText;
