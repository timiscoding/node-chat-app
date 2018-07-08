const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
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
};
