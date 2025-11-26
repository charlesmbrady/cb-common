import React from 'react';
import { Box } from '@cb-common/ui-react-mui';
import { BookCard } from './BookCard';
import type { Book } from '../index';

export function BookGrid({
  books,
  savedIds,
  onToggleSave,
  showMeta,
}: {
  books: Book[];
  savedIds: Set<string>;
  onToggleSave: (b: Book) => void;
  showMeta?: boolean;
}) {
  return (
    <Box
      sx={{
        mt: 1,
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {books.map((b) => (
        <Box key={b.id}>
          <BookCard
            book={b}
            saved={savedIds.has(b.id)}
            onToggleSave={onToggleSave}
            showMeta={showMeta}
          />
        </Box>
      ))}
    </Box>
  );
}
