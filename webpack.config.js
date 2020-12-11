const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
let DIR = "";
module.exports = (env = {}, argv) => {
  let isProduction = env["production"];
  let plugins = [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./" + DIR + "index.html"
    }),
  ]
  if(isProduction){
    let copy = new CopyPlugin([
      { from: path.resolve(__dirname, DIR + "static/"), to: path.resolve(__dirname, DIR + "dist/") },
    ]);
    plugins.push(copy);
  }
  return {
    mode: isProduction ? "production" : "development",
    entry: path.resolve(__dirname, DIR + "src/main.ts"),
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, DIR + "dist"),
      // publicPath:"./" + DIR + 'static/',
    },
    resolve: {
      extensions: [ ".ts", ".tsx", ".js"]
    },
    devServer: {
      // inline: false,
      host: "0.0.0.0",
      hot: true,
      compress: true,
      contentBase: "./" + DIR,
      port: 9006

    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: { loader: "awesome-typescript-loader" },
          exclude: /node_modules/
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        }
      ]
    },
    devtool: isProduction ? "source-map" : "inline-source-map",
    plugins: plugins,
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial"
          },
          babylonjs: {
            name: "chunk-babylonjs",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?babylonjs(.*)/
          }
        }
      }
    }
  };
};
