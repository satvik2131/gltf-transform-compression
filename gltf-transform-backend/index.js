const express = require('express')
const app = express()
const port = 3001
const { NodeIO, Document } = require('@gltf-transform/core');
const { KHRONOS_EXTENSIONS } = require('@gltf-transform/extensions');
const { resample, prune, dedup, draco, center, simplify } = require('@gltf-transform/functions');
const draco3d = require('draco3d');
const fs = require('fs');
const { MeshoptSimplifier } = require('meshoptimizer');
const { log } = require('console');
const cors = require('cors');
const formidable = require('formidable');
const { join } = require('node:path');
const { readFile } = require('node:fs/promises');


app.use(cors());

app.post('/transform/model', async (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
            res.end(String(err));
            return;
        }

        //Input filepath
        // const path = files.file.filepath;
        //postman input
        const path = files[''].filepath;

        // Configure I / O.
        const io = new NodeIO()
            .registerExtensions(KHRONOS_EXTENSIONS)
            .registerDependencies({
                'draco3d.decoder': await draco3d.createDecoderModule(), // Optional.
                'draco3d.encoder': await draco3d.createEncoderModule(), // Optional.
            });

        // Read.
        let document = await io.read(path); // → Document
        await document.transform(
            // Losslessly resample animation frames.
            resample(),
            // Remove unused nodes, textures, or other data.
            prune(),
            // Remove duplicate vertex or texture data, if any.
            dedup(),
            // Compress mesh geometry with Draco.
            draco(),
            //centers the model at the origin
            center(),
            //prduces fewer triangles and meshes
            simplify({ simplifier: MeshoptSimplifier, ratio: 0.2, error: 0.0001 })
        );

        const byteArrayGlb = await io.writeBinary(document);


        //To save file in system
        fs.writeFile('test2.glb', byteArrayGlb, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });

        // const filePath = new URL('test2.glb');
        // const contents = await readFile(filePath);
        // log(contents);

        // res.write(byteArrayGlb, 'binary');
        // res.end();

        // res.writeHead(200, { 'Content-Type': 'application/json' });
        // res.end(JSON.stringify({ fields, files }, null, 2));
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})