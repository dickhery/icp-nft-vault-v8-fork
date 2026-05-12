import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/use-admin";
import { useBackend } from "@/hooks/use-backend";
import { resolveImageUrl } from "@/lib/media";
import type {
  Collection,
  ModerationCategorySettings,
  NFTStandard,
} from "@/types";
import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  ImageOff,
  Info,
  Layers,
  LoaderCircle,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── helpers ────────────────────────────────────────────────────────────────

const E8S = 100_000_000n;
const MIN_COLLECTION_CANISTER_CYCLES = 2_000_000_000_000n;
const MAX_ON_CHAIN_IMAGE_CHARS = 1_500_000;
const DEFAULT_MODERATION_MESSAGE =
  "Uploads cannot include nudity or sexual content, graphic violence, explicit language, hate or harassment, hate symbols, illegal or dangerous activity, self-harm content, or other NSFW material.";

const defaultModerationCategories: ModerationCategorySettings = {
  nudityOrSexual: true,
  graphicViolence: true,
  explicitLanguage: true,
  hateOrHarassment: true,
  hateSymbols: true,
  illegalOrDangerous: true,
  selfHarm: true,
  otherNsfw: true,
};

const moderationCategoryLabels: Array<{
  key: keyof ModerationCategorySettings;
  label: string;
}> = [
  { key: "nudityOrSexual", label: "Nudity or sexual content" },
  { key: "graphicViolence", label: "Graphic violence or gore" },
  { key: "explicitLanguage", label: "Explicit words" },
  { key: "hateOrHarassment", label: "Hate or harassment" },
  { key: "hateSymbols", label: "Hate symbols" },
  { key: "illegalOrDangerous", label: "Illegal or dangerous activity" },
  { key: "selfHarm", label: "Self-harm content" },
  { key: "otherNsfw", label: "Other NSFW content" },
];

function truncatePrincipal(p: string) {
  if (p.length <= 24) return p;
  return `${p.slice(0, 10)}…${p.slice(-8)}`;
}

function makeStandard(raw: string, otherValue: string): NFTStandard {
  if (raw === "EXT") return { __kind__: "EXT", EXT: null };
  if (raw === "DIP721") return { __kind__: "DIP721", DIP721: null };
  if (raw === "ICRC7") return { __kind__: "ICRC7", ICRC7: null };
  return { __kind__: "Other", Other: otherValue };
}

function standardLabel(s: NFTStandard): string {
  if (s.__kind__ === "ICRC7") return "ICRC-7";
  return s.__kind__ === "Other" ? s.Other || "Other" : s.__kind__;
}

function standardVariant(s: NFTStandard): "default" | "secondary" | "outline" {
  if (s.__kind__ === "EXT") return "default";
  if (s.__kind__ === "DIP721") return "secondary";
  if (s.__kind__ === "ICRC7") return "secondary";
  return "outline";
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
  if (err instanceof Error)
    return err.message || "An unexpected error occurred";
  if (typeof err === "string") return err;
  if (err !== null && typeof err === "object") {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    try {
      return JSON.stringify(obj);
    } catch {
      /* noop */
    }
  }
  return "An unexpected error occurred";
}

function accountIdToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToAccountId(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}

function formatCycles(cycles: bigint): string {
  const trillion = 1_000_000_000_000n;
  if (cycles < trillion) return cycles.toString();
  const hundredths = (cycles * 100n) / trillion;
  const whole = hundredths / 100n;
  const frac = (hundredths % 100n).toString().padStart(2, "0");
  return `${whole}.${frac}T`;
}

function parseICPToE8s(value: string): bigint | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d{0,8})?$/.test(trimmed)) return null;
  const [wholePart, fracPart = ""] = trimmed.split(".");
  return BigInt(wholePart) * E8S + BigInt(`${fracPart}00000000`.slice(0, 8));
}

function parseWholeBigInt(value: string): bigint | null {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed || !/^\d+$/.test(trimmed)) return null;
  return BigInt(trimmed);
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

function readFileAsBytes(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error("Could not read WASM file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read WASM file"));
    reader.readAsArrayBuffer(file);
  });
}

// ─── CopyButton ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy canister ID"
      className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
      data-ocid="admin.copy_button"
    >
      {copied ? (
        <Check size={13} className="text-primary" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}

// ─── CollectionSetupGuide ────────────────────────────────────────────────────

const GUIDE_STEPS = [
  {
    num: 1,
    title: "Get the Collection's Canister ID",
    body: "Every NFT collection on the Internet Computer has a unique Canister ID (looks like: ryjl3-tyaaa-aaaaa-aaaba-cai). Get this from the collection's official website or creator.",
  },
  {
    num: 2,
    title: "Choose the Right NFT Standard",
    body: "EXT (Entrepot) is used by many older ICP collections, DIP721 is another common standard, and newer ledgers may expose ICRC-7. If unsure, check the collection's documentation. Choosing the wrong standard will cause transfer errors.",
  },
  {
    num: 3,
    title: "Fill In the Form",
    body: "Enter the Canister ID, a display name, symbol, optional description and collection image, then select the NFT Standard and click Add Collection.",
  },
  {
    num: 4,
    title: "Verify the Collection Works",
    body: "After adding, users with NFTs from that collection should be able to register them in their wallet using the token ID. If transfers fail, double-check the canister ID and NFT standard.",
  },
];

function CollectionSetupGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border border-primary/25 overflow-hidden bg-primary/3"
      data-ocid="admin.setup_guide"
    >
      {/* Toggle header */}
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-primary/5 transition-colors text-left"
        onClick={() => setOpen((v) => !v)}
        data-ocid="admin.setup_guide.toggle"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <Info size={15} className="text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-sm text-foreground">
              How to Add NFT Collections
            </p>
            <p className="text-xs text-muted-foreground">
              Step-by-step setup guide for admins
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-primary/15">
          {/* Steps */}
          <div className="space-y-3 pt-4">
            {GUIDE_STEPS.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-3"
                data-ocid={`admin.setup_guide.step.${step.num}`}
              >
                <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">
                    {step.num}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="bg-primary/15" />

          {/* Troubleshooting */}
          <div className="flex items-start gap-2.5 p-3 bg-destructive/5 border border-destructive/20 rounded-xl">
            <AlertCircle
              size={15}
              className="text-destructive shrink-0 mt-0.5"
            />
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold text-foreground">
                Troubleshooting Transfer Errors
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If users report transfer errors, verify:
              </p>
              <ul className="text-xs text-muted-foreground space-y-0.5 list-none">
                <li className="flex items-start gap-1.5">
                  <span className="text-destructive/60 mt-0.5">•</span>
                  The canister ID is correct and the collection is deployed on
                  mainnet.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-destructive/60 mt-0.5">•</span>
                  The NFT standard matches what the collection actually uses
                  (EXT vs DIP721 vs ICRC-7).
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-destructive/60 mt-0.5">•</span>
                  The collection canister is accessible (not paused or private).
                </li>
              </ul>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 pt-1.5 border-t border-destructive/10">
                <strong className="text-foreground">Note:</strong> Most
                collections on the{" "}
                <a
                  href="https://entrepot.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  Entrepot marketplace
                </a>{" "}
                use the{" "}
                <strong className="text-foreground">EXT standard</strong>.
                Collections deployed independently may use DIP721 or ICRC-7.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CollectionRow ───────────────────────────────────────────────────────────

function CollectionRow({
  collection,
  index,
  onRemove,
}: {
  collection: Collection;
  index: number;
  onRemove: (id: bigint) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const pid = collection.canisterId.toString();
  const imageUrl = resolveImageUrl(collection.imageUrl);

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
      data-ocid={`admin.collection.item.${index}`}
    >
      {/* thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={collection.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImageOff size={18} className="text-muted-foreground" />
        )}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground truncate">
            {collection.name}
          </span>
          <Badge
            variant={collection.kind === "Minted" ? "secondary" : "outline"}
            className="text-[10px] shrink-0"
          >
            {collection.kind === "Minted" ? "Minted" : "External"}
          </Badge>
          <Badge
            variant={standardVariant(collection.standard)}
            className="text-xs shrink-0"
          >
            {standardLabel(collection.standard)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-mono truncate flex items-center gap-1">
          {truncatePrincipal(pid)}
          <CopyButton text={pid} />
        </p>
        {collection.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {collection.description}
          </p>
        )}
      </div>

      {/* symbol */}
      <span className="hidden sm:block text-xs font-mono font-semibold text-muted-foreground px-2 py-1 rounded bg-muted shrink-0">
        {collection.symbol}
      </span>

      {/* remove */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 shrink-0"
            data-ocid={`admin.collection.delete_button.${index}`}
          >
            <Trash2 size={15} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent data-ocid="admin.remove_collection.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Collection?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{collection.name}</strong> will be removed from the
              platform. Existing registered NFTs from this collection won&apos;t
              be deleted but new registrations won&apos;t be possible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.remove_collection.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onRemove(collection.id)}
              data-ocid="admin.remove_collection.confirm_button"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MintConfigForm() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [collectionCreationPayout, setCollectionCreationPayout] = useState("");
  const [collectionCreationPrice, setCollectionCreationPrice] = useState("");
  const [collectionCreationEnabled, setCollectionCreationEnabled] =
    useState(false);
  const [mainMintPayout, setMainMintPayout] = useState("");
  const [mainMintPrice, setMainMintPrice] = useState("");
  const [mainMintEnabled, setMainMintEnabled] = useState(false);
  const [marketplaceFeePayout, setMarketplaceFeePayout] = useState("");
  const [marketplaceFeeInitialized, setMarketplaceFeeInitialized] =
    useState(false);
  const [mainMintDividendsEnabled, setMainMintDividendsEnabled] =
    useState(false);
  const [collectionCanisterCycles, setCollectionCanisterCycles] =
    useState("1000000000000");
  const [wasmBytes, setWasmBytes] = useState<Uint8Array | null>(null);
  const [wasmFileName, setWasmFileName] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [moderationEnabled, setModerationEnabled] = useState(false);
  const [xaiApiKey, setXaiApiKey] = useState("");
  const [clearXaiApiKey, setClearXaiApiKey] = useState(false);
  const [moderationModel, setModerationModel] = useState("grok-4.3");
  const [moderationMessage, setModerationMessage] = useState(
    DEFAULT_MODERATION_MESSAGE,
  );
  const [moderationCategories, setModerationCategories] =
    useState<ModerationCategorySettings>(defaultModerationCategories);
  const [moderationInitialized, setModerationInitialized] = useState(false);

  const { data: mintConfig, isLoading: mintConfigLoading } = useQuery({
    queryKey: ["mintConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMintConfig();
    },
    enabled: !!actor,
  });

  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor,
  });

  const { data: marketplaceFeeConfig, isLoading: marketplaceFeeLoading } =
    useQuery({
      queryKey: ["marketplaceFeeConfig"],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getMarketplaceFeeConfig();
      },
      enabled: !!actor,
    });

  const { data: moderationConfig, isLoading: moderationConfigLoading } =
    useQuery({
      queryKey: ["moderationConfig"],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getModerationConfig();
      },
      enabled: !!actor,
    });

  const parsedCreationPriceE8s = parseICPToE8s(collectionCreationPrice);
  const parsedCollectionCanisterCycles = parseWholeBigInt(
    collectionCanisterCycles,
  );
  const canQuoteCreationCost =
    !!actor &&
    parsedCreationPriceE8s !== null &&
    parsedCollectionCanisterCycles !== null;

  const {
    data: creationQuote,
    error: creationQuoteError,
    isFetching: creationQuoteFetching,
  } = useQuery({
    queryKey: [
      "collectionCreationQuote",
      collectionCreationPrice.trim(),
      collectionCanisterCycles.trim(),
    ],
    queryFn: async () => {
      if (
        !actor ||
        parsedCreationPriceE8s === null ||
        parsedCollectionCanisterCycles === null
      ) {
        return null;
      }
      return actor.quoteCollectionCreationCost(
        parsedCollectionCanisterCycles,
        parsedCreationPriceE8s,
      );
    },
    enabled: canQuoteCreationCost,
    staleTime: 60_000,
  });

  const creationPriceBelowCycles =
    !!creationQuote &&
    parsedCreationPriceE8s !== null &&
    parsedCreationPriceE8s < creationQuote.minimumCreationPriceE8s;

  const mainCollection = mintConfig?.collectionId
    ? collections?.find(
        (collection) => collection.id === mintConfig.collectionId,
      )
    : null;
  const dedicatedMintlabCollections =
    collections?.filter(
      (collection) =>
        collection.kind === "Minted" &&
        collection.id !== mintConfig?.collectionId,
    ) ?? [];

  useEffect(() => {
    if (initialized || !mintConfig) return;
    setName(mainCollection?.name ?? "");
    setSymbol(mainCollection?.symbol ?? "");
    setDescription(mainCollection?.description ?? "");
    setImageUrl(mainCollection?.imageUrl ?? "");
    setImageFileName(mainCollection?.imageUrl ? "Current image" : "");
    setCollectionCreationPayout(
      mintConfig.collectionCreationPayoutAccount
        ? accountIdToHex(mintConfig.collectionCreationPayoutAccount)
        : "",
    );
    setCollectionCreationPrice(
      mintConfig.collectionCreationPriceE8s > 0n
        ? formatICP(mintConfig.collectionCreationPriceE8s)
        : "0",
    );
    setCollectionCreationEnabled(mintConfig.collectionCreationEnabled);
    setMainMintPayout(
      mintConfig.mainMintPayoutAccount
        ? accountIdToHex(mintConfig.mainMintPayoutAccount)
        : "",
    );
    setMainMintPrice(
      mintConfig.mainMintPriceE8s > 0n
        ? formatICP(mintConfig.mainMintPriceE8s)
        : "0",
    );
    setMainMintEnabled(mintConfig.mainMintEnabled);
    setMainMintDividendsEnabled(
      mainCollection?.dividendConfig?.enabled === true,
    );
    setCollectionCanisterCycles(mintConfig.collectionCanisterCycles.toString());
    setInitialized(true);
  }, [initialized, mintConfig, mainCollection]);

  useEffect(() => {
    if (moderationInitialized || !moderationConfig) return;
    setModerationEnabled(moderationConfig.enabled);
    setModerationModel(moderationConfig.model || "grok-4.3");
    setModerationMessage(
      moderationConfig.userMessage || DEFAULT_MODERATION_MESSAGE,
    );
    setModerationCategories(moderationConfig.categories);
    setModerationInitialized(true);
  }, [moderationInitialized, moderationConfig]);

  useEffect(() => {
    if (marketplaceFeeInitialized || !marketplaceFeeConfig) return;
    setMarketplaceFeePayout(
      marketplaceFeeConfig.mintlabFeeRecipient
        ? accountIdToHex(marketplaceFeeConfig.mintlabFeeRecipient)
        : "",
    );
    setMarketplaceFeeInitialized(true);
  }, [marketplaceFeeInitialized, marketplaceFeeConfig]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!name.trim()) throw new Error("Main collection name is required");
      if (!symbol.trim()) throw new Error("Main collection symbol is required");
      if (!description.trim())
        throw new Error("Main collection description is required");
      if (!imageUrl) throw new Error("Upload a main collection image");

      const creationPriceE8s = parseICPToE8s(collectionCreationPrice);
      const mainMintPriceE8s = parseICPToE8s(mainMintPrice);
      const cycles = parseWholeBigInt(collectionCanisterCycles);
      if (creationPriceE8s === null)
        throw new Error("Collection creation fee must be a valid ICP amount");
      if (mainMintPriceE8s === null)
        throw new Error("Main mint price must be a valid ICP amount");
      if (cycles === null)
        throw new Error("Collection canister cycles must be a whole number");
      if (
        collectionCreationEnabled &&
        creationQuote &&
        creationPriceE8s < creationQuote.minimumCreationPriceE8s
      ) {
        throw new Error(
          `Collection creation fee must be at least ${formatICP(
            creationQuote.minimumCreationPriceE8s,
          )} ICP at the current cycles rate`,
        );
      }

      const creationPayoutRequired = creationQuote
        ? creationQuote.adminPayoutE8s > 0n
        : creationPriceE8s > 0n;
      const creationPayout = creationPayoutRequired
        ? validateAccountId(collectionCreationPayout, "collection creation")
        : null;
      const mintPayout =
        mainMintPriceE8s > 0n
          ? validateAccountId(mainMintPayout, "main mint")
          : null;

      return actor.configureMinting(
        name.trim(),
        description.trim(),
        symbol.trim().toUpperCase(),
        imageUrl,
        creationPayout,
        creationPriceE8s,
        collectionCreationEnabled,
        mintPayout,
        mainMintPriceE8s,
        mainMintEnabled,
        mainMintDividendsEnabled,
        cycles,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({ queryKey: ["mintConfig"] });
      toast.success("Mint settings saved");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const marketplaceFeeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const recipient = validateAccountId(
        marketplaceFeePayout,
        "Mintlab sales fee",
      );
      return actor.configureMarketplaceFeeRecipient(recipient);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceFeeConfig"],
      });
      toast.success("Marketplace fee payout saved");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const wasmMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!wasmBytes) throw new Error("Choose a collection canister WASM file");
      await actor.setCollectionCanisterWasm(wasmBytes);
    },
    onSuccess: () => {
      setWasmBytes(null);
      setWasmFileName("");
      void queryClient.invalidateQueries({ queryKey: ["mintConfig"] });
      toast.success("Collection canister WASM uploaded");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const moderationMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const apiKey = xaiApiKey.trim() || null;
      const model = moderationModel.trim() || "grok-4.3";
      const message = moderationMessage.trim() || DEFAULT_MODERATION_MESSAGE;
      return actor.configureModeration(
        moderationEnabled,
        apiKey,
        clearXaiApiKey,
        model,
        moderationCategories,
        message,
      );
    },
    onSuccess: () => {
      setXaiApiKey("");
      setClearXaiApiKey(false);
      void queryClient.invalidateQueries({ queryKey: ["moderationConfig"] });
      toast.success("Moderation settings saved");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const upgradeDedicatedCollectionsMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!mintConfig?.collectionCanisterWasmUploaded) {
        throw new Error("Upload the latest collection canister WASM first");
      }
      let updated = 0;
      for (const collection of dedicatedMintlabCollections) {
        const result = await actor.upgradeCollectionCanister(collection.id);
        if (result.__kind__ === "err") {
          throw new Error(`${collection.name}: ${result.err}`);
        }
        updated += 1;
      }
      return updated;
    },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"],
      });
      toast.success(
        updated === 0
          ? "No dedicated collection canisters to update"
          : `Updated ${updated} collection canister${updated === 1 ? "" : "s"}`,
      );
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  function validateAccountId(value: string, label: string) {
    const trimmed = value.trim();
    if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) {
      throw new Error(`${label} payout account must be 64 hex characters`);
    }
    return hexToAccountId(trimmed);
  }

  async function handleImageFile(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageUrl(dataUrl);
      setImageFileName(file.name);
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  async function handleWasmFile(file: File | null) {
    if (!file) {
      setWasmBytes(null);
      setWasmFileName("");
      return;
    }
    const bytes = await readFileAsBytes(file);
    setWasmBytes(bytes);
    setWasmFileName(`${file.name} (${Math.ceil(bytes.byteLength / 1024)} KB)`);
  }

  function setModerationCategory(
    key: keyof ModerationCategorySettings,
    value: boolean,
  ) {
    setModerationCategories((current) => ({ ...current, [key]: value }));
  }

  return (
    <Card className="border-accent/20 bg-card">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Mintlab Collections</CardTitle>
            <CardDescription className="text-xs">
              Configure the main app collection, user collection launch fees,
              mint fees, payout accounts, and child collection canister
              template.
            </CardDescription>
          </div>
          {mintConfigLoading ? (
            <Skeleton className="h-8 w-24 rounded-full" />
          ) : (
            <div className="flex flex-wrap justify-end gap-2">
              <Badge
                variant={collectionCreationEnabled ? "default" : "outline"}
              >
                {collectionCreationEnabled ? "Creation on" : "Creation off"}
              </Badge>
              <Badge variant={mainMintEnabled ? "default" : "outline"}>
                {mainMintEnabled ? "Main mint on" : "Main mint off"}
              </Badge>
              <Badge variant={moderationEnabled ? "secondary" : "outline"}>
                {moderationEnabled ? "Moderation on" : "Moderation off"}
              </Badge>
              <Badge
                variant={
                  mintConfig?.collectionCanisterWasmUploaded
                    ? "secondary"
                    : "outline"
                }
              >
                {mintConfig?.collectionCanisterWasmUploaded
                  ? "WASM ready"
                  : "WASM needed"}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="mint-name">Main collection name</Label>
            <Input
              id="mint-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vault Originals"
              data-ocid="admin.mint_config.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mint-symbol">Main collection symbol</Label>
            <Input
              id="mint-symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. VLT"
              data-ocid="admin.mint_config.symbol_input"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mint-description">Main collection description</Label>
          <Textarea
            id="mint-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the app's main collection..."
            data-ocid="admin.mint_config.description_textarea"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="mint-image">Main collection image</Label>
            <Input
              id="mint-image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                void handleImageFile(e.target.files?.[0] ?? null)
              }
              data-ocid="admin.mint_config.image_file_input"
            />
            <p className="text-xs text-muted-foreground">
              {imageFileName || "Choose an image from this device"}
            </p>
          </div>
          {imageUrl && (
            <img
              src={resolveImageUrl(imageUrl)}
              alt="Main collection preview"
              className="w-16 h-16 rounded-lg object-cover border border-border"
            />
          )}
        </div>

        <Separator />

        <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Marketplace Sales Fee
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fixed-price and auction sales send 2% of the sale amount to this
                ICP account.
              </p>
            </div>
            <Badge variant="secondary">
              {marketplaceFeeLoading
                ? "Loading"
                : `${Number(marketplaceFeeConfig?.mintlabFeeBasisPoints ?? 200n) / 100}% fee`}
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="marketplace-fee-payout">
                Mintlab sales fee account ID
              </Label>
              <Input
                id="marketplace-fee-payout"
                value={marketplaceFeePayout}
                onChange={(e) => setMarketplaceFeePayout(e.target.value)}
                placeholder="64-character ICP account hex"
                className="font-mono text-xs"
                data-ocid="admin.mint_config.marketplace_fee_payout_input"
              />
            </div>
            <Button
              type="button"
              onClick={() => marketplaceFeeMutation.mutate()}
              disabled={marketplaceFeeMutation.isPending}
              data-ocid="admin.mint_config.marketplace_fee_save_button"
            >
              {marketplaceFeeMutation.isPending ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Fee Account
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border bg-background/60 p-3">
              <span className="text-muted-foreground">Ledger fee</span>
              <p className="font-mono text-foreground mt-1">
                {formatICP(marketplaceFeeConfig?.ledgerFeeE8s ?? 10_000n)} ICP
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background/60 p-3">
              <span className="text-muted-foreground">
                Auction escrow fee reserve
              </span>
              <p className="font-mono text-foreground mt-1">
                {formatICP(
                  marketplaceFeeConfig?.auctionBidFeeReserveE8s ?? 20_000n,
                )}{" "}
                ICP
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-sm font-semibold text-foreground">
              User Collection Creation
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="creation-payout">
                Creation payout account ID
              </Label>
              <Input
                id="creation-payout"
                value={collectionCreationPayout}
                onChange={(e) => setCollectionCreationPayout(e.target.value)}
                placeholder="64-character ICP account hex"
                className="font-mono text-xs"
                data-ocid="admin.mint_config.creation_payout_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="creation-price">Creation fee (ICP)</Label>
              <Input
                id="creation-price"
                value={collectionCreationPrice}
                onChange={(e) => setCollectionCreationPrice(e.target.value)}
                placeholder="e.g. 1.25"
                data-ocid="admin.mint_config.creation_price_input"
              />
            </div>
            {creationQuoteFetching && (
              <p className="text-xs text-muted-foreground">
                Updating cycles quote...
              </p>
            )}
            {creationQuoteError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-xs text-destructive">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>
                  Could not fetch the cycles quote:{" "}
                  {creationQuoteError instanceof Error
                    ? creationQuoteError.message
                    : "Unknown error"}
                </span>
              </div>
            )}
            {creationQuote && (
              <div className="rounded-lg border border-border bg-background/60 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    Converted to cycles
                  </span>
                  <span className="font-medium text-foreground">
                    {formatICP(creationQuote.cycleCostE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Admin receives</span>
                  <span className="font-medium text-foreground">
                    {formatICP(creationQuote.adminPayoutE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">User debit</span>
                  <span className="font-medium text-foreground">
                    {formatICP(creationQuote.totalUserDebitE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Cycles funded</span>
                  <span className="font-medium text-foreground">
                    {formatCycles(creationQuote.totalCyclesToConvert)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    New canister receives
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCycles(creationQuote.collectionCanisterCycles)}
                  </span>
                </div>
                {creationPriceBelowCycles && (
                  <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-destructive">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>
                      Set at least{" "}
                      {formatICP(creationQuote.minimumCreationPriceE8s)} ICP at
                      the current cycles rate.
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="creation-enabled">Enable creation</Label>
              <Switch
                id="creation-enabled"
                checked={collectionCreationEnabled}
                onCheckedChange={setCollectionCreationEnabled}
                data-ocid="admin.mint_config.creation_enabled_switch"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-sm font-semibold text-foreground">
              Main Collection Minting
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="main-mint-payout">Mint payout account ID</Label>
              <Input
                id="main-mint-payout"
                value={mainMintPayout}
                onChange={(e) => setMainMintPayout(e.target.value)}
                placeholder="64-character ICP account hex"
                className="font-mono text-xs"
                data-ocid="admin.mint_config.main_payout_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="main-mint-price">Mint price (ICP)</Label>
              <Input
                id="main-mint-price"
                value={mainMintPrice}
                onChange={(e) => setMainMintPrice(e.target.value)}
                placeholder="e.g. 0.25"
                data-ocid="admin.mint_config.main_price_input"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="main-mint-enabled">Enable public mint</Label>
              <Switch
                id="main-mint-enabled"
                checked={mainMintEnabled}
                onCheckedChange={setMainMintEnabled}
                data-ocid="admin.mint_config.main_enabled_switch"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="main-dividends-enabled">Enable dividends</Label>
              <Switch
                id="main-dividends-enabled"
                checked={mainMintDividendsEnabled}
                onCheckedChange={setMainMintDividendsEnabled}
                data-ocid="admin.mint_config.main_dividends_switch"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Dedicated Collection Canisters
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="collection-cycles">Cycles per new canister</Label>
              <Input
                id="collection-cycles"
                inputMode="numeric"
                value={collectionCanisterCycles}
                onChange={(e) => setCollectionCanisterCycles(e.target.value)}
                data-ocid="admin.mint_config.collection_cycles_input"
              />
              <p className="text-xs text-muted-foreground">
                Values below {formatCycles(MIN_COLLECTION_CANISTER_CYCLES)} are
                raised automatically so the child canister has enough cycles to
                install its WASM module.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collection-wasm">Collection canister WASM</Label>
              <Input
                id="collection-wasm"
                type="file"
                accept=".wasm,application/wasm,application/octet-stream"
                onChange={(e) =>
                  void handleWasmFile(e.target.files?.[0] ?? null)
                }
                data-ocid="admin.mint_config.wasm_input"
              />
              <p className="text-xs text-muted-foreground">
                {wasmFileName ||
                  (mintConfig?.collectionCanisterWasmUploaded
                    ? "A collection canister template is stored"
                    : "Upload src/backend/dist/collection_nft.wasm after build")}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => upgradeDedicatedCollectionsMutation.mutate()}
              disabled={
                upgradeDedicatedCollectionsMutation.isPending ||
                !mintConfig?.collectionCanisterWasmUploaded
              }
              className="gap-2"
              data-ocid="admin.mint_config.upgrade_dedicated_wasms_button"
            >
              {upgradeDedicatedCollectionsMutation.isPending ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <RefreshCw size={15} />
              )}
              Update Existing Canisters
            </Button>
            <Button
              variant="outline"
              onClick={() => wasmMutation.mutate()}
              disabled={!wasmBytes || wasmMutation.isPending}
              className="gap-2"
              data-ocid="admin.mint_config.wasm_submit_button"
            >
              {wasmMutation.isPending ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Layers size={15} />
              )}
              Upload WASM
            </Button>
          </div>
        </div>

        <Separator />

        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield size={15} className="text-primary" />
                xAI Upload Moderation
              </p>
              <p className="text-xs text-muted-foreground">
                Checks collection and NFT titles, descriptions, and uploaded
                JPG/PNG images before any ICP transfer is attempted.
              </p>
            </div>
            {moderationConfigLoading ? (
              <Skeleton className="h-6 w-24 rounded-full" />
            ) : (
              <Badge
                variant={
                  moderationConfig?.apiKeyConfigured ? "secondary" : "outline"
                }
              >
                {moderationConfig?.apiKeyConfigured ? "xAI key set" : "No key"}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="moderation-api-key">xAI API key</Label>
              <Input
                id="moderation-api-key"
                type="password"
                value={xaiApiKey}
                onChange={(e) => {
                  setXaiApiKey(e.target.value);
                  if (e.target.value.trim()) setClearXaiApiKey(false);
                }}
                placeholder={
                  moderationConfig?.apiKeyConfigured
                    ? "Leave blank to keep current key"
                    : "xai-..."
                }
                data-ocid="admin.moderation.api_key_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="moderation-model">xAI model</Label>
              <Input
                id="moderation-model"
                value={moderationModel}
                onChange={(e) => setModerationModel(e.target.value)}
                placeholder="grok-4.3"
                data-ocid="admin.moderation.model_input"
              />
            </div>
          </div>

          {moderationConfig?.apiKeyConfigured && (
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 p-3">
              <Label htmlFor="moderation-clear-key">
                Clear stored xAI key on save
              </Label>
              <Switch
                id="moderation-clear-key"
                checked={clearXaiApiKey}
                onCheckedChange={(checked) => {
                  setClearXaiApiKey(checked);
                  if (checked) setXaiApiKey("");
                }}
                data-ocid="admin.moderation.clear_key_switch"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 p-3">
            <Label htmlFor="moderation-enabled">Enable moderation</Label>
            <Switch
              id="moderation-enabled"
              checked={moderationEnabled}
              onCheckedChange={setModerationEnabled}
              data-ocid="admin.moderation.enabled_switch"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {moderationCategoryLabels.map((category) => (
              <div
                key={category.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 p-3"
              >
                <Label
                  htmlFor={`moderation-${category.key}`}
                  className="text-xs"
                >
                  {category.label}
                </Label>
                <Switch
                  id={`moderation-${category.key}`}
                  checked={moderationCategories[category.key]}
                  onCheckedChange={(checked) =>
                    setModerationCategory(category.key, checked)
                  }
                  data-ocid={`admin.moderation.category.${category.key}`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="moderation-message">User policy message</Label>
            <Textarea
              id="moderation-message"
              rows={3}
              value={moderationMessage}
              onChange={(e) => setModerationMessage(e.target.value)}
              data-ocid="admin.moderation.message_textarea"
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => moderationMutation.mutate()}
              disabled={moderationMutation.isPending}
              className="gap-2"
              data-ocid="admin.moderation.submit_button"
            >
              {moderationMutation.isPending ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Moderation"
              )}
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="gap-2"
            data-ocid="admin.mint_config.submit_button"
          >
            {saveMutation.isPending ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Mint Settings"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── AddCollectionForm ────────────────────────────────────────────────────────

interface FormValues {
  name: string;
  symbol: string;
  description: string;
  canisterId: string;
  standard: string;
  otherStandard: string;
  imageUrl: string;
}

const defaultForm: FormValues = {
  name: "",
  symbol: "",
  description: "",
  canisterId: "",
  standard: "EXT",
  otherStandard: "",
  imageUrl: "",
};

interface FormErrors {
  name?: string;
  symbol?: string;
  description?: string;
  canisterId?: string;
  imageUrl?: string;
}

function AddCollectionForm({ onSuccess }: { onSuccess: () => void }) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormValues>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageFileInputKey, setImageFileInputKey] = useState(0);
  const [previewImg, setPreviewImg] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!actor) throw new Error("Backend not ready");
      const principal = Principal.fromText(values.canisterId);
      const standard = makeStandard(values.standard, values.otherStandard);
      return actor.addCollection(
        values.name,
        values.description,
        principal,
        standard,
        values.imageUrl,
        values.symbol,
        null,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection added successfully!");
      setForm(defaultForm);
      setImageDataUrl("");
      setImageFileName("");
      setImageFileInputKey((current) => current + 1);
      setPreviewImg("");
      setErrors({});
      onSuccess();
    },
    onError: (err: unknown) => {
      toast.error(`Failed to add collection: ${extractError(err)}`);
    },
  });

  function validate(imageValue: string): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.symbol.trim()) e.symbol = "Symbol is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.canisterId.trim()) {
      e.canisterId = "Canister ID is required";
    } else if (!isValidPrincipal(form.canisterId.trim())) {
      e.canisterId = "Invalid principal format";
    }
    if (!imageValue) {
      e.imageUrl = "Upload a collection image or add an image URL";
    } else if (imageValue.length > MAX_ON_CHAIN_IMAGE_CHARS) {
      e.imageUrl = "Collection image is too large for on-chain storage";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const imageValue = (imageDataUrl || form.imageUrl).trim();
    if (!validate(imageValue)) return;
    mutation.mutate({ ...form, imageUrl: imageValue });
  }

  function set(field: keyof FormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function setImageUrl(value: string) {
    if (imageDataUrl) {
      setImageFileInputKey((current) => current + 1);
    }
    setImageDataUrl("");
    setImageFileName("");
    set("imageUrl", value);
  }

  async function handleCollectionImageFile(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      setImageFileName(file.name);
      set("imageUrl", "");
      setPreviewImg(dataUrl);
      setPreviewError(false);
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  function handleImageBlur() {
    setPreviewError(false);
    setPreviewImg(form.imageUrl.trim());
  }

  const previewImage = imageDataUrl || previewImg;
  const previewImageUrl = resolveImageUrl(previewImage);

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader
        className="cursor-pointer select-none pb-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus size={16} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Add New Collection</CardTitle>
              <CardDescription className="text-xs">
                Manually curate a supported ICP NFT collection into Mintlab
              </CardDescription>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Row 1: Name + Symbol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="col-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="col-name"
                  placeholder="e.g. Bored Apes ICP"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  data-ocid="admin.add_collection.name_input"
                />
                {errors.name && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="admin.add_collection.name_field_error"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="col-symbol">
                  Symbol <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="col-symbol"
                  placeholder="e.g. BAPE"
                  value={form.symbol}
                  onChange={(e) => set("symbol", e.target.value.toUpperCase())}
                  data-ocid="admin.add_collection.symbol_input"
                />
                {errors.symbol && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="admin.add_collection.symbol_field_error"
                  >
                    {errors.symbol}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="col-desc">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="col-desc"
                placeholder="Brief description of the collection…"
                rows={2}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                data-ocid="admin.add_collection.description_textarea"
              />
              {errors.description && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="admin.add_collection.description_field_error"
                >
                  {errors.description}
                </p>
              )}
            </div>

            {/* Row 2: Canister ID + Standard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="col-canister">
                  Canister ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="col-canister"
                  placeholder="e.g. rrkah-fqaaa-aaaaa-aaaaq-cai"
                  value={form.canisterId}
                  onChange={(e) => set("canisterId", e.target.value)}
                  className="font-mono text-sm"
                  data-ocid="admin.add_collection.canister_id_input"
                />
                {errors.canisterId && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="admin.add_collection.canister_id_field_error"
                  >
                    {errors.canisterId}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="col-standard">
                  NFT Standard <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.standard}
                  onValueChange={(v) => set("standard", v)}
                >
                  <SelectTrigger
                    id="col-standard"
                    data-ocid="admin.add_collection.standard_select"
                  >
                    <SelectValue placeholder="Select standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXT">EXT (Entrepot)</SelectItem>
                    <SelectItem value="DIP721">DIP721</SelectItem>
                    <SelectItem value="ICRC7">ICRC-7</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.standard === "Other" && (
                  <Input
                    placeholder="Custom standard name"
                    value={form.otherStandard}
                    onChange={(e) => set("otherStandard", e.target.value)}
                    className="mt-1.5"
                    data-ocid="admin.add_collection.other_standard_input"
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  Most Entrepot collections use EXT. Modern ICP NFT ledgers may
                  use ICRC-7 instead.
                </p>
              </div>
            </div>

            {/* Image + preview */}
            <div className="space-y-1.5">
              <Label htmlFor="col-image-file">
                Collection image <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <div className="space-y-1">
                  <Input
                    key={imageFileInputKey}
                    id="col-image-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      void handleCollectionImageFile(
                        e.target.files?.[0] ?? null,
                      )
                    }
                    data-ocid="admin.add_collection.image_file_input"
                  />
                  <p className="text-xs text-muted-foreground">
                    {imageFileName || "Choose an image from this device"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="col-image"
                    className="text-xs text-muted-foreground"
                  >
                    Or image URL
                  </Label>
                  <Input
                    id="col-image"
                    placeholder="https://… or ipfs://…"
                    value={form.imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onBlur={handleImageBlur}
                    data-ocid="admin.add_collection.image_url_input"
                  />
                  {errors.imageUrl && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="admin.add_collection.image_url_field_error"
                    >
                      {errors.imageUrl}
                    </p>
                  )}
                </div>
                {/* preview */}
                <div className="w-14 h-14 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {previewImageUrl && !previewError ? (
                    <img
                      src={previewImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <ExternalLink size={16} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending}
                data-ocid="admin.add_collection.submit_button"
                className="gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Adding…
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    Add Collection
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}

// ─── AdminPage ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();

  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor && !isFetching,
  });

  const removeMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend not ready");
      const ok = await actor.removeCollection(id);
      if (!ok) throw new Error("Collection could not be removed");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection removed.");
    },
    onError: (err: unknown) => {
      toast.error(`Failed to remove collection: ${extractError(err)}`);
    },
  });

  // Redirect non-admins once we know they're not admin
  const redirected = useRef(false);
  if (!adminLoading && !isAdmin && !redirected.current) {
    redirected.current = true;
    void navigate({ to: "/wallet" });
    return null;
  }

  const isLoading = adminLoading || collectionsLoading;
  const count = collections?.length ?? 0;

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-6"
      data-ocid="admin.page"
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage Mintlab settings and collection curation
            </p>
          </div>
          {!isLoading && (
            <div className="ml-auto flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-1.5">
              <Layers size={14} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {count}
              </span>
              <span className="text-xs text-muted-foreground">
                {count === 1 ? "collection" : "collections"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add Collection form */}
      <AddCollectionForm onSuccess={() => {}} />

      <MintConfigForm />

      {/* Collection Setup Guide */}
      <CollectionSetupGuide />

      {/* Collections list */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Registered Collections
        </h2>

        {isLoading ? (
          <div
            className="space-y-2"
            data-ocid="admin.collections.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : count === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-border bg-muted/20"
            data-ocid="admin.collections.empty_state"
          >
            <Layers size={40} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">
              No collections yet
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Use the form above to register the first NFT collection.
            </p>
          </div>
        ) : (
          <div className="space-y-2" data-ocid="admin.collections.list">
            {collections!.map((col, i) => (
              <CollectionRow
                key={col.id.toString()}
                collection={col}
                index={i + 1}
                onRemove={(id) => removeMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
