import merge from 'webpack-merge';
import webpack from 'webpack';
import StartServerPlugin from 'start-server-webpack-plugin';
import common from './webpack.common.babel';

export default merge.multiple(common, {
  client: {
    devtool: 'cheap-source-map',
    mode: 'development',
  },
  server: {
    devtool: 'cheap-source-map',
    mode: 'development',
    plugins: [
      new webpack.BannerPlugin({
        banner: "require('source-map-support').install();",
        raw: true,
        entryOnly: false,
      }),
      new StartServerPlugin('server.bundle.js'),
    ],
  },
});