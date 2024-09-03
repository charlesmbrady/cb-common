import { Navigate, Route, Routes } from 'react-router-dom';

import {
  AppBar,
  AppConfigProvider,
  Box,
  Container,
  NavItem,
  SnackbarProvider,
  UserProvider,
  useAppConfig,
} from '@cb-common/ui-react';

function SimAppBar() {
  const appConfig = useAppConfig();
  const contactUrl = appConfig.data?.contactUrl || '';

  const NAV_ITEMS: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Contact', path: contactUrl },
  ].filter((navItem) => navItem.path);

  return <AppBar navItems={NAV_ITEMS} />;
}

export function App(): JSX.Element {
  return (
    <AppConfigProvider>
      <UserProvider>
        <SnackbarProvider>
          <SimAppBar />
          {/* Top Padding here should match the height of the appbar so no content gets hidden behind it */}
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Container sx={{ flex: 1 }} maxWidth="xl">
              <Routes>
                {/* <Route path="/" element={<SubmissionsList />} /> */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Container>
          </Box>
        </SnackbarProvider>
      </UserProvider>
    </AppConfigProvider>
  );
}

export default App;
