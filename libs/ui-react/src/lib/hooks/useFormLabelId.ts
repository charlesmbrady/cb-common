import { useMemo } from 'react';

// ensure stable ids
export default function useFormLabelId(id?: string, prefix?: string) {
  const stableId = useMemo(
    () => (id ? id : `${prefix}${Math.floor(Math.random() * 1000000)}`),
    [id, prefix]
  );

  return {
    id: stableId,
    labelId: `${stableId}-label`,
    helperTextId: `${stableId}-helper-text`,
  };
}
