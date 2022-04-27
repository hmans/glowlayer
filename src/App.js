import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  HalfFloatType,
  LinearEncoding,
  Vector2,
  WebGLRenderTarget,
} from "three";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js";

const Spaceship = () => {
  const gltf = useGLTF("/models/spaceship26_mod.gltf");

  /* The emissive intensity in the GLTF is always capped to 1,
     so let's increase it manually */
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
      const unrealPass = new UnrealBloomPass(new Vector2(256, 256), 3, 1, 0.8);
      const bloomPass = new BloomPass();
      const luminosityPass = new ShaderPass(LuminosityShader);

      composer.addPass(sceneRenderPass);
      // composer.addPass(luminosityPass);
      composer.addPass(unrealPass);
      // composer.addPass(bloomPass);
    }

    composer.render();
  }, 1);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight intensity={1} position={[10, 10, 10]} />
      <PerspectiveCamera position-z={30} makeDefault />
      <OrbitControls />

      {/* A mesh with emission */}
      <mesh position={[-14, 0, 0]}>
        <dodecahedronGeometry />
        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={3}
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
  <Canvas gl={{ logarithmicDepthBuffer: true }}>
    <color args={["#333"]} attach="background" />
    <Scene />
  </Canvas>
);
