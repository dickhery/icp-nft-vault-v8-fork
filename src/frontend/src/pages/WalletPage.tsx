import { AppCanisterTopUpDialog } from "@/components/AppCanisterTopUpDialog";
import { CollectionBadge } from "@/components/CollectionBadge";
import { EmptyState } from "@/components/EmptyState";
import { MediaImage } from "@/components/MediaImage";
import { NFTCard } from "@/components/NFTCard";
import { PaymentConfirmationDialog } from "@/components/PaymentConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { isLowCyclesError } from "@/lib/cycles";
import { resolveImageUrl } from "@/lib/media";
import type {
  ActiveListingDetail,
  Collection,
  MintConfig,
  NFTDividend,
  NFTMetadata,
  NFTStats,
  PublicModerationConfig,
  WalletNFT,
} from "@/types";
import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Coins,
  Copy,
  ExternalLink,
  ImagePlus,
  Info,
  Layers,
  LogIn,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Tag,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── helpers ────────────────────────────────────────────────────────────────

function accountIdToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function truncate(s: string, head = 6, tail = 4): string {
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}...${s.slice(-tail)}`;
}

function extractError(err: unknown): string {
  if (err === null || err === undefined) return "An unexpected error occurred";
  if (typeof err === "string") return err || "An unexpected error occurred";
  if (err instanceof Error)
    return err.message || "An unexpected error occurred";
  if (typeof err === "object") {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    try {
      return JSON.stringify(obj) || "An unexpected error occurred";
    } catch {
      return "An unexpected error occurred";
    }
  }
  return String(err) || "An unexpected error occurred";
}

const E8S = 100_000_000n;
const ICP_LEDGER_FEE_E8S = 10_000n;

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}

function parseAttributeLines(value: string): Array<[string, string]> {
  const seen = new Set<string>();
  const attributes: Array<[string, string]> = [];
  for (const rawLine of value.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const separator =
      line.indexOf(":") === -1 ? line.indexOf("=") : line.indexOf(":");
    if (separator === -1) {
      throw new Error("Attributes must use Trait: Value, one per line");
    }
    const key = line.slice(0, separator).trim();
    const attrValue = line.slice(separator + 1).trim();
    if (!key || !attrValue) {
      throw new Error("Each attribute needs both a trait name and value");
    }
    const uniqueKey = `${key.toLowerCase()}::${attrValue.toLowerCase()}`;
    if (!seen.has(uniqueKey)) {
      seen.add(uniqueKey);
      attributes.push([key, attrValue]);
    }
  }
  return attributes;
}

function nftKey(collectionId: bigint, tokenId: string): string {
  return `${collectionId.toString()}:${tokenId}`;
}

// ── CopyField ─────────────────────────────────────────────────────────────

interface CopyFieldProps {
  label: string;
  value: string;
  ocid: string;
}

function CopyField({ label, value, ocid }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      toast.success(`${label} copied`);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-lg px-3 py-2">
        <span className="font-mono text-sm text-foreground truncate flex-1 min-w-0">
          {value}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="shrink-0 w-7 h-7 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          data-ocid={ocid}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-accent" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

// ── SendNFTModal ───────────────────────────────────────────────────────────

interface SendNFTModalProps {
  open: boolean;
  onClose: () => void;
  nft: WalletNFT;
  collection?: Collection;
}

function SendNFTModal({ open, onClose, nft, collection }: SendNFTModalProps) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [recipient, setRecipient] = useState("");
  const [recipientError, setRecipientError] = useState("");

  const nftName = nft.metadata.name ?? `NFT #${nft.tokenId}`;

  function validateRecipient(value: string): string {
    if (!value.trim()) return "Recipient Principal ID is required";
    try {
      Principal.fromText(value.trim());
      return "";
    } catch {
      return "Invalid Principal ID format (e.g. aaaaa-aa or rrkah-fqaaa-aaaaa-aaaaq-cai)";
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const err = validateRecipient(recipient);
      if (err) throw new Error(err);
      const recipientPrincipal = Principal.fromText(recipient.trim());
      const result = await actor.sendNFT(nft.id, recipientPrincipal);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (txId) => {
      toast.success(`NFT sent successfully! Transaction: ${txId}`);
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setRecipient("");
      setRecipientError("");
      onClose();
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  function handleSend() {
    const err = validateRecipient(recipient);
    if (err) {
      setRecipientError(err);
      return;
    }
    setRecipientError("");
    mutation.mutate();
  }

  function handleClose() {
    if (mutation.isPending) return;
    setRecipient("");
    setRecipientError("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="send-nft.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Send className="w-4 h-4 text-accent" />
            Send NFT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* NFT preview */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
              <MediaImage
                src={nft.metadata.imageUrl}
                alt={nftName}
                assetCanisterId={collection?.canisterId.toString()}
                tokenId={nft.tokenId}
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                }
              />
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm text-foreground truncate">
                {nftName}
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Token #{nft.tokenId}
              </p>
              {collection && (
                <CollectionBadge
                  collection={collection}
                  size="sm"
                  className="mt-1"
                />
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
            <Info className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive leading-relaxed">
              <strong>This action cannot be undone.</strong> The NFT will be
              permanently transferred to the recipient's wallet. Double-check
              the Principal ID before sending.
            </p>
          </div>

          {/* Recipient input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="recipient-principal"
              className="text-sm text-foreground"
            >
              Recipient Principal ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recipient-principal"
              placeholder="e.g. rrkah-fqaaa-aaaaa-aaaaq-cai"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                if (recipientError)
                  setRecipientError(validateRecipient(e.target.value));
              }}
              onBlur={() => setRecipientError(validateRecipient(recipient))}
              className="bg-muted/30 border-border focus:border-accent font-mono text-sm"
              data-ocid="send-nft.recipient.input"
              disabled={mutation.isPending}
            />
            {recipientError && (
              <p
                className="text-xs text-destructive"
                data-ocid="send-nft.recipient.field_error"
              >
                {recipientError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              The recipient must have a Principal ID (not an Account ID). NFT
              wallets on ICP use Principal IDs for NFT transfers.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={mutation.isPending}
              data-ocid="send-nft.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!recipient.trim() || mutation.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2"
              data-ocid="send-nft.submit_button"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send NFT
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── NFTDetailsModal ────────────────────────────────────────────────────────

interface NFTDetailsModalProps {
  open: boolean;
  onClose: () => void;
  nft: WalletNFT;
  collection?: Collection;
  isListed?: boolean;
  dividendE8s?: bigint;
  onSend?: () => void;
}

function NFTDetailsModal({
  open,
  onClose,
  nft,
  collection,
  isListed = false,
  dividendE8s = 0n,
  onSend,
}: NFTDetailsModalProps) {
  const nftName = nft.metadata.name ?? `NFT #${nft.tokenId}`;
  const imageUrl = resolveImageUrl(nft.metadata.imageUrl, {
    canisterId: collection?.canisterId.toString(),
    tokenId: nft.tokenId,
  });
  const canisterId = collection?.canisterId.toString() ?? "";
  const canisterUrl = canisterId
    ? `https://dashboard.internetcomputer.org/canister/${canisterId}`
    : null;

  const locationLabel = isListed
    ? "Listed on Market"
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
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        className="bg-card border-border w-[calc(100vw-2rem)] max-w-3xl p-0 overflow-hidden max-h-[calc(100dvh-2rem)]"
        data-ocid="wallet.nft_details.dialog"
      >
        <div className="flex max-h-[calc(100dvh-2rem)] min-h-0 flex-col md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]">
          <div className="bg-muted h-[min(42vh,360px)] shrink-0 md:h-auto md:min-h-0 flex items-center justify-center p-3">
            <MediaImage
              src={nft.metadata.imageUrl}
              alt={nftName}
              assetCanisterId={collection?.canisterId.toString()}
              tokenId={nft.tokenId}
              className="max-h-full w-full h-full object-contain rounded-lg"
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground/35" />
                </div>
              }
            />
          </div>

          <div className="min-h-0 overflow-y-auto p-5 space-y-4">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className={`border text-xs ${locationClass}`}
                >
                  {locationLabel}
                </Badge>
                {collection && (
                  <CollectionBadge collection={collection} size="sm" />
                )}
                {dividendE8s > 0n && (
                  <Badge className="border text-xs bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                    <Coins className="w-3 h-3 mr-1" />
                    {formatICP(dividendE8s)} ICP
                  </Badge>
                )}
              </div>
              <DialogTitle className="font-display text-xl text-foreground break-words">
                {nftName}
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-mono">
                Token #{nft.tokenId}
              </p>
            </DialogHeader>

            {nft.metadata.description && (
              <p className="text-sm text-muted-foreground leading-relaxed break-words">
                {nft.metadata.description}
              </p>
            )}

            <div className="grid grid-cols-1 gap-3">
              <CopyField
                label="Token ID"
                value={nft.tokenId}
                ocid="wallet.nft_details.copy_token_id"
              />
              {canisterId && (
                <CopyField
                  label="Collection Canister"
                  value={canisterId}
                  ocid="wallet.nft_details.copy_canister_id"
                />
              )}
              {imageUrl && (
                <CopyField
                  label="NFT Media URL"
                  value={imageUrl}
                  ocid="wallet.nft_details.copy_media_url"
                />
              )}
            </div>

            {nft.metadata.attributes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3 h-3" />
                  Attributes
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {nft.metadata.attributes.map(([key, value]) => (
                    <div
                      key={`wallet-detail-${key}-${value}`}
                      className="rounded-lg border border-border/50 bg-muted/35 px-3 py-2"
                    >
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground truncate">
                        {key}
                      </p>
                      <p className="text-sm font-semibold text-foreground truncate mt-0.5">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              {canisterUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="gap-2"
                  data-ocid="wallet.nft_details.view_canister_button"
                >
                  <a
                    href={canisterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Canister
                  </a>
                </Button>
              )}
              {onSend && nft.location !== "Registered" && !isListed && (
                <Button
                  className="gap-2"
                  onClick={onSend}
                  data-ocid="wallet.nft_details.send_button"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send NFT
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── RegisterNFTModal ───────────────────────────────────────────────────────

interface RegisterNFTModalProps {
  open: boolean;
  onClose: () => void;
  collection: Collection;
}

function RegisterNFTModal({
  open,
  onClose,
  collection,
}: RegisterNFTModalProps) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [tokenId, setTokenId] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!tokenId.trim()) throw new Error("Token ID is required");
      const result = await actor.registerNFT(collection.id, tokenId.trim(), {
        attributes: [],
      });
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: () => {
      toast.success("NFT registered successfully");
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setTokenId("");
      onClose();
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="register-nft.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Register NFT
          </DialogTitle>
          <CollectionBadge collection={collection} size="sm" className="mt-1" />
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="tokenId" className="text-sm text-foreground">
              Token ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tokenId"
              placeholder="e.g. 1234"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="bg-muted/30 border-border focus:border-accent"
              data-ocid="register-nft.token_id.input"
            />
          </div>

          <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground">
            The app verifies that you actually own this token on-chain before it
            imports it. Metadata is fetched from the collection automatically.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={mutation.isPending}
              data-ocid="register-nft.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate()}
              disabled={!tokenId.trim() || mutation.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
              data-ocid="register-nft.submit_button"
            >
              {mutation.isPending ? "Registering…" : "Register NFT"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VaultDepositCard({
  collections,
  vaultPrincipalText,
  vaultAccountIdHex,
}: {
  collections: Collection[];
  vaultPrincipalText: string | null;
  vaultAccountIdHex: string | null;
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const externalCollections = collections.filter(
    (collection) => collection.kind === "External",
  );
  const [collectionId, setCollectionId] = useState<string>(
    externalCollections[0]?.id.toString() ?? "",
  );
  const [tokenId, setTokenId] = useState("");

  useEffect(() => {
    if (!collectionId && externalCollections[0]) {
      setCollectionId(externalCollections[0].id.toString());
    }
  }, [collectionId, externalCollections]);

  const prepareMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!collectionId) throw new Error("Choose a collection first");
      if (!tokenId.trim()) throw new Error("Token ID is required");
      const result = await actor.prepareVaultDeposit(
        BigInt(collectionId),
        tokenId.trim(),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (message) => {
      toast.success(message);
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!collectionId) throw new Error("Choose a collection first");
      if (!tokenId.trim()) throw new Error("Token ID is required");
      const result = await actor.claimVaultDeposit(
        BigInt(collectionId),
        tokenId.trim(),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      toast.success("NFT deposited into the app vault");
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      void queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setTokenId("");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base flex items-center gap-2">
          <Archive className="w-4 h-4 text-accent" />
          Vault Deposit
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Send a supported external NFT to the app vault, then claim it into
          your in-app wallet as a vaulted asset. Preparing first is optional,
          but helps reserve the token for your account before it arrives.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {externalCollections.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No external collections are enabled yet.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Collection</Label>
                <Select value={collectionId} onValueChange={setCollectionId}>
                  <SelectTrigger data-ocid="wallet.deposit.collection_select">
                    <SelectValue placeholder="Choose a supported collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {externalCollections.map((collection) => (
                      <SelectItem
                        key={collection.id.toString()}
                        value={collection.id.toString()}
                      >
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deposit-token-id">Token ID</Label>
                <Input
                  id="deposit-token-id"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="e.g. 1234"
                  data-ocid="wallet.deposit.token_input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vaultPrincipalText && (
                <CopyField
                  label="Vault Principal"
                  value={vaultPrincipalText}
                  ocid="wallet.deposit.vault_principal_copy"
                />
              )}
              {vaultAccountIdHex && (
                <CopyField
                  label="Vault Account ID"
                  value={vaultAccountIdHex}
                  ocid="wallet.deposit.vault_account_copy"
                />
              )}
            </div>

            <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground">
              If the NFT has not been sent yet, click{" "}
              <strong className="text-foreground">Prepare deposit</strong>, then
              send it from your external wallet to the vault principal. If it
              was already sent, skip prepare and click{" "}
              <strong className="text-foreground">Claim deposit</strong> to
              register the vaulted NFT inside the app.
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => prepareMutation.mutate()}
                disabled={
                  prepareMutation.isPending || !collectionId || !tokenId.trim()
                }
                data-ocid="wallet.deposit.prepare_button"
              >
                {prepareMutation.isPending ? "Preparing…" : "Prepare Deposit"}
              </Button>
              <Button
                onClick={() => claimMutation.mutate()}
                disabled={
                  claimMutation.isPending || !collectionId || !tokenId.trim()
                }
                data-ocid="wallet.deposit.claim_button"
              >
                {claimMutation.isPending ? "Claiming…" : "Claim Deposit"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MintComposer({
  mintConfig,
  moderationConfig,
  mainCollection,
  creatorCollections,
}: {
  mintConfig: MintConfig | null;
  moderationConfig: PublicModerationConfig | null;
  mainCollection: Collection | null;
  creatorCollections: Collection[];
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributesText, setAttributesText] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [confirmMintOpen, setConfirmMintOpen] = useState(false);
  const [cycleTopUpReason, setCycleTopUpReason] = useState<string | null>(null);

  const mainMintAvailable =
    mintConfig?.mainMintEnabled === true &&
    mintConfig.collectionId != null &&
    mainCollection != null;

  useEffect(() => {
    const targetStillAvailable =
      (selectedTarget === "main" && mainMintAvailable) ||
      creatorCollections.some(
        (collection) =>
          `collection:${collection.id.toString()}` === selectedTarget,
      );
    if (targetStillAvailable) return;
    if (mainMintAvailable) {
      setSelectedTarget("main");
      return;
    }
    if (creatorCollections.length > 0) {
      setSelectedTarget(`collection:${creatorCollections[0].id.toString()}`);
      return;
    }
    setSelectedTarget("");
  }, [creatorCollections, mainMintAvailable, selectedTarget]);

  const selectedCollection =
    creatorCollections.find(
      (collection) =>
        `collection:${collection.id.toString()}` === selectedTarget,
    ) ?? null;
  const targetCollection =
    selectedTarget === "main" ? mainCollection : selectedCollection;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!targetCollection)
        throw new Error("Select a Mintlab collection first");
      if (!imageDataUrl) throw new Error("Upload an image before minting");
      const metadata: NFTMetadata = {
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        imageUrl: imageDataUrl,
        attributes: parseAttributeLines(attributesText),
      };
      if (selectedTarget === "main") {
        const result = await actor.mintUserNFT(metadata);
        if (result.__kind__ === "err") throw new Error(result.err);
        return result.ok.nft;
      }
      const result = await actor.mintCollectionNFT(
        targetCollection.id,
        metadata,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (nft) => {
      const displayName = nft.metadata.name ?? `#${nft.tokenId}`;
      toast.success(
        `Minted ${displayName} into ${targetCollection?.name ?? "the collection"}`,
      );
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      void queryClient.invalidateQueries({ queryKey: ["userStats"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionNFTs", targetCollection?.id.toString() ?? ""],
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      setName("");
      setDescription("");
      setAttributesText("");
      setImageDataUrl(null);
      setFileName("");
    },
    onError: (err: unknown) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleTopUpReason(message);
        return;
      }
      toast.error(message);
    },
  });

  async function handleFileChange(file: File | null) {
    if (!file) {
      setImageDataUrl(null);
      setFileName("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageDataUrl(reader.result);
        setFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  function startMint() {
    try {
      if (!targetCollection)
        throw new Error("Select a Mintlab collection first");
      if (!imageDataUrl) throw new Error("Upload an image before minting");
      parseAttributeLines(attributesText);
      if (selectedTarget === "main" && mintConfig?.mainMintPriceE8s) {
        setConfirmMintOpen(true);
        return;
      }
      mutation.mutate();
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base flex items-center gap-2">
            <Coins className="w-4 h-4 text-accent" />
            Mint NFTs
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload artwork, choose a collection, and add optional traits for
            filtering and discovery.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!mintConfig ? (
            <p className="text-sm text-muted-foreground">
              Minting has not been configured by the admin yet.
            </p>
          ) : !mainMintAvailable && creatorCollections.length === 0 ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground">
                Create your first Mintlab collection on the Collections page, or
                wait for the admin to enable public minting into the main
                collection.
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
                Collection creation fee:{" "}
                <strong className="text-foreground">
                  {formatICP(mintConfig.collectionCreationPriceE8s)} ICP
                </strong>
                {mintConfig.collectionCreationEnabled
                  ? ""
                  : " - collection creation is currently disabled by the admin"}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="mint-collection">Mint target</Label>
                  <Select
                    value={selectedTarget}
                    onValueChange={setSelectedTarget}
                  >
                    <SelectTrigger
                      id="mint-collection"
                      data-ocid="wallet.mint.collection_select"
                    >
                      <SelectValue placeholder="Select a collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {mainMintAvailable && mainCollection && (
                        <SelectItem value="main">
                          {mainCollection.name} (
                          {formatICP(mintConfig.mainMintPriceE8s)} ICP)
                        </SelectItem>
                      )}
                      {creatorCollections.map((collection) => (
                        <SelectItem
                          key={collection.id.toString()}
                          value={`collection:${collection.id.toString()}`}
                        >
                          {collection.name} ({collection.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {targetCollection && (
                  <CopyField
                    label="Collection Canister"
                    value={targetCollection.canisterId.toString()}
                    ocid="wallet.mint.copy_canister_id"
                  />
                )}
              </div>

              <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground">
                {selectedTarget === "main"
                  ? `Minting into the main collection costs ${formatICP(mintConfig.mainMintPriceE8s)} ICP from your in-app account.`
                  : "Creator collections use their own dedicated ICRC-7 canister."}
              </div>

              {moderationConfig?.enabled && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
                  {moderationConfig.userMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="mint-name">NFT name</Label>
                  <Input
                    id="mint-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vault Original #1"
                    data-ocid="wallet.mint.name_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mint-image">Image upload</Label>
                  <Input
                    id="mint-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      void handleFileChange(e.target.files?.[0] ?? null)
                    }
                    data-ocid="wallet.mint.image_input"
                  />
                  <p className="text-xs text-muted-foreground">
                    {fileName || "Choose an image to store with the minted NFT"}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mint-description">Description</Label>
                <Textarea
                  id="mint-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your NFT…"
                  data-ocid="wallet.mint.description_textarea"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mint-attributes">
                  Attributes{" "}
                  <span className="text-muted-foreground">(Trait: Value)</span>
                </Label>
                <Textarea
                  id="mint-attributes"
                  rows={3}
                  value={attributesText}
                  onChange={(e) => setAttributesText(e.target.value)}
                  placeholder={"Rarity: Rare\nSeries: Genesis"}
                  data-ocid="wallet.mint.attributes_textarea"
                />
                <p className="text-xs text-muted-foreground">
                  Attributes are optional traits like Background: Blue or
                  Rarity: Rare. They appear as filters on collection pages.
                </p>
              </div>

              {imageDataUrl && (
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <img
                    src={imageDataUrl}
                    alt="Mint preview"
                    className="w-28 h-28 rounded-lg object-cover border border-border/50"
                  />
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={startMint}
                  disabled={mutation.isPending || !targetCollection}
                  className="gap-2"
                  data-ocid="wallet.mint.submit_button"
                >
                  <ImagePlus className="w-4 h-4" />
                  {mutation.isPending ? "Minting..." : "Mint NFT"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <PaymentConfirmationDialog
        open={confirmMintOpen}
        onOpenChange={setConfirmMintOpen}
        title="Confirm Mint Payment"
        description={
          moderationConfig?.enabled
            ? "Mintlab checks the upload against the current moderation policy before any ICP is transferred."
            : "Confirm the ICP payment from your in-app account before this NFT is minted."
        }
        lines={[
          {
            label: "Mint price",
            value: `${formatICP(mintConfig?.mainMintPriceE8s ?? 0n)} ICP`,
          },
          {
            label: "Ledger fee",
            value: `${formatICP(ICP_LEDGER_FEE_E8S)} ICP`,
          },
          {
            label: "Total debit",
            value: `${formatICP(
              (mintConfig?.mainMintPriceE8s ?? 0n) + ICP_LEDGER_FEE_E8S,
            )} ICP`,
          },
        ]}
        confirmLabel="Mint NFT"
        isPending={mutation.isPending}
        onConfirm={() => {
          setConfirmMintOpen(false);
          mutation.mutate();
        }}
        ocid="wallet.mint.payment_dialog"
      />
      <AppCanisterTopUpDialog
        open={cycleTopUpReason != null}
        reason={cycleTopUpReason}
        onOpenChange={(open) => {
          if (!open) setCycleTopUpReason(null);
        }}
        onSuccess={() => mutation.mutate()}
      />
    </>
  );
}

// ── StatsBar ───────────────────────────────────────────────────────────────

interface StatsBarProps {
  stats: NFTStats | undefined;
  isLoading: boolean;
}

function StatsBar({ stats, isLoading }: StatsBarProps) {
  const totalNFTs = stats ? Number(stats.totalCount) : 0;
  const totalCollections = stats ? stats.perCollection.length : 0;

  const items = [
    {
      icon: Wallet,
      label: "Total NFTs",
      value: isLoading ? null : totalNFTs,
      ocid: "wallet.stats.total_nfts",
    },
    {
      icon: Layers,
      label: "Collections",
      value: isLoading ? null : totalCollections,
      ocid: "wallet.stats.total_collections",
    },
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {items.map(({ icon: Icon, label, value, ocid }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-4 py-2.5"
          data-ocid={ocid}
        >
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent" />
          </div>
          {value === null ? (
            <Skeleton className="w-12 h-5" />
          ) : (
            <div className="min-w-0">
              <p className="font-display font-bold text-lg leading-none text-foreground">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── ReceivingInstructions ──────────────────────────────────────────────────

type SyncStatus =
  | { kind: "idle" }
  | { kind: "syncing" }
  | { kind: "ok"; newCount: number }
  | { kind: "upToDate" }
  | { kind: "error"; message: string };

interface ReceivingInstructionsProps {
  principalText: string | null;
  accountIdHex: string | null;
  onSync: () => void;
  syncStatus: SyncStatus;
}

function ReceivingInstructions({
  principalText,
  accountIdHex,
  onSync,
  syncStatus,
}: ReceivingInstructionsProps) {
  const isSyncing = syncStatus.kind === "syncing";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
      data-ocid="wallet.receiving_instructions"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border bg-accent/5">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-accent" />
          <span className="font-display font-semibold text-sm text-foreground">
            Receive NFTs &amp; ICP
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Sync status inline indicator */}
          {syncStatus.kind === "ok" && (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-xs text-accent font-medium"
              data-ocid="wallet.sync.success_state"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {syncStatus.newCount === 1
                ? "1 new NFT found"
                : `${syncStatus.newCount} new NFTs found`}
            </motion.span>
          )}
          {syncStatus.kind === "upToDate" && (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-xs text-muted-foreground"
              data-ocid="wallet.sync.success_state"
            >
              <Check className="w-3.5 h-3.5" />
              Up to date
            </motion.span>
          )}
          {syncStatus.kind === "error" && (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-destructive truncate max-w-[160px]"
              title={syncStatus.message}
              data-ocid="wallet.sync.error_state"
            >
              {syncStatus.message}
            </motion.span>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={onSync}
            disabled={isSyncing}
            data-ocid="wallet.refresh_button"
            aria-label="Sync NFTs from chain"
          >
            <RefreshCw
              className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Syncing…" : "Sync"}
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principalText && (
            <CopyField
              label="Principal ID — use to receive NFTs"
              value={principalText}
              ocid="wallet.copy_principal_button"
            />
          )}
          {accountIdHex ? (
            <CopyField
              label="Account ID — use to receive ICP"
              value={accountIdHex}
              ocid="wallet.copy_account_id_button"
            />
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Account ID — use to receive ICP
              </span>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          )}
        </div>

        {isSyncing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 bg-accent/5 border border-accent/20 rounded-lg"
            data-ocid="wallet.sync.loading_state"
          >
            <div className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin shrink-0" />
            <p className="text-xs text-accent leading-relaxed">
              Checking on-chain ownership across all collections — this may take
              up to 15 seconds…
            </p>
          </motion.div>
        )}

        <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">To receive NFTs:</strong> Share
            your <strong className="text-foreground">Principal ID</strong> with
            the sender (Plug wallet, other ICP apps). After sending, click{" "}
            <strong className="text-foreground">Sync</strong> to check on-chain
            ownership and auto-register any new NFTs. Use your{" "}
            <strong className="text-foreground">Account ID</strong> for
            receiving ICP token transfers.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── UnauthHero ─────────────────────────────────────────────────────────────

function UnauthHero({ login }: { login: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify-center text-center py-24 px-6"
      data-ocid="wallet.unauthenticated_hero"
    >
      <div className="relative mb-8">
        <div
          className="w-24 h-24 rounded-full nft-card-glow"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--accent) / 0.3) 0%, oklch(var(--primary) / 0.15) 60%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Wallet className="w-10 h-10 text-accent" />
        </div>
      </div>

      <h1 className="font-display font-bold text-4xl text-foreground mb-3">
        Your NFT Wallet
      </h1>
      <p className="text-muted-foreground text-lg max-w-md leading-relaxed mb-8">
        Connect with Internet Identity to view your NFTs, track collection
        stats, and register assets to your wallet.
      </p>

      <Button
        size="lg"
        onClick={login}
        className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2 font-semibold px-8 py-3"
        data-ocid="wallet.login_button"
      >
        <LogIn className="w-4 h-4" />
        Connect with Internet Identity
      </Button>

      <p className="text-xs text-muted-foreground mt-5">
        No account needed — Internet Identity is secure &amp; anonymous
      </p>
    </motion.div>
  );
}

// ── CollectionSection ─────────────────────────────────────────────────────

interface CollectionSectionProps {
  collection: Collection;
  nfts: WalletNFT[];
  listedNFTKeys: Set<string>;
  sectionIndex: number;
  isCreatorCollection: boolean;
  dividendBalances: Map<string, bigint>;
}

function CollectionSection({
  collection,
  nfts,
  listedNFTKeys,
  sectionIndex,
  isCreatorCollection,
  dividendBalances,
}: CollectionSectionProps) {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [detailNft, setDetailNft] = useState<WalletNFT | null>(null);
  const [sendNft, setSendNft] = useState<WalletNFT | null>(null);
  const collectionImageUrl = resolveImageUrl(collection.imageUrl);
  const isNFTListed = (nft: WalletNFT) =>
    listedNFTKeys.has(nftKey(nft.collectionId, nft.tokenId));

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: sectionIndex * 0.08 }}
      data-ocid={`wallet.collection.${sectionIndex + 1}`}
    >
      {/* Collection header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {collectionImageUrl && (
            <img
              src={collectionImageUrl}
              alt={collection.name}
              className="w-9 h-9 rounded-full border border-border/60 object-cover shrink-0"
            />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-bold text-foreground text-lg truncate">
                {collection.name}
              </h2>
              <Badge
                variant="secondary"
                className="font-mono text-xs shrink-0 bg-muted/60 text-muted-foreground border border-border/40"
              >
                {nfts.length} NFT{nfts.length !== 1 ? "s" : ""}
              </Badge>
              {isCreatorCollection && (
                <Badge className="shrink-0 bg-accent/10 text-accent border border-accent/20">
                  Your Collection
                </Badge>
              )}
              {collection.dividendConfig?.enabled && (
                <Badge className="shrink-0 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  Dividends
                </Badge>
              )}
            </div>
            <CollectionBadge
              collection={collection}
              size="sm"
              className="mt-0.5"
            />
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setRegisterOpen(true)}
          className="shrink-0 gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/60"
          data-ocid={`wallet.register_nft_button.${sectionIndex + 1}`}
          disabled={collection.kind !== "External"}
        >
          <Plus className="w-3.5 h-3.5" />
          {collection.kind === "External" ? "Import NFT" : "Mint in Studio"}
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Collection Canister
          </p>
          <p className="truncate font-mono text-sm text-foreground">
            {collection.canisterId.toString()}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5"
          onClick={() => {
            void navigator.clipboard.writeText(
              collection.canisterId.toString(),
            );
            toast.success("Collection canister copied");
          }}
          data-ocid={`wallet.copy_collection_canister.${sectionIndex + 1}`}
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </Button>
      </div>

      {/* NFT grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {nfts.map((nft, i) => (
          <div key={nft.id.toString()} className="relative group">
            <NFTCard
              nft={nft}
              collection={collection}
              isListed={isNFTListed(nft)}
              dividendE8s={
                dividendBalances.get(nftKey(nft.collectionId, nft.tokenId)) ??
                0n
              }
              index={i}
              onClick={() => setDetailNft(nft)}
              data-ocid={`wallet.nft.item.${sectionIndex * 100 + i + 1}`}
            />
            {/* Send button overlay */}
            <button
              type="button"
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-accent-foreground rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg hover:bg-accent/90"
              onClick={(e) => {
                e.stopPropagation();
                setSendNft(nft);
              }}
              data-ocid={`wallet.send_nft_button.${sectionIndex * 100 + i + 1}`}
              aria-label={`Send ${nft.metadata.name ?? `NFT #${nft.tokenId}`}`}
              disabled={nft.location === "Registered" || isNFTListed(nft)}
              hidden={nft.location === "Registered" || isNFTListed(nft)}
            >
              <Send className="w-3 h-3" />
              Send
            </button>
          </div>
        ))}
      </div>

      <RegisterNFTModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        collection={collection}
      />

      {sendNft && (
        <SendNFTModal
          open={!!sendNft}
          onClose={() => setSendNft(null)}
          nft={sendNft}
          collection={collection}
        />
      )}

      {detailNft && (
        <NFTDetailsModal
          open={!!detailNft}
          onClose={() => setDetailNft(null)}
          nft={detailNft}
          collection={collection}
          isListed={isNFTListed(detailNft)}
          dividendE8s={
            dividendBalances.get(
              nftKey(detailNft.collectionId, detailNft.tokenId),
            ) ?? 0n
          }
          onSend={
            detailNft.location === "Registered" || isNFTListed(detailNft)
              ? undefined
              : () => {
                  setDetailNft(null);
                  setSendNft(detailNft);
                }
          }
        />
      )}
    </motion.section>
  );
}

// ── WalletPage ─────────────────────────────────────────────────────────────

export default function WalletPage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
    login,
    principal,
    principalText,
  } = useAuth();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const bootstrappedRef = useRef(false);
  const autoSyncedPrincipalRef = useRef<string | null>(null);

  // Bootstrap admin on first login
  useEffect(() => {
    if (isAuthenticated && actor && !isFetching && !bootstrappedRef.current) {
      bootstrappedRef.current = true;
      actor
        .bootstrapAdmin()
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
          queryClient.invalidateQueries({ queryKey: ["adminPrincipal"] });
        })
        .catch(() => {
          // Already bootstrapped — silent
        });
    }
  }, [isAuthenticated, actor, isFetching, queryClient]);

  // ── queries ──────────────────────────────────────────────────────────────

  const {
    data: userNFTs,
    isLoading: nftsLoading,
    refetch: refetchNFTs,
  } = useQuery<WalletNFT[]>({
    queryKey: ["userNFTs", principalText],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getUserNFTs(principal);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
  });

  const { data: userStats, isLoading: statsLoading } = useQuery<NFTStats>({
    queryKey: ["userStats", principalText],
    queryFn: async () => {
      if (!actor || !principal) throw new Error("No actor");
      return actor.getNFTStats(principal);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
  });

  const { data: collections } = useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: accountIdBytes } = useQuery<Uint8Array>({
    queryKey: ["userAccountId", principalText],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getUserAccountId();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: vaultPrincipal } = useQuery<Principal | null>({
    queryKey: ["vaultPrincipal"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVaultPrincipal();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: vaultAccountIdBytes } = useQuery<Uint8Array | null>({
    queryKey: ["vaultAccountId"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVaultAccountId();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: mintConfig } = useQuery<MintConfig | null>({
    queryKey: ["mintConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMintConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: moderationConfig } = useQuery<PublicModerationConfig | null>({
    queryKey: ["moderationConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModerationConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: myCreatedCollections = [] } = useQuery<Collection[]>({
    queryKey: ["myCreatedCollections", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCreatedCollections();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: activeListingDetails = [] } = useQuery<ActiveListingDetail[]>({
    queryKey: ["activeListingDetails"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveListingDetails();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: myDividendNFTs = [] } = useQuery<NFTDividend[]>({
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

  // ── derived data ─────────────────────────────────────────────────────────

  const accountIdHex = accountIdBytes ? accountIdToHex(accountIdBytes) : null;
  const vaultPrincipalText = vaultPrincipal?.toString() ?? null;
  const vaultAccountIdHex = vaultAccountIdBytes
    ? accountIdToHex(vaultAccountIdBytes)
    : null;
  const listedNFTKeys = new Set(
    activeListingDetails
      .filter((detail) => {
        const seller =
          detail.listing.__kind__ === "Fixed"
            ? detail.listing.Fixed.seller
            : detail.listing.Auction.seller;
        return principal ? seller.toString() === principal.toString() : false;
      })
      .map((detail) => nftKey(detail.nft.collectionId, detail.nft.tokenId)),
  );

  const collectionMap = new Map<bigint, Collection>();
  for (const c of collections ?? []) {
    collectionMap.set(c.id, c);
  }
  const myCreatedCollectionIds = new Set(
    myCreatedCollections.map((collection) => collection.id),
  );
  const dividendBalances = new Map<string, bigint>(
    myDividendNFTs.map((item) => [
      nftKey(item.nft.collectionId, item.nft.tokenId),
      item.claimableE8s,
    ]),
  );

  const nftsByCollection = new Map<bigint, WalletNFT[]>();
  for (const nft of userNFTs ?? []) {
    const existing = nftsByCollection.get(nft.collectionId) ?? [];
    existing.push(nft);
    nftsByCollection.set(nft.collectionId, existing);
  }

  const collectionEntries: Array<{
    collection: Collection;
    nfts: WalletNFT[];
  }> = [];
  nftsByCollection.forEach((nfts, collId) => {
    const coll = collectionMap.get(collId);
    if (coll) collectionEntries.push({ collection: coll, nfts });
  });

  const hasNFTs = (userNFTs?.length ?? 0) > 0;
  const dataLoading = nftsLoading || statsLoading || isFetching;

  // ── sync state ────────────────────────────────────────────────────────────

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ kind: "idle" });

  // Auto-clear "ok" / "upToDate" / "error" status after 6 seconds
  useEffect(() => {
    if (
      syncStatus.kind === "ok" ||
      syncStatus.kind === "upToDate" ||
      syncStatus.kind === "error"
    ) {
      const id = setTimeout(() => setSyncStatus({ kind: "idle" }), 6000);
      return () => clearTimeout(id);
    }
  }, [syncStatus]);

  const handleSync = useCallback(
    async (options: { silent?: boolean } = {}) => {
      if (!actor) return;
      const silent = options.silent === true;
      if (!silent) setSyncStatus({ kind: "syncing" });

      try {
        // Cast to access syncUserNFTs which may not yet be in generated typings.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const actorAny = actor as any;

        if (typeof actorAny.syncUserNFTs !== "function") {
          // Fallback: just re-fetch from local state and show "up to date"
          await refetchNFTs();
          if (!silent) setSyncStatus({ kind: "upToDate" });
          return;
        }

        const result = await (actorAny.syncUserNFTs() as Promise<
          { ok: { newCount: bigint; errors: Array<string> } } | { err: string }
        >);

        if ("err" in result) {
          if (!silent) {
            setSyncStatus({ kind: "error", message: result.err });
            toast.error(`Sync failed: ${result.err}`);
          }
        } else {
          const newCount = Number(result.ok.newCount);
          if (result.ok.errors.length > 0) {
            console.warn("[syncUserNFTs] partial errors:", result.ok.errors);
          }
          if (newCount > 0) {
            if (!silent) {
              setSyncStatus({ kind: "ok", newCount });
              toast.success(
                newCount === 1
                  ? "Synced — 1 new NFT found and registered!"
                  : `Synced — ${newCount} new NFTs found and registered!`,
              );
            }
          } else {
            if (!silent) {
              setSyncStatus({ kind: "upToDate" });
              toast.success("Wallet is up to date");
            }
          }
        }
      } catch (err) {
        const msg = extractError(err);
        if (!silent) {
          setSyncStatus({ kind: "error", message: msg });
          toast.error(`Sync error: ${msg}`);
        }
      } finally {
        // Always refresh the local list after sync attempt
        void refetchNFTs();
        void queryClient.invalidateQueries({ queryKey: ["userStats"] });
      }
    },
    [actor, queryClient, refetchNFTs],
  );

  useEffect(() => {
    if (
      !actor ||
      !isAuthenticated ||
      !principalText ||
      isFetching ||
      nftsLoading ||
      !collections
    ) {
      return;
    }

    if (autoSyncedPrincipalRef.current === principalText) return;

    autoSyncedPrincipalRef.current = principalText;
    void handleSync({ silent: true });
  }, [
    actor,
    collections,
    isAuthenticated,
    isFetching,
    nftsLoading,
    principalText,
    handleSync,
  ]);

  // ── render: not authenticated ─────────────────────────────────────────────

  if (!isAuthenticated && !authLoading) {
    return <UnauthHero login={login} />;
  }

  // ── render: loading ───────────────────────────────────────────────────────

  if (authLoading || (isAuthenticated && dataLoading && !userNFTs)) {
    return (
      <div
        className="px-4 md:px-8 py-8 space-y-8 max-w-7xl mx-auto"
        data-ocid="wallet.loading_state"
      >
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-16 w-44 rounded-xl" />
          <Skeleton className="h-16 w-44 rounded-xl" />
        </div>
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="h-px bg-border" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <Skeleton key={k} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ── render: authenticated ─────────────────────────────────────────────────

  return (
    <div
      className="px-4 md:px-8 py-8 space-y-8 max-w-7xl mx-auto"
      data-ocid="wallet.page"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-1"
      >
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
          My Wallet
        </h1>
        <p className="text-sm text-muted-foreground">
          Your NFTs and account details
        </p>
      </motion.div>

      {/* Stats bar */}
      <StatsBar stats={userStats} isLoading={statsLoading} />

      {/* Receiving instructions — prominent address section */}
      <ReceivingInstructions
        principalText={principalText}
        accountIdHex={accountIdHex}
        onSync={handleSync}
        syncStatus={syncStatus}
      />

      <VaultDepositCard
        collections={collections ?? []}
        vaultPrincipalText={vaultPrincipalText}
        vaultAccountIdHex={vaultAccountIdHex}
      />

      <MintComposer
        mintConfig={mintConfig ?? null}
        moderationConfig={moderationConfig ?? null}
        mainCollection={
          mintConfig?.collectionId
            ? (collectionMap.get(mintConfig.collectionId) ?? null)
            : null
        }
        creatorCollections={myCreatedCollections}
      />

      <div className="h-px bg-border" />

      {/* NFT grid — grouped by collection */}
      {!hasNFTs ? (
        <>
          <EmptyState
            icon={Wallet}
            title="No NFTs yet"
            description="Register an NFT you received externally, import a supported collection, or create your own Mintlab collection first. Use your Principal ID above to receive NFTs from any ICP wallet."
            data-ocid="wallet.empty_state"
          />
          {/* Supported collections */}
          {(collections ?? []).length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Supported collections — register an NFT from any of these:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {(collections ?? []).map((c, idx) => {
                  const collectionImageUrl = resolveImageUrl(c.imageUrl);
                  return (
                    <div
                      key={c.id.toString()}
                      className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5 text-sm"
                      data-ocid={`wallet.supported_collection.${idx + 1}`}
                    >
                      {collectionImageUrl && (
                        <img
                          src={collectionImageUrl}
                          alt={c.name}
                          className="w-5 h-5 rounded-full border border-border/50 object-cover"
                        />
                      )}
                      <span className="font-medium text-foreground truncate max-w-[140px]">
                        {c.name}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {truncate(c.canisterId.toString(), 5, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-10" data-ocid="wallet.nft_list">
          {collectionEntries.map(({ collection, nfts }, idx) => (
            <CollectionSection
              key={collection.id.toString()}
              collection={collection}
              nfts={nfts}
              listedNFTKeys={listedNFTKeys}
              sectionIndex={idx}
              isCreatorCollection={myCreatedCollectionIds.has(collection.id)}
              dividendBalances={dividendBalances}
            />
          ))}
        </div>
      )}
    </div>
  );
}
