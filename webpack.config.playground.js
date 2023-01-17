const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const path = require('path');
const common = require('./webpack.config.js');

const outputPath = path.resolve(__dirname, 'playground/output');

common.entry = {
  script: './playground/playground.js',
};

common.devServer = {
  static: {
    directory: outputPath,
  },
  hot: true,
};

common.mode = 'development';

common.plugins = [
  new MiniCssExtractPlugin({
    filename: 'common.css',
  }),
  new CleanWebpackPlugin(),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'playground/html/index.html', to: outputPath },
      { from: 'playground/html/styles.css', to: outputPath },
    ],
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.MOCKED_API': JSON.stringify('true'),
  }),
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin(),
];

common.output = {
  path: outputPath,
  filename: 'script.js',
};

module.exports = common;
