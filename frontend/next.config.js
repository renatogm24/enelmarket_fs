const withTM = require("@vercel/edge-functions-ui/transpile")();

const withImages = require("next-images");
module.exports = withImages();

module.exports = withTM();
