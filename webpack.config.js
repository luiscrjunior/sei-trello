const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/* este diretório é onde será gerada automaticamente toda estrutura da extensão */
const outputPath = path.resolve(__dirname, 'dist/expanded');

module.exports = {

  entry: {
    /* importante para compatibilidade com as promises */
    'vendor/js/babel-polyfill.js': 'babel-polyfill',

    /* entry points da app */
    'js/process_list.js': './src/js/process_list.js',

    /* outros scripts */
    'js/common.js': './src/js/common.js',
    'js/background.js': './src/js/background.js',
    'js/options.js': './src/js/options.js',

    /* página de estilos */
    'css/common.css': './src/css/common.scss',
    'css/process_list.css': './src/css/process_list.scss',

  },
  output: {
    path: outputPath,
    filename: '[name]',
  },
  resolve: {
    alias: {
      'model': path.resolve(__dirname, 'src/js/model'),
      'view': path.resolve(__dirname, 'src/js/view'),
      'controller': path.resolve(__dirname, 'src/js/controller'),
      'api': path.resolve(__dirname, 'src/js/api'),
    },
  },
  module: {
    rules: [

      /* estilos neste path serão exportados para um .css */
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, 'src/css'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        }),
      },

      /* estilos dos componentes não serão exportados para arquivo */
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, 'src/js'),
        ],
        use: ['style-loader', 'css-loader?modules&importLoaders=1', 'postcss-loader', 'sass-loader'],
      },

      /* transforma os js */
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['transform-object-rest-spread'],
          },
        },
      },

      /* carrega as imagens em DataURL*/
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 8192 },
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
