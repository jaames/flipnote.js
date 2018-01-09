
"use strict";

const path = require("path");
const webpack = require("webpack");
const version = require("./package.json").version;

module.exports = function (env) {

  var isDevMode = (env == "dev");

  var config = {
    context: path.resolve(__dirname, "src"),
    entry: "./ugomemo.js",
    output: {
      library: "ugomemo",
      libraryTarget: "umd",
      path: path.resolve(__dirname, "dist"),
      filename: isDevMode ? "ugomemo.js" : "ugomemo.min.js",
    },
    resolve: {
      extensions: [".js"],
      alias: {
        "webgl": path.resolve(__dirname, "src/webgl/"),
        "parser": path.resolve(__dirname, "src/parser/"),
        "player": path.resolve(__dirname, "src/player/"),
      }
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: [
          "ugomemo.js",
          "Real-time, browser-based playback of Flipnote Studio's .ppm animation format",
          "2018 James Daniel",
          "Released under the MIT license",
          "Flipnote Studio and the proprietary .ppm format were created by Nintendo Co., Ltd.",
          "More detail at github.com/jaames/ugomemo.js",
        ].join("\n")
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(version)
      })
    ],
    devtool: "source-map",
    devServer: {
      port: process.env.PORT || 8080,
      host: "localhost",
      publicPath: "http://localhost:8080",
      contentBase: path.join(__dirname, "./"),
      watchContentBase: true,
    }
  }

  if (!isDevMode) {
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin()
    ]);
  }

  return config;
};