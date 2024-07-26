const webpack = require('webpack');
const { override, addWebpackPlugin } = require('customize-cra');
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
module.exports = override(
    // Enable source maps
    config => {
        config.devtool = 'source-map';
        return config;
    },

    // Add fallback settings
    config => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            crypto: require.resolve('crypto-browserify'),
            buffer: require.resolve('buffer/'),
            vm: require.resolve('vm-browserify'),
            stream: require.resolve('stream-browserify'),
        };
        return config;
    },

    // Add SourceMapDevToolPlugin for better source map handling
    addWebpackPlugin(
        new SourceMapDevToolPlugin({
            filename: '[file].map', // Generate source maps with filenames like [name].js.map
            exclude: ['/vendor/*.js'], // Exclude vendor files from source map generation if needed
        })
    )
);
