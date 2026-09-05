const base = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || "").replace(/\/$/, "");

export function assetUrl(path) {
  return `${base}${path}`;
}
