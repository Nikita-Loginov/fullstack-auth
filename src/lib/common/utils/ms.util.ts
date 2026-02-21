type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd';

const UNIT_TO_MS: Record<TimeUnit, number> = {
  ms: 1,
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
};

export const ms = {
  parse(value: string): number {
    const match = /^(\d+)\s*(ms|s|m|h|d)$/.exec(value);

    if (!match) {
      throw new Error(`Invalid time value: ${value}`);
    }

    const amount = Number(match[1]);
    const unit = match[2] as TimeUnit;

    return amount * UNIT_TO_MS[unit];
  },

  format(value: number): string {
    if (value < 0) {
      throw new Error('Time value must be positive');
    }

    for (const unit of ['d', 'h', 'm', 's', 'ms'] as TimeUnit[]) {
      const unitMs = UNIT_TO_MS[unit];

      if (value >= unitMs && value % unitMs === 0) {
        return `${value / unitMs}${unit}`;
      }
    }

    return `${value}ms`;
  },

  seconds: (v: number) => v * 1000,
  minutes: (v: number) => v * 60 * 1000,
  hours: (v: number) => v * 60 * 60 * 1000,
  days: (v: number) => v * 24 * 60 * 60 * 1000,
};
