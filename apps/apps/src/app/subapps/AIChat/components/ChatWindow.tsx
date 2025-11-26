import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { ChatMessage, Message } from './ChatMessage';

interface ChatWindowProps {
  messages: Message[];
  loading?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  loading = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        bgcolor: 'grey.50',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h5" color="text.secondary">
            👋 Welcome to AI Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask me anything to get started!
          </Typography>
        </Box>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Box
                  className="typing-dot"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'text.secondary',
                    animation: 'typing 1.4s infinite',
                    animationDelay: '0s',
                  }}
                />
                <Box
                  className="typing-dot"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'text.secondary',
                    animation: 'typing 1.4s infinite',
                    animationDelay: '0.2s',
                  }}
                />
                <Box
                  className="typing-dot"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'text.secondary',
                    animation: 'typing 1.4s infinite',
                    animationDelay: '0.4s',
                  }}
                />
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </Paper>
  );
};
