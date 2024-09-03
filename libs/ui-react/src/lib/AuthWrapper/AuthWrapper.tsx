import { useEffect, useState } from 'react';

import { UserRole } from '@cb-common/data';

import { Box } from '../Box/Box';
import { useAppConfig } from '../contexts/AppConfigContext';
import { useUser } from '../contexts/UserContext';
import AuthDialog from './AuthDialog';

export function AuthWrapper(props: { children: JSX.Element | JSX.Element[] }) {
  const appConfig = useAppConfig();
  const [user] = useUser();

  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  useEffect(() => {
    if (user?.data?.roles && !hasAuthorizedRole(user.data.roles)) {
      setOpenAuthDialog(true);
    } else {
      setShouldRenderChildren(true);
    }

    function hasAuthorizedRole(roles: UserRole[]) {
      return appConfig.data?.authorizedRoles.some((authorizedRole) => roles.includes(authorizedRole));
    }
  }, [user, appConfig]);

  return (
    <Box sx={{ height: '100%' }}>
      <AuthDialog open={openAuthDialog} />
      {shouldRenderChildren && props.children}
    </Box>
  );
}

export default AuthWrapper;
