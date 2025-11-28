import React, { useState, useCallback } from 'react';
import { Box, Container, Typography, Paper, Alert } from '@mui/material';
import { useApiLazy } from '@cb-common/ui-react-auth';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Message } from './components/ChatMessage';

interface AgentCoreResponse {
  status: string;
  response: string;
  sessionId: string;
  actorId?: string;
  invocationMethod?: string;
}

interface InvokeAgentRequest {
  prompt: string;
  sessionId?: string;
}

// Helper to parse nested response
function parseResponse(apiResponse: AgentCoreResponse): {
  status: string;
  response: string;
  elapsed_sec?: number;
} {
  try {
    const parsed = JSON.parse(apiResponse.response);
    return parsed;
  } catch (error) {
    return {
      status: 'success',
      response: apiResponse.response,
    };
  }
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>();

  // Use the new API hook for lazy fetching
  const {
    data: agentResponse,
    error: apiError,
    isLoading: loading,
    execute: invokeAgent,
  } = useApiLazy<AgentCoreResponse, InvokeAgentRequest>(
    '/agentcore/invoke',
    { method: 'POST' }
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Call AgentCore API using the hook
        const response = await invokeAgent({
          body: {
            prompt: content,
            sessionId,
          },
        });

        // Parse the nested response
        const parsedResponse = parseResponse(response);

        // Update session ID from response
        if (response.sessionId) {
          setSessionId(response.sessionId);
        }

        // Add assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: parsedResponse.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        console.error('Error sending message:', err);
        // Error is already handled by the hook
      }
    },
    [sessionId, invokeAgent]
  );

  const handleClearChat = () => {
    setMessages([]);
    setSessionId(undefined);
  };

  return (
    <Container maxWidth="md" sx={{ height: 'calc(100vh - 100px)', py: 3 }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              AI Assistant Chat
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Powered by AWS Bedrock AgentCore
            </Typography>
          </Box>
          {messages.length > 0 && (
            <Typography
              variant="button"
              onClick={handleClearChat}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Clear Chat
            </Typography>
          )}
        </Paper>

        {/* Error Alert */}
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError.message}
          </Alert>
        )}

        {/* Chat Container */}
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          <ChatWindow messages={messages} loading={loading} />
          <ChatInput
            onSend={handleSendMessage}
            disabled={loading}
            loading={loading}
          />
        </Paper>

        {/* Session Info */}
        {sessionId && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, textAlign: 'center' }}
          >
            Session: {sessionId.substring(0, 20)}...
          </Typography>
        )}
      </Box>

      {/* Add keyframe animation for typing indicator */}
      <style>
        {`
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.7;
            }
            30% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
        `}
      </style>
    </Container>
  );
}
