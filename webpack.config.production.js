var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Create multiple instances 
const extractCSS = new ExtractTextPlugin('assets/[name]-one.css');

module.exports = {
  entry: {
    vendor: ["react", "react-dom", "react-router"],
    app: ["babel-polyfill", "./src/index"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "assets/[name].[hash].js",
    chunkFilename: "assets/[name].[chunkhash].js"
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [{
        test: /\.js$/,
        include: path.join(__dirname, "src"),
        loader: "babel-loader",
        query: {
          presets: [
            ["es2015", { modules: false }],
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
        // test: /\.scss|css$/i,
        test: /\.scss$/i,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                minimize: true,
                sourceMap: true,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
            "resolve-url-loader",
            "sass-loader?sourceMap"
          ]
        })
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
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
        drop_console: true,
        screw_ie8: true
      },
      output: {
        comments: false
      }
    }),
    new ExtractTextPlugin("assets/[name].[contenthash:8].css"),
    // extractCSS,
    // new OptimizeCssAssetsPlugin({
    //   assetNameRegExp: /\.optimize\.css$/g,
    //   cssProcessor: require('cssnano'),
    //   cssProcessorOptions: { discardComments: { removeAll: true } },
    //   canPrint: true
    // }),
    new HtmlWebpackPlugin({
      hash: false,
      template: "./index.hbs",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    })
  ]
};