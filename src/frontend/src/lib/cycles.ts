const LOW_CYCLES_PATTERNS = [
  "ic0532",
  "insufficient cycles",
  "cannot grow memory",
  "out of cycles",
  "needs more cycles",
];

export function isLowCyclesError(message: string): boolean {
  const normalized = message.toLowerCase();
  return LOW_CYCLES_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function canisterIdFromError(message: string): string | null {
  const match = message.match(/Canister ([a-z0-9-]+):/i);
  return match?.[1] ?? null;
}
