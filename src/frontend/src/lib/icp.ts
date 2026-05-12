export const ICP_E8S = 100_000_000n;
const MAX_ICP_E8S = 18_446_744_073_709_551_615n;

export function formatICPAmount(e8s: bigint): string {
  const whole = e8s / ICP_E8S;
  const frac = (e8s % ICP_E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}

export function parseICPToE8s(value: string): bigint | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^(?:\d+|\d+\.\d{0,8}|\.\d{1,8})$/.test(trimmed)) return null;

  const normalized = trimmed.startsWith(".") ? `0${trimmed}` : trimmed;
  const [wholePart, fracPart = ""] = normalized.split(".");
  const whole = BigInt(wholePart || "0");
  const frac = BigInt(`${fracPart}00000000`.slice(0, 8));
  const e8s = whole * ICP_E8S + frac;

  if (e8s <= 0n || e8s > MAX_ICP_E8S) {
    return null;
  }

  return e8s;
}
