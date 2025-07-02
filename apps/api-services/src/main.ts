/* -------------------------------------------------------------------------- */
/*                                  IMPORTS                                   */
/* -------------------------------------------------------------------------- */
import express from 'express';
import cors from 'cors';
import serverlessExpress from '@codegenie/serverless-express';
import apiRoutes from './routes/api.routes';
import mockdatRoutes from './routes/mockdat.routes';
import { config } from './config';
const { API_PREFIX, LOCAL_SERVER, PORT } = config;

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                  // APP INIT //                            */
/* -------------------------------------------------------------------------- */
const app = express();

/* ------------------------- Configure middleware ------------------------- */
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------------- // Register Routes ------------------------- */
app.use(`${API_PREFIX}/api`, apiRoutes);
app.use(`${API_PREFIX}/mockdat`, mockdatRoutes);

/* ------------------------- Export the handler function for AWS Lambda ------------------------- */
export const handler = serverlessExpress({ app });

/* -------------------------------------------------------------------------- */
/*                          // Local Development Server //                    */
/* -------------------------------------------------------------------------- */
if (LOCAL_SERVER) {
  /* ------------------------- Bright yellow color and rocketship emoji ------------------------- */
  const brightYellow = '\x1b[1m\x1b[33m';
  const reset = '\x1b[0m';

  /* ------------------------- // Start the server ------------------------- */
  app.listen(PORT, () => {
    console.log(
      `${brightYellow}🚀 Local development server is running at http://localhost:${PORT}${reset}`
    );
  });
}
