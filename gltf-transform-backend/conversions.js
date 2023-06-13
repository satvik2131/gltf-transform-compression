const obj2gltf = require("obj2gltf");
const fs = require("fs");
const fsExtra = require("fs-extra");
const { log } = require("console");

const fbxToGlb = async (path) => {
  const convert = require("fbx2gltf");
  const pathOfGlb = await convert(path, "model.glb", ["--khr-materials-unlit"]);
  const glb = await fsExtra.readFile("model.glb");
  await fsExtra.remove(pathOfGlb);
  return glb;
};

const objToGlb = async (path) => {
  //OBJ --> GLB
  const options = {
    binary: true,
  };
  const glb = await obj2gltf(path, options);
  // await fsExtra.writeFile("model.glb", glb);
  // const finalGlb = await fsExtra.readFile("model.glb");
  // fsExtra.remove("model.glb");
  return glb;
};

module.exports = { fbxToGlb, objToGlb };
