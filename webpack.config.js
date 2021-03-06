const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// import d from "./js/"

module.exports = {
	entry: ["babel-polyfill", "./src/index.js"],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "js/bundle.js",
	},
	devServer: {
		contentBase: "./dist",
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "./index.html",
		}),
	],
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
