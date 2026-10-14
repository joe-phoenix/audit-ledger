/** Compact cedi amount: GH¢8.80bn, GH¢49.7m, GH¢837,931. */
export function ghs(n: number, digits = 2) {
  const a = Math.abs(n);
  // 999.6m would round to "1000m", so anything that rounds to a billion is shown in bn.
  if (a >= 9.995e8) return `GH¢${(n / 1e9).toFixed(digits)}bn`;
  if (a >= 1e6) return `GH¢${(n / 1e6).toFixed(a >= 1e8 ? 0 : 1)}m`;
  if (a >= 1e4) return `GH¢${(n / 1e3).toFixed(0)}k`;
  return `GH¢${Math.round(n).toLocaleString("en-GH")}`;
}
export const full = (n: number) => `GH¢${n.toLocaleString("en-GH", { maximumFractionDigits: 2 })}`;
export const pct = (n: number, d = 1) => `${n > 0 ? "+" : ""}${n.toFixed(d)}%`;
