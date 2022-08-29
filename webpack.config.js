const path = require("path");

module.exports = {
  entry: "./src/background.js",
  mode: "production",
  output: {
    filename: "background.js",
    path: path.resolve(__dirname, "dist"),
  },
};
