import React, { useState } from "react";
import Model from "./Compression";
import { Canvas } from "@react-three/fiber";
import axios from "axios";

function FileUploader() {
  const [buffer, setBuffer] = useState(null);
  const endpoint = "http://localhost:3001/transform/model";

  //Sends the file to backend and receives the compressed one
  const handleFileChange = async (event) => {
    const selectedFile = await event.target.files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);

    const gltfBuffer = await axios.post(endpoint, formData);
    setBuffer(gltfBuffer.data);
  };

  if (buffer != null) {
    return (
      <Canvas>
        <Model data={buffer} />
      </Canvas>
    );
  }

  // if (file != null) {
  //     return (
  //         <Canvas>
  //             <Model url={file} name={name} />
  //         </Canvas>
  //     );
  // }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

export default FileUploader;
