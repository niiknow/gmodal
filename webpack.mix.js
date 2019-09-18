const webpack = require('webpack');
const path    = require('path');
const mix     = require('laravel-mix');
const public  = mix.inProduction() ? 'lib' : 'lib';
const pkg     = require('./package.json');
const fs      = require('fs');

mix.setPublicPath(path.normalize(public));

const libraryName = pkg.name;
const banner  = `/*!
 * ${pkg.name}
 * ${pkg.description}\n
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @homepage ${pkg.homepage}
 * @repository ${pkg.repository.url}
 */\n`;

const fileName    = libraryName.toLowerCase() + (mix.inProduction() ? '.min.js' : '.js');

const config = {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)$/i,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader',
        options: {
          fix: false,
          cache: false,
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.tpl$/i,
        exclude: /(node_modules|bower_components)/,
        use: 'raw-loader'
      }
    ]
  },
  output: {
    path: path.resolve(public),
    filename: fileName,
    library: libraryName,
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  devServer: {
    overlay: true,
    inline: true,
    quiet: false
  },
  devtool: 'cheap-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'es6-promise'
    })
  ]
};

mix.webpackConfig(config).sourceMaps();
mix.js(`src/index.js`, `${ public }`);
mix.then(function () {
  const data   = fs.readFileSync(`${ public }/${ fileName }`);
  const fd     = fs.openSync(`${ public }/${ fileName }`, 'w+');
  const insert = new Buffer(banner);
  fs.writeSync(fd, insert, 0, insert.length, 0)
  fs.writeSync(fd, data, 0, data.length, insert.length)
  fs.close(fd, (err) => {
    if (err) throw err;
  });
});

if (mix.inProduction()) {
  mix.version();
  mix.disableNotifications();
} else {
  mix.browserSync({
    proxy: false,
    port: 3000,
    files: [
      'src/*',
      'example/*'
    ],
    browser: 'firefox',
    open: 'local',
    server: {
      baseDir: './lib/'
    }
  });
}

