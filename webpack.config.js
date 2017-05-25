var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var hostUrl = "http://127.0.0.1:3000";


module.exports = {
  entry: [
    "react-hot-loader/patch",
    "webpack-dev-server/client?" + hostUrl,
    "webpack/hot/only-dev-server",
    "babel-polyfill",
    "whatwg-fetch",
    "./src/index"
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, "dist"),
    port: 3000,
    host: "0.0.0.0",
    publicPath: "/",
    historyApiFallback: true,
    disableHostCheck: true
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "app.[hash].js"
  },
  devtool: "eval",
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            ["es2015", { "modules": false }],
            "stage-0",
            "react"
          ],
          plugins: [
            "transform-async-to-generator",
            "transform-decorators-legacy"
          ]
        }
      },
      {
        test: /\.scss|css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "resolve-url-loader",
          "sass-loader?sourceMap"
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader?hash=sha512&digest=hex&name=[hash].[ext]",
          {
            loader: "image-webpack-loader",
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: "65-90",
                speed: 4
              }
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new DashboardPlugin(),
    // new DashboardPlugin(() => {}),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ hash: false, template: "./index.hbs" }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/),
    new OpenBrowserPlugin({ url: hostUrl })
  ]
};