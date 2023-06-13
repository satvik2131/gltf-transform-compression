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
const { MeshoptSimplifier } = require("meshoptimizer");
const { log } = require("console");
const cors = require("cors");
const formidable = require("formidable");
//converting glb to gltf (Modules)
const gltfPipeline = require("gltf-pipeline");
const fsExtra = require("fs-extra");
const { glbToGltf, gltfToGlb } = gltfPipeline;
const { fbxToGlb, objToGlb } = require("./conversions");
app.use(cors());

app.post("/transform/model", async (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
      res.end(String(err));
      return;
    }

    //Input from Browser
    const path = files.file.filepath;
    const name = files.file.originalFilename;
    const type = name.split(".")[1];

    //Input from Postman
    // const path = files[""].filepath;
    // const name = files[""].originalFilename;
    // const type = name.split(".")[1];

    // Configure I / O.
    const io = new NodeIO()
      .registerExtensions(KHRONOS_EXTENSIONS)
      .registerDependencies({
        "draco3d.decoder": await draco3d.createDecoderModule(), // Optional.
        "draco3d.encoder": await draco3d.createEncoderModule(), // Optional.
      });

    log("type:-", type);

    //File conversion fbx -> glb , obj -> glb , gltf -> glb (NodeIo supports glb as an input)
    var glb;
    let document;
    switch (type) {
      case "glb":
        glb = await fsExtra.readFile(path);
        document = await io.readBinary(glb);
        break;

      case "fbx":
        //FBX converter returns a path of converted glb file
        glb = await fbxToGlb(path);
        document = await io.readBinary(glb);
        break;

      case "obj":
        glb = await objToGlb(path);
        document = await io.readBinary(glb);
        break;

      case "gltf":
        const gltf = fsExtra.readJSONSync(path);
        glb = await gltfToGlb(gltf);
        break;
    }

    //converting gltf to buffer
    // Read.
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
      center({ pivot: "below" }),
      //prduces fewer triangles and meshes
      simplify({ simplifier: MeshoptSimplifier, ratio: 0.2, error: 0.0001 })
    );

    //creates a json to send for backend (takes time)
    // const data = await io.writeJSON(document); // Creates Gltf Formatted Uint8 data
    // log(data);

    //Sending buffer
    // const mimetype = "application/octet-stream";
    // res.writeHead(200, {
    //   "Content-Type": mimetype,
    //   // "Content-disposition": "attachment;filename=" + "model.glb",
    //   "Content-Length": data.length,
    // });
    // res.send(Buffer.from(data));

    /************************************/
    //Currently Working on The below method
    /************************************/
    //GLB --> GLTF (Sending GLTF approach (worked))
    const data = await io.writeBinary(document);
    const gltf = await glbToGltf(data);
    // log(gltf);
    res.send(gltf.gltf);

    //Sending JSON
    // const data = await io.writeJSON(document);
    // log(data);
    // res.json(JSON.stringify(data));

    //Save As File
    // fs.writeFile("test2.glb", buffer, (err) => {
    //   if (err) throw err;
    //   console.log("The file has been saved!");
    // });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
