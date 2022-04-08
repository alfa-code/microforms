const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          { loader: "babel-loader" },
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: '@alfa-bank/corp-ao-microforms',
    globalObject: 'this',
  },
  externals: {
    "react": "react",
    "formik": "formik"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "./README.md", to: "./README.md" },
        { from: "./package.json", to: "./package.json" },
      ],
    }),
  ],
};
