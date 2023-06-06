var path = require("path");
var SRC_DIR = path.join(__dirname, "dist/client/src");
var DIST_DIR = path.join(__dirname, "dist/client/dist");

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: "bundle.js",
    path: DIST_DIR,
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },

    ],
  },
};
