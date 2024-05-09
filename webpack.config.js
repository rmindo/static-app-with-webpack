const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpack = require('html-webpack-plugin')

/**
 * Main directory
 */
const maindir = path.resolve(__dirname)


module.exports = {
  mode: 'development',
  entry: path.resolve(maindir, 'index.js'),
  output: {
    path: path.resolve(maindir, 'dist'),
    filename: 'static/js/bundle-[contenthash:8].js'
  },
  devServer: {
    hot: true,
    port: 3000,
    compress: true,
    host: '192.168.1.7',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(js|ts)$/,
        include: [
          path.resolve(maindir, 'src')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    esmodules: true,
                  },
                },
              ]
            ],
            plugins: [],
          },
        }
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'public/static/images',
          to: 'static/images'
        },
        {
          from: 'public/template',
          to: 'template'
        },
      ],
    }),
    new HtmlWebpack({
      template: path.resolve(maindir, 'public/index.html')
    }),
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV === 'production' || true
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
}