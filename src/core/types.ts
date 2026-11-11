export interface IBullsCows {
  bulls: number;
  cows: number;
}

export interface GameSettings {
  readonly length: number;
  readonly base: number;
}

export interface AttemptEntry {
  readonly guess: string;
  readonly result: IBullsCows;
}

export interface GameState {
  readonly status: 'settings' | 'playing' | 'won';
  readonly settings: GameSettings | null;
  readonly secret: readonly string[];
  readonly history: readonly AttemptEntry[];
  readonly startedAt: number | null;
  readonly finishedAt: number | null;
}
