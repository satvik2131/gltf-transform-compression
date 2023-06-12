const fbxToGlb = async (path) => {
  const convert = require("fbx2gltf");
  const pathOfGlb = await convert(path, "model.glb", ["--khr-materials-unlit"]);
  console.log(pathOfGlb);
  return pathOfGlb;
};

const objToGlb = (path) => {};

module.exports = { fbxToGlb, objToGlb };
