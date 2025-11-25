import React from 'react';
import { Button, Stack, TextField } from '@mui/material';

export function SearchBar({
  query,
  onQueryChange,
  onSearch,
  loading,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onSearch: () => void;
  loading?: boolean;
}) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField
        fullWidth
        label="Search Books"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch();
        }}
      />
      <Button variant="contained" onClick={onSearch} disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </Button>
    </Stack>
  );
}
