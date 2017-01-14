var webpack = require('webpack');
var  BrowserSyncPlugin  =  require('browser-sync-webpack-plugin'); 

module.exports = {
    entry: {
        './test-web/test.js': "./test-web/test.ts",
    },
    output: {
        path: './',
        filename: "[name]"
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [{
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    },
    plugins: [new  BrowserSyncPlugin({  
            host:   'localhost',
                  port:  3011,
                  server:  { 
                baseDir:  ['./test-web/'] 
            }    
        })
        // // Uglify
        // , new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     mangle: false,
        //     test: /\.(js|jsx)$/
        // })
    ]

}