module.exports = (config) => {
    config.set({
        basePath: 'src',
        singleRun: true,
        frameworks: ['mocha'],
        reporters: ['dots'],
        browsers: ['Chrome'],
        mode: 'development',
        files: [
            'test/**/*.spec.js',
        ],
        preprocessors: {
            'test/**/*.spec.js': ['webpack'],
        },
        webpack: {
            resolve: {
                extensions: ['*', '.js', '.ts'],
                modules: ['node_modules', 'src'],
            },
        },
        webpackMiddleware: {
            stats: {
                color: true,
                chunkModules: false,
                modules: false,
            },
        },
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox'],
            },
        },
    });
    config.set({ browsers: ['Chrome_travis_ci'] });

};
