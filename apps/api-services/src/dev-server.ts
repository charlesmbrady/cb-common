import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * Development server for local testing of the Lambda Express API
 */

import { config } from './config';

console.log('Starting dev server with environment:');
console.log(`NODE_ENV: ${config.NODE_ENV}`);
console.log(`LOCAL_SERVER: ${config.LOCAL_SERVER}`);
console.log(`PORT: ${config.PORT}`);
console.log(`ENVIRONMENT: ${config.ENVIRONMENT}`);
console.log(`API_PREFIX: ${config.API_PREFIX}`);

// Import the main app which will start a server when these environment variables are set
import './main';

console.log('Dev server initialized. Press Ctrl+C to stop.');
