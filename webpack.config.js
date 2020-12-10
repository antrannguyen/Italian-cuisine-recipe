"use strict";

const webpack = require("webpack");
const { join, resolve } = require("path");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// import d from "./dist/js/bundle";

module.exports = {
	// entry: ["babel-polyfill", "./src/index.js"],
	entry: join(__dirname, "src", "index.js"),
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	devServer: {
		contentBase: "./dist",
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: resolve(__dirname, "./src", "index.html"),
			filename: "index.html",
		}),
	],
	plugins: [new HtmlWebpackPlugin()],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},
};
