// MovingSpotlight.tsx
import React, { useRef } from 'react';
import { SpotLight as ThreeSpotLight, Object3D } from 'three';
import { useFrame } from '@react-three/fiber';

interface MovingSpotlightProps {
  targetPosition: [number, number, number];
  initialPosition?: [number, number, number];
  movementRange?: {
    x?: number;
    y?: number;
    speed?: number;
  };
  color?: string;
  intensity?: number;
  distance?: number;
  angle?: number;
  penumbra?: number;
  decay?: number;
}

const MovingSpotlight: React.FC<MovingSpotlightProps> = ({
  targetPosition = [0, 0, 10],
  initialPosition = [0, 0, 5],
  movementRange = { x: 8, y: 2, speed: 1 },
  color = 'white',
  intensity = 5,
  distance = 40,
  angle = Math.PI / 6,
  penumbra = 0.5,
  decay = 2,
}) => {
  const spotlightRef = useRef<ThreeSpotLight>(null!);
  const targetRef = useRef<Object3D>(new Object3D());

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const { x = 2, y = 2, speed = 1 } = movementRange;

    // Calculate new positions using sine and cosine for smooth oscillation
    const newX = initialPosition[0] + x * Math.sin(elapsed * speed);
    const newY = initialPosition[1] + y * Math.cos(elapsed * speed);
    const newZ = initialPosition[2]; // Keep Z constant at 20

    // Update spotlight position
    spotlightRef.current.position.set(newX, newY, newZ);

    // Update target position to the text's position
    targetRef.current.position.set(...targetPosition);
    spotlightRef.current.target = targetRef.current;
  });

  return (
    <>
      {/* Spotlight */}
      <spotLight
        ref={spotlightRef}
        color={color}
        intensity={intensity}
        distance={distance}
        angle={angle}
        penumbra={penumbra}
        decay={decay}
        castShadow
      />
      {/* Spotlight Target */}
      <primitive object={targetRef.current} />
    </>
  );
};

export default MovingSpotlight;
