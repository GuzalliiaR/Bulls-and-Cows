export interface BaseOption {
  readonly value: number;
  readonly label: string;
}

export const BASES: readonly BaseOption[] = [
  { value: 2, label: 'bin' },
  { value: 8, label: 'oct' },
  { value: 10, label: 'dec' },
  { value: 16, label: 'hex' },
];

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function baseLabel(base: number): string {
  return BASES.find((option) => option.value === base)?.label ?? String(base);
}
