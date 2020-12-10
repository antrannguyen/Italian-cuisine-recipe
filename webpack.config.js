const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
<<<<<<< HEAD

module.exports = {
	entry: ["babel-polyfill", "./docs/js/index.js"],
=======
// import d from "./js/"

module.exports = {
	entry: ["babel-polyfill", "./src/index.js"],
>>>>>>> 33c8f436cf4b92e3a9849a82b2342d694b8ef81c
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
<<<<<<< HEAD
			template: "./src/index.html",
=======
			template: "./index.html",
>>>>>>> 33c8f436cf4b92e3a9849a82b2342d694b8ef81c
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
