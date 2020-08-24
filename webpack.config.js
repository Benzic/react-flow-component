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
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[hash:base64:6]',
              },
            }
          },
          { loader: 'less-loader', },
        ]
      },

    ],
  },
  optimization: {
    minimize: true, // 开启代码压缩
  },
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // 我们想要避免把所有的React都放到一个文件里，因为会增加编译时间并且浏览器还能够缓存没有发生改变的库文件。
  // 理想情况下，我们只需要在浏览器里引入React模块，但是大部分浏览器还没有支持模块。
  // 因此大部分代码库会把自己包裹在一个单独的全局变量内，比如：jQuery或_。 这叫做“命名空间”模式，
  // webpack也允许我们继续使用通过这种方式写的代码库。
  // 通过我们的设置"react": "React"，webpack会神奇地将所有对"react"的导入转换成从React全局变量中加载
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
