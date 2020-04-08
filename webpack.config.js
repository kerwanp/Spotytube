const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

const {NODE_ENV = 'production'} = process.env;

module.exports = {
    watch: NODE_ENV === 'development',
    mode: NODE_ENV,
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    target: 'node',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: /src/
            }
        ]
    },
    externals: [nodeExternals()],
    plugins: [
        new WebpackShellPlugin({
            onBuildEnd: ['npm run start:dev']
        })
    ]
};