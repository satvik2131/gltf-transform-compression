import React from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Buffer } from "buffer";

export function Model({ data }) {
  const buffer = Buffer.from(data);
  const gltfArrBuffer = buffer.buffer;
  const loader = new GLTFLoader();
  loader.parse(gltfArrBuffer, (dt) => {
    console.log(dt);
  });

  // const gltf = new ObjectLoader(json);
  // scene.add(gltf);

  return (
    <group>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1} position={[0, 10, 0]} />
      {/* <primitive object={scene} /> */}
    </group>
  );
}

export default Model;
