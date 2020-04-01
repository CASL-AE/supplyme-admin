const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');

const currentPath = path.join(__dirname);
const basePath = currentPath + '/env/.env';
const envPath = basePath + '.' + 'production';
const finalPath = fs.existsSync(envPath) ? envPath : basePath;
const env = dotenv.config({ path: finalPath }).parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const PATHS = {
    build: path.join(__dirname, '../dist'),
};

module.exports = {

    mode: 'production',

    stats: {
        colors: false,
        hash: true,
        timings: true,
        assets: true,
        chunks: true,
        chunkModules: true,
        modules: true,
        children: true,
    },

    output: {
        path: PATHS.build,
        publicPath: 'dist/',
        filename: '[name].[hash].js',
    },

    entry: ['./src/index'],

    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: 'dist/',
                    },
                }, {
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
        // new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin(envKeys),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({
            title: 'caching',
            inject: true,
            template: './prod.html',
            filename: '../index.html',
        }),
        new webpack.HashedModuleIdsPlugin(),
        new CompressionPlugin(),
    ],
};
