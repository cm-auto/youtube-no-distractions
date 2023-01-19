const { readFileSync } = require('fs');
const path = require('path');
const webpack = require('webpack');

function readBanner() {
  return readFileSync("src/banner.js").toString()
}

const bannerPlugin = new webpack.BannerPlugin({ banner: readBanner, raw: true });

module.exports = {
  entry: ['./src/main.ts'],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'youtube-no-distractions.user.js',
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    bannerPlugin,
  ],
};