import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { ShaderMaterial, Vector2 } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

const Spaceship = () => {
  const gltf = useGLTF("/models/spaceship26_mod.gltf");
  return <primitive object={gltf.scene} />;
};

const Scene = () => {
  let composer;
  let glowComposer;
  const innerScene = useRef();

  useFrame(({ gl, scene, camera }) => {
    if (!composer) {
      /* Glow Layer */
      glowComposer = new EffectComposer(gl);
      glowComposer.renderToScreen = false;

      const glowRenderPass = new RenderPass(innerScene.current, camera);
      glowComposer.addPass(glowRenderPass);

      const unrealPass = new UnrealBloomPass(new Vector2(256, 256), 1.25, 1, 0);
      glowComposer.addPass(unrealPass);

      /* Our actual layer */
      composer = new EffectComposer(gl);

      const sceneRenderPass = new RenderPass(scene, camera);
      composer.addPass(sceneRenderPass);

      console.log(glowComposer);

      const finalPass = new ShaderPass(
        new ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: glowComposer.renderTarget2.texture },
          },
          vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }`,

          fragmentShader: `
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;

          varying vec2 vUv;

          void main() {
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
          }`,
          defines: {},
        }),
        "baseTexture"
      );
      finalPass.needsSwap = true;

      composer.addPass(finalPass);
    }

    glowComposer.render();
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
