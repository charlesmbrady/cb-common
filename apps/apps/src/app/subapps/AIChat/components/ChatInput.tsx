import React, { useState } from 'react';
import { Box, TextField, CircularProgress } from '@cb-common/ui-react-mui';
import { IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  loading = false,
}) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'flex-end',
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        // bgcolor: 'background.paper',
        backdropFilter: 'blur(8px)',
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask about my background, project results, or tech stack..."
        disabled={disabled}
        variant="outlined"
        size="small"
        // sx={{
        //   '& .MuiOutlinedInput-root': {
        //     borderRadius: 3,
        //     backgroundColor: 'background.default',
        //     color: 'text.primary',
        //     '& fieldset': {
        //       borderColor: 'divider',
        //     },
        //     '&:hover fieldset': {
        //       borderColor: 'primary.main',
        //     },
        //     '&.Mui-focused fieldset': {
        //       borderColor: 'primary.main',
        //     },
        //   },
        // }}
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={disabled || !input.trim() || loading}
        // sx={{
        //   bgcolor: 'primary.main',
        //   color: 'white',
        //   '&:hover': {
        //     bgcolor: 'primary.dark',
        //   },
        //   '&.Mui-disabled': {
        //     bgcolor: 'action.disabledBackground',
        //   },
        // }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : <Send />}
      </IconButton>
    </Box>
  );
};
