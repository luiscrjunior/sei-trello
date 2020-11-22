const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const common = require('./webpack.config.js');

const outputPath = path.resolve(__dirname, 'playground/output');

common.entry = {
  'filter-panel.js': './playground/filter-panel.js',
  'trello-card.js': './playground/trello-card.js',
  'due-panel.js': './playground/due-panel.js',
  'checklist-panel.js': './playground/checklist-panel.js',
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
];
common.output.path = outputPath;

module.exports = common;
