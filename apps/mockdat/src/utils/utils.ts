export function toCSV(data: Array<Record<string, any>>): string {
  if (data.length === 0) return '';
  const header = Object.keys(data[0]).join(',');
  const rows = data.map((row) =>
    Object.keys(row)
      .map((key) => row[key])
      .join(',')
  );
  return [header, ...rows].join('\n');
}
