let webpack = require('webpack')
let path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: {
    app: './client/main.ts'
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
  },
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    compress: true,
    open:true,
  },
  externals: {
    jquery: 'jQuery'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [resolve('client'),resolve('server')],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('client'),resolve('server')],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
      },
      {
        from: 'assets',
        to: 'assets',
      }
    ]),
    // new webpack.HotModuleReplacementPlugin(),
    // // Use NoErrorsPlugin for webpack 1.x
    // new webpack.NoEmitOnErrorsPlugin()
  ]
}