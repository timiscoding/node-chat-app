const merge = require('webpack-merge');

const applyPresets = ({ presets, mode }) => {
  const mergedPresets = [].concat(...[presets]);
  const mergedConfig = mergedPresets.map(presetName => require(`./presets/webpack.${presetName}`)(mode));
  return merge(...mergedConfig);
};

module.exports = applyPresets;
