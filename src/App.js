import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  VignetteEffect,
} from "postprocessing";
import { HalfFloatType } from "three";

const Spaceship = () => {
  const gltf = useGLTF("/models/spaceship26_mod.gltf");
  gltf.materials["Imphenzia"].emissiveIntensity = 10;
  return <primitive object={gltf.scene} />;
};

const Scene = () => {
  let composer;

  useFrame(({ gl, scene, camera }) => {
    if (!composer) {
      composer = new EffectComposer(gl, { frameBufferType: HalfFloatType });

      const renderScenePass = new RenderPass(scene, camera);

      const sceneEffectPass = new EffectPass(
        camera,
        new BloomEffect({
          luminanceThreshold: 0.1,
        }),
        new VignetteEffect({
          offset: 0.5,
          darkness: 0.7,
        })
      );

      composer.addPass(renderScenePass);
      composer.addPass(sceneEffectPass);
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
  <Canvas gl={{ logarithmicDepthBuffer: true }}>
    <color args={["#333"]} attach="background" />
    <Scene />
  </Canvas>
);
