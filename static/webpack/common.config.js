const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const merge = require('webpack-merge');
const webpack = require('webpack');

const development = require('./dev.config');
const stage = require('./stage.config');
const production = require('./prod.config');

require('@babel/polyfill');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, '../src'),
};

process.env.BABEL_ENV = TARGET;

process.traceDeprecation = true;

const common = {
    entry: [
        PATHS.app,
    ],

    resolve: {
        extensions: ['*', '.jsx', '.js', '.json', '.scss'],
        modules: ['node_modules', PATHS.app],
    },
    resolveLoader: {
        modules: ['node_modules', PATHS.app],
    },

    node: {
        fs: 'empty',
        net: 'empty',
        dgram: 'empty',
        child_process: false,
    },
    module: {
        // noParse: /node_modules\/signal-protocol\/src\/node_polyfills.js/,
        rules: [
          {
              test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
              loader: 'file-loader',
          }, {
              test: /\.js$/,
              loader: 'babel-loader',
              exclude: [/node_modules/],
              options: {
                  presets: ['@babel/preset-env'],
              },
          }, {
              test: /\.png$/,
              loader: 'file-loader?name=[name].[ext]',
          }, {
              test: /\.jpg$/,
              loader: 'file-loader?name=[name].[ext]',
          },
        ],
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                output: {
                    path: 'dist/',
                },
                postcss: [
                    autoprefixer({
                        browsers: ['last 2 versions'],
                    }),
                    postcssImport({
                        addDependencyTo: webpack,
                    }),
                ],
            },
        }),
    ],

    stats: {
        maxModules: Infinity,
        optimizationBailout: false,
    },
};

if (TARGET === 'dev') {
    module.exports = merge(development, common);
}

if (TARGET === 'stage') {
    module.exports = merge(stage, common);
}

if (TARGET === 'build' || !TARGET) {
    module.exports = merge(production, common);
}

if (TARGET === 'start' || !TARGET) {
    module.exports = merge(production, common);
}
