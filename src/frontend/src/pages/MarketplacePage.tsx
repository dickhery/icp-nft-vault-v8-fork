import { CollectionBadge } from "@/components/CollectionBadge";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MediaImage } from "@/components/MediaImage";
import { PaymentConfirmationDialog } from "@/components/PaymentConfirmationDialog";
import { PriceDisplay } from "@/components/PriceDisplay";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { formatICPAmount, parseICPToE8s } from "@/lib/icp";
import type {
  ActiveListing,
  ActiveListingDetail,
  AuctionListing,
  Collection,
  FixedListing,
  ListingId,
  WalletNFT,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  Coins,
  Gavel,
  ImageOff,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseICP(val: string): bigint | null {
  return parseICPToE8s(val);
}

function truncatePrincipal(p: string): string {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}…${p.slice(-6)}`;
}

function nftKey(collectionId: bigint, tokenId: string): string {
  return `${collectionId.toString()}:${tokenId}`;
}

const DEFAULT_ICP_LEDGER_FEE_E8S = 10_000n;
const DEFAULT_MINTLAB_FEE_BPS = 200n;
const BPS_DENOMINATOR = 10_000n;

function marketplaceFee(amount: bigint, feeBps: bigint): bigint {
  return (amount * feeBps) / BPS_DENOMINATOR;
}

function useCountdown(endTimeNs: bigint) {
  const [remaining, setRemaining] = useState<number>(() => {
    const endMs = Number(endTimeNs / 1_000_000n);
    return Math.max(0, endMs - Date.now());
  });

  useEffect(() => {
    const endMs = Number(endTimeNs / 1_000_000n);
    const tick = () => setRemaining(Math.max(0, endMs - Date.now()));
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, [endTimeNs]);

  return remaining;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Ended";
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) return `${d}d ${h}h remaining`;
  if (h > 0) return `${h}h ${m}m remaining`;
  return `${m}m ${s}s remaining`;
}

function NFTImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/60">
      <ImageOff className="w-8 h-8 text-muted-foreground/40" />
      <span className="text-xs text-muted-foreground/60 text-center px-2 truncate max-w-full">
        {name}
      </span>
    </div>
  );
}

// ─── Fixed Listing Card ───────────────────────────────────────────────────────

interface FixedCardProps {
  listing: FixedListing;
  nft: WalletNFT | undefined;
  collection?: Collection;
  dividendE8s?: bigint;
  index: number;
  currentPrincipal: string | null;
  onBuy: (id: ListingId) => void;
  onCancel: (id: ListingId) => void;
  onDetails: () => void;
  isBuying: boolean;
  isCancelling: boolean;
}

function FixedListingCard({
  listing,
  nft,
  collection,
  dividendE8s = 0n,
  index,
  currentPrincipal,
  onBuy,
  onCancel,
  onDetails,
  isBuying,
  isCancelling,
}: FixedCardProps) {
  const name = nft?.metadata.name ?? `NFT #${nft?.tokenId ?? "?"}`;
  const sellerText = listing.seller.toString();
  const isOwner = currentPrincipal === sellerText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:nft-card-glow-hover hover:border-accent/40 transition-smooth cursor-pointer"
      onClick={onDetails}
      data-ocid={`marketplace.fixed.item.${index + 1}`}
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        <MediaImage
          src={nft?.metadata.imageUrl}
          alt={name}
          assetCanisterId={collection?.canisterId.toString()}
          tokenId={nft?.tokenId}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
          fallback={<NFTImagePlaceholder name={name} />}
        />
        <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-mono uppercase">
          Fixed
        </Badge>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm text-foreground truncate">
            {name}
          </p>
          <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
            {truncatePrincipal(sellerText)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 font-mono">
            Token #{nft?.tokenId ?? "?"}
          </p>
        </div>

        {collection && <CollectionBadge collection={collection} size="sm" />}
        {dividendE8s > 0n && (
          <Badge className="w-fit bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px]">
            {formatICPAmount(dividendE8s)} ICP dividends
          </Badge>
        )}

        <div className="mt-auto pt-2 border-t border-border/60 flex items-end justify-between gap-2">
          <PriceDisplay e8s={listing.price} size="sm" label="Price" />
          {isOwner ? (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/40 hover:bg-destructive/10 transition-smooth shrink-0"
              onClick={(event) => {
                event.stopPropagation();
                onCancel(listing.id);
              }}
              disabled={isCancelling}
              data-ocid={`marketplace.fixed.cancel_button.${index + 1}`}
            >
              {isCancelling ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </>
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth shrink-0 font-semibold"
              onClick={(event) => {
                event.stopPropagation();
                onBuy(listing.id);
              }}
              disabled={isBuying}
              data-ocid={`marketplace.fixed.buy_button.${index + 1}`}
            >
              {isBuying ? <LoadingSpinner size="sm" /> : "Buy Now"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface ListingDetailModalProps {
  detail: {
    listing: ActiveListing;
    nft: WalletNFT;
    collection?: Collection;
    dividendE8s: bigint;
  } | null;
  currentPrincipal: string | null;
  onClose: () => void;
  onBuy: (id: ListingId) => void;
  onCancel: (id: ListingId) => void;
  onBid: (listing: AuctionListing) => void;
}

function ListingDetailModal({
  detail,
  currentPrincipal,
  onClose,
  onBuy,
  onCancel,
  onBid,
}: ListingDetailModalProps) {
  if (!detail) return null;

  const { listing, nft, collection, dividendE8s } = detail;
  const name = nft.metadata.name ?? `NFT #${nft.tokenId}`;
  const canisterId = collection?.canisterId.toString();
  const fixed = listing.__kind__ === "Fixed" ? listing.Fixed : null;
  const auction = listing.__kind__ === "Auction" ? listing.Auction : null;
  const seller = fixed?.seller ?? auction?.seller;
  const isOwner = seller != null && currentPrincipal === seller.toString();
  const auctionRemaining = auction
    ? formatRemaining(
        Math.max(0, Number(auction.endTime / 1_000_000n) - Date.now()),
      )
    : "";

  return (
    <Dialog open={!!detail} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-3xl p-0 overflow-hidden max-h-[88vh]"
        data-ocid="marketplace.nft_detail.dialog"
      >
        <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]">
          <div className="bg-muted min-h-[260px] md:min-h-0 md:h-full flex items-center justify-center p-3">
            <MediaImage
              src={nft.metadata.imageUrl}
              alt={name}
              assetCanisterId={collection?.canisterId.toString()}
              tokenId={nft.tokenId}
              className="max-h-[72vh] w-full h-full object-contain rounded-lg"
              fallback={<NFTImagePlaceholder name={name} />}
            />
          </div>

          <div className="p-5 space-y-4 overflow-y-auto max-h-[88vh]">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={
                    fixed
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-accent/10 text-accent border border-accent/20"
                  }
                >
                  {fixed ? "Fixed Price" : "Auction"}
                </Badge>
                {collection && (
                  <CollectionBadge collection={collection} size="sm" />
                )}
                {dividendE8s > 0n && (
                  <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                    <Coins className="w-3 h-3 mr-1" />
                    {formatICPAmount(dividendE8s)} ICP
                  </Badge>
                )}
              </div>
              <DialogTitle className="font-display text-xl text-foreground">
                {name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-mono">
                Token #{nft.tokenId}
              </p>
            </DialogHeader>

            {nft.metadata.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {nft.metadata.description}
              </p>
            )}

            <div className="grid grid-cols-1 gap-2">
              <div className="rounded-lg border border-border/50 bg-muted/35 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Seller
                </p>
                <p className="font-mono text-sm text-foreground truncate mt-0.5">
                  {seller?.toString() ?? "Unknown"}
                </p>
              </div>
              {canisterId && (
                <div className="rounded-lg border border-border/50 bg-muted/35 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Collection Canister
                  </p>
                  <p className="font-mono text-sm text-foreground truncate mt-0.5">
                    {canisterId}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/25 p-3 flex items-center justify-between gap-3">
              {fixed ? (
                <PriceDisplay e8s={fixed.price} label="Price" />
              ) : auction ? (
                <PriceDisplay
                  e8s={
                    auction.highestBid > 0n
                      ? auction.highestBid
                      : auction.startingBid
                  }
                  label={auction.highestBid > 0n ? "Top bid" : "Starting bid"}
                />
              ) : null}
              {auction && (
                <span className="text-xs text-muted-foreground font-mono">
                  {auctionRemaining}
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              {fixed &&
                (isOwner ? (
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/40 hover:bg-destructive/10"
                    onClick={() => {
                      onCancel(fixed.id);
                      onClose();
                    }}
                  >
                    Cancel Listing
                  </Button>
                ) : (
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => {
                      onBuy(fixed.id);
                      onClose();
                    }}
                  >
                    Buy Now
                  </Button>
                ))}
              {auction &&
                (isOwner ? (
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/40 hover:bg-destructive/10"
                    onClick={() => {
                      onCancel(auction.id);
                      onClose();
                    }}
                  >
                    Cancel Auction
                  </Button>
                ) : (
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => {
                      onBid(auction);
                      onClose();
                    }}
                    disabled={
                      Date.now() >= Number(auction.endTime / 1_000_000n)
                    }
                  >
                    <Gavel className="w-4 h-4 mr-2" />
                    Place Bid
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Auction Listing Card ─────────────────────────────────────────────────────

interface AuctionCardProps {
  listing: AuctionListing;
  nft: WalletNFT | undefined;
  collection?: Collection;
  dividendE8s?: bigint;
  index: number;
  currentPrincipal: string | null;
  onBid: (listing: AuctionListing) => void;
  onSettle: (id: ListingId) => void;
  onCancel: (id: ListingId) => void;
  onDetails: () => void;
  isSettling: boolean;
  isCancelling: boolean;
}

function AuctionListingCard({
  listing,
  nft,
  collection,
  dividendE8s = 0n,
  index,
  currentPrincipal,
  onBid,
  onSettle,
  onCancel,
  onDetails,
  isSettling,
  isCancelling,
}: AuctionCardProps) {
  const remaining = useCountdown(listing.endTime);
  const ended = remaining <= 0;
  const name = nft?.metadata.name ?? `NFT #${nft?.tokenId ?? "?"}`;
  const sellerText = listing.seller.toString();
  const isOwner = currentPrincipal === sellerText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:nft-card-glow-hover hover:border-accent/40 transition-smooth cursor-pointer"
      onClick={onDetails}
      data-ocid={`marketplace.auction.item.${index + 1}`}
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        <MediaImage
          src={nft?.metadata.imageUrl}
          alt={name}
          assetCanisterId={collection?.canisterId.toString()}
          tokenId={nft?.tokenId}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
          fallback={<NFTImagePlaceholder name={name} />}
        />
        <Badge
          className={`absolute top-2 left-2 text-xs font-mono uppercase ${
            ended
              ? "bg-muted text-muted-foreground"
              : "bg-accent/90 text-accent-foreground"
          }`}
        >
          {ended ? "Ended" : "Live"}
        </Badge>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm text-foreground truncate">
            {name}
          </p>
          <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
            {truncatePrincipal(sellerText)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 font-mono">
            Token #{nft?.tokenId ?? "?"}
          </p>
        </div>

        {collection && <CollectionBadge collection={collection} size="sm" />}
        {dividendE8s > 0n && (
          <Badge className="w-fit bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px]">
            {formatICPAmount(dividendE8s)} ICP dividends
          </Badge>
        )}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <Clock className="w-3 h-3 shrink-0" />
          <span
            className={ended ? "text-destructive/80" : "text-foreground/70"}
          >
            {formatRemaining(remaining)}
          </span>
        </div>

        <div className="mt-auto pt-2 border-t border-border/60 flex items-end justify-between gap-2">
          <PriceDisplay
            e8s={
              listing.highestBid > 0n ? listing.highestBid : listing.startingBid
            }
            size="sm"
            label={listing.highestBid > 0n ? "Top bid" : "Starting bid"}
          />

          {isOwner ? (
            <div className="flex gap-1.5 shrink-0">
              {ended && (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth font-semibold"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSettle(listing.id);
                  }}
                  disabled={isSettling}
                  data-ocid={`marketplace.auction.settle_button.${index + 1}`}
                >
                  {isSettling ? <LoadingSpinner size="sm" /> : "Settle"}
                </Button>
              )}
              {!ended && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive/40 hover:bg-destructive/10 transition-smooth"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCancel(listing.id);
                  }}
                  disabled={isCancelling}
                  data-ocid={`marketplace.auction.cancel_button.${index + 1}`}
                >
                  {isCancelling ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : (
            !ended && (
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth shrink-0 font-semibold"
                onClick={(event) => {
                  event.stopPropagation();
                  onBid(listing);
                }}
                data-ocid={`marketplace.auction.bid_button.${index + 1}`}
              >
                <Gavel className="w-3 h-3 mr-1" />
                Bid
              </Button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── List NFT Modal ───────────────────────────────────────────────────────────

type ListParams =
  | { type: "fixed"; nftId: bigint; price: bigint }
  | { type: "auction"; nftId: bigint; startingBid: bigint; endTime: bigint };

interface ListNFTModalProps {
  open: boolean;
  onClose: () => void;
  userNFTs: WalletNFT[];
  collections: Collection[];
  onList: (params: ListParams) => void;
  isListing: boolean;
}

function ListNFTModal({
  open,
  onClose,
  userNFTs,
  collections,
  onList,
  isListing,
}: ListNFTModalProps) {
  const [selectedNFT, setSelectedNFT] = useState<bigint | null>(null);
  const [mode, setMode] = useState<"fixed" | "auction">("fixed");
  const [price, setPrice] = useState("");
  const [startBid, setStartBid] = useState("");
  const [endDays, setEndDays] = useState("3");

  const reset = useCallback(() => {
    setSelectedNFT(null);
    setMode("fixed");
    setPrice("");
    setStartBid("");
    setEndDays("3");
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedNFT) return;

    if (mode === "fixed") {
      const p = parseICP(price);
      if (!p) return toast.error("Enter a valid price");
      onList({ type: "fixed", nftId: selectedNFT, price: p });
    } else {
      const bid = parseICP(startBid);
      if (!bid) return toast.error("Enter a valid starting bid");
      const days = Number.parseInt(endDays, 10);
      if (Number.isNaN(days) || days < 1)
        return toast.error("Duration must be at least 1 day");
      const endTimeNs = BigInt(Date.now() + days * 86_400_000) * 1_000_000n;
      onList({
        type: "auction",
        nftId: selectedNFT,
        startingBid: bid,
        endTime: endTimeNs,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto"
        data-ocid="marketplace.list_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            List Your NFT
          </DialogTitle>
        </DialogHeader>

        <div className="mt-1 mb-3 rounded-lg border border-accent/30 bg-accent/5 p-3 flex gap-2.5 items-start">
          <div className="w-4 h-4 rounded-full bg-accent/30 flex items-center justify-center mt-0.5 shrink-0">
            <span className="text-accent text-[10px] font-bold">!</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your NFT will be held securely by the app until the sale completes.
            You'll receive the ICP proceeds automatically, less the 2% Mintlab
            marketplace fee.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NFT Selector */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Select NFT
            </Label>
            {userNFTs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
                No vaulted or minted NFTs available to list yet
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {userNFTs.map((nft) => {
                  const nftName = nft.metadata.name ?? `#${nft.tokenId}`;
                  const collection = collections.find(
                    (item) => item.id === nft.collectionId,
                  );
                  const selected = selectedNFT === nft.id;
                  return (
                    <button
                      key={nft.id.toString()}
                      type="button"
                      onClick={() => setSelectedNFT(nft.id)}
                      className={`rounded-lg border overflow-hidden transition-smooth text-left ${
                        selected
                          ? "border-accent ring-1 ring-accent/50"
                          : "border-border hover:border-accent/40"
                      }`}
                      data-ocid="marketplace.list_nft_select"
                    >
                      <div className="aspect-square bg-muted">
                        <MediaImage
                          src={nft.metadata.imageUrl}
                          alt={nftName}
                          assetCanisterId={collection?.canisterId.toString()}
                          tokenId={nft.tokenId}
                          className="w-full h-full object-cover"
                          fallback={
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                          }
                        />
                      </div>
                      <p className="px-1.5 py-1 text-[10px] font-mono text-foreground/80 truncate">
                        {nftName}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Type Toggle */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Listing Type
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("fixed")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-smooth ${
                  mode === "fixed"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-border/80"
                }`}
                data-ocid="marketplace.list_type_fixed"
              >
                <Tag className="w-3.5 h-3.5 inline mr-1.5" />
                Fixed Price
              </button>
              <button
                type="button"
                onClick={() => setMode("auction")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-smooth ${
                  mode === "auction"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-border/80"
                }`}
                data-ocid="marketplace.list_type_auction"
              >
                <Gavel className="w-3.5 h-3.5 inline mr-1.5" />
                Auction
              </button>
            </div>
          </div>

          {mode === "fixed" ? (
            <div className="space-y-1.5">
              <Label
                htmlFor="list-price"
                className="text-xs text-muted-foreground uppercase tracking-wider"
              >
                Price (ICP)
              </Label>
              <Input
                id="list-price"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 15.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-background border-input font-mono"
                data-ocid="marketplace.list_price_input"
              />
              <p className="text-xs text-muted-foreground">
                Use any positive ICP amount with up to 8 decimals.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="list-startbid"
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                >
                  Starting Bid (ICP)
                </Label>
                <Input
                  id="list-startbid"
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 5.0"
                  value={startBid}
                  onChange={(e) => setStartBid(e.target.value)}
                  className="bg-background border-input font-mono"
                  data-ocid="marketplace.list_startbid_input"
                />
                <p className="text-xs text-muted-foreground">
                  Use any positive ICP amount with up to 8 decimals.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="list-duration"
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                >
                  Duration (days)
                </Label>
                <Input
                  id="list-duration"
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  placeholder="e.g. 3"
                  value={endDays}
                  onChange={(e) => setEndDays(e.target.value)}
                  className="bg-background border-input font-mono"
                  data-ocid="marketplace.list_duration_input"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border"
              onClick={onClose}
              data-ocid="marketplace.list_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isListing || !selectedNFT}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold"
              data-ocid="marketplace.list_submit_button"
            >
              {isListing ? <LoadingSpinner size="sm" /> : "List NFT"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Place Bid Modal ──────────────────────────────────────────────────────────

interface BidModalProps {
  listing: AuctionListing | null;
  nft: WalletNFT | undefined;
  ledgerFeeE8s: bigint;
  auctionBidFeeReserveE8s: bigint;
  mintlabFeeBps: bigint;
  onClose: () => void;
  onBid: (listingId: ListingId, amount: bigint) => void;
  isBidding: boolean;
}

function PlaceBidModal({
  listing,
  nft,
  ledgerFeeE8s,
  auctionBidFeeReserveE8s,
  mintlabFeeBps,
  onClose,
  onBid,
  isBidding,
}: BidModalProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [pendingBidAmount, setPendingBidAmount] = useState<bigint | null>(null);
  const [confirmBidOpen, setConfirmBidOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listing) {
      setBidAmount("");
      setPendingBidAmount(null);
      setConfirmBidOpen(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [listing]);

  if (!listing) return null;

  const minBid =
    listing.highestBid > 0n ? listing.highestBid + 1n : listing.startingBid;
  const minBidICP = formatICPAmount(minBid);
  const name = nft?.metadata.name ?? `NFT #${nft?.tokenId ?? "?"}`;
  const pendingAmount = pendingBidAmount ?? 0n;
  const pendingMintlabFee = marketplaceFee(pendingAmount, mintlabFeeBps);
  const escrowDeposit = pendingAmount + auctionBidFeeReserveE8s;
  const maximumDebit = escrowDeposit + ledgerFeeE8s;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!listing) return;
    const amount = parseICP(bidAmount);
    if (!amount) return toast.error("Enter a valid bid amount");
    if (amount < minBid) {
      return toast.error(`Bid must be at least ${minBidICP} ICP`);
    }
    setPendingBidAmount(amount);
    setConfirmBidOpen(true);
  }

  return (
    <>
      <Dialog open={!!listing} onOpenChange={(v) => !v && onClose()}>
        <DialogContent
          className="bg-card border-border max-w-sm"
          data-ocid="marketplace.bid_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Place a Bid
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground -mt-1">{name}</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-1">
            <div className="rounded-lg bg-muted/40 border border-border p-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {listing.highestBid > 0n ? "Current top bid" : "Starting bid"}
              </span>
              <PriceDisplay
                e8s={
                  listing.highestBid > 0n
                    ? listing.highestBid
                    : listing.startingBid
                }
                size="sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="bid-amount"
                className="text-xs text-muted-foreground uppercase tracking-wider"
              >
                Your Bid (ICP) — min {minBidICP}
              </Label>
              <Input
                id="bid-amount"
                ref={inputRef}
                type="text"
                inputMode="decimal"
                placeholder={minBidICP}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="bg-background border-input font-mono"
                data-ocid="marketplace.bid_amount_input"
              />
              <p className="text-xs text-muted-foreground">
                Enter any positive ICP amount with up to 8 decimals.
              </p>
            </div>

            {bidAmount.trim() && (
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                If confirmed,{" "}
                <span className="font-mono text-foreground">
                  {bidAmount.trim()} ICP
                </span>{" "}
                plus escrow fee reserves moves from your in-app account into
                auction escrow now.
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border"
                onClick={onClose}
                data-ocid="marketplace.bid_cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isBidding}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold"
                data-ocid="marketplace.bid_confirm_button"
              >
                {isBidding ? <LoadingSpinner size="sm" /> : "Review Bid"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <PaymentConfirmationDialog
        open={confirmBidOpen}
        onOpenChange={setConfirmBidOpen}
        title="Fund Auction Escrow"
        description="Your bid is held in escrow until you are outbid or the auction settles. Outbid refunds return the bid and unused reserve, but ledger transfers into escrow and back still cost a small amount of ICP."
        lines={[
          {
            label: "Bid amount",
            value: `${formatICPAmount(pendingAmount)} ICP`,
          },
          {
            label: "Mintlab fee if won",
            value: `${formatICPAmount(pendingMintlabFee)} ICP`,
            helper: "Deducted from seller proceeds.",
          },
          {
            label: "Escrow fee reserve",
            value: `${formatICPAmount(auctionBidFeeReserveE8s)} ICP`,
            helper: "Reserved to settle the sale or refund you if outbid.",
          },
          {
            label: "Transfer to escrow fee",
            value: `${formatICPAmount(ledgerFeeE8s)} ICP`,
          },
          {
            label: "Total debit now",
            value: `${formatICPAmount(maximumDebit)} ICP`,
          },
        ]}
        confirmLabel="Fund Escrow"
        isPending={isBidding}
        onConfirm={() => {
          if (pendingBidAmount == null) return;
          onBid(listing.id, pendingBidAmount);
        }}
        ocid="marketplace.bid.payment_dialog"
      />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const { actor, isFetching: actorLoading } = useBackend();
  const { isAuthenticated, principal, login } = useAuth();
  const qc = useQueryClient();

  const [activeTab, setActiveTab] = useState<"fixed" | "auctions">("fixed");
  const [buyTarget, setBuyTarget] = useState<ListingId | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ListingId | null>(null);
  const [bidTarget, setBidTarget] = useState<AuctionListing | null>(null);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] =
    useState<ListingDetailModalProps["detail"]>(null);

  // ── Queries ───────────────────────────────────────────────────────────────

  const { data: listingDetails = [], isLoading: listingsLoading } = useQuery<
    ActiveListingDetail[]
  >({
    queryKey: ["activeListingDetails"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveListingDetails();
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 30_000,
  });

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor && !actorLoading,
  });

  const { data: marketplaceFeeConfig } = useQuery({
    queryKey: ["marketplaceFeeConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarketplaceFeeConfig();
    },
    enabled: !!actor && !actorLoading,
    staleTime: 60_000,
  });

  const { data: userNFTs = [] } = useQuery<WalletNFT[]>({
    queryKey: ["userNFTs", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getUserNFTs(principal);
    },
    enabled: !!actor && !actorLoading && isAuthenticated && !!principal,
  });

  const collectionMap = new Map<bigint, Collection>(
    collections.map((collection) => [collection.id, collection]),
  );

  const { data: listingDividendBalances = [] } = useQuery<
    Array<[string, bigint]>
  >({
    queryKey: [
      "marketplaceDividendBalances",
      listingDetails
        .map((detail) => detail.nft.collectionId.toString())
        .join(","),
      collections.map((collection) => collection.id.toString()).join(","),
    ],
    queryFn: async () => {
      if (!actor) return [];
      const entries: Array<[string, bigint]> = [];
      const collectionIds = Array.from(
        new Set(listingDetails.map((detail) => detail.nft.collectionId)),
      );
      for (const collectionId of collectionIds) {
        const collection = collectionMap.get(collectionId);
        if (!collection?.dividendConfig?.enabled) continue;
        const balances =
          await actor.refreshCollectionDividendBalances(collectionId);
        for (const [tokenId, balance] of balances) {
          entries.push([`${collectionId.toString()}:${tokenId}`, balance]);
        }
      }
      return entries;
    },
    enabled: !!actor && !actorLoading && listingDetails.length > 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });

  const listingDividendMap = new Map<string, bigint>(listingDividendBalances);
  const ledgerFeeE8s =
    marketplaceFeeConfig?.ledgerFeeE8s ?? DEFAULT_ICP_LEDGER_FEE_E8S;
  const auctionBidFeeReserveE8s =
    marketplaceFeeConfig?.auctionBidFeeReserveE8s ?? ledgerFeeE8s * 2n;
  const mintlabFeeBps =
    marketplaceFeeConfig?.mintlabFeeBasisPoints ?? DEFAULT_MINTLAB_FEE_BPS;

  // ── Derived lists ──────────────────────────────────────────────────────────

  const fixedListings = listingDetails.flatMap((detail) =>
    detail.listing.__kind__ === "Fixed"
      ? [
          {
            listing: detail.listing.Fixed,
            nft: detail.nft,
            collection: collectionMap.get(detail.nft.collectionId),
          },
        ]
      : [],
  );

  const buyListingDetail =
    buyTarget == null
      ? null
      : (fixedListings.find(({ listing }) => listing.id === buyTarget) ?? null);

  const auctionListings = listingDetails.flatMap((detail) =>
    detail.listing.__kind__ === "Auction"
      ? [
          {
            listing: detail.listing.Auction,
            nft: detail.nft,
            collection: collectionMap.get(detail.nft.collectionId),
          },
        ]
      : [],
  );

  const listedNFTKeys = new Set(
    listingDetails
      .filter((detail) => {
        const seller =
          detail.listing.__kind__ === "Fixed"
            ? detail.listing.Fixed.seller
            : detail.listing.Auction.seller;
        return principal ? seller.toString() === principal.toString() : false;
      })
      .map(
        (detail) =>
          `${detail.nft.collectionId.toString()}:${detail.nft.tokenId}`,
      ),
  );

  const listableUserNFTs = userNFTs.filter(
    (nft) =>
      (nft.location === "Minted" || nft.location === "Vaulted") &&
      !listedNFTKeys.has(`${nft.collectionId.toString()}:${nft.tokenId}`),
  );

  // ── Mutations ──────────────────────────────────────────────────────────────

  const refreshMarketplace = () => {
    void qc.invalidateQueries({ queryKey: ["activeListingDetails"] });
    void qc.invalidateQueries({ queryKey: ["activeListings"] });
    void qc.invalidateQueries({ queryKey: ["userNFTs"] });
    void qc.invalidateQueries({ queryKey: ["userStats"] });
    void qc.invalidateQueries({ queryKey: ["icp-balance"] });
  };

  const { mutate: buyListing, isPending: isBuying } = useMutation({
    mutationFn: async (id: ListingId) => {
      if (!actor) throw new Error("Not connected");
      return actor.buyFixedListing(id);
    },
    onSuccess: () => {
      toast.success("NFT purchased successfully!");
      setBuyTarget(null);
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Purchase failed: ${e.message}`),
  });

  const { mutate: cancelListing, isPending: isCancelling } = useMutation({
    mutationFn: async (id: ListingId) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelListing(id);
    },
    onSuccess: () => {
      toast.success("Listing cancelled.");
      setCancelTarget(null);
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Cancel failed: ${e.message}`),
  });

  const { mutate: placeBid, isPending: isBidding } = useMutation({
    mutationFn: async ({ id, amount }: { id: ListingId; amount: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeBid(id, amount);
    },
    onSuccess: () => {
      toast.success("Bid placed and escrow funded!");
      setBidTarget(null);
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Bid failed: ${e.message}`),
  });

  const { mutate: settleAuction, isPending: isSettling } = useMutation({
    mutationFn: async (id: ListingId) => {
      if (!actor) throw new Error("Not connected");
      return actor.settleAuction(id);
    },
    onSuccess: () => {
      toast.success("Auction settled!");
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Settle failed: ${e.message}`),
  });

  const { mutate: createFixed, isPending: isCreatingFixed } = useMutation({
    mutationFn: async ({ nftId, price }: { nftId: bigint; price: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFixedListing(nftId, price);
    },
    onSuccess: () => {
      toast.success("Fixed listing created!");
      setListModalOpen(false);
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Listing failed: ${e.message}`),
  });

  const { mutate: createAuction, isPending: isCreatingAuction } = useMutation({
    mutationFn: async ({
      nftId,
      startingBid,
      endTime,
    }: {
      nftId: bigint;
      startingBid: bigint;
      endTime: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createAuctionListing(nftId, startingBid, endTime);
    },
    onSuccess: () => {
      toast.success("Auction listing created!");
      setListModalOpen(false);
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Listing failed: ${e.message}`),
  });

  const isListing = isCreatingFixed || isCreatingAuction;

  function handleList(params: ListParams) {
    if (params.type === "fixed") {
      createFixed({ nftId: params.nftId, price: params.price });
    } else {
      createAuction({
        nftId: params.nftId,
        startingBid: params.startingBid,
        endTime: params.endTime,
      });
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const principalStr = principal?.toString() ?? null;
  const buyPrice = buyListingDetail?.listing.price ?? 0n;
  const buyMintlabFee = marketplaceFee(buyPrice, mintlabFeeBps);
  const buySellerProceeds = buyPrice - buyMintlabFee;
  const buyLedgerFees = ledgerFeeE8s * (buyMintlabFee > 0n ? 2n : 1n);

  return (
    <div className="min-h-screen bg-background" data-ocid="marketplace.page">
      {/* Sticky header strip */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
              Marketplace
            </p>
            <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
              Discover Digital Collectibles
            </h1>
          </div>

          {isAuthenticated ? (
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold shrink-0"
              onClick={() => setListModalOpen(true)}
              data-ocid="marketplace.list_nft_button"
            >
              <Tag className="w-4 h-4 mr-2" />
              List Your NFT
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border-accent/40 text-accent hover:bg-accent/10 transition-smooth shrink-0"
              onClick={login}
              data-ocid="marketplace.login_button"
            >
              Connect Wallet to List
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "fixed" | "auctions")}
        >
          <TabsList
            className="bg-muted/60 border border-border mb-6"
            data-ocid="marketplace.tabs"
          >
            <TabsTrigger
              value="fixed"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
              data-ocid="marketplace.tab.fixed"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Fixed Price
              {fixedListings.length > 0 && (
                <Badge className="ml-2 bg-primary/20 text-primary text-[10px] px-1.5 py-0 font-mono border-0">
                  {fixedListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="auctions"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-medium"
              data-ocid="marketplace.tab.auctions"
            >
              <Gavel className="w-4 h-4 mr-2" />
              Auctions
              {auctionListings.length > 0 && (
                <Badge className="ml-2 bg-accent/20 text-accent text-[10px] px-1.5 py-0 font-mono border-0">
                  {auctionListings.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Fixed Price Tab */}
          <TabsContent value="fixed" className="mt-0">
            {listingsLoading ? (
              <div
                className="flex items-center justify-center min-h-[40vh]"
                data-ocid="marketplace.fixed.loading_state"
              >
                <LoadingSpinner size="lg" label="Loading listings…" />
              </div>
            ) : fixedListings.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No fixed-price listings"
                description="Be the first to list an NFT for a fixed price. Connect your wallet and click 'List Your NFT' above."
                action={
                  isAuthenticated
                    ? {
                        label: "List Your NFT",
                        onClick: () => setListModalOpen(true),
                        "data-ocid": "marketplace.fixed.list_cta",
                      }
                    : undefined
                }
                data-ocid="marketplace.fixed.empty_state"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {fixedListings.map(({ listing, nft, collection }, i) => (
                  <FixedListingCard
                    key={listing.id.toString()}
                    listing={listing}
                    nft={nft}
                    collection={collection}
                    dividendE8s={
                      listingDividendMap.get(
                        nftKey(nft.collectionId, nft.tokenId),
                      ) ?? 0n
                    }
                    index={i}
                    currentPrincipal={principalStr}
                    onBuy={(id) => setBuyTarget(id)}
                    onCancel={(id) => setCancelTarget(id)}
                    onDetails={() =>
                      setDetailTarget({
                        listing: { __kind__: "Fixed", Fixed: listing },
                        nft,
                        collection,
                        dividendE8s:
                          listingDividendMap.get(
                            nftKey(nft.collectionId, nft.tokenId),
                          ) ?? 0n,
                      })
                    }
                    isBuying={isBuying && buyTarget === listing.id}
                    isCancelling={isCancelling && cancelTarget === listing.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Auctions Tab */}
          <TabsContent value="auctions" className="mt-0">
            {listingsLoading ? (
              <div
                className="flex items-center justify-center min-h-[40vh]"
                data-ocid="marketplace.auction.loading_state"
              >
                <LoadingSpinner size="lg" label="Loading auctions…" />
              </div>
            ) : auctionListings.length === 0 ? (
              <EmptyState
                icon={Gavel}
                title="No active auctions"
                description="No NFTs are currently up for auction. List yours to start the bidding!"
                action={
                  isAuthenticated
                    ? {
                        label: "Start an Auction",
                        onClick: () => setListModalOpen(true),
                        "data-ocid": "marketplace.auction.list_cta",
                      }
                    : undefined
                }
                data-ocid="marketplace.auction.empty_state"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {auctionListings.map(({ listing, nft, collection }, i) => (
                  <AuctionListingCard
                    key={listing.id.toString()}
                    listing={listing}
                    nft={nft}
                    collection={collection}
                    dividendE8s={
                      listingDividendMap.get(
                        nftKey(nft.collectionId, nft.tokenId),
                      ) ?? 0n
                    }
                    index={i}
                    currentPrincipal={principalStr}
                    onBid={(l) => setBidTarget(l)}
                    onSettle={(id) => settleAuction(id)}
                    onCancel={(id) => setCancelTarget(id)}
                    onDetails={() =>
                      setDetailTarget({
                        listing: { __kind__: "Auction", Auction: listing },
                        nft,
                        collection,
                        dividendE8s:
                          listingDividendMap.get(
                            nftKey(nft.collectionId, nft.tokenId),
                          ) ?? 0n,
                      })
                    }
                    isSettling={isSettling}
                    isCancelling={isCancelling && cancelTarget === listing.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ListingDetailModal
        detail={detailTarget}
        currentPrincipal={principalStr}
        onClose={() => setDetailTarget(null)}
        onBuy={(id) => setBuyTarget(id)}
        onCancel={(id) => setCancelTarget(id)}
        onBid={(listing) => setBidTarget(listing)}
      />

      {/* Buy Confirmation Dialog */}
      <AlertDialog
        open={buyTarget !== null}
        onOpenChange={(v) => !v && setBuyTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="marketplace.buy_dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Confirm Purchase
            </AlertDialogTitle>
            <AlertDialogDescription>
              Confirm the ICP payment from your in-app account before this NFT
              is purchased and sent to you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {buyListingDetail && (
            <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Listed price</span>
                <span className="font-mono">
                  {formatICPAmount(buyListingDetail.listing.price)} ICP
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">
                  Mintlab fee
                  <span className="block text-[11px] leading-snug">
                    Deducted from seller proceeds
                  </span>
                </span>
                <span className="font-mono">
                  {formatICPAmount(buyMintlabFee)} ICP
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Seller receives</span>
                <span className="font-mono">
                  {formatICPAmount(buySellerProceeds)} ICP
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Ledger fees</span>
                <span className="font-mono">
                  {formatICPAmount(buyLedgerFees)} ICP
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-2 font-medium">
                <span>Total debit</span>
                <span className="font-mono">
                  {formatICPAmount(buyPrice + buyLedgerFees)} ICP
                </span>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border"
              data-ocid="marketplace.buy_cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => buyTarget !== null && buyListing(buyTarget)}
              data-ocid="marketplace.buy_confirm_button"
            >
              {isBuying ? <LoadingSpinner size="sm" /> : "Confirm Purchase"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Listing Confirmation Dialog */}
      <AlertDialog
        open={cancelTarget !== null}
        onOpenChange={(v) => !v && setCancelTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="marketplace.cancel_dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Cancel Listing
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this listing? Your NFT will be
              returned to your wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border"
              data-ocid="marketplace.cancel_keep_button"
            >
              Keep Listing
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                cancelTarget !== null && cancelListing(cancelTarget)
              }
              data-ocid="marketplace.cancel_confirm_button"
            >
              {isCancelling ? <LoadingSpinner size="sm" /> : "Cancel Listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Place Bid Modal */}
      <PlaceBidModal
        listing={bidTarget}
        nft={
          bidTarget
            ? auctionListings.find(({ listing }) => listing.id === bidTarget.id)
                ?.nft
            : undefined
        }
        ledgerFeeE8s={ledgerFeeE8s}
        auctionBidFeeReserveE8s={auctionBidFeeReserveE8s}
        mintlabFeeBps={mintlabFeeBps}
        onClose={() => setBidTarget(null)}
        onBid={(id, amount) => placeBid({ id, amount })}
        isBidding={isBidding}
      />

      {/* List NFT Modal */}
      <ListNFTModal
        open={listModalOpen}
        onClose={() => setListModalOpen(false)}
        userNFTs={listableUserNFTs}
        collections={collections}
        onList={handleList}
        isListing={isListing}
      />
    </div>
  );
}
