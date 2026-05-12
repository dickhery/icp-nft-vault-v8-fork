import { j as jsxRuntimeExports, a as cn } from "./index-DngK8SgJ.js";
import { r as resolveImageUrl } from "./media-JcaPzrnE.js";
function getStandardLabel(standard) {
  if (standard.__kind__ === "EXT") return "EXT";
  if (standard.__kind__ === "DIP721") return "DIP-721";
  if (standard.__kind__ === "ICRC7") return "ICRC-7";
  return standard.Other ?? "Unknown";
}
function CollectionBadge({
  collection,
  size = "md",
  className
}) {
  const standardLabel = getStandardLabel(collection.standard);
  const imageUrl = resolveImageUrl(collection.imageUrl);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1.5 min-w-0", className), children: [
    imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: imageUrl,
        alt: collection.name,
        className: cn(
          "rounded-full object-cover shrink-0 border border-border/60",
          size === "sm" ? "w-4 h-4" : "w-5 h-5"
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "font-medium truncate text-muted-foreground",
          size === "sm" ? "text-xs" : "text-sm"
        ),
        children: collection.name
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "shrink-0 px-1.5 py-0.5 rounded font-mono bg-muted/60 text-muted-foreground border border-border/40",
          size === "sm" ? "text-[10px]" : "text-xs"
        ),
        children: standardLabel
      }
    )
  ] });
}
const ICP_DECIMALS = 100000000n;
function formatICP(e8s) {
  const whole = e8s / ICP_DECIMALS;
  const frac = e8s % ICP_DECIMALS;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}
function PriceDisplay({
  e8s,
  size = "md",
  label,
  className
}) {
  const formatted = formatICP(e8s);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col gap-0.5", className), children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "text-muted-foreground uppercase tracking-wider font-medium",
          size === "sm" ? "text-[10px]" : "text-xs"
        ),
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: cn(
          "bid-typography",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-2xl"
        ),
        children: [
          formatted,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-accent/70 font-mono font-semibold text-[0.75em]", children: "ICP" })
        ]
      }
    )
  ] });
}
export {
  CollectionBadge as C,
  PriceDisplay as P
};
