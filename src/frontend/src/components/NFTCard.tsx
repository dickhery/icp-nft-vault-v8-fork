import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Collection, WalletNFT } from "@/types";
import { ImageOff } from "lucide-react";
import { motion } from "motion/react";
import { CollectionBadge } from "./CollectionBadge";
import { MediaImage } from "./MediaImage";
import { PriceDisplay } from "./PriceDisplay";

interface NFTCardProps {
  nft: WalletNFT;
  collection?: Collection;
  listingPrice?: bigint;
  dividendE8s?: bigint;
  isAuction?: boolean;
  isListed?: boolean;
  onClick?: () => void;
  index?: number;
  "data-ocid"?: string;
}

export function NFTCard({
  nft,
  collection,
  listingPrice,
  dividendE8s,
  isAuction,
  isListed = false,
  onClick,
  index = 0,
  "data-ocid": dataOcid,
}: NFTCardProps) {
  const name = nft.metadata.name ?? `NFT #${nft.tokenId}`;
  const description = nft.metadata.description;
  const locationLabel = isListed
    ? "Listed"
    : nft.location === "Registered"
      ? "Registered"
      : nft.location === "Vaulted"
        ? "Vaulted"
        : "Minted";
  const locationClass = isListed
    ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
    : nft.location === "Registered"
      ? "bg-muted/80 text-muted-foreground border-border/60"
      : nft.location === "Vaulted"
        ? "bg-primary/10 text-primary border-primary/20"
        : "bg-accent/10 text-accent border-accent/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer transition-smooth",
        "hover:nft-card-glow-hover hover:border-accent/40",
      )}
      onClick={onClick}
      data-ocid={dataOcid}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted relative">
        <MediaImage
          src={nft.metadata.imageUrl}
          alt={name}
          assetCanisterId={collection?.canisterId.toString()}
          tokenId={nft.tokenId}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-10 h-10 text-muted-foreground/40" />
            </div>
          }
        />
        {isAuction && (
          <Badge className="absolute top-2 right-2 bg-accent/90 text-accent-foreground text-xs font-mono">
            AUCTION
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm text-foreground truncate">
            {name}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {description}
            </p>
          )}
        </div>

        {collection && <CollectionBadge collection={collection} size="sm" />}

        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className={cn("text-[10px] border", locationClass)}
          >
            {locationLabel}
          </Badge>
          {dividendE8s !== undefined && dividendE8s > 0n && (
            <Badge className="text-[10px] border bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
              {formatCompactICP(dividendE8s)} ICP
            </Badge>
          )}
        </div>

        {listingPrice !== undefined && (
          <div className="pt-1 border-t border-border/60">
            <PriceDisplay
              e8s={listingPrice}
              size="sm"
              label={isAuction ? "Current bid" : "Price"}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

const E8S = 100_000_000n;

function formatCompactICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  const trimmed = frac.replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}
