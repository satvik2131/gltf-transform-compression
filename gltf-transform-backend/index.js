const express = require("express");
const app = express();
const port = 3001;
const { NodeIO, Document } = require("@gltf-transform/core");
const { KHRONOS_EXTENSIONS } = require("@gltf-transform/extensions");
const {
  resample,
  prune,
  dedup,
  draco,
  center,
  simplify,
} = require("@gltf-transform/functions");
const draco3d = require("draco3d");
const fs = require("fs");
const { MeshoptSimplifier } = require("meshoptimizer");
const { log } = require("console");
const cors = require("cors");
const formidable = require("formidable");

app.use(cors());

app.post("/transform/model", async (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
      res.end(String(err));
      return;
    }

    //Input filepath
    const path = files.file.filepath;
    //Postman input
    // const path = files[""].filepath;

    // Configure I / O.
    const io = new NodeIO()
      .registerExtensions(KHRONOS_EXTENSIONS)
      .registerDependencies({
        "draco3d.decoder": await draco3d.createDecoderModule(), // Optional.
        "draco3d.encoder": await draco3d.createEncoderModule(), // Optional.
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

    //Sending buffer
    const data = await io.writeBinary(document);
    const mimetype = "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": mimetype,
      "Content-disposition": "attachment;filename=" + "model.glb",
      "Content-Length": data.length,
    });
    res.end(Buffer.from(data, "binary"));

    //Sending JSON
    // const data = await io.writeJSON(document);
    // const mimetype = "application/octet-stream";
    // res.writeHead(200, {
    //   "Content-Type": mimetype,
    //   "Content-disposition": "attachment;filename=" + "model.glb",
    //   "Content-Length": data.length,
    // });
    // res.end(data);

    //To save file in system
    // fs.writeFile('test2.glb', byteArrayGlb, (err) => {
    //     if (err) throw err;
    //     console.log('The file has been saved!');
    // });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
