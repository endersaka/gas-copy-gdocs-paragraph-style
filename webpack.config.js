/**
 * @file webpack.config.js
 * @author Amit Agarwal
 * @email amit@labnol.org
 *
 * Google Apps Script Starter Kit
 * https://github.com/labnol/apps-script-starter
 */

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { version } = require('./package.json');

const src = path.resolve(__dirname, 'src');
const destination = path.resolve(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'none',
  context: __dirname,
  entry: {
    code: `${src}/index.js`,
    sidebar: `${src}/sidebar.js`
  },
  output: {
    filename: (chunkData) => {
      if (chunkData.chunk.name === 'code') {
        return `code-${version}.js`;
      } else {
        return '[name].js';
      }
    },
    path: destination,
    libraryTarget: 'this'
  },
  resolve: {
    extensions: ['.js']
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          ie8: true,
          warnings: false,
          mangle: false,
          compress: {
            properties: false,
            drop_console: false,
            drop_debugger: isProduction
          },
          output: {
            beautify: !isProduction
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: false,
          failOnError: false,
          fix: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: `${src}/**/*.html`,
        flatten: true,
        to: destination
      },
      {
        from: `${src}/../appsscript.json`,
        to: destination
      },
      {
        from: `${src}/sidebar.js`,
        to: destination
      }
    ]),
    new GasPlugin({
      comments: false,
      source: 'digitalinspiration.com'
    })
  ]
};
