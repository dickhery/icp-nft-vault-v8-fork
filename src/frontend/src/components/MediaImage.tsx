import { resolveImageUrl, resolveMetadataImageUrl } from "@/lib/media";
import type { ImgHTMLAttributes, ReactNode, SyntheticEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface MediaImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src?: string | null;
  alt: string;
  assetCanisterId?: string | null;
  tokenId?: string | null;
  preferThumbnail?: boolean;
  fallback?: ReactNode;
}

export function MediaImage({
  src,
  alt,
  assetCanisterId,
  tokenId,
  preferThumbnail,
  fallback = null,
  onError,
  ...props
}: MediaImageProps) {
  const mediaContext = useMemo(
    () => ({
      canisterId: assetCanisterId,
      tokenId,
      preferThumbnail,
    }),
    [assetCanisterId, tokenId, preferThumbnail],
  );
  const [currentSrc, setCurrentSrc] = useState(() =>
    resolveImageUrl(src, mediaContext),
  );
  const [failed, setFailed] = useState(
    () => !resolveImageUrl(src, mediaContext),
  );
  const triedMetadata = useRef(false);

  useEffect(() => {
    const initialSrc = resolveImageUrl(src, mediaContext);
    triedMetadata.current = false;
    setCurrentSrc(initialSrc);
    setFailed(!initialSrc);
  }, [src, mediaContext]);

  function handleError(event: SyntheticEvent<HTMLImageElement, Event>) {
    onError?.(event);

    if (triedMetadata.current) {
      setFailed(true);
      return;
    }

    triedMetadata.current = true;
    void resolveMetadataImageUrl(src, undefined, mediaContext)
      .then((metadataSrc) => {
        if (metadataSrc && metadataSrc !== currentSrc) {
          setCurrentSrc(metadataSrc);
          setFailed(false);
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        setFailed(true);
      });
  }

  if (!currentSrc || failed) return <>{fallback}</>;

  return <img {...props} src={currentSrc} alt={alt} onError={handleError} />;
}
