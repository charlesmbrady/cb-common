import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@cb-common/ui-react-mui';
import { Container, Tab, Tabs, Typography } from '@mui/material';
import { SearchBar } from './components/SearchBar';
import { BookGrid } from './components/BookGrid';
import { useResolvedColorScheme } from './hooks/useResolvedColorScheme';

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
  const isDark = useResolvedColorScheme() === 'dark';
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
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage:
          'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: { md: 'fixed' },
        py: { xs: 4, md: 6 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: 3,
          px: { xs: 3, md: 5 },
          borderRadius: 3,
          backgroundColor: isDark //TODO: why is dark/light mode built in not working?
            ? 'rgba(5,10,20,0.85)'
            : 'rgba(255,255,255,0.92)',
          boxShadow: isDark
            ? '0 20px 60px rgba(2,4,8,0.7)'
            : '0 20px 40px rgba(15,25,40,0.25)',
          border: isDark
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid rgba(15,25,40,0.08)',
          backdropFilter: 'blur(8px)',
          color: isDark ? 'rgba(255,255,255,0.92)' : 'text.primary',
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom color="inherit">
          Google Book Search
        </Typography>
        <Typography
          variant="body2"
          color={isDark ? 'rgba(255,255,255,0.75)' : 'text.secondary'}
          gutterBottom
        >
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
              <Typography color="text.secondary">
                No saved books yet.
              </Typography>
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
    </Box>
  );
}
