import common from './webpack.common.babel';
import merge from 'webpack-merge';
import StartServerPlugin from 'start-server-webpack-plugin';

export default merge.multiple(common, {
  client: {
    devtool: 'inline-source-map',
    mode: 'development',
  },
  server: {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
      new StartServerPlugin('server.js')
    ],
  }
});
