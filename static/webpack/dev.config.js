const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');

const currentPath = path.join(__dirname);
const basePath = currentPath + '/env/.env';
const envPath = basePath + '.' + 'development';
const finalPath = fs.existsSync(envPath) ? envPath : basePath;
const env = dotenv.config({ path: finalPath }).parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {

    mode: 'development',

    devtool: 'source-map',

    entry: [
        'webpack-hot-middleware/client',
        './src/index',
    ],

    output: {
        filename: 'bundle.js',
        publicPath: '/dist/',
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: 'css-loader',
                }],
            }, {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins() {
                            return [
                                require('precss'),
                                require('autoprefixer'),
                            ];
                        },
                    },
                }, {
                    loader: 'sass-loader',
                }],
            }, {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'less-loader',
                }],
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin(envKeys),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
};
