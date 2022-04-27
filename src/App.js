import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

const Spaceship = () => {
  const gltf = useGLTF("/models/spaceship26.gltf");
  return <primitive object={gltf.scene} />;
};

const Scene = () => {
  useFrame(({ scene, camera, gl }) => {
    gl.render(scene, camera);
  }, 1);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight intensity={0.8} />
      <PerspectiveCamera position-z={30} makeDefault />
      <OrbitControls />
      <Spaceship />
    </>
  );
};

export const App = () => (
  <Canvas>
    <color args={["black"]} attach="background" />
    <Scene />
  </Canvas>
);
