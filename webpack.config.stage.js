const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const common = require('./webpack.config.js');

const outputPath = path.resolve(__dirname, 'stage/output');

common.entry = {
  'bundle.js': './stage/filter-panel.js',
  'common.css': './src/css/common.scss',
};

common.devServer = {
  contentBase: outputPath,
  inline: true,
  hot: true,
};

common.plugins = [
  new ExtractTextPlugin('[name]'),
  new webpack.DefinePlugin({
    DEVELOPMENT: JSON.stringify(process.env.NODE_ENV === 'development'),
    PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  new webpack.HotModuleReplacementPlugin(),
];
common.output.path = outputPath;

module.exports = common;
