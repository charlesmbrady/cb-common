// Array utility: returns elements in a not in b
export function not<T>(a: T[], b: T[]): T[] {
  return a.filter((value) => b.indexOf(value) === -1);
}

// Array utility: returns elements in both a and b
export function intersection<T>(a: T[], b: T[]): T[] {
  return a.filter((value) => b.indexOf(value) !== -1);
}
