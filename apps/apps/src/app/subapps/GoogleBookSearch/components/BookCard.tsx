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
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {book.thumbnail && (
        <CardMedia
          component="img"
          image={book.thumbnail}
          alt={book.title}
          sx={{ objectFit: 'cover', height: 200 }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom noWrap>
          {book.title}
        </Typography>
        {book.authors && (
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            noWrap
          >
            {book.authors.join(', ')}
          </Typography>
        )}
        {showMeta && book.categories && book.categories.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', my: 1 }}>
            {book.categories.slice(0, 3).map((c) => (
              <Chip size="small" key={c} label={c} />
            ))}
          </Stack>
        )}
        {showMeta && book.publishedDate && (
          <Typography variant="caption" color="text.secondary">
            {book.publishedDate}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          size="small"
          href={book.infoLink || '#'}
          target="_blank"
          rel="noreferrer noopener"
        >
          Details
        </Button>
        <IconButton aria-label="save" onClick={() => onToggleSave(book)}>
          {saved ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
}
