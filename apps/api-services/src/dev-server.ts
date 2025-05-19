/**
 * Development server for local testing of the Lambda Express API
 *
 * Run with: NODE_ENV=development LOCAL_SERVER=true npx ts-node dev-server.ts
 */

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.LOCAL_SERVER = 'true';
// process.env.PORT = '3333';

console.log('Starting dev server with environment:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`LOCAL_SERVER: ${process.env.LOCAL_SERVER}`);

// Import the main app which will start a server when these environment variables are set
import './main';

console.log('Dev server initialized. Press Ctrl+C to stop.');
