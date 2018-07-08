const webpack = require('webpack');
const StartServerPlugin = require('start-server-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  client: {
    devtool: 'cheap-source-map',
  },
  server: {
    entry: ['webpack/hot/poll.js?1000'],
    devtool: 'cheap-source-map',
    plugins: [
      new webpack.BannerPlugin({
        banner: "require('source-map-support').install();",
        raw: true,
        entryOnly: false,
      }),
      new StartServerPlugin({ name: 'server.bundle.js', keyboard: true }),
      new webpack.HotModuleReplacementPlugin(),
      new Dotenv({ path: './.env.dev' }),
    ],
  },
};
