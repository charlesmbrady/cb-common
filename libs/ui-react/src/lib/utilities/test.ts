export function generateTestDataAttr(fieldType: string, label?: string) {
  return `${fieldType} ${label || ''}`.replace(/\s/g, '-').toLowerCase();
}
