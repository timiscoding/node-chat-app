const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const merge = require('webpack-merge');

const WebpackFileDirnamePlugin = require('./build-utils/WebpackFileDirnamePlugin');
const presetsConfig = require('./build-utils/loadPresets');

const modeConfig = mode => require(`./build-utils/webpack.${mode}.js`);

module.exports = ({ mode, presets = [] } = { mode: 'production', presets: [] }) => (
  merge.multiple(
    {
      client: {
        mode,
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
        mode,
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
    },
    modeConfig(mode),
    presetsConfig({ presets, mode }),
  )
);
