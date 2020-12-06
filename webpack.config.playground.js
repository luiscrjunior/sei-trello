const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const common = require('./webpack.config.js');

const outputPath = path.resolve(__dirname, 'playground/html');

common.entry = {
  'script.js': './playground/playground.js',
  'common.css': './src/css/common.scss',
};

common.devServer = {
  contentBase: outputPath,
  hotOnly: true,
};

common.plugins = [
  new ExtractTextPlugin('[name]'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin(),
];
common.output.path = outputPath;

module.exports = common;
