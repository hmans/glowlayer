import {
  Effects,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import { Canvas, extend } from "@react-three/fiber";
import { HalfFloatType, LinearEncoding, Vector2 } from "three";
import { AdaptiveToneMappingPass } from "three/examples/jsm/postprocessing/AdaptiveToneMappingPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js";
import { Skybox } from "./Skybox";

extend({ UnrealBloomPass, AdaptiveToneMappingPass, ShaderPass });

const Spaceship = () => {
  const gltf = useGLTF("/models/spaceship26_mod.gltf");

  /* GLTF caps emissivion values at 1, but we can boost it manually */
  gltf.materials["Imphenzia"].emissiveIntensity = 1.3;

  return <primitive object={gltf.scene} />;
};

export const App = () => (
  <Canvas
    flat
    gl={{
      logarithmicDepthBuffer: true,
    }}
  >
    <Skybox />

    <ambientLight intensity={0.5} />
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

    <Effects disableGamma encoding={LinearEncoding} type={HalfFloatType}>
      <unrealBloomPass
        args={[
          new Vector2(window.innerWidth, window.innerHeight),
          1.5,
          0.0,
          0.8,
        ]}
      />
      <adaptiveToneMappingPass args={[true, 256]} />
      <shaderPass args={[VignetteShader]} />
    </Effects>
  </Canvas>
);
