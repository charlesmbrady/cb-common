import * as React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  InputLabel,
} from '../../../../core';

export type FooterNewsletterProps = {
  title?: string;
  description?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  buttonText?: string;
  onSubscribe?: (email: string) => void;
};

export function FooterNewsletter({
  title = 'Join the newsletter',
  description = 'Subscribe for weekly updates. No spams ever!',
  emailLabel = 'Email',
  emailPlaceholder = 'Your email address',
  buttonText = 'Subscribe',
  onSubscribe,
}: FooterNewsletterProps) {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubscribe && email) {
      onSubscribe(email);
      setEmail('');
    }
  };

  return (
    <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
      <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {description}
      </Typography>
      <form onSubmit={handleSubmit}>
        <InputLabel htmlFor="email-newsletter">{emailLabel}</InputLabel>
        <Stack direction="row" spacing={1} useFlexGap>
          <TextField
            id="email-newsletter"
            hiddenLabel
            size="small"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Enter your email address"
            placeholder={emailPlaceholder}
            slotProps={{
              htmlInput: {
                autoComplete: 'off',
                'aria-label': 'Enter your email address',
              },
            }}
            sx={{ width: '250px' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            sx={{ flexShrink: 0 }}
          >
            {buttonText}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
