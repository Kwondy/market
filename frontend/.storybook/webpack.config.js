import config from '../config/webpack.config.dev.js'
const getDefaultConfig =  require('@storybook/react/dist/server/config/defaults/webpack.config.js');
const path = require('path');

// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

module.exports = (baseConfig, env) => {
  const config = getDefaultConfig(base, env);
}

module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    rules: [
     {
       text: /\.scss$/,
       loaders: ["style-loader", "css-loader", "sass-loader"],
       include: path.resolve(__dirname, '../')
     }
    ],
  },
};
