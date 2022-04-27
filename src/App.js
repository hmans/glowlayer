import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import {
  CubeTextureLoader,
  HalfFloatType,
  LinearEncoding,
  NoToneMapping,
  Vector2,
  WebGLRenderTarget,
} from "three";
import { AdaptiveToneMappingPass } from "three/examples/jsm/postprocessing/AdaptiveToneMappingPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js";
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js";

const Spaceship = () => {
  const gltf = useGLTF("/models/spaceship26_mod.gltf");

  gltf.materials["Imphenzia"].emissiveIntensity = 2;

  return <primitive object={gltf.scene} />;
};

const Scene = () => {
  let composer;

  useFrame(({ gl, scene, camera }) => {
    if (!composer) {
      composer = new EffectComposer(
        gl,
        new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
          type: HalfFloatType,
          encoding: LinearEncoding,
        })
      );

      const sceneRenderPass = new RenderPass(scene, camera);
      const unrealPass = new UnrealBloomPass(
        new Vector2(window.innerWidth, window.innerHeight),
        1.2,
        0.8,
        0.8
      );
      const luminosityPass = new ShaderPass(LuminosityShader);
      const toneMappingPass = new AdaptiveToneMappingPass(true, 256);
      const vignettePass = new ShaderPass(VignetteShader);

      composer.addPass(sceneRenderPass);
      composer.addPass(unrealPass);
      composer.addPass(toneMappingPass);
      composer.addPass(vignettePass);
    }

    composer.render();
  }, 1);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight intensity={0.5} position={[20, 0, -10]} />
      <PerspectiveCamera position-z={30} makeDefault />
      <OrbitControls />

      {/* A mesh with emission */}
      <mesh position={[-14, 0, 0]}>
        <dodecahedronGeometry />
        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={1}
        />
      </mesh>

      {/* A mesh with no emission */}
      <mesh position={[+14, 0, 0]}>
        <dodecahedronGeometry />
        <meshStandardMaterial color="white" />
      </mesh>

      <Spaceship />
    </>
  );
};

export const Skybox = () => {
  const { scene } = useThree();

  useEffect(() => {
    const urls = [
      "/textures/skybox/right.png",
      "/textures/skybox/left.png",
      "/textures/skybox/top.png",
      "/textures/skybox/bottom.png",
      "/textures/skybox/front.png",
      "/textures/skybox/back.png",
    ];

    const cube = new CubeTextureLoader().load(urls);

    scene.background = cube;
  }, []);

  return null;
};

export const App = () => (
  <Canvas
    gl={{
      logarithmicDepthBuffer: true,
      toneMapping: NoToneMapping,
    }}
  >
    <Skybox />
    <Scene />
  </Canvas>
);
