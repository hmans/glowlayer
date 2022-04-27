import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

const Spaceship = () => {
  const gltf = useGLTF("/models/spaceship26_mod.gltf");
  gltf.materials["Imphenzia"].emissiveIntensity = 2;
  return <primitive object={gltf.scene} />;
};

const Scene = () => {
  let composer;
  const innerScene = useRef();

  useFrame(({ gl, scene, camera }) => {
    if (!composer) {
      /* Glow Layer */
      // const unrealPass = new UnrealBloomPass(new Vector2(256, 256), 1.25, 1, 0);
      // glowComposer.addPass(unrealPass);

      /* Our actual layer */
      composer = new EffectComposer(gl);

      const sceneRenderPass = new RenderPass(scene, camera);
      composer.addPass(sceneRenderPass);
    }

    composer.render();
  }, 1);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight intensity={0.8} />
      <PerspectiveCamera position-z={30} makeDefault />
      <OrbitControls />

      {/* LOL */}
      <scene ref={innerScene}>
        <Spaceship />
      </scene>
    </>
  );
};

export const App = () => (
  <Canvas gl={{ logarithmicDepthBuffer: true }}>
    <color args={["#333"]} attach="background" />
    <Scene />
  </Canvas>
);
