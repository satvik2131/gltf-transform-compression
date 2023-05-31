import React from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { ObjectLoader } from "three";

export function Model({ json }) {

    // const json = model.parser.json;
    // const objModel = useLoader(loaders.obj, json);
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    // dracoLoader.setDecoderConfig({ type: 'js' });
    // const gltf = useLoader(GLTFLoader, url, (loader) => {
    //     loader.setDRACOLoader(dracoLoader);
    // });
    const { scene } = useThree();
    const gltf = new ObjectLoader(json);
    scene.add(gltf);


    return (
        <group>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight intensity={1} position={[0, 10, 0]} />
            <primitive object={scene} />
        </group>
    );
}


export default Model;
