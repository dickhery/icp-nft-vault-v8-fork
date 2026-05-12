import { AppCanisterTopUpDialog } from "@/components/AppCanisterTopUpDialog";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MediaImage } from "@/components/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { isLowCyclesError } from "@/lib/cycles";
import type { NFTDividend, WalletNFT } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CircleDollarSign,
  Coins,
  ImageOff,
  LoaderCircle,
  LogIn,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const E8S = 100_000_000n;
const ICP_FEE = 10_000n;

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const fraction = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

function extractError(err: unknown): string {
  if (err instanceof Error) return err.message || "Something went wrong";
  if (typeof err === "string") return err;
  return "Something went wrong";
}

function dividendKey(item: NFTDividend): string {
  return `${item.nft.collectionId.toString()}:${item.nft.tokenId}`;
}

export default function DividendsPage() {
  const { actor, isFetching } = useBackend();
  const { principal, isAuthenticated, principalText, login } = useAuth();
  const queryClient = useQueryClient();
  const [cycleRetry, setCycleRetry] = useState<
    | { kind: "sync"; reason: string }
    | { kind: "claim"; reason: string; item: NFTDividend }
    | null
  >(null);

  const {
    data: dividends = [],
    error: dividendsError,
    isError: dividendsFailed,
    isLoading,
    refetch,
  } = useQuery<NFTDividend[]>({
    queryKey: ["myDividendNFTs", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.refreshMyDividendNFTs();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });

  const { data: mediaNFTs = [] } = useQuery<WalletNFT[]>({
    queryKey: ["userNFTs", principalText],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getUserNFTs(principal);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });

  const claimMutation = useMutation({
    mutationFn: async (item: NFTDividend) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.claimNFTDividend(item.nft.id);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (receipt) => {
      toast.success(`Collected ${formatICP(receipt.paidE8s)} ICP`, {
        description: `Confirmed at block ${receipt.blockIndex.toString()}`,
      });
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"],
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
    },
    onError: (err: unknown, item) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleRetry({ kind: "claim", reason: message, item });
        return;
      }
      toast.error(message);
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      const collectionIds = Array.from(
        new Set(dividends.map((item) => item.collection.id.toString())),
      );
      let distributed = 0n;
      for (const collectionId of collectionIds) {
        const result = await actor.syncCollectionDividends(
          BigInt(collectionId),
        );
        if (result.__kind__ === "ok") {
          distributed += result.ok.distributedE8s;
        }
      }
      return distributed;
    },
    onSuccess: (distributed) => {
      toast.success(
        distributed > 0n
          ? `Distributed ${formatICP(distributed)} ICP`
          : "No new deposits to distribute",
      );
      void refetch();
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"],
      });
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
    },
    onError: (err: unknown) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleRetry({ kind: "sync", reason: message });
        return;
      }
      toast.error(message);
    },
  });

  const mediaByDividendKey = useMemo(() => {
    return new Map(
      mediaNFTs.map((nft) => [
        `${nft.collectionId.toString()}:${nft.tokenId}`,
        nft,
      ]),
    );
  }, [mediaNFTs]);

  if (!isAuthenticated) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4"
        data-ocid="dividends.page"
      >
        <div className="rounded-2xl bg-card border border-border/50 shadow-lg p-10 flex flex-col items-center gap-5 max-w-sm w-full">
          <div className="rounded-full bg-emerald-500/15 border border-emerald-500/30 p-4">
            <CircleDollarSign className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-display font-semibold text-foreground">
              Connect to view dividends
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in to see ICP rewards attached to NFTs you own.
            </p>
          </div>
          <Button className="w-full gap-2" onClick={login}>
            <LogIn className="h-4 w-4" />
            Sign in with Internet Identity
          </Button>
        </div>
      </div>
    );
  }

  const totalClaimable = dividends.reduce(
    (sum, item) => sum + item.claimableE8s,
    0n,
  );
  const claimableItems = dividends.filter((item) => item.claimableE8s > 0n);

  return (
    <>
      <div
        className="px-4 md:px-8 py-8 space-y-6 max-w-6xl mx-auto"
        data-ocid="dividends.page"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              NFT Rewards
            </p>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              Dividends
            </h1>
            <p className="text-sm text-muted-foreground">
              Collect ICP that has been assigned to NFTs you currently hold.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending || dividends.length === 0}
            data-ocid="dividends.sync_button"
          >
            {syncMutation.isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Check Deposits
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Claimable
              </p>
              <p className="font-mono text-2xl font-bold text-emerald-600 mt-1">
                {formatICP(totalClaimable)} ICP
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Eligible NFTs
              </p>
              <p className="font-mono text-2xl font-bold text-foreground mt-1">
                {dividends.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Ready To Collect
              </p>
              <p className="font-mono text-2xl font-bold text-foreground mt-1">
                {claimableItems.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="min-h-[32vh] flex items-center justify-center">
            <LoadingSpinner size="lg" label="Loading dividends..." />
          </div>
        ) : dividendsFailed ? (
          <EmptyState
            icon={CircleDollarSign}
            title="Dividend NFTs could not load"
            description={extractError(dividendsError)}
            data-ocid="dividends.error_state"
          />
        ) : dividends.length === 0 ? (
          <EmptyState
            icon={Coins}
            title="No dividend-enabled NFTs"
            description="Create or hold NFTs from collections that enabled dividends to collect rewards here."
            data-ocid="dividends.empty_state"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dividends.map((item, index) => {
              const hydratedNFT = mediaByDividendKey.get(dividendKey(item));
              const nftName =
                item.nft.metadata.name ??
                hydratedNFT?.metadata.name ??
                `NFT #${item.nft.tokenId}`;
              const imageSrc =
                item.nft.metadata.imageUrl ?? hydratedNFT?.metadata.imageUrl;
              const canClaim = item.claimableE8s > ICP_FEE;
              const isClaiming =
                claimMutation.isPending &&
                claimMutation.variables != null &&
                dividendKey(claimMutation.variables) === dividendKey(item);

              return (
                <Card
                  key={`${dividendKey(item)}-${index}`}
                  className="border-border bg-card overflow-hidden"
                  data-ocid={`dividends.item.${index + 1}`}
                >
                  <CardContent className="p-0 flex min-h-36">
                    <div className="w-32 sm:w-40 bg-muted shrink-0 flex items-center justify-center">
                      <MediaImage
                        src={imageSrc}
                        alt={nftName}
                        assetCanisterId={item.collection.canisterId.toString()}
                        tokenId={item.nft.tokenId}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        fallback={
                          <ImageOff className="w-8 h-8 text-muted-foreground/35" />
                        }
                      />
                    </div>
                    <div className="p-4 flex-1 min-w-0 flex flex-col gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                            {formatICP(item.claimableE8s)} ICP
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs bg-muted/60 text-muted-foreground border border-border/40"
                          >
                            #{item.nft.tokenId}
                          </Badge>
                        </div>
                        <h2 className="font-display font-semibold text-foreground truncate mt-2">
                          {nftName}
                        </h2>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.collection.name}
                        </p>
                      </div>
                      <Button
                        className="mt-auto gap-2 self-start"
                        disabled={!canClaim || isClaiming}
                        onClick={() => claimMutation.mutate(item)}
                        data-ocid={`dividends.claim_button.${index + 1}`}
                      >
                        {isClaiming ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Coins className="h-4 w-4" />
                        )}
                        {canClaim ? "Collect ICP" : "Below Fee"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <AppCanisterTopUpDialog
        open={cycleRetry != null}
        reason={cycleRetry?.reason ?? null}
        onOpenChange={(open) => {
          if (!open) setCycleRetry(null);
        }}
        onSuccess={() => {
          const retry = cycleRetry;
          setCycleRetry(null);
          if (retry?.kind === "sync") {
            syncMutation.mutate();
          } else if (retry?.kind === "claim") {
            claimMutation.mutate(retry.item);
          }
        }}
      />
    </>
  );
}
