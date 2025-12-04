import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from '@cb-common/ui-react-mui';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { modernApps, throwbackApps } from '../data/appListData';
import { RouterButton } from './RouterButton';

export function AppsLandingPage() {
  return (
    <Box component="main">
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={5}>
          <HeroIntro />
          <ModernAppsList />
          <Divider sx={{ my: 2 }} />
          <ThrowbackIntro />
          <ThrowbackList />
        </Stack>
      </Container>
    </Box>
  );
}

function HeroIntro() {
  return (
    <Box>
      <Chip
        icon={<SportsEsportsRoundedIcon fontSize="small" />}
        label="Apps & experiments"
        size="small"
        variant="outlined"
        color="primary"
      />
      <Typography variant="h3" component="h1" sx={{ mt: 2, fontWeight: 700 }}>
        A growing list of playgrounds
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Quick links into the projects I demo the most. Everything lives inside{' '}
        <Link
          href="https://github.com/charlesmbrady"
          target="_blank"
          rel="noopener noreferrer"
        >
          this Nx monorepo
        </Link>
        , shares the same UI kit, and can be deployed with a single task.
      </Typography>
    </Box>
  );
}

function ModernAppsList() {
  return (
    <Stack component="ul" spacing={2} sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {modernApps.map(({ title, description, meta, badge, to, icon }) => (
        <Card
          key={title}
          component="li"
          sx={{ p: { xs: 3, md: 4 }, borderColor: 'divider' }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
          >
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {icon && (
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '50%',
                      backgroundColor: 'action.hover',
                      color: 'primary.main',
                      display: 'inline-flex',
                    }}
                  >
                    {icon}
                  </Box>
                )}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
                {badge && <Chip size="small" color="primary" label={badge} />}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {meta.map((label) => (
                  <Chip
                    key={`${title}-${label}`}
                    size="small"
                    variant="outlined"
                    label={label}
                  />
                ))}
              </Stack>
            </Stack>
            {to && (
              <RouterButton
                to={to}
                size="medium"
                variant="contained"
                endIcon={<ArrowOutwardRoundedIcon fontSize="small" />}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Open
              </RouterButton>
            )}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

function ThrowbackIntro() {
  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
        Vanilla throwbacks
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Some of my earliest in-browser experiments that mimic popular games or
        exercises—handy for showing fundamental web concepts—and still ship as
        static bundles.
      </Typography>
    </Box>
  );
}

function ThrowbackList() {
  return (
    <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {throwbackApps.map(({ title, description, meta, href }) => (
        <Card key={title} component="li" sx={{ p: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
          >
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {meta.map((label) => (
                  <Chip
                    key={`${title}-${label}`}
                    size="small"
                    label={label}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Stack>
            {href && (
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  display: 'inline-flex',
                }}
              >
                <Button
                  size="small"
                  endIcon={<ArrowOutwardRoundedIcon fontSize="small" />}
                  fullWidth
                >
                  View
                </Button>
              </Link>
            )}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
