const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './frontend-js/main.js',
  output: {
    filename: 'main-bundled.js',
    path: path.resolve(__dirname, 'public'),
    // This tells Webpack to treat the output as a module
    clean: true 
  },
  mode: "development", // Change this to development for faster compiling while we work
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: "defaults" }]]
          }
        }
      }
    ]
  }
};