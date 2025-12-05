import React from 'react';
import { Box, Paper, Typography, Avatar } from '@cb-common/ui-react-mui';
import { Person, SmartToy } from '@mui/icons-material';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        gap: 1,
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            // bgcolor: 'primary.light',
            // color: 'primary.contrastText',
            width: 36,
            height: 36,
          }}
        >
          <SmartToy fontSize="small" />
        </Avatar>
      )}

      <Paper
        elevation={1}
        sx={{
          maxWidth: '70%',
          px: 2,
          py: 1.5,
          // bgcolor: isUser ? 'primary.main' : 'background.default',
          // color: isUser ? 'primary.contrastText' : 'text.primary',
          // borderRadius: 2,
          // border: '1px solid',
          // borderColor: 'divider',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            // color: 'text.secondary',
            display: 'block',
            mt: 0.5,
            fontSize: '0.7rem',
          }}
        >
          {message.timestamp.toLocaleTimeString()}
        </Typography>
      </Paper>

      {isUser && (
        <Avatar
          sx={{
            // bgcolor: 'secondary.light',
            // color: 'secondary.contrastText',
            width: 36,
            height: 36,
          }}
        >
          <Person fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
};
