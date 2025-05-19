import express from 'express';
import cors from 'cors';
import serverlessExpress from '@codegenie/serverless-express';
import rootRoutes from './routes/root.routes';
import apiRoutes from './routes/api.routes';
import mockdatRoutes from './routes/mockdat.routes';

const prefix = process.env.LOCAL_SERVER ? '/services' : '';

// Create Express app
const app = express();

// Add CORS middleware
app.use(cors());

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use(`${prefix}/`, rootRoutes);
app.use(`${prefix}/api`, apiRoutes);
app.use(`${prefix}/mockdat`, mockdatRoutes);

// Export the handler function for AWS Lambda
export const handler = serverlessExpress({ app });

// Local development server
if (process.env.LOCAL_SERVER === 'true') {
  const port = process.env.PORT || 3333;
  // Bright yellow color and rocketship emoji
  const brightYellow = '\x1b[1m\x1b[33m';
  const reset = '\x1b[0m';
  app.listen(port, () => {
    console.log(
      `${brightYellow}🚀 Local development server is running at http://localhost:${port}${reset}`
    );
  });
}
