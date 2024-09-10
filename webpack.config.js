const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/* este diretório é onde será gerada automaticamente toda estrutura da extensão */
const outputPath = path.resolve(__dirname, 'dist/expanded');

module.exports = {
  mode:
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'
      ? process.env.NODE_ENV
      : process.env.NODE_ENV === 'test'
      ? 'none'
      : 'development',

  entry: {
    /* entry points da app */
    process_list: './src/js/entries/process_list',
    process_content: './src/js/entries/process_content',

    /* outros scripts */
    common: './src/js/common.js',
    service_worker: './src/js/service_worker.js',
    options: './src/js/options.js',
  },
  output: {
    path: outputPath,
    filename: ({ chunk }) => {
      if (['options'].includes(chunk.name)) {
        return 'html/[name].js';
      } else {
        return 'js/[name].js';
      }
    },
  },
  resolve: {
    alias: {
      model: path.resolve(__dirname, 'src/js/model'),
      view: path.resolve(__dirname, 'src/js/view'),
      controller: path.resolve(__dirname, 'src/js/controller'),
      api: path.resolve(__dirname, 'src/js/api'),
      actions: path.resolve(__dirname, 'src/js/actions'),
      utils: path.resolve(__dirname, 'src/js/utils'),
      tests: path.resolve(__dirname, 'src/__tests__'),
      css: path.resolve(__dirname, 'src/css'),
    },
  },
  module: {
    rules: [
      /* estilos neste path serão exportados para um .css */
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src/css')],
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },

      /* estilos dos componentes não serão exportados para arquivo */
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src/js')],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
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
  devtool: 'cheap-module-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: ({ chunk }) => {
        if (['options'].includes(chunk.name)) {
          return 'html/[name].css';
        } else {
          return 'css/[name].css';
        }
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: outputPath + '/' },
        { from: 'src/icons', to: outputPath + '/icons' },
        { from: 'src/html', to: outputPath + '/html' },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.MOCKED_API': JSON.stringify('false'),
    }),
  ],
};
