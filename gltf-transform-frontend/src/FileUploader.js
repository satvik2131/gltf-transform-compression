import React, { useState } from 'react';
import Model from './Compression';
import { Canvas } from '@react-three/fiber';
import axios from 'axios';

function FileUploader() {
    const [file, setFile] = useState(null);
    const [name, setName] = useState(null);
    const [jsonData, setJSONData] = useState(null);
    const endpoint = 'http://localhost:3001/transform/model'

    //Sends the file to backend and receives the compressed one
    const handleFileChange = async (event) => {
        const selectedFile = await event.target.files[0];
        const formData = new FormData();
        formData.append('file', selectedFile);

        const jsonData = await axios.post(endpoint, formData)
        console.log(jsonData)
        // setJSONData(jsonData);

        // setName(selectedFile.name);
        // reader.onload = (event) => {
        //     const fileUrl = event.target.result;
        //     setFile(fileUrl);
        // };

        // reader.readAsDataURL(selectedFile);
    };


    // if (jsonData != null) {
    //     return (
    //         <Canvas>
    //             <Model json={jsonData} />
    //         </Canvas>
    //     )
    // }

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
