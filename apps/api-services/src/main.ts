import express from 'express';
import serverlessExpress from '@codegenie/serverless-express';

// Create Express app
const app = express();

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Lambda!!' });
});

app.get('/api/info', (req, res) => {
  res.json({
    service: 'API Services',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Add more routes as needed
app.post('/api/data', (req, res) => {
  const data = req.body;
  console.log('Received data:', data);

  res.status(201).json({
    message: 'Data received successfully',
    data,
  });
});

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
