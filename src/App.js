import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  HalfFloatType,
  LinearEncoding,
  WebGLRenderTarget,
  Vector2,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js";

const Spaceship = () => {
  const gltf = useGLTF("/models/spaceship26_mod.gltf");
  gltf.materials["Imphenzia"].emissiveIntensity = 20;
  return <primitive object={gltf.scene} />;
};

const Scene = () => {
  let composer;

  useFrame(({ gl, scene, camera }) => {
    if (!composer) {
      /* Glow Layer */

      /* Our actual layer */
      composer = new EffectComposer(
        gl,
        new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
          type: HalfFloatType,
          encoding: LinearEncoding,
        })
      );

      const sceneRenderPass = new RenderPass(scene, camera);
      const unrealPass = new UnrealBloomPass(new Vector2(256, 256), 1.25, 1, 1);
      const bloomPass = new BloomPass();

      const luminosityPass = new ShaderPass(LuminosityShader);
      composer.addPass(sceneRenderPass);
      composer.addPass(luminosityPass);
      // composer.addPass(unrealPass);
      // composer.addPass(bloomPass);
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
