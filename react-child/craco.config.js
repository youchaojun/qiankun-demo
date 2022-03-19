const { name } = require("./package");

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.library = `${name}-[name]`;
      config.output.libraryTarget = "umd";
      config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;

      return config;
    },
  },
  devServer: {
    port: 3002,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: true,
    hot: true,
    liveReload: false,
  },
};
