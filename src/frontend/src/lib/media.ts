const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
const ARWEAVE_GATEWAY = "https://arweave.net/";
const IC_RAW_DOMAIN = "raw.icp0.io";

interface MediaContext {
  canisterId?: string | null;
  tokenId?: string | null;
  preferThumbnail?: boolean;
}

const IMAGE_FIELDS = [
  "image",
  "image_url",
  "imageUrl",
  "icrc7:image",
  "icrc7:image_url",
  "icrc7:logo",
  "logo",
  "thumbnail",
  "thumb",
  "media",
  "artifact_uri",
  "asset",
  "url",
  "location",
  "preview",
  "display",
  "animation_url",
  "metadata",
  "metadata_url",
  "token_uri",
  "uri",
];

export function resolveImageUrl(
  value?: string | null,
  context?: MediaContext,
): string | undefined {
  const url = value?.trim();
  if (!url) return undefined;

  const metadataImageUrl = extractImageUrlFromMetadata(url);
  if (metadataImageUrl && metadataImageUrl !== url) {
    return resolveImageUrl(metadataImageUrl, context);
  }

  if (url.startsWith("ipfs://ipfs/")) {
    return `${IPFS_GATEWAY}${url.slice("ipfs://ipfs/".length)}`;
  }
  if (url.startsWith("ipfs://")) {
    return `${IPFS_GATEWAY}${url.slice("ipfs://".length)}`;
  }
  if (url.startsWith("ar://")) {
    return `${ARWEAVE_GATEWAY}${url.slice("ar://".length)}`;
  }
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  if (isRelativeICAssetReference(url, context)) {
    return resolveICAssetUrl(url, context);
  }

  return url;
}

export async function resolveMetadataImageUrl(
  value?: string | null,
  signal?: AbortSignal,
  context?: MediaContext,
): Promise<string | undefined> {
  const inline = extractImageUrlFromMetadata(value);
  if (inline) return resolveImageUrl(inline, context);

  const metadataUrl = resolveImageUrl(value, context);
  if (!metadataUrl) return undefined;

  const response = await fetch(metadataUrl, { credentials: "omit", signal });
  if (!response.ok) return undefined;

  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();
  if (
    !contentType.includes("json") &&
    !contentType.startsWith("text/") &&
    !looksLikeJson(body)
  ) {
    return undefined;
  }

  return resolveImageUrl(extractImageUrlFromMetadata(body), context);
}

export function extractImageUrlFromMetadata(
  value?: string | null,
): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const jsonText = decodeMetadataText(trimmed);
  if (!jsonText || !looksLikeJson(jsonText)) return undefined;

  try {
    return imageFromMetadata(JSON.parse(jsonText));
  } catch {
    return undefined;
  }
}

function decodeMetadataText(value: string): string | undefined {
  if (value.startsWith("data:application/json;base64,")) {
    try {
      return atob(value.slice("data:application/json;base64,".length));
    } catch {
      return undefined;
    }
  }

  if (value.startsWith("data:application/json,")) {
    try {
      return decodeURIComponent(value.slice("data:application/json,".length));
    } catch {
      return value.slice("data:application/json,".length);
    }
  }

  return value;
}

function looksLikeJson(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

function imageFromMetadata(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = imageFromMetadata(item);
      if (found) return found;
    }
    return undefined;
  }

  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  for (const field of IMAGE_FIELDS) {
    const found = stringValue(record[field]);
    if (found) return found;
  }

  for (const field of ["properties", "metadata", "attributes"]) {
    const found = imageFromMetadata(record[field]);
    if (found) return found;
  }

  return undefined;
}

function stringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return stringValue(record.Text ?? record.text ?? record.value);
  }

  return undefined;
}

function isRelativeICAssetReference(
  url: string,
  context?: MediaContext,
): boolean {
  if (!context?.canisterId) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//")) return false;
  if (url.startsWith("data:")) return false;
  return !looksLikeJson(url);
}

function resolveICAssetUrl(url: string, context?: MediaContext): string {
  const canisterId = context?.canisterId?.trim();
  if (!canisterId) return url;

  const base = `https://${canisterId}.${IC_RAW_DOMAIN}`;
  if (url.startsWith("/")) return `${base}${url}`;

  const tokenId = context?.tokenId?.trim();
  if (!tokenId) return `${base}/${encodeURIComponent(url)}`;

  const tokenQuery = /^\d+$/.test(tokenId)
    ? `index=${encodeURIComponent(tokenId)}`
    : `tokenid=${encodeURIComponent(tokenId)}`;
  const wantsThumbnail =
    context?.preferThumbnail !== false || /thumb|thumbnail/i.test(url);

  return `${base}/?${wantsThumbnail ? "type=thumbnail&" : ""}${tokenQuery}`;
}
