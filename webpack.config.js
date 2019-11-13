/**
 * @file webpack.config.js
 * @author Amit Agarwal
 * @email amit@labnol.org
 *
 * Google Apps Script Starter Kit
 * https://github.com/labnol/apps-script-starter
 */

const fs = require('fs')
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { version } = require('./package.json');

const src = path.resolve(__dirname, 'src');
const destination = path.resolve(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production';

// const babel = require('@babel/core');
// const content = fs.readFileSync(path.resolve(__dirname, '.babelrc'));
// const options = JSON.parse(content);
// console.log(`OPTIONS:`, options);

//babel.transformFile(`${src}/sidebar.js`, );

module.exports = {
  mode: isProduction ? 'production' : 'none',
  context: __dirname,
  entry: {
    code: `${src}/index.js`//,
    //sidebar: `${src}/sidebar.js`
  },
  output: {
    filename: (chunkData) => {
      if (chunkData.chunk.name === 'code') {
        return `code-${version}.js`;
      }
      // else {
      //   return '[name].js';
      // }
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
    // noParse: [
    //   //new RegExp(src + '/sidebar.js')
    //   /sidebar\.js$/
    // ],
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
        exclude: /node_modules|sidebar\.js\.html/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /sidebar\.js\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
        parser: {
          amd: false, // disable AMD
          commonjs: false, // disable CommonJS
          system: false, // disable SystemJS
          harmony: false, // disable ES2015 Harmony import/export
          // requireInclude: false, // disable require.include
          // requireEnsure: false, // disable require.ensure
          // requireContext: false, // disable require.context
          // browserify: false, // disable special handling of Browserify bundles
          requireJs: false, // disable requirejs.*
          // node: false, // disable dirname, filename, module, require.extensions, require.main, etc.
          // node: {...} // reconfigure node layer on module level
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
