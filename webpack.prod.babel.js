import common from './webpack.common.babel';
import merge from 'webpack-merge';

export default merge.multiple(common, {
  client: {
    mode: 'production',
  },
  server: {
    mode: 'production',
  }
});
