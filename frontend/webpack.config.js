const { join } = require('path');
const path = require('path');
const HTMLWebPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/index.js',

	output: {
		path: join(__dirname, '/dist'),
		filename: 'bundle.js'
	},

	plugins: [
		new HTMLWebPlugin({
			template: './index.html'
		}),
        new MiniCssExtractPlugin()
	],

	module: {
		rules: [
			{
				test: /.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
			},
            {
                test: /.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
		]
	}
}
