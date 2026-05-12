import { AppCanisterTopUpDialog } from "@/components/AppCanisterTopUpDialog";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MediaImage } from "@/components/MediaImage";
import { PaymentConfirmationDialog } from "@/components/PaymentConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { isLowCyclesError } from "@/lib/cycles";
import { resolveImageUrl } from "@/lib/media";
import type {
  ActiveListingDetail,
  Collection,
  CollectionBrowseInfo,
  CollectionBrowseStats,
  CollectionCanisterControllers,
  CollectionCanisterStatus,
  CollectionCycleTopUpQuote,
  MintConfig,
  NFTMetadata,
  PublicModerationConfig,
  WalletNFT,
} from "@/types";
import { Principal } from "@icp-sdk/core/principal";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  CircleDollarSign,
  Copy,
  ExternalLink,
  Grid3X3,
  ImageOff,
  Info,
  Layers,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

// ── helpers ────────────────────────────────────────────────────────────────

function standardLabel(standard: Collection["standard"]): string {
  if (standard.__kind__ === "EXT") return "EXT";
  if (standard.__kind__ === "DIP721") return "DIP721";
  if (standard.__kind__ === "ICRC7") return "ICRC-7";
  return standard.Other ?? "Other";
}

function nftKey(collectionId: bigint, tokenId: string): string {
  return `${collectionId.toString()}:${tokenId}`;
}

const E8S = 100_000_000n;
const MAX_ON_CHAIN_IMAGE_CHARS = 1_500_000;

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const fraction = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

function formatCycles(cycles: bigint): string {
  const trillion = 1_000_000_000_000n;
  if (cycles < trillion) return cycles.toString();
  const hundredths = (cycles * 100n) / trillion;
  const whole = hundredths / 100n;
  const fraction = (hundredths % 100n).toString().padStart(2, "0");
  return `${whole}.${fraction}T`;
}

function accountIdToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function makeStandard(value: string): Collection["standard"] {
  if (value === "EXT") return { __kind__: "EXT", EXT: null };
  if (value === "DIP721") return { __kind__: "DIP721", DIP721: null };
  return { __kind__: "ICRC7", ICRC7: null };
}

function parseOptionalNat(value: string): bigint | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) {
    throw new Error("Enter whole numbers only for browse settings");
  }
  return BigInt(trimmed);
}

function parseCyclesInput(value: string): bigint | null {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  return BigInt(trimmed);
}

function buildBrowseInfo(
  standard: ImportCollectionFormValues["standard"],
  totalSupply: string,
  tokenIndexOffset: string,
): CollectionBrowseInfo | null {
  if (standard === "ICRC7") return null;

  const parsedTotalSupply = parseOptionalNat(totalSupply);
  const parsedTokenIndexOffset = parseOptionalNat(tokenIndexOffset);

  if (parsedTotalSupply == null && parsedTokenIndexOffset == null) {
    return null;
  }

  return {
    totalSupply: parsedTotalSupply,
    tokenIndexOffset: parsedTokenIndexOffset,
  };
}

function browseCoverageLabel(stats: CollectionBrowseStats): string {
  if (stats.coverage === "Full") {
    return `${stats.totalCount.toString()} NFT${stats.totalCount === 1n ? "" : "s"}`;
  }
  return `${stats.visibleCount.toString()} indexed`;
}

function isValidPrincipal(value: string): boolean {
  try {
    Principal.fromText(value);
    return true;
  } catch {
    return false;
  }
}

function extractError(err: unknown): string {
  if (err instanceof Error) return err.message || "Something went wrong";
  if (typeof err === "string") return err;
  return "Something went wrong";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read image file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}

async function readImageFileAsDataUrl(file: File): Promise<string> {
  if (file.type && !file.type.startsWith("image/")) {
    throw new Error("Choose an image file");
  }
  const dataUrl = await readFileAsDataUrl(file);
  if (dataUrl.length > MAX_ON_CHAIN_IMAGE_CHARS) {
    throw new Error("Uploaded image is too large for on-chain storage");
  }
  return dataUrl;
}

interface CopyFieldProps {
  label: string;
  value: string;
  ocid: string;
}

function CopyField({ label, value, ocid }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    toast.success(`${label} copied`);
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
          className="shrink-0 h-7 w-7 text-muted-foreground hover:text-foreground"
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

interface ImportCollectionFormValues {
  name: string;
  symbol: string;
  description: string;
  canisterId: string;
  standard: "EXT" | "DIP721" | "ICRC7";
  imageUrl: string;
  totalSupply: string;
  tokenIndexOffset: string;
}

const defaultImportValues: ImportCollectionFormValues = {
  name: "",
  symbol: "",
  description: "",
  canisterId: "",
  standard: "EXT",
  imageUrl: "",
  totalSupply: "",
  tokenIndexOffset: "",
};

function ImportCollectionCard({
  onImported,
}: {
  onImported: (collection: Collection) => void;
}) {
  const { actor } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [values, setValues] =
    useState<ImportCollectionFormValues>(defaultImportValues);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageFileInputKey, setImageFileInputKey] = useState(0);

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!isAuthenticated) throw new Error("Sign in to import a collection");
      if (!values.name.trim()) throw new Error("Collection name is required");
      if (!values.symbol.trim())
        throw new Error("Collection symbol is required");
      if (!values.description.trim())
        throw new Error("Collection description is required");
      if (!isValidPrincipal(values.canisterId.trim())) {
        throw new Error("Enter a valid collection canister ID");
      }
      const collectionImage = (imageDataUrl || values.imageUrl).trim();
      if (!collectionImage) {
        throw new Error("Upload a collection image or add an image URL");
      }
      if (collectionImage.length > MAX_ON_CHAIN_IMAGE_CHARS) {
        throw new Error("Collection image is too large for on-chain storage");
      }
      return actor.addCollection(
        values.name.trim(),
        values.description.trim(),
        Principal.fromText(values.canisterId.trim()),
        makeStandard(values.standard),
        collectionImage,
        values.symbol.trim().toUpperCase(),
        buildBrowseInfo(
          values.standard,
          values.totalSupply,
          values.tokenIndexOffset,
        ),
      );
    },
    onSuccess: (collection) => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success(
        `${collection.name} is now available to everyone in Mintlab`,
      );
      setValues(defaultImportValues);
      setImageDataUrl("");
      setImageFileName("");
      setImageFileInputKey((current) => current + 1);
      onImported(collection);
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  function updateField<K extends keyof ImportCollectionFormValues>(
    key: K,
    value: ImportCollectionFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function updateImageUrl(value: string) {
    if (imageDataUrl) {
      setImageFileInputKey((current) => current + 1);
    }
    setImageDataUrl("");
    setImageFileName("");
    updateField("imageUrl", value);
  }

  async function handleImportImageFile(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      setImageFileName(file.name);
      updateField("imageUrl", "");
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  const selectedImage = imageDataUrl || values.imageUrl;
  const imagePreviewUrl = resolveImageUrl(selectedImage);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="w-4 h-4 text-accent" />
          Import an ICP NFT Collection
        </CardTitle>
        <CardDescription className="text-sm">
          Add a supported collection from another ICP app or website. Once it is
          added, the collection appears in Mintlab for every user.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">What you need</p>
          <p className="mt-1">
            Paste the collection canister ID, choose the NFT standard, and add
            the display details you want Mintlab to show. EXT, DIP721, and
            ICRC-7 collections are supported. Add the collection size for EXT
            and DIP721 imports so everyone can browse the full collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="import-name">Collection name</Label>
            <Input
              id="import-name"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="e.g. Motoko Mugs"
              data-ocid="collections.import.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="import-symbol">Symbol</Label>
            <Input
              id="import-symbol"
              value={values.symbol}
              onChange={(event) =>
                updateField("symbol", event.target.value.toUpperCase())
              }
              placeholder="e.g. MUG"
              data-ocid="collections.import.symbol_input"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="import-description">Description</Label>
          <Textarea
            id="import-description"
            rows={3}
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Tell collectors what this collection is about…"
            data-ocid="collections.import.description_textarea"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="import-canister">Collection canister ID</Label>
            <Input
              id="import-canister"
              className="font-mono text-sm"
              value={values.canisterId}
              onChange={(event) =>
                updateField("canisterId", event.target.value)
              }
              placeholder="ryjl3-tyaaa-aaaaa-aaaba-cai"
              data-ocid="collections.import.canister_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="import-standard">NFT standard</Label>
            <Select
              value={values.standard}
              onValueChange={(value: "EXT" | "DIP721" | "ICRC7") =>
                updateField("standard", value)
              }
            >
              <SelectTrigger
                id="import-standard"
                data-ocid="collections.import.standard_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXT">EXT</SelectItem>
                <SelectItem value="DIP721">DIP721</SelectItem>
                <SelectItem value="ICRC7">ICRC-7</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {values.standard !== "ICRC7" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="import-supply">Collection size</Label>
              <Input
                id="import-supply"
                inputMode="numeric"
                value={values.totalSupply}
                onChange={(event) =>
                  updateField("totalSupply", event.target.value)
                }
                placeholder="e.g. 1000"
                data-ocid="collections.import.total_supply_input"
              />
              <p className="text-xs text-muted-foreground">
                Recommended for full browsing of imported {values.standard}{" "}
                NFTs.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="import-offset">First token index</Label>
              <Input
                id="import-offset"
                inputMode="numeric"
                value={values.tokenIndexOffset}
                onChange={(event) =>
                  updateField("tokenIndexOffset", event.target.value)
                }
                placeholder="Default: 0"
                data-ocid="collections.import.token_offset_input"
              />
              <p className="text-xs text-muted-foreground">
                Use `1` if the collection starts token IDs at 1 instead of 0.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="import-image-file">Collection image</Label>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div className="space-y-1.5">
              <Input
                key={imageFileInputKey}
                id="import-image-file"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  void handleImportImageFile(event.target.files?.[0] ?? null)
                }
                data-ocid="collections.import.image_file_input"
              />
              <p className="text-xs text-muted-foreground">
                {imageFileName || "Choose an image from this device"}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="import-image"
                className="text-xs text-muted-foreground"
              >
                Or image URL
              </Label>
              <Input
                id="import-image"
                value={values.imageUrl}
                onChange={(event) => updateImageUrl(event.target.value)}
                placeholder="https://… or ipfs://…"
                data-ocid="collections.import.image_input"
              />
            </div>
            <div className="w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Collection preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageOff className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
            Sign in with Internet Identity to import a collection into the
            shared Mintlab directory.
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={() => importMutation.mutate()}
            disabled={importMutation.isPending || !isAuthenticated}
            className="gap-2"
            data-ocid="collections.import.submit_button"
          >
            {importMutation.isPending ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Importing…
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Collection
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateCollectionCard({
  mintConfig,
  moderationConfig,
  onCreated,
}: {
  mintConfig: MintConfig | null;
  moderationConfig: PublicModerationConfig | null;
  onCreated: (collection: Collection) => void;
}) {
  const { actor } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [dividendsEnabled, setDividendsEnabled] = useState(false);
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);
  const [cycleTopUpReason, setCycleTopUpReason] = useState<string | null>(null);

  const { data: creationQuote } = useQuery({
    queryKey: [
      "collectionCreationQuote",
      mintConfig?.collectionCanisterCycles.toString() ?? "none",
      mintConfig?.collectionCreationPriceE8s.toString() ?? "none",
    ],
    queryFn: async () => {
      if (!actor || !mintConfig) return null;
      return actor.quoteCollectionCreationCost(
        mintConfig.collectionCanisterCycles,
        mintConfig.collectionCreationPriceE8s,
      );
    },
    enabled: !!actor && !!mintConfig,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!isAuthenticated) throw new Error("Sign in to create a collection");
      if (!mintConfig?.collectionCreationEnabled) {
        throw new Error("Collection creation is currently disabled");
      }
      if (!mintConfig.collectionCanisterWasmUploaded) {
        throw new Error("Collection canister creation is not ready yet");
      }
      if (!name.trim()) throw new Error("Collection name is required");
      if (!symbol.trim()) throw new Error("Collection symbol is required");
      if (!description.trim())
        throw new Error("Collection description is required");
      if (!imageDataUrl) throw new Error("Upload a collection image");
      const result = await actor.createUserCollection(
        name.trim(),
        description.trim(),
        symbol.trim().toUpperCase(),
        imageDataUrl,
        dividendsEnabled,
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (receipt) => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["myCreatedCollections"],
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      toast.success(
        `${receipt.collection.name} created at ICP block ${receipt.paymentBlock.toString()}`,
      );
      setName("");
      setSymbol("");
      setDescription("");
      setImageDataUrl("");
      setImageFileName("");
      setDividendsEnabled(false);
      onCreated(receipt.collection);
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

  async function handleImageFile(file: File | null) {
    if (!file) {
      setImageDataUrl("");
      setImageFileName("");
      return;
    }
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      setImageFileName(file.name);
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  function openCreateConfirmation() {
    try {
      if (!actor) throw new Error("Backend not connected");
      if (!isAuthenticated) throw new Error("Sign in to create a collection");
      if (!mintConfig?.collectionCreationEnabled) {
        throw new Error("Collection creation is currently disabled");
      }
      if (!mintConfig.collectionCanisterWasmUploaded) {
        throw new Error("Collection canister creation is not ready yet");
      }
      if (!creationQuote) {
        throw new Error("Collection creation quote is still loading");
      }
      if (!name.trim()) throw new Error("Collection name is required");
      if (!symbol.trim()) throw new Error("Collection symbol is required");
      if (!description.trim())
        throw new Error("Collection description is required");
      if (!imageDataUrl) throw new Error("Upload a collection image");
      setConfirmCreateOpen(true);
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-4 h-4 text-accent" />
            Create Your Mintlab Collection
          </CardTitle>
          <CardDescription className="text-sm">
            Pay the admin-set collection fee from your in-app ICP balance,
            launch your own collection, then mint, list, and transfer NFTs
            however you want.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!mintConfig ? (
            <div className="rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
              The admin has not configured collection creation yet.
            </div>
          ) : (
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground">
              Creation fee:{" "}
              <strong className="text-foreground">
                {formatICP(mintConfig.collectionCreationPriceE8s)} ICP
              </strong>
              .{" "}
              {creationQuote ? (
                <>
                  {formatICP(creationQuote.cycleCostE8s)} ICP is converted into{" "}
                  {formatCycles(creationQuote.totalCyclesToConvert)} cycles, the
                  new canister receives{" "}
                  {formatCycles(creationQuote.collectionCanisterCycles)}, and{" "}
                  {formatICP(creationQuote.adminPayoutE8s)} ICP goes to the
                  admin payout account. Ledger fees bring the total debit to{" "}
                  {formatICP(creationQuote.totalUserDebitE8s)} ICP.
                </>
              ) : (
                "Part of the fee is converted into cycles for the new collection canister and the remainder goes to the admin payout account."
              )}
            </div>
          )}

          {moderationConfig?.enabled && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
              {moderationConfig.userMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="create-name">Collection name</Label>
            <Input
              id="create-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Studio Zero"
              data-ocid="collections.create.name_input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="create-symbol">Symbol</Label>
              <Input
                id="create-symbol"
                value={symbol}
                onChange={(event) =>
                  setSymbol(event.target.value.toUpperCase())
                }
                placeholder="e.g. ST0"
                data-ocid="collections.create.symbol_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-image">Collection image</Label>
              <Input
                id="create-image"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  void handleImageFile(event.target.files?.[0] ?? null)
                }
                data-ocid="collections.create.image_input"
              />
              <p className="text-xs text-muted-foreground">
                {imageFileName || "Choose an image from this device"}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="create-description">Description</Label>
            <Textarea
              id="create-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your collection for everyone browsing Mintlab…"
              data-ocid="collections.create.description_textarea"
            />
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
            Your collection gets its own ICRC-7 canister controlled by you and
            Mintlab. You can copy the canister ID from the collection card and
            wallet views.
          </div>

          <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/20 p-3">
            <div className="space-y-1">
              <Label
                htmlFor="create-dividends"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <CircleDollarSign className="w-4 h-4 text-accent" />
                Enable collection dividends
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Creates a dedicated ICP address for this collection so deposits
                can be split evenly across its NFTs.
              </p>
            </div>
            <Switch
              id="create-dividends"
              checked={dividendsEnabled}
              onCheckedChange={setDividendsEnabled}
              data-ocid="collections.create.dividends_switch"
            />
          </div>

          {!isAuthenticated && (
            <div className="rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
              Sign in with Internet Identity to create a collection.
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={openCreateConfirmation}
              disabled={
                createMutation.isPending ||
                !isAuthenticated ||
                !mintConfig?.collectionCreationEnabled ||
                !mintConfig?.collectionCanisterWasmUploaded ||
                !creationQuote
              }
              className="gap-2"
              data-ocid="collections.create.submit_button"
            >
              {createMutation.isPending ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Collection
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      <PaymentConfirmationDialog
        open={confirmCreateOpen}
        onOpenChange={setConfirmCreateOpen}
        title="Confirm Collection Payment"
        description={
          moderationConfig?.enabled
            ? "Mintlab checks the upload against the current moderation policy before any ICP is transferred."
            : "Confirm the ICP payment from your in-app account before Mintlab creates your collection canister."
        }
        lines={[
          {
            label: "Collection fee",
            value: `${formatICP(mintConfig?.collectionCreationPriceE8s ?? 0n)} ICP`,
          },
          {
            label: "Converted to cycles",
            value: creationQuote
              ? `${formatICP(creationQuote.cycleCostE8s)} ICP`
              : "Loading",
          },
          {
            label: "New canister cycles",
            value: creationQuote
              ? formatCycles(creationQuote.collectionCanisterCycles)
              : "Loading",
          },
          {
            label: "Ledger fees",
            value: creationQuote
              ? `${formatICP(
                  creationQuote.cycleTransferFeeE8s +
                    creationQuote.adminPayoutFeeE8s,
                )} ICP`
              : "Loading",
          },
          {
            label: "Total debit",
            value: creationQuote
              ? `${formatICP(creationQuote.totalUserDebitE8s)} ICP`
              : "Loading",
          },
        ]}
        confirmLabel="Create Collection"
        isPending={createMutation.isPending}
        onConfirm={() => {
          setConfirmCreateOpen(false);
          createMutation.mutate();
        }}
        ocid="collections.create.payment_dialog"
      />
      <AppCanisterTopUpDialog
        open={cycleTopUpReason != null}
        reason={cycleTopUpReason}
        onOpenChange={(open) => {
          if (!open) setCycleTopUpReason(null);
        }}
        onSuccess={() => createMutation.mutate()}
      />
    </>
  );
}

// ── CollectionGrid ─────────────────────────────────────────────────────────

interface CollectionCardProps {
  collection: Collection;
  browseStats?: CollectionBrowseStats;
  cycleStatus?: CollectionCanisterStatus;
  index: number;
  isCreatorCollection: boolean;
  canManageCollection: boolean;
  isMainAppCollection: boolean;
  onClick: () => void;
  onTopUp?: (collection: Collection) => void;
  onUpgrade?: (collection: Collection) => void;
  onRetryInstall?: (collection: Collection) => void;
  onManageControllers?: (collection: Collection) => void;
  isUpgrading?: boolean;
  isRetryingInstall?: boolean;
}

function CollectionCard({
  collection,
  browseStats,
  cycleStatus,
  index,
  isCreatorCollection,
  canManageCollection,
  isMainAppCollection,
  onClick,
  onTopUp,
  onUpgrade,
  onRetryInstall,
  onManageControllers,
  isUpgrading = false,
  isRetryingInstall = false,
}: CollectionCardProps) {
  const coverage = browseStats?.coverage ?? "Partial";
  const countLabel = browseStats
    ? browseCoverageLabel(browseStats)
    : "Loading…";
  const dividendsEnabled = collection.dividendConfig?.enabled === true;
  const moduleMissing = cycleStatus?.moduleInstalled === false;
  const wasmActionPending = moduleMissing ? isRetryingInstall : isUpgrading;
  const imageUrl = resolveImageUrl(collection.imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group nft-card-glow cursor-pointer rounded-2xl border border-border bg-card overflow-hidden hover:border-accent/40 transition-smooth"
      onClick={onClick}
      data-ocid={`collections.collection.item.${index + 1}`}
    >
      {/* Cover image */}
      <div className="aspect-video overflow-hidden bg-muted relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={collection.name}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layers className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm border border-border/60 text-foreground font-mono text-xs">
          {standardLabel(collection.standard)}
        </Badge>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <p className="font-display font-bold text-foreground truncate">
              {collection.name}
            </p>
            <div className="mt-0.5 flex items-center gap-2 flex-wrap">
              <p className="font-mono text-xs text-muted-foreground">
                {collection.symbol}
              </p>
              {isCreatorCollection && (
                <Badge className="bg-accent/10 text-accent border border-accent/20 text-[10px]">
                  Created by You
                </Badge>
              )}
              {!isCreatorCollection && canManageCollection && (
                <Badge className="bg-accent/10 text-accent border border-accent/20 text-[10px]">
                  Admin Managed
                </Badge>
              )}
              {dividendsEnabled && (
                <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px]">
                  Dividends
                </Badge>
              )}
            </div>
          </div>
          <Badge
            variant="secondary"
            className="shrink-0 bg-accent/10 text-accent border border-accent/20 text-xs font-semibold"
          >
            {countLabel}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {collection.description}
        </p>
        {coverage === "Partial" && (
          <p className="text-[11px] text-muted-foreground">
            Showing indexed NFTs until full browse details are available.
          </p>
        )}
        {canManageCollection && (
          <div className="rounded-lg border border-border bg-muted/20 p-2 text-[11px] text-muted-foreground space-y-1">
            {isMainAppCollection ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span>Wasm module</span>
                  <span className="font-mono text-foreground">
                    App canister
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>OISY import</span>
                  <span className="font-mono text-foreground">Included</span>
                </div>
              </>
            ) : cycleStatus ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span>Cycle balance</span>
                  <span className="font-mono text-foreground">
                    {formatCycles(cycleStatus.cycles)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Wasm module</span>
                  <span className="font-mono text-foreground">
                    {cycleStatus.moduleInstalled ? "Installed" : "Missing"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Controllers</span>
                  <span className="font-mono text-foreground">
                    {cycleStatus.controllers.length}
                  </span>
                </div>
              </>
            ) : (
              <span>Cycle status loading…</span>
            )}
          </div>
        )}
        <div className="pt-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/60 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            data-ocid={`collections.browse_button.${index + 1}`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            Browse Collection
          </Button>
          {canManageCollection && !isMainAppCollection && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onTopUp?.(collection);
                }}
                data-ocid={`collections.top_up_button.${index + 1}`}
              >
                <Plus className="w-3.5 h-3.5" />
                Top Up
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs"
                disabled={wasmActionPending}
                onClick={(e) => {
                  e.stopPropagation();
                  if (moduleMissing) {
                    onRetryInstall?.(collection);
                  } else {
                    onUpgrade?.(collection);
                  }
                }}
                data-ocid={`collections.upgrade_button.${index + 1}`}
              >
                {wasmActionPending ? (
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                {moduleMissing ? "Install Wasm" : "Update Wasm"}
              </Button>
            </div>
          )}
          {canManageCollection && !isMainAppCollection && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full gap-1.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onManageControllers?.(collection);
              }}
              data-ocid={`collections.controllers_button.${index + 1}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Controllers
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CollectionTopUpDialog({
  collection,
  open,
  onClose,
}: {
  collection: Collection | null;
  open: boolean;
  onClose: () => void;
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [cyclesText, setCyclesText] = useState("1000000000000");
  const cyclesToTopUp = useMemo(
    () => parseCyclesInput(cyclesText),
    [cyclesText],
  );

  const { data: quote, isFetching: quoteLoading } =
    useQuery<CollectionCycleTopUpQuote | null>({
      queryKey: ["collectionCycleTopUpQuote", cyclesToTopUp?.toString()],
      queryFn: async () => {
        if (!actor || cyclesToTopUp == null) return null;
        return actor.quoteCollectionCycleTopUp(cyclesToTopUp);
      },
      enabled: !!actor && open && cyclesToTopUp != null,
      staleTime: 60_000,
    });

  const topUpMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!collection) throw new Error("Select a collection first");
      if (cyclesToTopUp == null) throw new Error("Enter a valid cycles amount");
      const result = await actor.topUpCollectionCanisterCycles(
        collection.id,
        cyclesToTopUp,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      toast.success(
        `Added ${formatCycles(receipt.cyclesMinted)} cycles to ${collection?.name ?? "the collection"}`,
      );
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"],
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      onClose();
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="collections.top_up.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            Top Up Collection Cycles
          </DialogTitle>
          <DialogDescription>
            Confirm the ICP payment from your in-app account before cycles are
            minted directly into this collection canister.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Collection</span>
              <span className="font-medium text-right">
                {collection?.name ?? "Collection"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Canister</span>
              <span className="font-mono text-xs text-right break-all">
                {collection?.canisterId.toString() ?? ""}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="collection-top-up-cycles">Cycles to add</Label>
            <Input
              id="collection-top-up-cycles"
              value={cyclesText}
              onChange={(event) => setCyclesText(event.target.value)}
              inputMode="numeric"
              className="font-mono"
              data-ocid="collections.top_up.cycles_input"
            />
            <p className="text-xs text-muted-foreground">
              Minimum top-up is 100B cycles. The app will normalize very small
              amounts to that minimum.
            </p>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
            {cyclesToTopUp == null ? (
              <p className="text-muted-foreground">
                Enter a whole-number cycles amount.
              </p>
            ) : quoteLoading || !quote ? (
              <p className="text-muted-foreground">Fetching quote…</p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Cycles requested
                  </span>
                  <span className="font-mono">
                    {formatCycles(quote.cyclesToTopUp)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">ICP converted</span>
                  <span className="font-mono">
                    {formatICP(quote.cycleCostE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Ledger fee</span>
                  <span className="font-mono">
                    {formatICP(quote.ledgerFeeE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border pt-2 font-medium">
                  <span>Total debit</span>
                  <span className="font-mono">
                    {formatICP(quote.totalUserDebitE8s)} ICP
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="gap-2"
            disabled={
              topUpMutation.isPending ||
              !collection ||
              cyclesToTopUp == null ||
              !quote
            }
            onClick={() => topUpMutation.mutate()}
            data-ocid="collections.top_up.confirm_button"
          >
            {topUpMutation.isPending ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Confirm Top Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── NFTDetailModal ─────────────────────────────────────────────────────────

interface NFTDetailModalProps {
  nft: WalletNFT;
  collection: Collection;
  isListed?: boolean;
  dividendE8s?: bigint;
  open: boolean;
  onClose: () => void;
}

function NFTDetailModal({
  nft,
  collection,
  isListed = false,
  dividendE8s = 0n,
  open,
  onClose,
}: NFTDetailModalProps) {
  const { isAuthenticated, principal } = useAuth();
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  const { data: inWallet, isLoading: walletCheckLoading } = useQuery<boolean>({
    queryKey: [
      "isNFTInUserWallet",
      collection.id.toString(),
      nft.tokenId,
      principal?.toString(),
    ],
    queryFn: async () => {
      if (!actor || !principal) return false;
      return actor.isNFTInUserWallet(collection.id, nft.tokenId, principal);
    },
    enabled: !!actor && isAuthenticated && !!principal && open,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const metadata: NFTMetadata = {
        name: nft.metadata.name,
        description: nft.metadata.description,
        imageUrl: nft.metadata.imageUrl,
        attributes: nft.metadata.attributes,
      };
      return actor.registerNFT(collection.id, nft.tokenId, metadata);
    },
    onSuccess: () => {
      toast.success("NFT registered to your wallet!");
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({
        queryKey: ["isNFTInUserWallet", collection.id.toString(), nft.tokenId],
      });
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to register NFT");
    },
  });

  const nftName = nft.metadata.name ?? `#${nft.tokenId}`;
  const imageUrl = resolveImageUrl(nft.metadata.imageUrl, {
    canisterId: collection.canisterId.toString(),
    tokenId: nft.tokenId,
  });
  const collectionImageUrl = resolveImageUrl(collection.imageUrl);
  const canisterId = collection.canisterId.toString();
  const canisterUrl = `https://dashboard.internetcomputer.org/canister/${canisterId}`;
  const ownsPreview =
    principal != null && nft.owner.toString() === principal.toString();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border w-[calc(100vw-2rem)] max-w-3xl max-h-[calc(100dvh-2rem)] p-0 overflow-hidden"
        data-ocid="collections.nft_detail.dialog"
      >
        <div className="flex max-h-[calc(100dvh-2rem)] min-h-0 flex-col md:grid md:grid-cols-[minmax(0,0.95fr)_minmax(320px,1fr)]">
          {/* Image */}
          <div className="h-[min(42vh,360px)] md:h-auto md:min-h-0 w-full overflow-hidden bg-muted relative">
            <MediaImage
              src={nft.metadata.imageUrl}
              alt={nftName}
              assetCanisterId={collection.canisterId.toString()}
              tokenId={nft.tokenId}
              className="w-full h-full object-contain"
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="w-14 h-14 text-muted-foreground/30" />
                </div>
              }
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
              aria-label="Close"
              data-ocid="collections.nft_detail.close_button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <ScrollArea className="min-h-0 flex-1 md:h-full">
            <div className="p-5 space-y-4">
              <DialogHeader className="space-y-1">
                <DialogTitle className="font-display text-xl text-foreground break-words">
                  {nftName}
                </DialogTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="font-mono text-xs bg-muted/60 text-muted-foreground border border-border/40"
                  >
                    #{nft.tokenId}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-accent/10 text-accent border border-accent/20"
                  >
                    {standardLabel(collection.standard)}
                  </Badge>
                  {isListed && (
                    <Badge className="text-xs bg-amber-500/10 text-amber-700 border border-amber-500/20">
                      Listed on Market
                    </Badge>
                  )}
                  {dividendE8s > 0n && (
                    <Badge className="text-xs bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                      {formatICP(dividendE8s)} ICP dividends
                    </Badge>
                  )}
                </div>
              </DialogHeader>

              {nft.metadata.description && (
                <p className="text-sm text-muted-foreground leading-relaxed break-words">
                  {nft.metadata.description}
                </p>
              )}

              {/* Collection */}
              <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 border border-border/40">
                {collectionImageUrl && (
                  <img
                    src={collectionImageUrl}
                    alt={collection.name}
                    className="w-6 h-6 rounded-full border border-border/50 object-cover shrink-0"
                  />
                )}
                <span className="text-sm text-foreground font-medium truncate">
                  {collection.name}
                </span>
                <span className="text-xs font-mono text-muted-foreground ml-auto shrink-0">
                  {collection.symbol}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <CopyField
                  label="Token ID"
                  value={nft.tokenId}
                  ocid="collections.nft_detail.copy_token_id"
                />
                <CopyField
                  label="Collection Canister"
                  value={canisterId}
                  ocid="collections.nft_detail.copy_canister_id"
                />
                <CopyField
                  label="Current Owner"
                  value={nft.owner.toString()}
                  ocid="collections.nft_detail.copy_owner"
                />
                {imageUrl && (
                  <CopyField
                    label="NFT Media URL"
                    value={imageUrl}
                    ocid="collections.nft_detail.copy_media_url"
                  />
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  data-ocid="collections.nft_detail.view_canister_button"
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
              </div>

              {/* Attributes */}
              {nft.metadata.attributes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> Attributes
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nft.metadata.attributes.map(([key, value]) => (
                      <div
                        key={`attr-detail-${key}-${value}`}
                        className="bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-center"
                      >
                        <p className="text-xs text-muted-foreground uppercase tracking-wide truncate">
                          {key}
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-0.5 truncate">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Register to Wallet CTA */}
              {isAuthenticated && (
                <div
                  className="pt-2 border-t border-border/60"
                  data-ocid="collections.nft_detail.register_section"
                >
                  {walletCheckLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : inWallet ? (
                    <div
                      className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5"
                      data-ocid="collections.nft_detail.in_wallet_state"
                    >
                      <Sparkles className="w-4 h-4 text-accent shrink-0" />
                      Already in your wallet
                    </div>
                  ) : !ownsPreview ? (
                    <div className="rounded-lg bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
                      Sign in with the owner principal shown above to register
                      this NFT into your Mintlab wallet.
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2"
                      onClick={() => registerMutation.mutate()}
                      disabled={registerMutation.isPending}
                      data-ocid="collections.nft_detail.register_button"
                    >
                      <Sparkles className="w-4 h-4" />
                      {registerMutation.isPending
                        ? "Registering…"
                        : "Register to Wallet"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CollectionControllersDialog({
  collection,
  initialStatus,
  open,
  onClose,
}: {
  collection: Collection | null;
  initialStatus?: CollectionCanisterStatus;
  open: boolean;
  onClose: () => void;
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [controllerInput, setControllerInput] = useState("");
  const queryKey = [
    "collectionCanisterControllers",
    collection?.id.toString() ?? "none",
  ];
  const initialInfo = useMemo<CollectionCanisterControllers | null>(() => {
    if (!collection || !initialStatus) return null;
    return {
      collectionId: collection.id,
      canisterId: collection.canisterId,
      appCanisterId: initialStatus.appCanisterId,
      controllers: initialStatus.controllers,
    };
  }, [collection, initialStatus]);

  const {
    data: fetchedInfo,
    isFetching,
    error,
  } = useQuery<CollectionCanisterControllers | null>({
    queryKey,
    queryFn: async () => {
      if (!actor || !collection) return null;
      const result = await actor.getCollectionCanisterControllers(
        collection.id,
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    enabled: !!actor && !!collection && open,
    retry: false,
  });

  const info = fetchedInfo ?? initialInfo;
  const appCanisterText = info?.appCanisterId.toString() ?? "";
  const appControllerPresent =
    !!info &&
    info.controllers.some(
      (controller) => controller.toString() === appCanisterText,
    );

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!collection) throw new Error("Select a collection first");
      const trimmed = controllerInput.trim();
      if (!isValidPrincipal(trimmed)) {
        throw new Error("Enter a valid controller principal");
      }
      const result = await actor.addCollectionCanisterController(
        collection.id,
        Principal.fromText(trimmed),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      queryClient.setQueryData(queryKey, receipt);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"],
      });
      setControllerInput("");
      toast.success("Controller added");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (controller: Principal) => {
      if (!actor) throw new Error("Backend not connected");
      if (!collection) throw new Error("Select a collection first");
      const result = await actor.removeCollectionCanisterController(
        collection.id,
        controller,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      queryClient.setQueryData(queryKey, receipt);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"],
      });
      toast.success("Controller removed");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  function copyPrincipal(value: string) {
    void navigator.clipboard.writeText(value);
    toast.success("Controller principal copied");
  }

  function removeController(controller: Principal) {
    if (!info) return;
    const controllerText = controller.toString();
    const isAppController = controllerText === appCanisterText;
    if (
      isAppController &&
      !window.confirm(
        "Remove the Mintlab app controller? Mintlab may no longer be able to upgrade, top up, or read this collection canister after this change.",
      )
    ) {
      return;
    }
    removeMutation.mutate(controller);
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-2xl"
        data-ocid="collections.controllers.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            Collection Controllers
          </DialogTitle>
          <DialogDescription>
            {collection?.name ?? "Collection"} canister{" "}
            <span className="font-mono">
              {collection?.canisterId.toString() ?? ""}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {appControllerPresent && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900">
              Add your replacement controller before removing the Mintlab app
              controller. Once removed, controller management through Mintlab
              can stop working for this canister.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="collection-controller-principal">
              Add controller principal
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="collection-controller-principal"
                value={controllerInput}
                onChange={(event) => setControllerInput(event.target.value)}
                className="font-mono text-sm"
                placeholder="ryjl3-tyaaa-aaaaa-aaaba-cai"
                data-ocid="collections.controllers.add_input"
              />
              <Button
                className="gap-2 sm:w-auto"
                disabled={addMutation.isPending}
                onClick={() => addMutation.mutate()}
                data-ocid="collections.controllers.add_button"
              >
                {addMutation.isPending ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Current controllers</Label>
              {isFetching && (
                <span className="text-xs text-muted-foreground">
                  Refreshing…
                </span>
              )}
            </div>

            {!info && isFetching && (
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
                Loading controllers…
              </div>
            )}

            {!info && error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {extractError(error)}
              </div>
            )}

            {info && (
              <div className="space-y-2">
                {info.controllers.map((controller, index) => {
                  const controllerText = controller.toString();
                  const isAppController = controllerText === appCanisterText;
                  const removeDisabled =
                    removeMutation.isPending || info.controllers.length <= 1;
                  return (
                    <div
                      key={controllerText}
                      className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Controller {index + 1}
                          </span>
                          {isAppController && (
                            <Badge className="border border-accent/20 bg-accent/10 text-accent">
                              Mintlab app
                            </Badge>
                          )}
                        </div>
                        <p className="break-all font-mono text-sm text-foreground">
                          {controllerText}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyPrincipal(controllerText)}
                          aria-label="Copy controller principal"
                          data-ocid={`collections.controllers.copy.${index + 1}`}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={removeDisabled}
                          onClick={() => removeController(controller)}
                          aria-label="Remove controller"
                          data-ocid={`collections.controllers.remove.${index + 1}`}
                        >
                          {removeMutation.isPending &&
                          removeMutation.variables?.toString() ===
                            controllerText ? (
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── NFT Browser (in-collection view) ─────────────────────────────────────

interface AttributeFilter {
  key: string;
  value: string;
}

interface NFTBrowserProps {
  collection: Collection;
  isCreatorCollection: boolean;
  onBack: () => void;
}

function NFTBrowser({
  collection,
  isCreatorCollection,
  onBack,
}: NFTBrowserProps) {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [attrFilter, setAttrFilter] = useState<AttributeFilter | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<WalletNFT | null>(null);
  const canisterId = collection.canisterId.toString();
  const canisterUrl = `https://dashboard.internetcomputer.org/canister/${canisterId}`;
  const dividendsEnabled = collection.dividendConfig?.enabled === true;

  const {
    data: browsePages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["collectionNFTPage", collection.id.toString()],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      if (!actor) {
        return {
          nfts: [],
          totalCount: 0n,
          coverage: "Partial" as const,
          note: "Mintlab is preparing this collection browser.",
        };
      }
      return actor.getCollectionNFTPage(collection.id, pageParam, 24n);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!actor && !isFetching,
  });
  const { data: activeListingDetails = [] } = useQuery<ActiveListingDetail[]>({
    queryKey: ["activeListingDetails"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveListingDetails();
    },
    enabled: !!actor && !isFetching,
  });
  const { data: dividendInfo } = useQuery({
    queryKey: ["collectionDividendInfo", collection.id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCollectionDividendInfo(collection.id);
    },
    enabled: !!actor && !isFetching && dividendsEnabled,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });
  const { data: dividendBalances = [] } = useQuery<Array<[string, bigint]>>({
    queryKey: ["collectionDividendBalances", collection.id.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.refreshCollectionDividendBalances(collection.id);
    },
    enabled: !!actor && !isFetching && dividendsEnabled,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });
  const syncDividendsMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.syncCollectionDividends(collection.id);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (receipt) => {
      toast.success(
        receipt.distributedE8s > 0n
          ? `Distributed ${formatICP(receipt.distributedE8s)} ICP`
          : "No new dividends to distribute",
      );
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo", collection.id.toString()],
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances", collection.id.toString()],
      });
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"],
      });
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });
  const loadedNFTs = useMemo<WalletNFT[]>(() => {
    if (!browsePages) return [];
    return browsePages.pages.flatMap((page) => page.nfts);
  }, [browsePages]);
  const firstPage = browsePages?.pages[0];
  const totalCount = firstPage?.totalCount ?? BigInt(loadedNFTs.length);
  const coverage = firstPage?.coverage ?? "Partial";
  const browseNote =
    firstPage?.note ??
    "Mintlab is showing the NFTs it has already loaded for this collection.";
  const listedNFTKeys = new Set(
    activeListingDetails
      .filter((detail) => detail.nft.collectionId === collection.id)
      .map((detail) => nftKey(detail.nft.collectionId, detail.nft.tokenId)),
  );
  const dividendBalanceMap = useMemo(
    () => new Map<string, bigint>(dividendBalances),
    [dividendBalances],
  );

  // Collect all attribute keys and values from the NFT set
  const allAttributePairs = useMemo<AttributeFilter[]>(() => {
    const seen = new Set<string>();
    const pairs: AttributeFilter[] = [];
    for (const nft of loadedNFTs) {
      for (const [key, value] of nft.metadata.attributes) {
        const k = `${key}::${value}`;
        if (!seen.has(k)) {
          seen.add(k);
          pairs.push({ key, value });
        }
      }
    }
    return pairs.sort((a, b) => a.key.localeCompare(b.key));
  }, [loadedNFTs]);

  const filteredNFTs = useMemo<WalletNFT[]>(() => {
    const q = search.trim().toLowerCase();
    return loadedNFTs.filter((nft) => {
      // text search
      if (q) {
        const nameMatch = (nft.metadata.name ?? "").toLowerCase().includes(q);
        const idMatch = nft.tokenId.toLowerCase().includes(q);
        if (!nameMatch && !idMatch) return false;
      }
      // attribute filter
      if (attrFilter) {
        const hasAttr = nft.metadata.attributes.some(
          ([k, v]) => k === attrFilter.key && v === attrFilter.value,
        );
        if (!hasAttr) return false;
      }
      return true;
    });
  }, [loadedNFTs, search, attrFilter]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setAttrFilter(null);
  }, []);

  const hasActiveFilter = search.trim() !== "" || attrFilter !== null;
  const loadedCount = loadedNFTs.length;
  const fullyLoaded = BigInt(loadedCount) >= totalCount;
  const collectionImageUrl = resolveImageUrl(collection.imageUrl);

  return (
    <div className="space-y-6" data-ocid="collections.nft_browser">
      {/* Breadcrumb / back */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
            data-ocid="collections.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            All Collections
          </Button>
          <span className="text-muted-foreground/40">/</span>
          <div className="flex items-center gap-2 min-w-0">
            {collectionImageUrl && (
              <img
                src={collectionImageUrl}
                alt={collection.name}
                className="w-6 h-6 rounded-full border border-border/50 object-cover shrink-0"
              />
            )}
            <span className="font-display font-bold text-foreground truncate">
              {collection.name}
            </span>
            <Badge
              variant="secondary"
              className="font-mono text-xs bg-muted/60 text-muted-foreground border border-border/40 shrink-0"
            >
              {standardLabel(collection.standard)}
            </Badge>
            {isCreatorCollection && (
              <Badge className="bg-accent/10 text-accent border border-accent/20 shrink-0">
                Your Mintlab Collection
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              void navigator.clipboard.writeText(canisterId);
              toast.success("Collection canister copied");
            }}
            data-ocid="collections.copy_canister_button"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy Canister ID
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="gap-1.5"
            data-ocid="collections.view_canister_button"
          >
            <a href={canisterUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5" />
              View Canister
            </a>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground">
        {browseNote}
        {coverage === "Full" && !fullyLoaded && (
          <span className="block mt-1">
            Load more to keep browsing the rest of the collection.
          </span>
        )}
      </div>

      {dividendsEnabled && dividendInfo && (
        <div
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3"
          data-ocid="collections.dividends.panel"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-emerald-700 font-mono">
                Collection Dividends
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Send ICP to this address, then check for deposits to split the
                new balance evenly across minted NFTs in this collection.
              </p>
            </div>
            <Button
              size="sm"
              className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => syncDividendsMutation.mutate()}
              disabled={syncDividendsMutation.isPending}
              data-ocid="collections.dividends.sync_button"
            >
              {syncDividendsMutation.isPending ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <CircleDollarSign className="w-4 h-4" />
              )}
              Check Deposits
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-end">
            <CopyField
              label="Dividend ICP Address"
              value={accountIdToHex(dividendInfo.accountId)}
              ocid="collections.dividends.copy_account"
            />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border/50 bg-card/60 px-3 py-2">
                <p className="text-muted-foreground uppercase tracking-wide">
                  Pool
                </p>
                <p className="font-mono font-semibold text-foreground mt-0.5">
                  {formatICP(dividendInfo.balanceE8s)} ICP
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-card/60 px-3 py-2">
                <p className="text-muted-foreground uppercase tracking-wide">
                  Pending
                </p>
                <p className="font-mono font-semibold text-foreground mt-0.5">
                  {formatICP(dividendInfo.pendingE8s)} ICP
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search + Filter bar */}
      <div
        className="flex flex-col sm:flex-row gap-3"
        data-ocid="collections.filters_bar"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name or token ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border focus:border-accent"
            data-ocid="collections.search_input"
          />
          {search && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {allAttributePairs.length > 0 && (
          <Select
            value={
              attrFilter ? `${attrFilter.key}::${attrFilter.value}` : "all"
            }
            onValueChange={(val) => {
              if (val === "all") {
                setAttrFilter(null);
              } else {
                const [key, value] = val.split("::");
                setAttrFilter({ key, value });
              }
            }}
          >
            <SelectTrigger
              className="w-full sm:w-56 bg-card border-border focus:border-accent"
              data-ocid="collections.attribute_filter.select"
            >
              <Tag className="w-3.5 h-3.5 text-muted-foreground mr-1.5" />
              <SelectValue placeholder="Filter by attribute" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All attributes</SelectItem>
              {allAttributePairs.map(({ key, value }) => (
                <SelectItem key={`${key}::${value}`} value={`${key}::${value}`}>
                  <span className="text-muted-foreground">{key}:</span>{" "}
                  <span className="font-medium">{value}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 text-muted-foreground hover:text-foreground whitespace-nowrap"
            data-ocid="collections.clear_filters_button"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Result count */}
      {!isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <span>
            Loaded {loadedCount} of {totalCount.toString()} NFT
            {totalCount === 1n ? "" : "s"}
          </span>
          <Badge
            variant="secondary"
            className={
              coverage === "Full"
                ? "bg-accent/10 text-accent border border-accent/20 text-xs"
                : "bg-muted/60 text-muted-foreground border border-border/40 text-xs"
            }
          >
            {coverage === "Full" ? "Full Browse" : "Indexed View"}
          </Badge>
          {hasActiveFilter && (
            <Badge
              variant="secondary"
              className="bg-accent/10 text-accent border border-accent/20 text-xs"
            >
              Filtered
            </Badge>
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          data-ocid="collections.nft_browser.loading_state"
        >
          {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((k) => (
            <Skeleton
              key={`nft-skel-${k}`}
              className="aspect-square rounded-xl"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filteredNFTs.length === 0 && (
        <EmptyState
          icon={hasActiveFilter ? Search : Layers}
          title={
            hasActiveFilter ? "No matches found" : "No NFTs available to browse"
          }
          description={
            hasActiveFilter
              ? "Try adjusting your search or clearing the attribute filter."
              : coverage === "Full"
                ? "Mintlab could not find any NFTs to show from this collection yet."
                : "Mintlab can only show the NFTs it has already indexed for this collection right now."
          }
          action={
            hasActiveFilter
              ? {
                  label: "Clear filters",
                  onClick: clearFilters,
                  "data-ocid": "collections.empty.clear_button",
                }
              : undefined
          }
          data-ocid="collections.nft_browser.empty_state"
        />
      )}

      {/* NFT Grid */}
      {!isLoading && filteredNFTs.length > 0 && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          data-ocid="collections.nft_grid"
        >
          {filteredNFTs.map((nft, i) => (
            <BrowseNFTCard
              key={nft.id.toString()}
              nft={nft}
              collection={collection}
              isListed={listedNFTKeys.has(
                nftKey(nft.collectionId, nft.tokenId),
              )}
              dividendE8s={dividendBalanceMap.get(nft.tokenId) ?? 0n}
              index={i}
              onClick={() => setSelectedNFT(nft)}
            />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            data-ocid="collections.load_more_button"
          >
            {isFetchingNextPage ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Loading more…
              </>
            ) : (
              <>
                <Grid3X3 className="w-4 h-4" />
                Load More NFTs
              </>
            )}
          </Button>
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <NFTDetailModal
          nft={selectedNFT}
          collection={collection}
          isListed={listedNFTKeys.has(
            nftKey(selectedNFT.collectionId, selectedNFT.tokenId),
          )}
          dividendE8s={dividendBalanceMap.get(selectedNFT.tokenId) ?? 0n}
          open={!!selectedNFT}
          onClose={() => setSelectedNFT(null)}
        />
      )}
    </div>
  );
}

// ── BrowseNFTCard ──────────────────────────────────────────────────────────

interface BrowseNFTCardProps {
  nft: WalletNFT;
  collection: Collection;
  isListed?: boolean;
  dividendE8s?: bigint;
  index: number;
  onClick: () => void;
}

function BrowseNFTCard({
  nft,
  collection,
  isListed = false,
  dividendE8s = 0n,
  index,
  onClick,
}: BrowseNFTCardProps) {
  const name = nft.metadata.name ?? `#${nft.tokenId}`;
  const topAttrs = nft.metadata.attributes.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="nft-card-glow group cursor-pointer rounded-xl border border-border bg-card overflow-hidden hover:border-accent/40 transition-smooth"
      onClick={onClick}
      data-ocid={`collections.nft.item.${index + 1}`}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted relative">
        <MediaImage
          src={nft.metadata.imageUrl}
          alt={name}
          assetCanisterId={collection.canisterId.toString()}
          tokenId={nft.tokenId}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-muted-foreground/30" />
            </div>
          }
        />
        {/* hover detail hint */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
          <div className="flex items-center gap-1 text-xs text-foreground font-medium bg-card/80 backdrop-blur-sm rounded-full px-2.5 py-1 border border-border/60">
            <Info className="w-3 h-3" /> Details
          </div>
        </div>
        {isListed && (
          <Badge className="absolute top-2 left-2 bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px]">
            Listed
          </Badge>
        )}
        {dividendE8s > 0n && (
          <Badge className="absolute bottom-2 left-2 bg-emerald-500/90 text-white border-0 text-[10px] font-mono">
            {formatICP(dividendE8s)} ICP
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-1.5">
        <p className="font-display font-semibold text-xs text-foreground truncate">
          {name}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          #{nft.tokenId}
        </p>
        {topAttrs.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {topAttrs.map(([key, value]) => (
              <Badge
                key={`card-attr-${key}-${value}`}
                variant="secondary"
                className="text-xs bg-muted/60 text-muted-foreground border border-border/40 px-1.5 py-0 font-normal"
              >
                {key}:{" "}
                <span className="text-foreground font-medium ml-0.5">
                  {value}
                </span>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── CollectionsPage ────────────────────────────────────────────────────────

export default function CollectionsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principalText } = useAuth();
  const { isAdmin } = useAdmin();
  const queryClient = useQueryClient();
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [topUpCollection, setTopUpCollection] = useState<Collection | null>(
    null,
  );
  const [controllersCollection, setControllersCollection] =
    useState<Collection | null>(null);

  const { data: collections, isLoading } = useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor && !isFetching,
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

  const { data: myCollectionCanisterStatuses = [] } = useQuery<
    CollectionCanisterStatus[]
  >({
    queryKey: ["myCollectionCanisterStatuses", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCollectionCanisterStatuses();
    },
    enabled:
      !!actor &&
      !isFetching &&
      isAuthenticated &&
      myCreatedCollections.length > 0,
    refetchInterval: 60_000,
  });

  const upgradeMutation = useMutation({
    mutationFn: async (collection: Collection) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.upgradeCollectionCanister(collection.id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (collection) => {
      toast.success(`${collection.name} canister updated.`);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"],
      });
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const retryInstallMutation = useMutation({
    mutationFn: async (collection: Collection) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.retryInstallCollectionCanister(collection.id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (collection) => {
      toast.success(`${collection.name} Wasm installed.`);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionBrowseStats"],
      });
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const browseStatsQuery = useQuery<Map<string, CollectionBrowseStats>>({
    queryKey: [
      "allCollectionBrowseStats",
      collections?.map((c) => c.id.toString()).join(",") ?? "",
    ],
    queryFn: async () => {
      if (!actor || !collections) return new Map();
      const stats = new Map<string, CollectionBrowseStats>();
      await Promise.all(
        collections.map(async (c) => {
          const result = await actor.getCollectionBrowseStats(c.id);
          stats.set(c.id.toString(), result);
        }),
      );
      return stats;
    },
    enabled: !!actor && !isFetching && !!collections && collections.length > 0,
  });

  const browseStats =
    browseStatsQuery.data ?? new Map<string, CollectionBrowseStats>();
  const myCreatedCollectionIds = new Set(
    myCreatedCollections.map((collection) => collection.id.toString()),
  );
  const canisterStatusMap = new Map(
    myCollectionCanisterStatuses.map((status) => [
      status.collectionId.toString(),
      status,
    ]),
  );

  return (
    <div
      className="px-4 md:px-8 py-8 max-w-7xl mx-auto"
      data-ocid="collections.page"
    >
      <AnimatePresence mode="wait">
        {selectedCollection ? (
          <motion.div
            key="browser"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <NFTBrowser
              collection={selectedCollection}
              isCreatorCollection={myCreatedCollectionIds.has(
                selectedCollection.id.toString(),
              )}
              onBack={() => setSelectedCollection(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Page header */}
            <div className="space-y-2">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                Collections
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover community collections, import supported ICP NFT
                collections from elsewhere, and launch your own Mintlab
                collection after paying the admin-set setup fee.
              </p>
            </div>

            {!isLoading && !isAuthenticated && (
              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-muted-foreground">
                Sign in to preview your NFTs, import collections into the shared
                directory, and create your own Mintlab collection.
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <ImportCollectionCard
                onImported={(collection) => setSelectedCollection(collection)}
              />
              <CreateCollectionCard
                mintConfig={mintConfig ?? null}
                moderationConfig={moderationConfig ?? null}
                onCreated={(collection) => setSelectedCollection(collection)}
              />
            </div>

            {isAuthenticated && myCreatedCollections.length > 0 && (
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <p className="text-sm font-medium text-foreground">
                  Your Mintlab collections
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {myCreatedCollections.map((collection, index) => (
                    <Button
                      key={collection.id.toString()}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setSelectedCollection(collection)}
                      data-ocid={`collections.my_collection.${index + 1}`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {collection.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                data-ocid="collections.loading_state"
              >
                {["a", "b", "c", "d", "e", "f"].map((k) => (
                  <div
                    key={`coll-skel-${k}`}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-8 w-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {!isLoading && (collections ?? []).length === 0 && (
              <EmptyState
                icon={Layers}
                title="No collections yet"
                description="Import the first supported ICP NFT collection or create your own Mintlab collection to get the shared directory started."
                data-ocid="collections.empty_state"
              />
            )}

            {/* Collection grid */}
            {!isLoading && (collections ?? []).length > 0 && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                data-ocid="collections.grid"
              >
                {(collections ?? []).map((collection, index) => {
                  const isCreatorCollection = myCreatedCollectionIds.has(
                    collection.id.toString(),
                  );
                  const isMainAppCollection =
                    mintConfig?.collectionId?.toString() ===
                    collection.id.toString();
                  const canManageCollection =
                    isCreatorCollection ||
                    (isAdmin && collection.kind === "Minted");

                  return (
                    <CollectionCard
                      key={collection.id.toString()}
                      collection={collection}
                      browseStats={browseStats.get(collection.id.toString())}
                      cycleStatus={canisterStatusMap.get(
                        collection.id.toString(),
                      )}
                      index={index}
                      isCreatorCollection={isCreatorCollection}
                      canManageCollection={canManageCollection}
                      isMainAppCollection={isMainAppCollection}
                      onClick={() => setSelectedCollection(collection)}
                      onTopUp={setTopUpCollection}
                      onUpgrade={(target) => upgradeMutation.mutate(target)}
                      onRetryInstall={(target) =>
                        retryInstallMutation.mutate(target)
                      }
                      onManageControllers={setControllersCollection}
                      isUpgrading={
                        upgradeMutation.isPending &&
                        upgradeMutation.variables?.id === collection.id
                      }
                      isRetryingInstall={
                        retryInstallMutation.isPending &&
                        retryInstallMutation.variables?.id === collection.id
                      }
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <CollectionTopUpDialog
        collection={topUpCollection}
        open={topUpCollection != null}
        onClose={() => setTopUpCollection(null)}
      />
      <CollectionControllersDialog
        collection={controllersCollection}
        initialStatus={
          controllersCollection
            ? canisterStatusMap.get(controllersCollection.id.toString())
            : undefined
        }
        open={controllersCollection != null}
        onClose={() => setControllersCollection(null)}
      />
    </div>
  );
}
