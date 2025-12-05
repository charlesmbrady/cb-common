import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useApiLazy } from '@cb-common/ui-react-auth';
import {
  Collapse,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
  Alert,
} from '@cb-common/ui-react-mui';
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
  const [showIntro, setShowIntro] = useState(true);
  const [introManuallyToggled, setIntroManuallyToggled] = useState(false);
  const hasAutoCollapsed = useRef(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const promptSuggestions = useMemo(
    () => [
      {
        label: 'Experience overview',
        prompt:
          "Give me a concise narrative about Charles Brady's experience and specialties.",
      },
      {
        label: 'Project deep dive',
        prompt:
          "Walk me through one of Charles Brady's recent projects and key outcomes.",
      },
      {
        label: 'Tech stack focus',
        prompt:
          'What tools, frameworks, and AWS services does Charles Brady use most often?',
      },
      {
        label: 'Interview prep',
        prompt:
          "Help me craft talking points that highlight Charles Brady's strengths.",
      },
    ],
    []
  );

  useEffect(() => {
    if (messages.length > 0 && !hasAutoCollapsed.current) {
      setShowIntro(false);
      hasAutoCollapsed.current = true;
    }
  }, [messages.length]);

  // On mobile, default to a collapsed intro to preserve chat space
  useEffect(() => {
    if (isMobile && !introManuallyToggled) {
      setShowIntro(false);
    }
  }, [isMobile, introManuallyToggled]);

  // Use the new API hook for lazy fetching
  const {
    data: agentResponse,
    error: apiError,
    isLoading: loading,
    execute: invokeAgent,
  } = useApiLazy<AgentCoreResponse, InvokeAgentRequest>('/agentcore/invoke', {
    method: 'POST',
  });

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

  const handlePromptSelect = useCallback(
    (prompt: string) => {
      handleSendMessage(prompt);
    },
    [handleSendMessage]
  );

  const toggleIntro = useCallback(() => {
    setIntroManuallyToggled(true);
    setShowIntro((prev) => !prev);
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{
        height: { xs: 'auto', md: 'calc(100vh - 100px)' },
        minHeight: { xs: '100vh', md: 'auto' },
        py: { xs: 3, md: 4 },
        px: { xs: 0, md: 0 },
        position: 'relative',
        borderRadius: { xs: 0, md: 4 },
        // backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          height: { xs: 'auto', md: '100%' },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.5, md: 2 },
          px: { xs: 2, md: 0 },
          pb: { xs: 3, md: 0 },
        }}
      >
        {/* Hero / Header */}
        <Collapse in={showIntro} timeout={400} collapsedSize={0}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              // backgroundColor: theme.palette.background.paper,
              border: '1px solid',
              // borderColor: theme.palette.divider,
            }}
          >
            <Stack spacing={3}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                spacing={2.5}
              >
                <Box>
                  <Typography
                    variant="overline"
                    color="primary.main"
                    fontWeight={600}
                  >
                    Charles Brady · AI Portfolio Assistant
                  </Typography>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Ask about my work, career journey, or case studies
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    This assistant is tuned to my resume, projects, and delivery
                    style. Explore experience summaries, project retros, or get
                    a curated narrative for your next conversation.
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => {
                    setIntroManuallyToggled(true);
                    setShowIntro(false);
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Hide intro
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Collapse>

        {/* Topic Chips & Controls */}
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 3,
            border: '1px dashed',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                flexShrink: 0,
              }}
            >
              Jump into a topic:
            </Typography>
            <Box
              sx={{
                flex: 1,
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 1,
              }}
            >
              {promptSuggestions.map((item) => (
                <Chip
                  key={item.label}
                  label={item.label}
                  onClick={() => handlePromptSelect(item.prompt)}
                  disabled={loading}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    borderRadius: 999,
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
            <Button
              size="small"
              onClick={toggleIntro}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                alignSelf: 'flex-start',
                mt: 1,
              }}
            >
              {showIntro ? 'Hide intro section' : 'Show intro section'}
            </Button>
          </Box>
        </Paper>

        {messages.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={handleClearChat}
              disabled={loading}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Clear conversation
            </Button>
          </Box>
        )}

        {/* Error Alert */}
        {apiError && (
          <Alert title="Error" severity="error" sx={{ mb: 2 }}>
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
            borderRadius: 3,
            border: '1px solid',
            // borderColor: theme.palette.divider,
            // bgcolor: chatPanelBg,
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
