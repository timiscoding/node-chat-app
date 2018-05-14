import merge from 'webpack-merge';
import StartServerPlugin from 'start-server-webpack-plugin';
import common from './webpack.common.babel';

export default merge.multiple(common, {
  client: {
    devtool: 'inline-source-map',
    mode: 'development',
  },
  server: {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
      new StartServerPlugin('server.js'),
    ],
  },
});
