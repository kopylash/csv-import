'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './app/index.js',

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist/')
  },

  devServer: {
    port: 3000,
    historyApiFallback: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './app/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      'API_URL': JSON.stringify(process.env.API_URL)
    })
  ]
};
