const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { join } = require('path');

// Determine which config file to copy based on Nx configuration
const nxConfig = process.env.NX_TASK_TARGET_CONFIGURATION;
let configFrom = join(__dirname, 'src/config.json');
if (nxConfig === 'test') {
  configFrom = join(__dirname, 'src/assets/config_test.json');
} else if (nxConfig === 'production') {
  configFrom = join(__dirname, 'src/assets/config_prod.json');
}

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/apps'),
  },
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      // Rely on project.json assets + fileReplacements for config.json
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.css'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    // Copy the correct environment config to dist/config.json
    new CopyWebpackPlugin({
      patterns: [
        { from: configFrom, to: 'config.json' },
        { from: join(__dirname, 'public/subapps'), to: 'subapps' },
      ],
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
  ],
};
