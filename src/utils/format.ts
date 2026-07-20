export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

