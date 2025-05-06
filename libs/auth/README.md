# Auth Library

A shared authentication library for CB Common applications using AWS Cognito with OpenID Connect (OIDC).

## Technologies Used

- [react-oidc-context](https://github.com/authts/react-oidc-context) - React context and hooks for OpenID Connect
- [oidc-client-ts](https://github.com/authts/oidc-client-ts) - TypeScript OIDC client library
- AWS Cognito - Identity provider

## Features

- OIDC-based authentication with AWS Cognito
- Protected route HOC
- Authentication context with user state management
- Automatic redirect to login for protected routes
- TypeScript support

## Usage

### 1. Configure Cognito

Set up your AWS Cognito User Pool with OIDC configuration:

```typescript
// apps/your-app/src/config/auth.ts
import { CognitoAuthConfig } from '@cb-common/auth';

export const cognitoConfig: CognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  response_type: 'code',
  scope: 'email openid profile',
  logout_uri: process.env.NEXT_PUBLIC_LOGOUT_URI,
};
```

### 2. Add AuthProvider to your app

```typescript
// apps/your-app/src/pages/_app.tsx
import { AuthProvider } from '@cb-common/auth';
import { cognitoConfig } from '../config/auth';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider config={cognitoConfig}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

### 3. Protect Routes

```typescript
// apps/your-app/src/pages/protected-page.tsx
import { withAuth } from '@cb-common/auth';

function ProtectedPage() {
  return <div>Protected Content</div>;
}

export default withAuth(ProtectedPage);
```

### 4. Use Auth Context

```typescript
import { useAuth } from '@cb-common/auth';

function MyComponent() {
  const { isAuthenticated, user, signIn, signOut } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.profile.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={signIn}>Sign In</button>
      )}
    </div>
  );
}
```

## Environment Variables

Required environment variables for your application:

```env
NEXT_PUBLIC_COGNITO_DOMAIN=https://your-cognito-domain.auth.region.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_LOGOUT_URI=http://localhost:3000
```

## API Reference

### AuthProvider Props

```typescript
interface AuthProviderProps {
  config: CognitoAuthConfig;
  children: React.ReactNode;
}
```

### useAuth Hook

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: Error | null;
}
```

### withAuth HOC

Higher-order component to protect routes. Redirects to login page if user is not authenticated.

```typescript
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P>;
```
