const STORAGE_KEY = 'bulls-and-cows:records';
const TOP_LIMIT = 10;

export interface RecordEntry {
  readonly length: number;
  readonly base: number;
  readonly attempts: number;
  readonly durationMs: number;
  readonly achievedAt: number;
}

// Если isRecordEntry вернет true, то считай, что аргумент value имеет тип RecordEntry
function isRecordEntry(value: unknown): value is RecordEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Partial<RecordEntry>;

  return (
    typeof entry.length === 'number' &&
    typeof entry.base === 'number' &&
    typeof entry.attempts === 'number' &&
    typeof entry.durationMs === 'number' &&
    typeof entry.achievedAt === 'number'
  );
}

/** Меньше попыток — лучше; при равенстве — меньше времени. */
function compareRecords(a: RecordEntry, b: RecordEntry): number {
  if (a.attempts !== b.attempts) return a.attempts - b.attempts;
  return a.durationMs - b.durationMs;
}

export function loadRecords(): readonly RecordEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isRecordEntry)
      .sort(compareRecords)
      .slice(0, TOP_LIMIT);
  } catch {
    // данные повреждены
    return [];
  }
}

export function saveRecord(entry: RecordEntry): readonly RecordEntry[] {
  const updated = [...loadRecords(), entry]
    .sort(compareRecords)
    .slice(0, TOP_LIMIT);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export function clearRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}
