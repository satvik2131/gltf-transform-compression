import React, { useState } from "react";
import Model from "./Compression";
import { Canvas } from "@react-three/fiber";
import axios from "axios";

function FileUploader() {
  const [data, setData] = useState(null);
  const endpoint = "http://localhost:3001/transform/model";

  //Sends the file to backend and receives the compressed one
  const handleFileChange = async (event) => {
    const selectedFile = await event.target.files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);

    const data = await axios.post(endpoint, formData);
    const gltf = data.data;
    //JSON approach
    setData(gltf);

    //Buffer approach
    // setData(gltfBuffer.data);
  };

  if (data != null) {
    return (
      <Canvas>
        <Model model={data} />
      </Canvas>
    );
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

export default FileUploader;
