import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@cb-common/ui-react-mui';
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
        p: { xs: 2, md: 3 },
        bgcolor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        // color: 'text.primary',
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
          <Typography variant="h5" textAlign="center">
            👋 Meet Charles' Personal Portfolio Assistant
          </Typography>
          <Typography
            variant="body2"
            // color="text.secondary"
            sx={{ maxWidth: 420, textAlign: 'center' }}
          >
            Ask about Charles Brady&apos;s experience, request a project
            walkthrough, or get tailored talking points for your next
            conversation.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              'Experience recaps',
              'Project retrospectives',
              'Tech stack deep dives',
            ].map((item) => (
              <Typography
                key={item}
                variant="caption"
                color="text.secondary"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 999,
                  // bgcolor: 'action.hover',
                  // border: '1px solid',
                  // borderColor: 'divider',
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
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
                  // bgcolor: 'action.hover',
                  borderRadius: 2,
                }}
              >
                <Box
                  className="typing-dot"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    // bgcolor: 'text.secondary',
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
                    // bgcolor: 'text.secondary',
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
                    // bgcolor: 'text.secondary',
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
