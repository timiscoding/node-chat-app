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
      filename: '[name].bundle.js',
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
      ],
    },
  },
  server: {
    entry: ['./server/index.js'],
    output: {
      path: path.join(__dirname, 'server/dist'),
      filename: 'server.bundle.js',
    },
    target: 'node',
    node: {
      __dirname: false,
    },
    externals: [nodeExternals({ whitelist: [new RegExp('webpack/hot/poll')] })],
  },
};
