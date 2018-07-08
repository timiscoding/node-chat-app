const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');

const WebpackFileDirnamePlugin = require('./WebpackFileDirnamePlugin');

module.exports = {
  output: { // enable sourcemaps support
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  target: 'node',
  node: false, // disable webpack plugins that alter node variables for non-node environments
  externals: [nodeExternals()],
  devtool: 'inline-cheap-module-source-map',
  mode: 'none',
  plugins: [
    new Dotenv({ path: './.env.test' }),
    new WebpackFileDirnamePlugin(),
  ],
};
