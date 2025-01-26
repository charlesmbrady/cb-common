export const handler = async (event: any) => {
  console.log('Hello World I am here');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World response' }),
  };
};
