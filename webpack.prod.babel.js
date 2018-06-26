import merge from 'webpack-merge';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import common from './webpack.common.babel';

export default merge.multiple(common, {
  client: {
    devtool: 'source-map',
    mode: 'production',
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
  },
  server: {
    devtool: 'source-map',
    mode: 'production',
  },
});
