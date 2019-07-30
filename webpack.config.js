const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const version = require('./package.json').version;

module.exports = function(env, argv) {

  const mode = argv.mode;
  const prod = mode === 'production';
  const devserver = argv.hasOwnProperty('host');

  return {
    mode,
    context: path.resolve(__dirname, 'src'),
    entry: {
      flipnote: devserver ? './test.js' : './flipnote.ts',
      node: './node.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: prod ? '[name].min.js' : '[name].js',
      library: 'flipnote',
      libraryExport: 'default',
      libraryTarget: 'umd',
      // for some reason webpack 4's umd implementation uses window as a global object
      // this means that these modules won't work in node js environments unless you manually change this
      // see https://github.com/webpack/webpack/issues/6522#issuecomment-371120689
      globalObject: 'typeof self !== "undefined" ? self : this',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        'webgl': path.resolve(__dirname, 'src/webgl/'),
        'parser': path.resolve(__dirname, 'src/parser/'),
        'encoders': path.resolve(__dirname, 'src/encoders/'),
        'utils': path.resolve(__dirname, 'src/utils/'),
        'loader': path.resolve(__dirname, 'src/loader/'),
        'player': path.resolve(__dirname, 'src/player/'),
      }
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.(glsl|frag|vert)?$/,
          exclude: /node_modules/,
          use: [
            { loader: 'raw-loader' },
            { loader: 'glslify-loader' },
          ]
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: [
          'flipnote.js v' + version,
          'Browser-based playback of .ppm and .kwz animations from Flipnote Studio and Flipnote Studio 3D',
          '2018 - 2019 James Daniel',
          'github.com/jaames/flipnote.js',
          'Flipnote Studio is (c) Nintendo Co., Ltd.',
        ].join('\n')
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(version),
        IS_PROD: prod,
        IS_DEV_SERVER: devserver,
      }),
      devserver ? new CopyWebpackPlugin([{from: 'demo/*'}]) : false,
      devserver ? new HtmlWebpackPlugin() : false
    ].filter(Boolean),
    devtool: 'source-map',
  }
};