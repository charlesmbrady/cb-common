import React from 'react';
import { Box } from '@cb-common/ui-react-mui';
import type { SxProps, Theme } from '@mui/material/styles';

interface GlassPanelProps {
  children: React.ReactNode;
  /** Draw thin gold corner brackets (top-left + bottom-right). */
  corners?: boolean;
  sx?: SxProps<Theme>;
}

const bracket = (theme: Theme) => ({
  content: '""',
  position: 'absolute',
  width: 26,
  height: 26,
  borderColor: theme.vars
    ? `rgba(${theme.vars.palette.primary.mainChannel} / 0.65)`
    : theme.palette.primary.main,
  borderStyle: 'solid',
  pointerEvents: 'none',
});

/**
 * Frosted glass surface with a hairline border and an inner top highlight.
 * With `corners`, adds thin gold corner brackets on opposing corners —
 * used sparingly to frame the most important panels.
 */
export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  corners = false,
  sx,
}) => (
  <Box
    sx={[
      (theme: Theme) => ({
        position: 'relative',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.background.paperChannel} / 0.55)`
          : theme.palette.background.paper,
        backdropFilter: 'blur(18px) saturate(1.4)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 18px 40px -24px rgba(0, 0, 0, 0.5)',
        ...(corners && {
          '&::before': {
            ...bracket(theme),
            top: -1,
            left: -1,
            borderWidth: '1px 0 0 1px',
            borderTopLeftRadius: 12,
          },
          '&::after': {
            ...bracket(theme),
            bottom: -1,
            right: -1,
            borderWidth: '0 1px 1px 0',
            borderBottomRightRadius: 12,
          },
        }),
      }),
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {children}
  </Box>
);
