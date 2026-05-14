import { j as jsxRuntimeExports, m as motion, B as Button, a as cn, r as reactExports } from "./index-C71bI6gW.js";
import { r as resolveImageUrl, a as resolveMetadataImageUrl } from "./media-BUtul1vm.js";
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  "data-ocid": dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className
      ),
      "data-ocid": dataOcid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-8 h-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-lg", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: description })
        ] }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: action.onClick,
            className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth mt-2",
            "data-ocid": action["data-ocid"],
            children: action.label
          }
        )
      ]
    }
  );
}
function MediaImage({
  src,
  alt,
  assetCanisterId,
  tokenId,
  preferThumbnail,
  fallback = null,
  onError,
  ...props
}) {
  const mediaContext = reactExports.useMemo(
    () => ({
      canisterId: assetCanisterId,
      tokenId,
      preferThumbnail
    }),
    [assetCanisterId, tokenId, preferThumbnail]
  );
  const [currentSrc, setCurrentSrc] = reactExports.useState(
    () => resolveImageUrl(src, mediaContext)
  );
  const [failed, setFailed] = reactExports.useState(
    () => !resolveImageUrl(src, mediaContext)
  );
  const triedMetadata = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const initialSrc = resolveImageUrl(src, mediaContext);
    triedMetadata.current = false;
    setCurrentSrc(initialSrc);
    setFailed(!initialSrc);
  }, [src, mediaContext]);
  function handleError(event) {
    onError == null ? void 0 : onError(event);
    if (triedMetadata.current) {
      setFailed(true);
      return;
    }
    triedMetadata.current = true;
    void resolveMetadataImageUrl(src, void 0, mediaContext).then((metadataSrc) => {
      if (metadataSrc && metadataSrc !== currentSrc) {
        setCurrentSrc(metadataSrc);
        setFailed(false);
      } else {
        setFailed(true);
      }
    }).catch(() => {
      setFailed(true);
    });
  }
  if (!currentSrc || failed) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: fallback });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { ...props, src: currentSrc, alt, onError: handleError });
}
export {
  EmptyState as E,
  MediaImage as M
};
