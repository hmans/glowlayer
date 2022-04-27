import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Vector2 } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

const Spaceship = () => {
  const gltf = useGLTF("/models/spaceship26_mod.gltf");
  return <primitive object={gltf.scene} />;
};

const Scene = () => {
  let composer;

  useFrame(({ gl, scene, camera }) => {
    if (!composer) {
      composer = new EffectComposer(gl);

      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      const unrealPass = new UnrealBloomPass(
        new Vector2(256, 256),
        2,
        0.8,
        0.2
      );
      composer.addPass(unrealPass);
    }

    composer.render();
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
