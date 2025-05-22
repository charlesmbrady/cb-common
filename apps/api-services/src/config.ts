export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOCAL_SERVER: process.env.LOCAL_SERVER === 'true',
  PORT: process.env.PORT || 3333,
  ENVIRONMENT: process.env.ENVIRONMENT || 'Test',
  API_PREFIX: process.env.API_PREFIX || '',
};
