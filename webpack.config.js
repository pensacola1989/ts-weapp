// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
// const { CheckerPlugin } = require('awesome-typescript-loader')
const upath = require('upath');
const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const generateRelative = function (len) {
  let ret = '';
  for (let i = 0; i <= len; i++) {
    ret += '../';
  }
  return ret;
};

module.exports = {
  entry: [
    './mock_bundle.js'
  ],
  output: {
    filename: 'bundle.js',
    path: resolve('unused')
  },
  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.js']
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    loaders: [
      // {
      //   test: /\.ts$/,
      //   loader: 'awesome-typescript-loader'
      // }
    ]
  },
  plugins: [
      new CopyWebpackPlugin([{
        context: './src',
        from: '**/*.xml',
        to: resolve('dist/[path][name].wxml'),
        toType: 'template'
      }, {
        context: './src',
        from: '**/*.json',
        to: resolve('dist')
      }, {
        context: './src',
        from: '**/*.css',
        to: resolve('dist/[path][name].wxss'),
        toType: 'template'
      }, {
        context: './src',
        from: '**/promise.js',
        to: resolve('dist/[path][name].[ext]')
      }, {
        context: './src',
        from: '**/styles/fonts/*.*',
        to: resolve('dist')
      }, {
        context: './src',
        from: '**/assets/images/*.*',
        to: resolve('dist')
      }, {
        context: './.tmp',
        from: '**/*.js',
        to: resolve('dist'),
        transform: (content, path) => {
          if (path.indexOf('promise.js') !== -1) {
            return content;
          }
          let spliter = '.tmp';
          let _path = upath.toUnix(path).split(spliter)[1];
          let level = _path.split('/').length - 3;
          let relative = level === -1 ? './' : generateRelative(level);
          let promiseRequireString = `\n
            ///__APPENDED___
              var Promise = require("${relative}utils/promise.js");
            ///__END___
          `;
          let jsContentStr = content.toString('utf-8');
          let replaceStr = `"use strict";`;
          jsContentStr = jsContentStr.replace(replaceStr, replaceStr + promiseRequireString);

          return Buffer.from(jsContentStr, 'utf-8');
        }
      }], {
            ignore: [
                // Doesn't copy any files with a txt extension    
                // '*.js',
                '*.ts',
                // Doesn't copy any file, even if they start with a dot
                // '**/*',
                // Doesn't copy any file, except if they start with a dot
                // { glob: '**/*', dot: false }
            ],

            // By default, we only copy modified files during
            // a watch or webpack-dev-server build. Setting this
            // to `true` copies all files.
            copyUnmodified: true
      })
  ]
};