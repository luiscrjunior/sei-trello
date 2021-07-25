const { merge } = require('webpack-merge');
const ExtensionReloader = require('webpack-extension-reloader');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  plugins: [
    new ExtensionReloader({
      port: 9090,
      reloadPage: false,
      entries: {
        contentScript: ['js/process_list.js', 'js/process_content.js'],
        background: 'js/background.js',
      },
    }),
  ],
});
