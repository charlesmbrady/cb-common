const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  entry: './src/main.ts', // Your entry point for Lambda
  target: 'node', // Ensure Node.js environment compatibility
  output: {
    path: join(__dirname, '../../dist/apps/services-middleware'),
    filename: 'main.js', // Output file name
    libraryTarget: 'commonjs2', // Required for AWS Lambda
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve .ts and .js files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use Babel for transpiling
          options: {
            configFile: join(__dirname, '../../babel.config.json'), // Point to central config
          },
        },
      },
    ],
  },
  plugins: [
    new NxAppWebpackPlugin({
      main: './src/main.ts',

      tsConfig: './tsconfig.app.json',
      outputHashing: 'none', // Disable output hashing
      generatePackageJson: true, // Generate package.json
      assets: ['./src/assets'], // Include assets if necessary
    }),
  ],
  externals: {
    'aws-sdk': 'commonjs aws-sdk', // Avoid bundling AWS SDK
  },
  optimization: {
    minimize: false, // Easier debugging
  },
};
