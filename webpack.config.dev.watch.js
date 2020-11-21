const merge = require('webpack-merge');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  plugins: [
    new ChromeExtensionReloader({
      port: 9090,
      reloadPage: false,
      entries: {
        contentScript: 'js/process_list.js',
        background: 'js/background.js',
      },
    }),
  ],
});
