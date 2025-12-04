import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import type { Book } from '../index';
import { useResolvedColorScheme } from '../hooks/useResolvedColorScheme';

export function BookCard({
  book,
  saved,
  onToggleSave,
  showMeta = true,
}: {
  book: Book;
  saved: boolean;
  onToggleSave: (b: Book) => void;
  showMeta?: boolean;
}) {
  const isDark = useResolvedColorScheme() === 'dark';

  const cardBg = isDark ? 'rgba(5, 10, 20, 0.85)' : 'rgba(255,255,255,0.95)';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,25,40,0.12)';
  const chipBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,25,40,0.08)';
  const chipColor = isDark ? 'common.white' : 'text.primary';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        backgroundColor: cardBg,
        color: isDark ? 'common.white' : 'text.primary',
        border: `1px solid ${borderColor}`,
        boxShadow: isDark
          ? '0 10px 30px rgba(0,0,0,0.45)'
          : '0 12px 24px rgba(15,25,40,0.15)',
        backdropFilter: 'saturate(140%) blur(4px)',
      }}
    >
      {book.thumbnail && (
        <CardMedia
          component="img"
          image={book.thumbnail}
          alt={book.title}
          sx={{
            objectFit: 'cover',
            height: 160,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          gutterBottom
          noWrap
          sx={{ color: isDark ? 'common.white' : 'text.primary' }}
        >
          {book.title}
        </Typography>
        {book.authors && (
          <Typography
            variant="body2"
            gutterBottom
            noWrap
            sx={{
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(15,25,40,0.7)',
            }}
          >
            {book.authors.join(', ')}
          </Typography>
        )}
        {showMeta && book.categories && book.categories.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', my: 1 }}>
            {book.categories.slice(0, 3).map((c) => (
              <Chip
                size="small"
                key={c}
                label={c}
                sx={{
                  backgroundColor: chipBg,
                  color: chipColor,
                  border: `1px solid ${borderColor}`,
                }}
              />
            ))}
          </Stack>
        )}
        {showMeta && book.publishedDate && (
          <Typography
            variant="caption"
            sx={{
              color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(15,25,40,0.6)',
            }}
          >
            {book.publishedDate}
          </Typography>
        )}
      </CardContent>
      <CardActions
        sx={{
          justifyContent: 'space-between',
          pt: 0,
          mt: 'auto',
          color: isDark ? 'common.white' : 'text.secondary',
        }}
      >
        <Button
          size="small"
          href={book.infoLink || '#'}
          target="_blank"
          rel="noreferrer noopener"
          sx={{
            color: isDark ? 'primary.light' : 'primary.main',
          }}
        >
          Details
        </Button>
        <IconButton
          aria-label="save"
          onClick={() => onToggleSave(book)}
          sx={{ color: isDark ? 'common.white' : 'text.primary' }}
        >
          {saved ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
}
