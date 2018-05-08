const path = require('path');
const StartServerPlugin = require('start-server-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './server/server.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
  },
  plugins: [
    new StartServerPlugin('server.js')
  ],
  mode: 'development',
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()]
};
