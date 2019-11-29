
var path = require('path')
var entryPath = path.resolve('.', 'demo.js')
var buildPath = path.resolve('..', 'docs')
var buildFilename = 'bundle.js'


module.exports = (env) => ({

    mode: (() => {
        return (env && env.production) ?
            'production' : 'development'
    })(),

    entry: entryPath,
    // resolve: {},
    // performance: {
    //     maxEntrypointSize: 1.5e6,
    //     maxAssetSize: 1.5e6,
    // },
    output: {
        path: buildPath,
        filename: buildFilename,
    },
    devServer: {
        hot: true,
        clientLogLevel: 'warning',
        contentBase: buildPath,
        inline: true,
        host: "0.0.0.0",
        stats: "minimal",
    },
})
