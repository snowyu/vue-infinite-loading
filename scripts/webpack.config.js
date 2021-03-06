const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'vue-infinite-loading': './src/index.js'
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/',
    library: 'VueInfiniteLoading',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.min.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(vue|js)$/,
        enforce: 'pre',
        include: [path.join(__dirname, '../src'), path.join(__dirname, '../test')],
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-formatter-friendly')
        }
      },
      {
        test: /\.js$/,
        include: [path.join(__dirname, '../src'), path.join(__dirname, '../test')],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime'],
          env: {
            test: {
              presets: [['@babel/preset-env', { useBuiltIns: 'usage' }]],
              plugins: ['babel-plugin-istanbul']
            }
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')
              ]
            }
          },
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  mode: process.env.NODE_ENV || 'development'
};

if (process.env.NODE_ENV === 'production') {
  // production configurations
  const pkg = require('../package');
  const banner = [
    `${pkg.name} v${process.env.VERSION || pkg.version}`,
    `(c) 2016-${new Date().getFullYear()} ${pkg.author.name}`,
    `${pkg.license} License`
  ].join('\n');

  module.exports.plugins.push(new webpack.BannerPlugin(banner));
} else {
  // development configurations
  module.exports.plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './example/index.html',
    inject: false
  }));
}
