import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@cb-common/auth';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

export default function Login() {
  const { isAuthenticated, loading, signIn, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Mockdat
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error.message}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => signIn()}
        size="large"
      >
        Sign In with Cognito
      </Button>
    </Box>
  );
}
