import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webpack from 'webpack';

import WebpackFileDirnamePlugin from './WebpackFileDirnamePlugin';

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
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', {
                  targets: {
                    browsers: ['last 2 versions', 'safari >= 7'],
                  },
                }],
              ],
              babelrc: false,
            },
          },
        },
      ],
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment/),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
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
    plugins: [
      new WebpackFileDirnamePlugin(),
    ],
  },
};
