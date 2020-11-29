const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/* este diretório é onde será gerada automaticamente toda estrutura da extensão */
const outputPath = path.resolve(__dirname, 'dist/expanded');

module.exports = {
  mode: 'development',

  entry: {
    /* entry points da app */
    'js/process_list.js': './src/js/entries/process_list',
    'js/process_content.js': './src/js/entries/process_content',

    /* outros scripts */
    'js/common.js': './src/js/common.js',
    'js/background.js': './src/js/background.js',
    'js/options.js': './src/js/options.js',

    /* página de estilos */
    'css/common.css': './src/css/common.scss',
    'css/process_list.css': './src/css/process_list.scss',
    'css/process_content.css': './src/css/process_content.scss',
  },
  output: {
    path: outputPath,
    filename: '[name]',
  },
  resolve: {
    alias: {
      model: path.resolve(__dirname, 'src/js/model'),
      view: path.resolve(__dirname, 'src/js/view'),
      controller: path.resolve(__dirname, 'src/js/controller'),
      api: path.resolve(__dirname, 'src/js/api'),
      actions: path.resolve(__dirname, 'src/js/actions'),
      utils: path.resolve(__dirname, 'src/js/utils'),
    },
  },
  module: {
    rules: [
      /* estilos neste path serão exportados para um .css */
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src/css')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        }),
      },

      /* estilos dos componentes não serão exportados para arquivo */
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src/js')],
        use: ['style-loader', 'css-loader?modules&importLoaders=1', 'postcss-loader', 'sass-loader'],
      },

      /* estilos dos componentes importados do node_modules */
      {
        test: /\.(scss|css)$/,
        include: [path.resolve(__dirname, 'node_modules')],
        use: ['style-loader', 'css-loader?importLoaders=1', 'sass-loader'],
      },

      /* transforma os js */
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },

      /* carrega as imagens em DataURL*/
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 8192, fallback: 'file-loader' },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(outputPath),
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: outputPath + '/' },
      { from: 'src/icons', to: outputPath + '/icons' },
      { from: 'src/html', to: outputPath + '/html' },
      { from: 'src/vendor', to: outputPath + '/vendor' },
    ]),
    new ExtractTextPlugin('[name]'),
    new webpack.DefinePlugin({
      DEVELOPMENT: JSON.stringify(process.env.NODE_ENV === 'development'),
      PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
