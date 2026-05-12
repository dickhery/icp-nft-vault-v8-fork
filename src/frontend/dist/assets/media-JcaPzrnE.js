import { c as createLucideIcon } from "./index-DngK8SgJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }],
  ["path", { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83", key: "1bzlo9" }],
  ["line", { x1: "13.5", x2: "6", y1: "13.5", y2: "21", key: "1q0aeu" }],
  ["line", { x1: "18", x2: "21", y1: "12", y2: "15", key: "5mozeu" }],
  [
    "path",
    {
      d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",
      key: "mmje98"
    }
  ],
  ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9", key: "43el77" }]
];
const ImageOff = createLucideIcon("image-off", __iconNode);
const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
const ARWEAVE_GATEWAY = "https://arweave.net/";
const IC_RAW_DOMAIN = "raw.icp0.io";
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
  "uri"
];
function resolveImageUrl(value, context) {
  const url = value == null ? void 0 : value.trim();
  if (!url) return void 0;
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
async function resolveMetadataImageUrl(value, signal, context) {
  const inline = extractImageUrlFromMetadata(value);
  if (inline) return resolveImageUrl(inline, context);
  const metadataUrl = resolveImageUrl(value, context);
  if (!metadataUrl) return void 0;
  const response = await fetch(metadataUrl, { credentials: "omit", signal });
  if (!response.ok) return void 0;
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();
  if (!contentType.includes("json") && !contentType.startsWith("text/") && !looksLikeJson(body)) {
    return void 0;
  }
  return resolveImageUrl(extractImageUrlFromMetadata(body), context);
}
function extractImageUrlFromMetadata(value) {
  const trimmed = value == null ? void 0 : value.trim();
  if (!trimmed) return void 0;
  const jsonText = decodeMetadataText(trimmed);
  if (!jsonText || !looksLikeJson(jsonText)) return void 0;
  try {
    return imageFromMetadata(JSON.parse(jsonText));
  } catch {
    return void 0;
  }
}
function decodeMetadataText(value) {
  if (value.startsWith("data:application/json;base64,")) {
    try {
      return atob(value.slice("data:application/json;base64,".length));
    } catch {
      return void 0;
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
function looksLikeJson(value) {
  const trimmed = value.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}
function imageFromMetadata(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = imageFromMetadata(item);
      if (found) return found;
    }
    return void 0;
  }
  if (!value || typeof value !== "object") return void 0;
  const record = value;
  for (const field of IMAGE_FIELDS) {
    const found = stringValue(record[field]);
    if (found) return found;
  }
  for (const field of ["properties", "metadata", "attributes"]) {
    const found = imageFromMetadata(record[field]);
    if (found) return found;
  }
  return void 0;
}
function stringValue(value) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object") {
    const record = value;
    return stringValue(record.Text ?? record.text ?? record.value);
  }
  return void 0;
}
function isRelativeICAssetReference(url, context) {
  if (!(context == null ? void 0 : context.canisterId)) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//")) return false;
  if (url.startsWith("data:")) return false;
  return !looksLikeJson(url);
}
function resolveICAssetUrl(url, context) {
  var _a, _b;
  const canisterId = (_a = context == null ? void 0 : context.canisterId) == null ? void 0 : _a.trim();
  if (!canisterId) return url;
  const base = `https://${canisterId}.${IC_RAW_DOMAIN}`;
  if (url.startsWith("/")) return `${base}${url}`;
  const tokenId = (_b = context == null ? void 0 : context.tokenId) == null ? void 0 : _b.trim();
  if (!tokenId) return `${base}/${encodeURIComponent(url)}`;
  const tokenQuery = /^\d+$/.test(tokenId) ? `index=${encodeURIComponent(tokenId)}` : `tokenid=${encodeURIComponent(tokenId)}`;
  const wantsThumbnail = (context == null ? void 0 : context.preferThumbnail) !== false || /thumb|thumbnail/i.test(url);
  return `${base}/?${wantsThumbnail ? "type=thumbnail&" : ""}${tokenQuery}`;
}
export {
  ImageOff as I,
  resolveMetadataImageUrl as a,
  resolveImageUrl as r
};
