import merge from 'webpack-merge';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';

import common from './webpack.common.babel';

export default merge.multiple(common, {
  client: {
    devtool: 'cheap-source-map',
    mode: 'none',
  },
  server: {
    devtool: 'cheap-source-map',
    mode: 'none',
    plugins: [
      new webpack.BannerPlugin({
        banner: "require('source-map-support').install();",
        raw: true,
        entryOnly: false,
      }),
      new Dotenv({ path: './.env.test' }),
    ],
  },
});
