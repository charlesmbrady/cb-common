import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { nanoid } from 'nanoid';
import Snackbar from '../Snackbar/Snackbar';

type Snack = {
  id?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

type SnackbarContextType = {
  addSnack: (snack: Snack) => void;
};

type SnackbarProviderProps = { children: React.ReactNode };

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

function useSnackbarContext() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within an SnackbarProvider');
  }
  const addSnack = useCallback(
    (snack: Snack) => {
      context.addSnack({ ...snack, id: nanoid() });
    },
    [context]
  );

  return { addSnack };
}

function SnackbarProvider({ children }: SnackbarProviderProps): JSX.Element {
  const [snacks, setSnacks] = useState<Snack[]>([]);

  const addSnack = useCallback(
    (snack: Snack) => setSnacks((snacks) => [snack, ...snacks]),
    []
  );

  const value = useMemo(() => ({ addSnack }), [addSnack]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {snacks[0] && (
        <Snackbar
          open
          key={snacks[0].id}
          type={snacks[0].type}
          message={snacks[0].message}
        />
      )}
    </SnackbarContext.Provider>
  );
}

export { SnackbarProvider, useSnackbarContext };
