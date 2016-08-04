'use strict';
var path = require('path');

module.exports = {
	entry: './renderer.js',
	output: {
		filename: 'renderer-bundle.js'
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: [
					path.join(__dirname, 'renderer.js')
				],
				loader: 'babel-loader'
			}
		]
	}
};
//
