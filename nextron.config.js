module.exports = {
    webpack: (defaultConfig) => {
        const config = Object.assign(defaultConfig, {
            entry: {
                background: './main/background.ts',
                preload: './main/preload.ts',
            },
        })

        // CopyWebpackPluginを使ってlicenses.jsonをappディレクトリにコピーする
        const CopyWebpackPlugin = require('copy-webpack-plugin')
        const path = require('path')

        config.plugins.push(
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.resolve(__dirname, 'licenses.json'),
                    to: path.resolve(__dirname, 'app/local-data/licenses.json'),
                }],
            }),
        )

        // CopyWebpackPluginを使ってfontsディレクトリをappディレクトリにコピーする
        config.plugins.push(
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.resolve(__dirname, 'resources/fonts/assistant'),
                    to: path.resolve(__dirname, 'app/local-data/fonts/assistant'),
                }],
            }),
        )

        /*
        // CopyWebpackPluginを使ってimagesディレクトリをappディレクトリにコピーする
        config.plugins.push(
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.resolve(__dirname, 'resources/images'),
                    to: path.resolve(__dirname, 'app/local-data/images'),
                }],
            }),
        )
        */

        return config
    }
}