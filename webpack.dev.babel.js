import merge from 'webpack-merge';
import webpack from 'webpack';
import StartServerPlugin from 'start-server-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import common from './webpack.common.babel';

export default merge.multiple(common, {
  client: {
    devtool: 'cheap-source-map',
    mode: 'development',
  },
  server: {
    entry: ['webpack/hot/poll.js?1000'],
    devtool: 'cheap-source-map',
    mode: 'development',
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
});
