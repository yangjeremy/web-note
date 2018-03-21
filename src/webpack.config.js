  var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require("autoprefixer");

module.exports = {
  entry: path.join(__dirname, "js/app/index"),
  output: {
    path: path.join(__dirname, "../public"),
    filename: "js/index.js"
  },
  module: {
    rules: [
      {
        test: /(\.less)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "less-loader"]
        }) //把 css 抽离出来生成一个文件
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: { presets: ["es2015"] }
      }
    ],
  },
  resolve: {
    alias: {
      jquery: path.join(__dirname, "js/lib/jquery-3.3.1.min"),
      mod: path.join(__dirname, "js/mod"),
      less: path.join(__dirname, "less")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery"
    }),
    new ExtractTextPlugin("css/index.css"),
    new webpack.LoaderOptionsPlugin({
      options: {
        css: [autoprefixer()]
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    })
  ]
};
