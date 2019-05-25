const path = require('path'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	MiniCssExtractPlugin = require("mini-css-extract-plugin"),
	CleanWebpackPlugin = require("clean-webpack-plugin");

function resolve(dir) {
	return path.join(__dirname, '..', dir);
}
module.exports = {
	entry: './src/index.js',
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist')
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'zhufengpeixun',
					chunks: 'all'
				}
			}
		}
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			include: [resolve('src')],
			exclude: [resolve('node_modules')]
		}, {
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader'
			]
		}, {
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 100000,
				name: "[name].[hash:4].[ext]",
				outputPath: "./image"
			}
		}]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			hash: true,
			template: './src/index.html',
			filename: 'index.html'
		}),
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css",
			chunkFilename: "[name].[contenthash].css"
		})
	]
};