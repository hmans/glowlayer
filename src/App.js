import { Box, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export const App = () => (
  <Canvas>
    <color args={["black"]} attach="background" />
    <ambientLight />
    <OrbitControls />

    <Box>
      <meshStandardMaterial color="orange" />
    </Box>
  </Canvas>
);
