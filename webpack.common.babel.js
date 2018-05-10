import path from 'path';
import nodeExternals from 'webpack-node-externals';

export default {
  client: {
    entry: {
      chat: './client/chat.js',
      join: './client/join.js',
    },
    output: {
      path: path.join(__dirname, 'public/js'),
      filename: '[name].js',
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
      ]
    },
  },
  server: {
    entry: './server/server.js',
    output: {
      path: path.join(__dirname, 'server/dist'),
      filename: 'server.js',
    },
    target: 'node',
    node: {
      __dirname: false,
    },
    externals: [nodeExternals()]
  },
};
