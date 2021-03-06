'use strict';
var path = require('path');

module.exports = {
	entry: {
		renderer: './renderer.js',
	},
	output: {
		filename: path.join(__dirname, '[name]-build.js')
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.vue$/,
				loader: 'vue'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
		]
	},
	babel: {
		presets: ['es2015'],
		plugins: ['transform-runtime']
	}
};
