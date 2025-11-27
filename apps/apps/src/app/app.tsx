// // Uncomment this line to use CSS modules
// // import styles from './app.module.css';

// import * as React from 'react';
// import { styled, useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
// import { Appbar } from './layout/Appbar';
// import { MenuDrawer } from './layout/MenuDrawer';
// import { ControlPanelDrawer } from './layout/ControlPanelDrawer';
// import {
//   P5Experiment,
//   MatterExperiment,
//   CtxExperiment,
// } from '@cb-common/ui-packages-react-gamepad';
// import * as p5SketchTemplate from './experiments/templates/p5SketchTemplate';
// import * as p5GameTemplate from './experiments/templates/p5GameTemplate';
// import * as ctxSketchTemplate from './experiments/templates/ctxSketchTemplate';
// import * as ctxGameTemplate from './experiments/templates/ctxGameTemplate';
// import * as matterSketchTemplate from './experiments/templates/matterSketchTemplate';
// import * as matterGameTemplate from './experiments/templates/matterGameTemplate';
// import * as pongP5Template from './experiments/Pong/Pong';
// import { GamePadControlPanel } from './components/GamePadControlPanel';
// import {
//   GamepadProvider,
//   useGamepad,
// } from '@cb-common/ui-packages-react-gamepad';
// import * as zurvival from './experiments/Zurvival/zurvival';
// import Toolbar from '@mui/material/Toolbar';
// import { CameraProvider, useCamera } from './contexts/CameraContext';
// import * as dirt from './experiments/dirt/dirt';

// const drawerWidth = 240;

// const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
//   open?: boolean;
// }>(({ theme, open }) => ({
//   flexGrow: 1,
//   padding: theme.spacing(3),
//   transition: theme.transitions.create('margin', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   marginRight: -drawerWidth,
//   ...(open && {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginRight: 0,
//   }),
//   minHeight: '100vh',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

// // Top-level wrapper for zurvival experiment
// function ZurvivalExperimentWrapper() {
//   const gamepad = useGamepad(0);
//   const { followCam } = useCamera();
//   return (
//     <MatterExperiment
//       setup={zurvival.setup}
//       update={zurvival.update}
//       gamepad={gamepad}
//       followCam={followCam}
//       width={800}
//       height={600}
//     />
//   );
// }

// const experimentComponents = [
//   () => (
//     <MatterExperiment
//       setup={dirt.setup}
//       update={dirt.update}
//       width={800}
//       height={600}
//     />
//   ),
//   () => (
//     <P5Experiment setup={pongP5Template.setup} draw={pongP5Template.draw} />
//   ),
//   () => (
//     <P5Experiment setup={p5SketchTemplate.setup} draw={p5SketchTemplate.draw} />
//   ),
//   () => (
//     <P5Experiment setup={p5GameTemplate.setup} draw={p5GameTemplate.draw} />
//   ),
//   () => <CtxExperiment draw={ctxSketchTemplate.draw} />,
//   () => <CtxExperiment draw={ctxGameTemplate.draw} />,
//   () => (
//     <MatterExperiment
//       setup={matterSketchTemplate.setup}
//       update={matterSketchTemplate.update}
//     />
//   ),
//   () => (
//     <MatterExperiment
//       setup={matterGameTemplate.setup}
//       update={matterGameTemplate.update}
//     />
//   ),
//   () => <ZurvivalExperimentWrapper />,
// ];

// const experiments = [
//   { name: 'Dirtbike Simulator' },
//   { name: 'Pong' },
//   { name: 'p5.js Sketch Template' },
//   { name: 'p5.js Game Template' },
//   { name: 'Canvas 2D Sketch Template' },
//   { name: 'Canvas 2D Game Template' },
//   { name: 'Matter.js Sketch Template' },
//   { name: 'Matter.js Game Template' },
//   { name: 'Zurvival' },
// ];

// export default function App() {
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(false);
//   const [bottomOpen, setBottomOpen] = React.useState(true);
//   const [selected, setSelected] = React.useState(0);

//   const handleDrawerOpen = () => setOpen(true);
//   const handleDrawerClose = () => setOpen(false);
//   const handleBottomDrawerToggle = () => setBottomOpen((prev) => !prev);

//   return (
//     <CameraProvider>
//       <GamepadProvider>
//         <Box sx={{ display: 'flex' }}>
//           <CssBaseline />
//           <Appbar
//             open={open}
//             onMenuClick={handleDrawerOpen}
//             onBottomDrawerClick={handleBottomDrawerToggle}
//             bottomDrawerOpen={bottomOpen}
//             title="Labs Sketches"
//           />
//           <Main open={open}>
//             <Toolbar />
//             <Box
//               sx={{
//                 width: '100%',
//                 height: '100%',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 flex: 1,
//               }}
//             >
//               <Box
//                 sx={{
//                   width: '100%',
//                   maxWidth: 800,
//                   height: '100%',
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}
//               >
//                 <div key={selected} style={{ width: '100%', height: '100%' }}>
//                   {React.createElement(experimentComponents[selected])}
//                 </div>
//               </Box>
//             </Box>
//           </Main>
//           <MenuDrawer
//             open={open}
//             onClose={handleDrawerClose}
//             selected={selected}
//             onSelect={setSelected}
//             experiments={experiments}
//           />
//           <ControlPanelDrawer open={bottomOpen}>
//             <GamePadControlPanel />
//           </ControlPanelDrawer>
//         </Box>
//       </GamepadProvider>
//     </CameraProvider>
//   );
// }

// Uncomment this line to use CSS modules
// import styles from './app.module.css';
// import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Link, RouterLink } from '@cb-common/ui-react-mui';
import {
  AppConfigProvider,
  UserProvider,
  useAppConfig,
} from '@cb-common/ui-react-auth';
import GoogleBookSearchApp from './subapps/GoogleBookSearch';
import AIChat from './subapps/AIChat';
// ScrapeNSurf removed

import {
  AppTheme,
  AppAppBarCommon,
  AppBarNavigationItem,
  Box,
  FooterMinimal,
} from '@cb-common/ui-react-mui';

const navItems: AppBarNavigationItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Technologies', href: '/technologies' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
];

// const HomePage = lazy(() => import('./pages/HomePage'));
// const AboutPage = lazy(() => import('./pages/AboutPage'));
// const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
// const TechnologiesPage = lazy(() => import('./pages/TechnologiesPage'));
// const WorkPage = lazy(() => import('./pages/WorkPage'));
// const ContactPage = lazy(() => import('./pages/ContactPage'));

export default function App() {
  const { data: config, isLoading } = useAppConfig();
  if (!config) return null;

  return (
    <AppTheme>
      <UserProvider protectedRoutes={['/aichat']}>
        <AppAppBarCommon
          brandProps={{
            logo: (
              <Box
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1,
                  fontSize: '1.1rem',
                  ':hover': { cursor: 'pointer' },
                }}
                onClick={() => (window.location.href = '/')}
              >
                Charles Brady
              </Box>
            ),
            navigationProps: {
              items: navItems.map(({ label, href }) => ({ label, href })),
            },
          }}
          actionsProps={{
            signInText: 'GitHub',
            signUpText: 'Resume',
            onSignInClick: () =>
              window.open('https://github.com/charlesmbrady', '_blank'),
            onSignUpClick: () => window.open('/resume.pdf', '_blank'),
            showColorMode: true,
          }}
          mobileMenuProps={{
            navigationItems: navItems.map(({ label, href }) => ({
              label,
              href,
            })),
            signInText: 'GitHub',
            signUpText: 'Resume',
            onSignInClick: () =>
              window.open('https://github.com/charlesmbrady', '_blank'),
            onSignUpClick: () => window.open('/resume.pdf', '_blank'),
            showColorMode: true,
          }}
        />
        <Box sx={{ pt: { xs: 8, md: 12 }, minHeight: '100vh' }}>
          <Routes>
            <Route
              path="/googlebooksearch/*"
              element={<GoogleBookSearchApp />}
            />
            <Route path="/aichat" element={<AIChat />} />
            <Route
              path="/"
              element={
                <Box sx={{ px: 2, py: 3 }}>
                  <Box sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>
                    Apps
                  </Box>
                  <Box>
                    <RouterLink to="/aichat">AI Assistant Chat</RouterLink>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <RouterLink to="/googlebooksearch">
                      Google Book Search
                    </RouterLink>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/GifTastic/index.html">
                      GifTastic (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/ThePsychicGame/index.html">
                      The Psychic Game (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/TriviaGame/index.html">
                      Trivia Game (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/WordGuessGame/index.html">
                      Word Guess Game (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/StarWarsGame/index.html">
                      Star Wars RPG (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/FormValidator/index.html">
                      Form Validator (vanilla)
                    </a>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <a href="/subapps/MovieSeatBooking/index.html">
                      Movie Seat Booking (vanilla)
                    </a>
                  </Box>
                </Box>
              }
            />
          </Routes>
          <FooterMinimal
            brand={
              <Box sx={{ fontWeight: 700, letterSpacing: 1, fontSize: '1rem' }}>
                Charles Brady
              </Box>
            }
            // socialLinksProps={{
            //   links: socialLinks,
            // }}
          />
        </Box>
      </UserProvider>
    </AppTheme>
  );
}
