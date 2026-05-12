import type {
  backendInterface,
  Collection,
  WalletNFT,
  ActiveListing,
  ActiveListingDetail,
  AuctionListing,
  FixedListing,
  NFTStats,
  AccountIdentifier,
  ModerationCategorySettings,
} from "../backend-client";
import { ListingStatus } from "../backend-client";
import { Principal } from "@icp-sdk/core/principal";

const samplePrincipal = Principal.fromText("aaaaa-aa");
const collectionPrincipal = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
const creatorControllerPrincipal = Principal.fromText(
  "ryjl3-tyaaa-aaaaa-aaaba-cai",
);

const mockModerationCategories: ModerationCategorySettings = {
  nudityOrSexual: true,
  graphicViolence: true,
  explicitLanguage: true,
  hateOrHarassment: true,
  hateSymbols: true,
  illegalOrDangerous: true,
  selfHarm: true,
  otherNsfw: true,
};

const sampleCollections: Collection[] = [
  {
    id: BigInt(1),
    name: "Cosmic Entity",
    description: "Ethereal beings from the void between stars.",
    imageUrl: "https://picsum.photos/seed/cosmic/400/400",
    standard: { __kind__: "EXT", EXT: null },
    symbol: "CENT",
    canisterId: collectionPrincipal,
    kind: "External",
    browseInfo: {
      totalSupply: BigInt(120),
      tokenIndexOffset: BigInt(0),
    },
  },
  {
    id: BigInt(2),
    name: "Geometric Flux",
    description: "Abstract geometric forms in perpetual motion.",
    imageUrl: "https://picsum.photos/seed/geo/400/400",
    standard: { __kind__: "DIP721", DIP721: null },
    symbol: "GFLX",
    canisterId: collectionPrincipal,
    kind: "External",
    browseInfo: {
      totalSupply: BigInt(80),
      tokenIndexOffset: BigInt(1),
    },
  },
  {
    id: BigInt(3),
    name: "Mintlab Genesis",
    description: "The managed Mintlab canister collection profile.",
    imageUrl: "https://picsum.photos/seed/ape/400/400",
    standard: { __kind__: "ICRC7", ICRC7: null },
    symbol: "MINT",
    canisterId: collectionPrincipal,
    kind: "Minted",
  },
  {
    id: BigInt(4),
    name: "Creator Forge",
    description: "A user-owned Mintlab collection created after paying the setup fee.",
    imageUrl: "https://picsum.photos/seed/forge/400/400",
    standard: { __kind__: "ICRC7", ICRC7: null },
    symbol: "FORGE",
    canisterId: collectionPrincipal,
    kind: "Minted",
    dividendConfig: { enabled: true },
  },
];

const sampleNFTs: WalletNFT[] = [
  {
    id: BigInt(1),
    tokenId: "42",
    collectionId: BigInt(1),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Registered",
    metadata: {
      name: "Cosmic Entity #42",
      description: "A rare cosmic entity with stellar attributes.",
      imageUrl: "https://picsum.photos/seed/nft1/400/400",
      attributes: [["Rarity", "Legendary"], ["Power", "9500"]],
    },
  },
  {
    id: BigInt(2),
    tokenId: "77",
    collectionId: BigInt(2),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Vaulted",
    metadata: {
      name: "Geometric Flux #77",
      description: "Abstract flux in violet frequencies.",
      imageUrl: "https://picsum.photos/seed/nft2/400/400",
      attributes: [["Rarity", "Rare"], ["Frequency", "290hz"]],
    },
  },
  {
    id: BigInt(3),
    tokenId: "12",
    collectionId: BigInt(4),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Minted",
    metadata: {
      name: "Creator Forge #12",
      description: "Elite community drop minted inside a creator-owned Mintlab collection.",
      imageUrl: "https://picsum.photos/seed/nft3/400/400",
      attributes: [["Rarity", "Epic"], ["Neural", "V3"]],
    },
  },
];

const fixedListing: FixedListing = {
  id: BigInt(1),
  status: ListingStatus.Active,
  createdAt: BigInt(Date.now()) * BigInt(1_000_000),
  seller: samplePrincipal,
  nftId: BigInt(4),
  price: BigInt(1_550_000_000),
};

const auctionListing: AuctionListing = {
  id: BigInt(2),
  status: ListingStatus.Active,
  endTime: BigInt(Date.now() + 86400000) * BigInt(1_000_000),
  createdAt: BigInt(Date.now()) * BigInt(1_000_000),
  seller: samplePrincipal,
  highestBid: BigInt(820_000_000),
  highestBidder: samplePrincipal,
  nftId: BigInt(5),
  startingBid: BigInt(500_000_000),
};

const sampleActiveListings: ActiveListing[] = [
  { __kind__: "Fixed", Fixed: fixedListing },
  { __kind__: "Auction", Auction: auctionListing },
  {
    __kind__: "Fixed",
    Fixed: { ...fixedListing, id: BigInt(3), nftId: BigInt(6), price: BigInt(820_000_000) },
  },
  {
    __kind__: "Auction",
    Auction: {
      ...auctionListing,
      id: BigInt(4),
      nftId: BigInt(7),
      highestBid: BigInt(1_550_000_000),
    },
  },
];

const sampleListingNFTs: WalletNFT[] = [
  {
    id: BigInt(4),
    tokenId: "81",
    collectionId: BigInt(2),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Vaulted",
    metadata: {
      name: "Geometric Flux #81",
      description: "Escrowed for direct sale.",
      imageUrl: "https://picsum.photos/seed/market1/400/400",
      attributes: [["Edition", "81"]],
    },
  },
  {
    id: BigInt(5),
    tokenId: "24",
    collectionId: BigInt(3),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Minted",
    metadata: {
      name: "Cybernetic Ape #24",
      description: "Live auction sample.",
      imageUrl: "https://picsum.photos/seed/market2/400/400",
      attributes: [["Drop", "Genesis"]],
    },
  },
  {
    id: BigInt(6),
    tokenId: "108",
    collectionId: BigInt(1),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Vaulted",
    metadata: {
      name: "Cosmic Entity #108",
      description: "Limited fixed-price sample.",
      imageUrl: "https://picsum.photos/seed/market3/400/400",
      attributes: [["Rarity", "Rare"]],
    },
  },
  {
    id: BigInt(7),
    tokenId: "31",
    collectionId: BigInt(3),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Minted",
    metadata: {
      name: "Cybernetic Ape #31",
      description: "Second auction sample.",
      imageUrl: "https://picsum.photos/seed/market4/400/400",
      attributes: [["Rarity", "Epic"]],
    },
  },
];

const sampleActiveListingDetails: ActiveListingDetail[] = sampleActiveListings.map(
  (listing) => ({
    listing,
    nft:
      sampleListingNFTs.find((nft) =>
        nft.id ===
        (listing.__kind__ === "Fixed" ? listing.Fixed.nftId : listing.Auction.nftId),
      ) ?? sampleListingNFTs[0],
  }),
);

const mockAccountId: AccountIdentifier = new Uint8Array(32).fill(0xab);

const sampleBrowseNFTsByCollection = new Map<string, WalletNFT[]>([
  [
    "1",
    [
      sampleNFTs[0],
      sampleListingNFTs[2],
      {
        id: 109n,
        tokenId: "109",
        collectionId: 1n,
        owner: samplePrincipal,
        registeredAt: BigInt(Date.now()) * 1_000_000n,
        location: "Registered",
        metadata: {
          name: "Cosmic Entity #109",
          description: "Mock browser sample for the full EXT collection.",
          imageUrl: "https://picsum.photos/seed/market5/400/400",
          attributes: [["Rarity", "Mythic"]],
        },
      },
    ],
  ],
  [
    "2",
    [
      sampleNFTs[1],
      sampleListingNFTs[0],
      {
        id: 82n,
        tokenId: "82",
        collectionId: 2n,
        owner: samplePrincipal,
        registeredAt: BigInt(Date.now()) * 1_000_000n,
        location: "Registered",
        metadata: {
          name: "Geometric Flux #82",
          description: "Mock browser sample for the DIP721 collection.",
          imageUrl: "https://picsum.photos/seed/market6/400/400",
          attributes: [["Edition", "82"]],
        },
      },
    ],
  ],
  [
    "3",
    [
      sampleListingNFTs[1],
      sampleListingNFTs[3],
      {
        id: 32n,
        tokenId: "32",
        collectionId: 3n,
        owner: samplePrincipal,
        registeredAt: BigInt(Date.now()) * 1_000_000n,
        location: "Minted",
        metadata: {
          name: "Cybernetic Ape #32",
          description: "Additional mock minted sample.",
          imageUrl: "https://picsum.photos/seed/market7/400/400",
          attributes: [["Rarity", "Legendary"]],
        },
      },
    ],
  ],
  [
    "4",
    [
      sampleNFTs[2],
      {
        id: 13n,
        tokenId: "13",
        collectionId: 4n,
        owner: samplePrincipal,
        registeredAt: BigInt(Date.now()) * 1_000_000n,
        location: "Minted",
        metadata: {
          name: "Creator Forge #13",
          description: "Another creator-owned Mintlab collectible.",
          imageUrl: "https://picsum.photos/seed/market8/400/400",
          attributes: [["Rarity", "Rare"]],
        },
      },
    ],
  ],
]);

function sampleCollectionNFTs(collectionId: bigint): WalletNFT[] {
  return sampleBrowseNFTsByCollection.get(collectionId.toString()) ?? [];
}

export const mockBackend: backendInterface = {
  addCollection: async (
    name,
    description,
    canisterId,
    standard,
    imageUrl,
    symbol,
    browseInfo,
  ) => ({
    id: BigInt(Math.floor(Math.random() * 1000)),
    name,
    description,
    imageUrl,
    standard,
    symbol,
    canisterId,
    kind: "External",
    browseInfo: browseInfo ?? undefined,
  }),
  bootstrapAdmin: async () => undefined,
  buyFixedListing: async () => undefined,
  cancelListing: async () => undefined,
  claimNFTDividend: async (nftId) => ({
    __kind__: "ok" as const,
    ok: {
      nft:
        sampleNFTs.find((nft) => nft.id === nftId) ??
        sampleNFTs[sampleNFTs.length - 1],
      collection: sampleCollections[3],
      paidE8s: 49_990_000n,
      feeE8s: 10_000n,
      blockIndex: 42n,
    },
  }),
  claimVaultDeposit: async (collectionId, tokenId) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(Math.floor(Math.random() * 1000)),
      tokenId,
      collectionId,
      owner: samplePrincipal,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
      location: "Vaulted",
      metadata: {
        name: `Deposited #${tokenId}`,
        description: "Mock vaulted NFT",
        imageUrl: "https://picsum.photos/seed/deposit/400/400",
        attributes: [],
      },
    },
  }),
  configureMarketplaceFeeRecipient: async (recipient) => ({
    auctionBidFeeReserveE8s: 20_000n,
    ledgerFeeE8s: 10_000n,
    mintlabFeeBasisPoints: 200n,
    mintlabFeeRecipient: recipient,
  }),
  configureMinting: async (name, description, symbol, imageUrl) => ({
    id: BigInt(999),
    name,
    description,
    imageUrl,
    standard: { __kind__: "ICRC7", ICRC7: null },
    symbol,
    canisterId: collectionPrincipal,
    kind: "Minted",
    browseInfo: undefined,
  }),
  createAuctionListing: async (nftId, startingBid, endTime) => ({
    ...auctionListing,
    nftId,
    startingBid,
    endTime,
    highestBid: startingBid,
  }),
  createUserCollection: async (name, description, symbol, imageUrl, dividendsEnabled) => ({
    __kind__: "ok" as const,
    ok: {
      paymentBlock: BigInt(7),
      collection: {
        id: BigInt(4),
        name,
        description,
        imageUrl,
        standard: { __kind__: "ICRC7", ICRC7: null },
        symbol,
        canisterId: collectionPrincipal,
        kind: "Minted",
        browseInfo: undefined,
        dividendConfig: dividendsEnabled ? { enabled: true } : undefined,
      },
    },
  }),
  createFixedListing: async (nftId, price) => ({
    ...fixedListing,
    nftId,
    price,
  }),
  getActiveListingDetails: async () => sampleActiveListingDetails,
  getActiveListings: async () => sampleActiveListings,
  getAdminPrincipal: async () => samplePrincipal,
  getCollection: async (id) => sampleCollections.find((c) => c.id === id) ?? null,
  getCollectionBrowseStats: async (collectionId) => {
    const collection = sampleCollections.find((c) => c.id === collectionId);
    const visibleCount = BigInt(sampleCollectionNFTs(collectionId).length);
    const totalCount =
      collection?.kind === "Minted"
        ? visibleCount
        : collection?.browseInfo?.totalSupply ?? visibleCount;
    return {
      collectionId,
      totalCount,
      visibleCount:
        collection?.kind === "Minted" || collection?.browseInfo?.totalSupply != null
          ? totalCount
          : visibleCount,
      coverage:
        collection?.kind === "Minted" || collection?.browseInfo?.totalSupply != null
          ? "Full"
          : "Partial",
      note:
        collection?.kind === "Minted"
          ? "Mintlab can browse every NFT minted in this collection."
          : collection?.browseInfo?.totalSupply != null
            ? "Mintlab can browse the full imported collection."
            : "Mintlab is showing the NFTs it has already indexed for this collection.",
    };
  },
  getCollectionCreator: async (id) => (id === 4n ? samplePrincipal : null),
  getCollectionDividendAccountId: async () => mockAccountId,
  getCollectionDividendBalances: async (collectionId) =>
    collectionId === 4n
      ? [
          ["12", 50_000_000n],
          ["13", 50_000_000n],
        ]
      : [],
  refreshCollectionDividendBalances: async (collectionId) =>
    mockBackend.getCollectionDividendBalances(collectionId),
  getCollectionDividendInfo: async (collectionId) => ({
    collectionId,
    enabled: collectionId === 4n,
    accountId: mockAccountId,
    balanceE8s: 100_000_000n,
    processedBalanceE8s: 100_000_000n,
    pendingE8s: collectionId === 4n ? 100_000_000n : 0n,
    nftCount: BigInt(sampleCollectionNFTs(collectionId).length),
  }),
  getCollectionNFTPage: async (collectionId, cursor, limit) => {
    const items = sampleCollectionNFTs(collectionId);
    const start = cursor == null ? 0 : Number.parseInt(cursor, 10) || 0;
    const pageSize = limit == null ? 24 : Number(limit);
    const nfts = items.slice(start, start + pageSize);
    const stats = await mockBackend.getCollectionBrowseStats(collectionId);
    return {
      nfts,
      nextCursor:
        start + nfts.length < items.length ? `${start + nfts.length}` : undefined,
      totalCount: stats.totalCount,
      coverage: stats.coverage,
      note: stats.note,
    };
  },
  getNFTStats: async (): Promise<NFTStats> => ({
    totalCount: BigInt(3),
    perCollection: [
      [BigInt(1), BigInt(1)],
      [BigInt(2), BigInt(1)],
      [BigInt(4), BigInt(1)],
    ],
  }),
  getUserAccountId: async () => mockAccountId,
  getUserICPBalance: async () => BigInt(4_250_000_000),
  getUserNFTs: async () => sampleNFTs,
  getMarketplaceFeeConfig: async () => ({
    auctionBidFeeReserveE8s: 20_000n,
    ledgerFeeE8s: 10_000n,
    mintlabFeeBasisPoints: 200n,
    mintlabFeeRecipient: mockAccountId,
  }),
  getMintConfig: async () => ({
    collectionId: BigInt(3),
    payoutAccount: mockAccountId,
    mintPriceE8s: BigInt(100_000_000),
    mintEnabled: true,
    collectionCreationPayoutAccount: mockAccountId,
    collectionCreationPriceE8s: BigInt(100_000_000),
    collectionCreationEnabled: true,
    mainMintPayoutAccount: mockAccountId,
    mainMintPriceE8s: BigInt(25_000_000),
    mainMintEnabled: true,
    collectionCanisterWasmUploaded: true,
    collectionCanisterCycles: 2_000_000_000_000n,
  }),
  getModerationConfig: async () => ({
    enabled: true,
    apiKeyConfigured: true,
    model: "grok-4.3",
    categories: mockModerationCategories,
    userMessage:
      "Uploads cannot include nudity or sexual content, graphic violence, explicit language, hate or harassment, hate symbols, illegal or dangerous activity, self-harm content, or other NSFW material.",
  }),
  configureModeration: async (
    enabled,
    apiKey,
    clearApiKey,
    model,
    categories,
    userMessage,
  ) => ({
    enabled,
    apiKeyConfigured: !clearApiKey,
    model,
    categories,
    userMessage,
  }),
  quoteCollectionCreationCost: async (
    collectionCanisterCycles,
    collectionCreationPriceE8s,
  ) => {
    const minimumCollectionCanisterCycles = 2_000_000_000_000n;
    const normalizedCollectionCanisterCycles =
      collectionCanisterCycles < minimumCollectionCanisterCycles
        ? minimumCollectionCanisterCycles
        : collectionCanisterCycles;
    const factoryReserveCycles = 500_000_000_000n;
    const totalCyclesToConvert =
      normalizedCollectionCanisterCycles + factoryReserveCycles;
    const cycleCostE8s = 15_000_000n;
    const adminPayoutE8s =
      collectionCreationPriceE8s > cycleCostE8s
        ? collectionCreationPriceE8s - cycleCostE8s
        : 0n;
    const adminPayoutFeeE8s = adminPayoutE8s > 0n ? 10_000n : 0n;
    return {
      collectionCanisterCycles: normalizedCollectionCanisterCycles,
      factoryReserveCycles,
      totalCyclesToConvert,
      cycleCostE8s,
      minimumCreationPriceE8s: cycleCostE8s,
      collectionCreationPriceE8s,
      adminPayoutE8s,
      ledgerFeeE8s: 10_000n,
      cycleTransferFeeE8s: 10_000n,
      adminPayoutFeeE8s,
      totalUserDebitE8s:
        collectionCreationPriceE8s + 10_000n + adminPayoutFeeE8s,
      xdrPermyriadPerIcp: 100_000n,
      rateTimestampSeconds: BigInt(Math.floor(Date.now() / 1000)),
    };
  },
  quoteCollectionCycleTopUp: async (cyclesToTopUp) => ({
    cyclesToTopUp:
      cyclesToTopUp < 100_000_000_000n
        ? 100_000_000_000n
        : cyclesToTopUp,
    cycleCostE8s: 750_000n,
    ledgerFeeE8s: 10_000n,
    totalUserDebitE8s: 760_000n,
    xdrPermyriadPerIcp: 100_000n,
    rateTimestampSeconds: BigInt(Math.floor(Date.now() / 1000)),
  }),
  quoteAppCanisterCycleTopUp: async (cyclesToTopUp) =>
    mockBackend.quoteCollectionCycleTopUp(cyclesToTopUp),
  getMyCreatedCollections: async () =>
    sampleCollections.filter((collection) => collection.id === 4n),
  getMyCollectionCanisterStatuses: async () =>
    sampleCollections
      .filter((collection) => collection.id === 4n)
      .map((collection) => ({
        collectionId: collection.id,
        canisterId: collection.canisterId,
        appCanisterId: samplePrincipal,
        controllers: [samplePrincipal, creatorControllerPrincipal],
        cycles: 1_750_000_000_000n,
        moduleInstalled: true,
        freezingThresholdSeconds: 2_592_000n,
        idleCyclesBurnedPerDay: 12_500_000_000n,
      })),
  getCollectionCanisterControllers: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      canisterId:
        sampleCollections.find((collection) => collection.id === collectionId)
          ?.canisterId ?? collectionPrincipal,
      appCanisterId: samplePrincipal,
      controllers: [samplePrincipal, creatorControllerPrincipal],
    },
  }),
  addCollectionCanisterController: async (collectionId, controller) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      canisterId:
        sampleCollections.find((collection) => collection.id === collectionId)
          ?.canisterId ?? collectionPrincipal,
      appCanisterId: samplePrincipal,
      controllers: [samplePrincipal, creatorControllerPrincipal, controller],
    },
  }),
  removeCollectionCanisterController: async (collectionId, controller) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      canisterId:
        sampleCollections.find((collection) => collection.id === collectionId)
          ?.canisterId ?? collectionPrincipal,
      appCanisterId: samplePrincipal,
      controllers: [samplePrincipal, creatorControllerPrincipal].filter(
        (principal) => principal.toString() !== controller.toString(),
      ),
    },
  }),
  getMyDividendNFTs: async () =>
    sampleNFTs
      .filter((nft) => nft.collectionId === 4n)
      .map((nft) => ({
        nft,
        collection: sampleCollections[3],
        claimableE8s: 50_000_000n,
      })),
  getMyPendingAuctionRefunds: async () => [],
  refreshMyDividendNFTs: async () => mockBackend.getMyDividendNFTs(),
  getVaultAccountId: async () => mockAccountId,
  getVaultPrincipal: async () => samplePrincipal,
  isAdmin: async () => true,
  listCollections: async () => sampleCollections,
  mintCollectionNFT: async (collectionId, metadata) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(Math.floor(Math.random() * 1000)),
      tokenId: `${Math.floor(Math.random() * 10000)}`,
      collectionId,
      owner: samplePrincipal,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
      location: "Minted",
      metadata,
    },
  }),
  mintUserNFT: async (metadata) => ({
    __kind__: "ok" as const,
    ok: {
      paymentBlock: BigInt(1),
      nft: {
        id: BigInt(Math.floor(Math.random() * 1000)),
        tokenId: `${Math.floor(Math.random() * 10000)}`,
        collectionId: BigInt(3),
        owner: samplePrincipal,
        registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
        location: "Minted",
        metadata,
      },
    },
  }),
  placeBid: async (listingId, amount) => ({
    ...auctionListing,
    id: listingId,
    highestBid: amount,
  }),
  prepareVaultDeposit: async () => ({ __kind__: "ok" as const, ok: "Mock deposit prepared" }),
  previewMyCollectionNFTs: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: sampleNFTs.filter((nft) => nft.collectionId === collectionId),
  }),
  registerNFT: async (collectionId, tokenId, metadata) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(Math.floor(Math.random() * 1000)),
      tokenId,
      collectionId,
      owner: samplePrincipal,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
      location: "Registered",
      metadata,
    },
  }),
  removeCollection: async () => true,
  retryAuctionRefund: async () => true,
  retryInstallCollectionCanister: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: sampleCollections.find((collection) => collection.id === collectionId) ??
      sampleCollections[0],
  }),
  topUpCollectionCanisterCycles: async (collectionId, cyclesToTopUp) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      canisterId:
        sampleCollections.find((collection) => collection.id === collectionId)
          ?.canisterId ?? sampleCollections[0].canisterId,
      cyclesRequested: cyclesToTopUp,
      cyclesMinted: cyclesToTopUp,
      cycleCostE8s: 750_000n,
      totalUserDebitE8s: 760_000n,
      paymentBlock: 1n,
      cycleBalance: 2_500_000_000_000n,
    },
  }),
  topUpCanisterCycles: async (targetCanister, cyclesToTopUp) => ({
    __kind__: "ok" as const,
    ok: {
      canisterId: targetCanister,
      cyclesRequested: cyclesToTopUp,
      cyclesMinted: cyclesToTopUp,
      cycleCostE8s: 750_000n,
      totalUserDebitE8s: 760_000n,
      paymentBlock: 1n,
      cycleBalance: 2_500_000_000_000n,
    },
  }),
  topUpAppCanisterCycles: async (cyclesToTopUp) => ({
    __kind__: "ok" as const,
    ok: {
      canisterId: sampleCollections[0].canisterId,
      cyclesRequested: cyclesToTopUp,
      cyclesMinted: cyclesToTopUp,
      cycleCostE8s: 750_000n,
      totalUserDebitE8s: 760_000n,
      paymentBlock: 1n,
      cycleBalance: 2_500_000_000_000n,
    },
  }),
  upgradeCollectionCanister: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: sampleCollections.find((collection) => collection.id === collectionId) ??
      sampleCollections[0],
  }),
  sendNFT: async () => ({ __kind__: "ok" as const, ok: "mock-tx-id" }),
  setCollectionCanisterWasm: async () => undefined,
  settleAuction: async () => undefined,
  syncCollectionDividends: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      depositedE8s: 100_000_000n,
      distributedE8s: 100_000_000n,
      shareE8s: 50_000_000n,
      remainderE8s: 0n,
      nftCount: 2n,
      balanceE8s: 100_000_000n,
    },
  }),
  transferICPOut: async () => ({ __kind__: "Ok", Ok: BigInt(1) }),
  getCollectionNFTs: async (collectionId) => sampleCollectionNFTs(collectionId),
  getCollectionNFT: async (collectionId, tokenId) =>
    sampleCollectionNFTs(collectionId).find((n) => n.tokenId === tokenId) ?? null,
  isNFTInUserWallet: async () => false,
  syncUserNFTs: async () => ({ __kind__: "ok" as const, ok: { newCount: 0n, errors: [] as string[] } }),
};
