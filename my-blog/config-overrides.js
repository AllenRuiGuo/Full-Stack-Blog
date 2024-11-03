const { override } = require('customize-cra');
const webpack = require('webpack');

module.exports = override((config) => {
  // Fallbacks for process and buffer
    config.resolve.fallback = {
    process: require.resolve('process/browser'),
    buffer: require.resolve('buffer/'),
};

  // Provide process and Buffer globally
    config.plugins.push(
    new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
    })
);

    return config;
});
