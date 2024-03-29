/*
 * @Author: your name
 * @Date: 2020-08-21 17:39:24
 * @LastEditTime: 2021-07-20 11:20:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-flow-component\webpack.config.js
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const base = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'cheap-module-source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      // ts-loader 用于加载解析 ts 文件
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      // 用于加载解析 less 文件
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader', },
          {
            loader: 'css-loader'
          },
          { loader: 'less-loader', },
        ]
      },
      {test:/\.(jpg|png|jpeg|gif)$/,loader:"url-loader"}
    ],
  },
  optimization: {
    minimize: true, // 开启代码压缩
  },
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
  }
};

let tempConfig = {};

if (process.env.NODE_ENV === 'production') {
  tempConfig = {
    ...base,
    entry: './src/index.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'laputarednerer',
      libraryTarget: 'umd',
    },
    devtool: 'none',
    externals: {
      'react': 'react',
      'react-dom': 'react-dom'
    },
    plugins: [
      new CleanWebpackPlugin(), // 编译之前清空 /dist
    ],
  };
} else {
  tempConfig = {
    ...base,
    entry: path.join(__dirname, 'example/src/index.tsx'),
    output: {
      path: path.join(__dirname, 'example/dist'),
      filename: 'bundle.js',
      library: 'laputarenderer',
      libraryTarget: 'umd',
    },
    plugins: [
      // 自动注入编译打包好的代码至 html
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './example/src/index.html'),
        filename: 'index.html',
      }),
    ],
    devServer: {
      // port: 8008,
    },
  }
}

module.exports = tempConfig;
