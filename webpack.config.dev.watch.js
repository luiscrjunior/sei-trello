const { merge } = require('webpack-merge');
const ExtensionReloader = require('webpack-ext-reloader');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  plugins: [
    new ExtensionReloader({
      port: 9090,
      reloadPage: false,
      entries: {
        contentScript: ['js/process_list.js', 'js/process_content.js'],
        service_worker: 'js/service_worker.js',
      },
    }),
  ],
});
