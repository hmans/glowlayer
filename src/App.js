import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
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

const Spaceship = () => {
  const gltf = useGLTF("/models/spaceship26_mod.gltf");

  gltf.materials["Imphenzia"].emissiveIntensity = 1.5;

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
        new Vector2(1024, 1024),
        1.2,
        0.01,
        0.9
      );
      const luminosityPass = new ShaderPass(LuminosityShader);
      const toneMappingPass = new AdaptiveToneMappingPass(true, 256);

      composer.addPass(sceneRenderPass);
      composer.addPass(unrealPass);
      composer.addPass(toneMappingPass);
    }

    composer.render();
  }, 1);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight intensity={0.6} position={[-10, -10, -10]} />
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

export const App = () => (
  <Canvas
    gl={{
      logarithmicDepthBuffer: true,
      toneMapping: NoToneMapping,
    }}
  >
    <color args={["#555"]} attach="background" />
    <Scene />
  </Canvas>
);
