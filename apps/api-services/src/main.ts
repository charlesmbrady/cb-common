import express from 'express';
import serverlessExpress from '@codegenie/serverless-express';
import rootRoutes from './routes/root.routes';
import apiRoutes from './routes/api.routes';

// Create Express app
const app = express();

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/', rootRoutes);
app.use('/api', apiRoutes);

// Export the handler function for AWS Lambda
export const handler = serverlessExpress({ app });

// Local development server
if (process.env.LOCAL_SERVER === 'true') {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(
      `Local development server is running at http://localhost:${port}`
    );
  });
}
