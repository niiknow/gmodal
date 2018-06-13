/*global __dirname, require, module*/

const webpack = require( 'webpack' );
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require( 'path' );
const env = require( 'yargs' ).argv.env; // use --env with webpack 2
const pkg = require( './package.json' );

let libraryName = pkg.name;
let plugins = [],
  outputFile;

let banner = [
  ` ${pkg.name}.js - v${pkg.version}`,
  ` build: ${new Date()}`,
  ` ${pkg.description}`
].join( '\n' );

plugins.push( new webpack.BannerPlugin( banner ) );

if ( env === 'build' ) {
  plugins.push( new UglifyJsPlugin( {
    minimize: true,
    sourceMap: true
  } ) );
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

const config = {
  entry: [ __dirname + '/src/index.js' ],
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      },
      {
        test: /(\.html|\.css)$/,
        use: 'raw-loader'
      }
    ]
  },
  resolve: {
    modules: [ path.resolve( './src' ), 'node_modules' ],
    extensions: [ '.json', '.js' ]
  },
  plugins: plugins,
  target: 'web'
};

module.exports = config;
