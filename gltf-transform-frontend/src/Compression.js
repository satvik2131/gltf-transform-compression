import { React, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Center, Bounds, Resize } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function Model({ model }) {
  console.log(model);
  const jsonString = JSON.stringify(model);
  const encodedJSON = encodeURIComponent(jsonString);
  const dataURI = "data:application/json;charset=utf-8," + encodedJSON;

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
  );
  dracoLoader.setDecoderConfig({ type: "js" });
  const gltf = useLoader(GLTFLoader, dataURI, (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });

  // useEffect(() => {
  //   (async () => {
  //     //Uint8 type Data
  //     // const bufferData = Buffer.from(model);
  //     // console.log(bufferData);
  //     // const arrBuffer = bufferData.buffer;
  //     //Approach 1 (reading with gltf-transform WebIO library)
  //     // const document = await io.readBinary(bufferData);
  //     // const glb = await io.writeBinary(document);
  //     // console.log(glb);
  //     //Approach 2 (reading with GltfLoader parse method form three.js)
  //     // const gltfLoader = new GLTFLoader();
  //     // gltfLoader.parse(
  //     //   arrBuffer,
  //     //   "",
  //     //   //GLTF file
  //     //   function (gltf) {
  //     //     console.log(gltf);
  //     //   },
  //     //   //Error
  //     //   function (err) {
  //     //     console.log(err);
  //     //   }
  //     // );
  //     //JSON Approach
  //     // const loader = new ObjectLoader();
  //     // const model = loader.parse(jsonDt.json);
  //     // console.log(model);
  //   })();

  //   return () => {
  //     <group>
  //       <OrbitControls />
  //       <ambientLight intensity={0.5} />
  //       <directionalLight intensity={1} position={[0, 10, 0]} />
  //       <primitive object={model.scene} />
  //     </group>;
  //   };
  // }, []);

  // const loader = new GLTFLoader();
  // loader.parse(
  //   data,
  //   "",
  //   (gltf) => {
  //     // 'gltf' contains the parsed glTF data
  //     console.log(gltf);

  //     // Further processing or usage of the glTF data can be done here
  //   },
  //   (error) => {
  //     console.error("Error parsing glTF:", error);
  //   }
  // );
  // const gltf = new ObjectLoader(json);
  // scene.add(gltf);

  return (
    <Bounds fit clip observe>
      <Resize scale={1}>
        <Center>
          <OrbitControls />
          <GetInfo />
          <ambientLight intensity={0.5} />
          <directionalLight intensity={1} position={[0, 10, 0]} />
          <primitive object={gltf.scene} />
        </Center>
      </Resize>
    </Bounds>
  );
}

//Get Render info
const GetInfo = () => {
  const { gl } = useThree();
  useEffect(() => {
    // gl === WebGLRenderer
    // gl.info.calls
    console.log(gl.info);
  });
  return null;
};

export default Model;
