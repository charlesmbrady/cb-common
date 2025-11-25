import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@cb-common/ui-react-mui';
import { Container, Tab, Tabs, Typography } from '@mui/material';
import { SearchBar } from './components/SearchBar';
import { BookGrid } from './components/BookGrid';

// Types for Google Books API
interface GoogleBookApiItem {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    infoLink?: string;
    publishedDate?: string;
    categories?: string[];
  };
}

export type Book = {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  thumbnail?: string;
  infoLink?: string;
  publishedDate?: string;
  categories?: string[];
};

const toBook = (item: GoogleBookApiItem): Book => {
  const v = item.volumeInfo || {};
  return {
    id: item.id,
    title: v.title || 'Untitled',
    authors: v.authors,
    description: v.description,
    thumbnail: v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail,
    infoLink: v.infoLink,
    publishedDate: v.publishedDate,
    categories: v.categories,
  };
};

const STORAGE_KEY = 'googlebooksearch.savedBooks';

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export default function GoogleBookSearchApp() {
  const [tab, setTab] = useState(0); // 0 = Search, 1 = Saved
  const [query, setQuery] = useState('harry potter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Book[]>([]);
  const [saved, setSaved] = useLocalStorage<Book[]>(STORAGE_KEY, []);

  const savedIds = useMemo(() => new Set(saved.map((b) => b.id)), [saved]);

  const performSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const items: GoogleBookApiItem[] = data.items || [];
      setResults(items.map(toBook));
    } catch (e: any) {
      setError(e?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial search
    performSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSave = (book: Book) => {
    setSaved((prev) => {
      const exists = prev.find((b) => b.id === book.id);
      if (exists) return prev.filter((b) => b.id !== book.id);
      return [book, ...prev];
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Google Book Search
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Client-only version. Saved items persist to localStorage.
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="views">
          <Tab label="Search" />
          <Tab label={`Saved (${saved.length})`} />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box sx={{ mt: 3 }}>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={() => performSearch(query)}
            loading={loading}
          />

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <BookGrid
            books={results}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            showMeta
          />
        </Box>
      )}

      {tab === 1 && (
        <Box sx={{ mt: 3 }}>
          {saved.length === 0 ? (
            <Typography color="text.secondary">No saved books yet.</Typography>
          ) : (
            <BookGrid
              books={saved}
              savedIds={savedIds}
              onToggleSave={toggleSave}
            />
          )}
        </Box>
      )}
    </Container>
  );
}
