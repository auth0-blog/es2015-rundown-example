module.exports = {
    entry: "./app.js",
    output: {
        path: __dirname,
        filename: "app.bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'stage-3']
            }
        }]
    }
};
