import type { Meta, StoryFn } from '@storybook/react';
import { AppAppBarCommon } from './AppAppBarCommon';
import { AppBarNavigation } from './AppBarNavigation';
import { AppBarActions } from './AppBarActions';
import { AppBarBrand } from './AppBarBrand';
import { AppBarMobileMenu } from './AppBarMobileMenu';

const meta: Meta<typeof AppAppBarCommon> = {
  component: AppAppBarCommon,
  title: 'Components/Common/AppAppBar',
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

export const AppAppBarCommonBasic: StoryFn = () => {
  return <AppAppBarCommon />;
};

export const AppAppBarCommonCustomNavigation: StoryFn = () => {
  const customItems = [
    { label: 'Home' },
    { label: 'About' },
    { label: 'Services' },
    { label: 'Contact' },
  ];

  return (
    <AppAppBarCommon
      brandProps={{
        navigationProps: {
          items: customItems,
          color: 'primary',
        },
      }}
    />
  );
};

export const AppAppBarCommonCustomActions: StoryFn = () => {
  return (
    <AppAppBarCommon
      actionsProps={{
        signInText: 'Login',
        signUpText: 'Register',
        onSignInClick: () => console.log('Sign in clicked'),
        onSignUpClick: () => console.log('Sign up clicked'),
      }}
    />
  );
};

export const AppAppBarCommonNoColorMode: StoryFn = () => {
  return (
    <AppAppBarCommon
      actionsProps={{
        showColorMode: false,
      }}
      mobileMenuProps={{
        showColorMode: false,
      }}
    />
  );
};

export const AppBarNavigationOnly: StoryFn = () => {
  const items = [
    { label: 'Products' },
    { label: 'Solutions' },
    { label: 'Resources' },
    { label: 'Support' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <AppBarNavigation items={items} color="primary" />
    </div>
  );
};

export const AppBarActionsOnly: StoryFn = () => {
  return (
    <div style={{ padding: '20px' }}>
      <AppBarActions
        signInText="Login"
        signUpText="Get Started"
        onSignInClick={() => alert('Login clicked')}
        onSignUpClick={() => alert('Get Started clicked')}
      />
    </div>
  );
};

export const AppBarBrandOnly: StoryFn = () => {
  return (
    <div style={{ padding: '20px' }}>
      <AppBarBrand />
    </div>
  );
};
