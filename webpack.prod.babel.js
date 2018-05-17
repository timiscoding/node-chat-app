import merge from 'webpack-merge';
import common from './webpack.common.babel';

export default merge.multiple(common, {
  client: {
    devtool: 'source-map',
    mode: 'production',
  },
  server: {
    devtool: 'source-map',
    mode: 'production',
  },
});
