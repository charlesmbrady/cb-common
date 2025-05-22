import express from 'express';
import cors from 'cors';
import serverlessExpress from '@codegenie/serverless-express';
import apiRoutes from './routes/api.routes';
import mockdatRoutes from './routes/mockdat.routes';
import { config } from './config';
const { API_PREFIX, LOCAL_SERVER, PORT } = config;

// Create Express app
const app = express();

// Add CORS middleware
app.use(cors());

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use(`${API_PREFIX}/api`, apiRoutes);
app.use(`${API_PREFIX}/mockdat`, mockdatRoutes);

// Export the handler function for AWS Lambda
export const handler = serverlessExpress({ app });

// Local development server
if (LOCAL_SERVER) {
  // Bright yellow color and rocketship emoji
  const brightYellow = '\x1b[1m\x1b[33m';
  const reset = '\x1b[0m';
  app.listen(PORT, () => {
    console.log(
      `${brightYellow}🚀 Local development server is running at http://localhost:${PORT}${reset}`
    );
  });
}
