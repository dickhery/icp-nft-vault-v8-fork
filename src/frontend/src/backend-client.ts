import {
  Actor,
  type ActorConfig,
  type ActorSubclass,
  type Agent,
  HttpAgent,
  type HttpAgentOptions,
} from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory } from "./backend-idl";

export interface Tokens {
  e8s: bigint;
}

export type AccountIdentifier = Uint8Array;
export type CollectionId = bigint;
export type ListingId = bigint;
export type NFTId = bigint;
export type Timestamp = bigint;
export type UserId = Principal;

export type NFTStandard =
  | { __kind__: "EXT"; EXT: null }
  | { __kind__: "DIP721"; DIP721: null }
  | { __kind__: "ICRC7"; ICRC7: null }
  | { __kind__: "Other"; Other: string };

export type CollectionKind = "External" | "Minted";

export type CollectionBrowseCoverage = "Full" | "Partial";

export type WalletLocation = "Minted" | "Registered" | "Vaulted";

export interface NFTMetadata {
  name?: string;
  description?: string;
  imageUrl?: string;
  attributes: Array<[string, string]>;
}

export interface WalletNFT {
  id: NFTId;
  tokenId: string;
  collectionId: CollectionId;
  owner: UserId;
  metadata: NFTMetadata;
  location: WalletLocation;
  registeredAt: Timestamp;
}

export interface NFTStats {
  totalCount: bigint;
  perCollection: Array<[CollectionId, bigint]>;
}

export interface CollectionBrowseInfo {
  totalSupply: bigint | null;
  tokenIndexOffset: bigint | null;
}

export interface CollectionDividendConfig {
  enabled: boolean;
}

export interface Collection {
  id: CollectionId;
  name: string;
  description: string;
  imageUrl: string;
  standard: NFTStandard;
  symbol: string;
  canisterId: Principal;
  kind: CollectionKind;
  browseInfo?: CollectionBrowseInfo;
  dividendConfig?: CollectionDividendConfig;
}

export interface CollectionBrowseStats {
  collectionId: CollectionId;
  totalCount: bigint;
  visibleCount: bigint;
  coverage: CollectionBrowseCoverage;
  note: string;
}

export interface CollectionNFTPage {
  nfts: Array<WalletNFT>;
  nextCursor?: string;
  totalCount: bigint;
  coverage: CollectionBrowseCoverage;
  note: string;
}

export interface FixedListing {
  id: ListingId;
  status: ListingStatus;
  createdAt: Timestamp;
  seller: UserId;
  nftId: NFTId;
  price: bigint;
}

export interface AuctionListing {
  id: ListingId;
  status: ListingStatus;
  highestBidder?: UserId;
  endTime: Timestamp;
  createdAt: Timestamp;
  seller: UserId;
  highestBid: bigint;
  nftId: NFTId;
  startingBid: bigint;
}

export type ActiveListing =
  | { __kind__: "Fixed"; Fixed: FixedListing }
  | { __kind__: "Auction"; Auction: AuctionListing };

export interface ActiveListingDetail {
  listing: ActiveListing;
  nft: WalletNFT;
}

export interface AuctionEscrow {
  amount: bigint;
  bidder: UserId;
  createdAt: Timestamp;
  depositedBlock: bigint;
  escrowId: bigint;
  feeReserve: bigint;
  ledgerFeeE8s: bigint;
  listingId: ListingId;
}

export interface MarketplaceFeeConfig {
  auctionBidFeeReserveE8s: bigint;
  ledgerFeeE8s: bigint;
  mintlabFeeBasisPoints: bigint;
  mintlabFeeRecipient: AccountIdentifier | null;
}

export enum ListingStatus {
  Sold = "Sold",
  Active = "Active",
  Cancelled = "Cancelled",
  Settled = "Settled",
}

export interface MintConfig {
  collectionId: CollectionId | null;
  payoutAccount: AccountIdentifier | null;
  mintPriceE8s: bigint;
  mintEnabled: boolean;
  collectionCreationPayoutAccount: AccountIdentifier | null;
  collectionCreationPriceE8s: bigint;
  collectionCreationEnabled: boolean;
  mainMintPayoutAccount: AccountIdentifier | null;
  mainMintPriceE8s: bigint;
  mainMintEnabled: boolean;
  collectionCanisterWasmUploaded: boolean;
  collectionCanisterCycles: bigint;
}

export interface ModerationCategorySettings {
  nudityOrSexual: boolean;
  graphicViolence: boolean;
  explicitLanguage: boolean;
  hateOrHarassment: boolean;
  hateSymbols: boolean;
  illegalOrDangerous: boolean;
  selfHarm: boolean;
  otherNsfw: boolean;
}

export interface PublicModerationConfig {
  enabled: boolean;
  apiKeyConfigured: boolean;
  model: string;
  categories: ModerationCategorySettings;
  userMessage: string;
}

export interface CollectionCreationQuote {
  collectionCanisterCycles: bigint;
  factoryReserveCycles: bigint;
  totalCyclesToConvert: bigint;
  cycleCostE8s: bigint;
  minimumCreationPriceE8s: bigint;
  collectionCreationPriceE8s: bigint;
  adminPayoutE8s: bigint;
  ledgerFeeE8s: bigint;
  cycleTransferFeeE8s: bigint;
  adminPayoutFeeE8s: bigint;
  totalUserDebitE8s: bigint;
  xdrPermyriadPerIcp: bigint;
  rateTimestampSeconds: bigint;
}

export interface CollectionCanisterStatus {
  collectionId: CollectionId;
  canisterId: Principal;
  appCanisterId: Principal;
  controllers: Array<Principal>;
  cycles: bigint;
  moduleInstalled: boolean;
  freezingThresholdSeconds: bigint;
  idleCyclesBurnedPerDay: bigint;
}

export interface CollectionCanisterControllers {
  collectionId: CollectionId;
  canisterId: Principal;
  appCanisterId: Principal;
  controllers: Array<Principal>;
}

export interface CollectionCycleTopUpQuote {
  cyclesToTopUp: bigint;
  cycleCostE8s: bigint;
  ledgerFeeE8s: bigint;
  totalUserDebitE8s: bigint;
  xdrPermyriadPerIcp: bigint;
  rateTimestampSeconds: bigint;
}

export interface MintReceipt {
  nft: WalletNFT;
  paymentBlock: bigint;
}

export interface CollectionCreationReceipt {
  collection: Collection;
  paymentBlock: bigint;
}

export interface CollectionCycleTopUpReceipt {
  collectionId: CollectionId;
  canisterId: Principal;
  cyclesRequested: bigint;
  cyclesMinted: bigint;
  cycleCostE8s: bigint;
  totalUserDebitE8s: bigint;
  paymentBlock: bigint;
  cycleBalance: bigint | null;
}

export interface AppCycleTopUpReceipt {
  canisterId: Principal;
  cyclesRequested: bigint;
  cyclesMinted: bigint;
  cycleCostE8s: bigint;
  totalUserDebitE8s: bigint;
  paymentBlock: bigint;
  cycleBalance: bigint | null;
}

export interface CollectionDividendInfo {
  collectionId: CollectionId;
  enabled: boolean;
  accountId: AccountIdentifier;
  balanceE8s: bigint;
  processedBalanceE8s: bigint;
  pendingE8s: bigint;
  nftCount: bigint;
}

export interface NFTDividend {
  nft: WalletNFT;
  collection: Collection;
  claimableE8s: bigint;
}

export interface DividendSyncReceipt {
  collectionId: CollectionId;
  depositedE8s: bigint;
  distributedE8s: bigint;
  shareE8s: bigint;
  remainderE8s: bigint;
  nftCount: bigint;
  balanceE8s: bigint;
}

export interface DividendClaimReceipt {
  nft: WalletNFT;
  collection: Collection;
  paidE8s: bigint;
  feeE8s: bigint;
  blockIndex: bigint;
}

export type TransferError =
  | {
      __kind__: "TxTooOld";
      TxTooOld: { allowed_window_nanos: bigint };
    }
  | {
      __kind__: "BadFee";
      BadFee: { expected_fee: Tokens };
    }
  | {
      __kind__: "TxDuplicate";
      TxDuplicate: { duplicate_of: bigint };
    }
  | {
      __kind__: "TxCreatedInFuture";
      TxCreatedInFuture: null;
    }
  | {
      __kind__: "InsufficientFunds";
      InsufficientFunds: { balance: Tokens };
    };

export type TransferResult =
  | {
      __kind__: "Ok";
      Ok: bigint;
    }
  | {
      __kind__: "Err";
      Err: TransferError;
    };

export class ExternalBlob {
  _blob?: Uint8Array<ArrayBuffer> | null;
  directURL: string;
  onProgress?: (percentage: number) => void = undefined;

  private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null) {
    if (blob) {
      this._blob = blob;
    }
    this.directURL = directURL;
  }

  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(url, null);
  }

  static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
    const url = URL.createObjectURL(
      new Blob([new Uint8Array(blob)], {
        type: "application/octet-stream",
      }),
    );
    return new ExternalBlob(url, blob);
  }

  async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
    if (this._blob) {
      return this._blob;
    }
    const response = await fetch(this.directURL);
    const blob = await response.blob();
    this._blob = new Uint8Array(await blob.arrayBuffer());
    return this._blob;
  }

  getDirectURL(): string {
    return this.directURL;
  }

  withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    this.onProgress = onProgress;
    return this;
  }
}

export interface CreateActorOptions {
  agent?: Agent;
  agentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
  processError?: (error: unknown) => never;
}

export interface backendInterface {
  getAgent(): Agent;
  addCollection(
    name: string,
    description: string,
    canisterId: Principal,
    standard: NFTStandard,
    imageUrl: string,
    symbol: string,
    browseInfo: CollectionBrowseInfo | null,
  ): Promise<Collection>;
  bootstrapAdmin(): Promise<void>;
  buyFixedListing(listingId: ListingId): Promise<void>;
  cancelListing(listingId: ListingId): Promise<void>;
  claimVaultDeposit(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  >;
  configureMarketplaceFeeRecipient(
    recipient: AccountIdentifier | null,
  ): Promise<MarketplaceFeeConfig>;
  configureMinting(
    name: string,
    description: string,
    symbol: string,
    imageUrl: string,
    collectionCreationPayoutAccount: AccountIdentifier | null,
    collectionCreationPriceE8s: bigint,
    collectionCreationEnabled: boolean,
    mainMintPayoutAccount: AccountIdentifier | null,
    mainMintPriceE8s: bigint,
    mainMintEnabled: boolean,
    mainMintDividendsEnabled: boolean,
    collectionCanisterCycles: bigint,
  ): Promise<Collection>;
  configureModeration(
    enabled: boolean,
    apiKey: string | null,
    clearApiKey: boolean,
    model: string,
    categories: ModerationCategorySettings,
    userMessage: string,
  ): Promise<PublicModerationConfig>;
  createAuctionListing(
    nftId: NFTId,
    startingBid: bigint,
    endTime: bigint,
  ): Promise<AuctionListing>;
  createUserCollection(
    name: string,
    description: string,
    symbol: string,
    imageUrl: string,
    dividendsEnabled: boolean,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationReceipt }
    | { __kind__: "err"; err: string }
  >;
  createFixedListing(nftId: NFTId, price: bigint): Promise<FixedListing>;
  quoteCollectionCreationCost(
    collectionCanisterCycles: bigint,
    collectionCreationPriceE8s: bigint,
  ): Promise<CollectionCreationQuote>;
  quoteCollectionCycleTopUp(
    cyclesToTopUp: bigint,
  ): Promise<CollectionCycleTopUpQuote>;
  quoteAppCanisterCycleTopUp(
    cyclesToTopUp: bigint,
  ): Promise<CollectionCycleTopUpQuote>;
  claimNFTDividend(
    nftId: NFTId,
  ): Promise<
    | { __kind__: "ok"; ok: DividendClaimReceipt }
    | { __kind__: "err"; err: string }
  >;
  getActiveListingDetails(): Promise<Array<ActiveListingDetail>>;
  getActiveListings(): Promise<Array<ActiveListing>>;
  getAdminPrincipal(): Promise<Principal | null>;
  getCollection(id: CollectionId): Promise<Collection | null>;
  getCollectionBrowseStats(
    collectionId: CollectionId,
  ): Promise<CollectionBrowseStats>;
  getCollectionCreator(collectionId: CollectionId): Promise<Principal | null>;
  getCollectionDividendAccountId(
    collectionId: CollectionId,
  ): Promise<AccountIdentifier>;
  getCollectionDividendBalances(
    collectionId: CollectionId,
  ): Promise<Array<[string, bigint]>>;
  refreshCollectionDividendBalances(
    collectionId: CollectionId,
  ): Promise<Array<[string, bigint]>>;
  getCollectionDividendInfo(
    collectionId: CollectionId,
  ): Promise<CollectionDividendInfo | null>;
  getMyCollectionCanisterStatuses(): Promise<Array<CollectionCanisterStatus>>;
  getCollectionCanisterControllers(
    collectionId: CollectionId,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  >;
  addCollectionCanisterController(
    collectionId: CollectionId,
    controller: Principal,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  >;
  removeCollectionCanisterController(
    collectionId: CollectionId,
    controller: Principal,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  >;
  getCollectionNFT(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<WalletNFT | null>;
  getCollectionNFTPage(
    collectionId: CollectionId,
    cursor: string | null,
    limit: bigint | null,
  ): Promise<CollectionNFTPage>;
  getCollectionNFTs(collectionId: CollectionId): Promise<Array<WalletNFT>>;
  getMarketplaceFeeConfig(): Promise<MarketplaceFeeConfig>;
  getMintConfig(): Promise<MintConfig>;
  getModerationConfig(): Promise<PublicModerationConfig>;
  getMyCreatedCollections(): Promise<Array<Collection>>;
  getMyDividendNFTs(): Promise<Array<NFTDividend>>;
  getMyPendingAuctionRefunds(): Promise<Array<AuctionEscrow>>;
  refreshMyDividendNFTs(): Promise<Array<NFTDividend>>;
  getNFTStats(user: Principal): Promise<NFTStats>;
  getUserAccountId(): Promise<AccountIdentifier>;
  getUserICPBalance(): Promise<bigint>;
  getUserNFTs(user: Principal): Promise<Array<WalletNFT>>;
  getVaultAccountId(): Promise<AccountIdentifier>;
  getVaultPrincipal(): Promise<Principal>;
  isAdmin(): Promise<boolean>;
  isNFTInUserWallet(
    collectionId: CollectionId,
    tokenId: string,
    user: UserId,
  ): Promise<boolean>;
  listCollections(): Promise<Array<Collection>>;
  mintCollectionNFT(
    collectionId: CollectionId,
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  >;
  mintUserNFT(
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: MintReceipt } | { __kind__: "err"; err: string }
  >;
  placeBid(listingId: ListingId, amount: bigint): Promise<AuctionListing>;
  prepareVaultDeposit(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  previewMyCollectionNFTs(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Array<WalletNFT> } | { __kind__: "err"; err: string }
  >;
  registerNFT(
    collectionId: CollectionId,
    tokenId: string,
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  >;
  removeCollection(id: CollectionId): Promise<boolean>;
  retryAuctionRefund(escrowId: bigint): Promise<boolean>;
  retryInstallCollectionCanister(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string }
  >;
  topUpCollectionCanisterCycles(
    collectionId: CollectionId,
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  >;
  topUpAppCanisterCycles(
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: AppCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  >;
  topUpCanisterCycles(
    targetCanister: Principal,
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: AppCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  >;
  upgradeCollectionCanister(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string }
  >;
  sendNFT(
    nftId: NFTId,
    recipient: Principal,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  setCollectionCanisterWasm(wasm: Uint8Array): Promise<void>;
  settleAuction(listingId: ListingId): Promise<void>;
  syncUserNFTs(): Promise<
    | { __kind__: "ok"; ok: { errors: Array<string>; newCount: bigint } }
    | { __kind__: "err"; err: string }
  >;
  syncCollectionDividends(
    collectionId: CollectionId,
  ): Promise<
    | { __kind__: "ok"; ok: DividendSyncReceipt }
    | { __kind__: "err"; err: string }
  >;
  transferICPOut(
    to: AccountIdentifier,
    amount: bigint,
  ): Promise<TransferResult>;
}

type RawNFTStandard =
  | { EXT: null }
  | { DIP721: null }
  | { ICRC7: null }
  | { Other: string };
type RawCollectionKind = { External: null } | { Minted: null };
type RawCollectionBrowseCoverage = { Full: null } | { Partial: null };
type RawWalletLocation =
  | { Minted: null }
  | { Registered: null }
  | { Vaulted: null };
type RawListingStatus =
  | { Sold: null }
  | { Active: null }
  | { Cancelled: null }
  | { Settled: null };
type RawActiveListing =
  | { Fixed: RawFixedListing }
  | { Auction: RawAuctionListing };
type RawActiveListingDetail = { listing: RawActiveListing; nft: RawWalletNFT };
type RawTransferError =
  | { TxTooOld: { allowed_window_nanos: bigint } }
  | { BadFee: { expected_fee: Tokens } }
  | { TxDuplicate: { duplicate_of: bigint } }
  | { TxCreatedInFuture: null }
  | { InsufficientFunds: { balance: Tokens } };
type RawTransferResult = { Ok: bigint } | { Err: RawTransferError };
type RawCollectionBrowseInfo = {
  totalSupply: [] | [bigint];
  tokenIndexOffset: [] | [bigint];
};
type RawCollectionDividendConfig = {
  enabled: boolean;
};
type RawCollectionBrowseStats = {
  collectionId: CollectionId;
  totalCount: bigint;
  visibleCount: bigint;
  coverage: RawCollectionBrowseCoverage;
  note: string;
};
type RawCollectionNFTPage = {
  nfts: Array<RawWalletNFT>;
  nextCursor: [] | [string];
  totalCount: bigint;
  coverage: RawCollectionBrowseCoverage;
  note: string;
};
type RawMintConfig = {
  collectionId: [] | [CollectionId];
  payoutAccount: [] | [AccountIdentifier];
  mintPriceE8s: bigint;
  mintEnabled: boolean;
  collectionCreationPayoutAccount: [] | [AccountIdentifier];
  collectionCreationPriceE8s: bigint;
  collectionCreationEnabled: boolean;
  mainMintPayoutAccount: [] | [AccountIdentifier];
  mainMintPriceE8s: bigint;
  mainMintEnabled: boolean;
  collectionCanisterWasmUploaded: boolean;
  collectionCanisterCycles: bigint;
};
type RawModerationCategorySettings = {
  nudityOrSexual: boolean;
  graphicViolence: boolean;
  explicitLanguage: boolean;
  hateOrHarassment: boolean;
  hateSymbols: boolean;
  illegalOrDangerous: boolean;
  selfHarm: boolean;
  otherNsfw: boolean;
};
type RawPublicModerationConfig = {
  enabled: boolean;
  apiKeyConfigured: boolean;
  model: string;
  categories: RawModerationCategorySettings;
  userMessage: string;
};
type RawCollectionCreationQuote = {
  collectionCanisterCycles: bigint;
  factoryReserveCycles: bigint;
  totalCyclesToConvert: bigint;
  cycleCostE8s: bigint;
  minimumCreationPriceE8s: bigint;
  collectionCreationPriceE8s: bigint;
  adminPayoutE8s: bigint;
  ledgerFeeE8s: bigint;
  cycleTransferFeeE8s: bigint;
  adminPayoutFeeE8s: bigint;
  totalUserDebitE8s: bigint;
  xdrPermyriadPerIcp: bigint;
  rateTimestampSeconds: bigint;
};
type RawCollectionCanisterStatus = {
  collectionId: CollectionId;
  canisterId: Principal;
  appCanisterId: Principal;
  controllers: Array<Principal>;
  cycles: bigint;
  moduleInstalled: boolean;
  freezingThresholdSeconds: bigint;
  idleCyclesBurnedPerDay: bigint;
};
type RawCollectionCanisterControllers = {
  collectionId: CollectionId;
  canisterId: Principal;
  appCanisterId: Principal;
  controllers: Array<Principal>;
};
type RawCollectionCycleTopUpQuote = {
  cyclesToTopUp: bigint;
  cycleCostE8s: bigint;
  ledgerFeeE8s: bigint;
  totalUserDebitE8s: bigint;
  xdrPermyriadPerIcp: bigint;
  rateTimestampSeconds: bigint;
};
type RawNFTMetadata = {
  name: [] | [string];
  description: [] | [string];
  imageUrl: [] | [string];
  attributes: Array<[string, string]>;
};
type RawWalletNFT = {
  id: NFTId;
  tokenId: string;
  collectionId: CollectionId;
  owner: UserId;
  metadata: RawNFTMetadata;
  location: RawWalletLocation;
  registeredAt: Timestamp;
};
type RawCollection = {
  id: CollectionId;
  name: string;
  description: string;
  imageUrl: string;
  standard: RawNFTStandard;
  symbol: string;
  canisterId: Principal;
  kind: RawCollectionKind;
  browseInfo: [] | [RawCollectionBrowseInfo];
  dividendConfig: [] | [RawCollectionDividendConfig];
};
type RawFixedListing = {
  id: ListingId;
  status: RawListingStatus;
  createdAt: Timestamp;
  seller: UserId;
  nftId: NFTId;
  price: bigint;
};
type RawAuctionListing = {
  id: ListingId;
  status: RawListingStatus;
  highestBidder: [] | [UserId];
  endTime: Timestamp;
  createdAt: Timestamp;
  seller: UserId;
  highestBid: bigint;
  nftId: NFTId;
  startingBid: bigint;
};
type RawAuctionEscrow = {
  amount: bigint;
  bidder: UserId;
  createdAt: Timestamp;
  depositedBlock: bigint;
  escrowId: bigint;
  feeReserve: bigint;
  ledgerFeeE8s: bigint;
  listingId: ListingId;
};
type RawMarketplaceFeeConfig = {
  auctionBidFeeReserveE8s: bigint;
  ledgerFeeE8s: bigint;
  mintlabFeeBasisPoints: bigint;
  mintlabFeeRecipient: [] | [AccountIdentifier];
};
type RawMintReceipt = {
  nft: RawWalletNFT;
  paymentBlock: bigint;
};
type RawCollectionCreationReceipt = {
  collection: RawCollection;
  paymentBlock: bigint;
};
type RawCollectionCycleTopUpReceipt = {
  collectionId: CollectionId;
  canisterId: Principal;
  cyclesRequested: bigint;
  cyclesMinted: bigint;
  cycleCostE8s: bigint;
  totalUserDebitE8s: bigint;
  paymentBlock: bigint;
  cycleBalance: [] | [bigint];
};
type RawAppCycleTopUpReceipt = {
  canisterId: Principal;
  cyclesRequested: bigint;
  cyclesMinted: bigint;
  cycleCostE8s: bigint;
  totalUserDebitE8s: bigint;
  paymentBlock: bigint;
  cycleBalance: [] | [bigint];
};
type RawCollectionDividendInfo = {
  collectionId: CollectionId;
  enabled: boolean;
  accountId: AccountIdentifier;
  balanceE8s: bigint;
  processedBalanceE8s: bigint;
  pendingE8s: bigint;
  nftCount: bigint;
};
type RawNFTDividend = {
  nft: RawWalletNFT;
  collection: RawCollection;
  claimableE8s: bigint;
};
type RawDividendSyncReceipt = {
  collectionId: CollectionId;
  depositedE8s: bigint;
  distributedE8s: bigint;
  shareE8s: bigint;
  remainderE8s: bigint;
  nftCount: bigint;
  balanceE8s: bigint;
};
type RawDividendClaimReceipt = {
  nft: RawWalletNFT;
  collection: RawCollection;
  paidE8s: bigint;
  feeE8s: bigint;
  blockIndex: bigint;
};

function fromRawOption<T>(value: [] | [T]): T | null {
  return value.length === 0 ? null : value[0];
}

function toRawOption<T>(value: T | null | undefined): [] | [T] {
  return value == null ? [] : [value];
}

function fromRawNFTStandard(value: RawNFTStandard): NFTStandard {
  if ("EXT" in value) return { __kind__: "EXT", EXT: null };
  if ("DIP721" in value) return { __kind__: "DIP721", DIP721: null };
  if ("ICRC7" in value) return { __kind__: "ICRC7", ICRC7: null };
  return { __kind__: "Other", Other: value.Other };
}

function toRawNFTStandard(value: NFTStandard): RawNFTStandard {
  if (value.__kind__ === "EXT") return { EXT: null };
  if (value.__kind__ === "DIP721") return { DIP721: null };
  if (value.__kind__ === "ICRC7") return { ICRC7: null };
  return { Other: value.Other };
}

function fromRawCollectionKind(value: RawCollectionKind): CollectionKind {
  if ("External" in value) return "External";
  return "Minted";
}

function fromRawCollectionBrowseCoverage(
  value: RawCollectionBrowseCoverage,
): CollectionBrowseCoverage {
  if ("Full" in value) return "Full";
  return "Partial";
}

function fromRawCollectionBrowseInfo(
  value: RawCollectionBrowseInfo,
): CollectionBrowseInfo {
  return {
    totalSupply: fromRawOption(value.totalSupply),
    tokenIndexOffset: fromRawOption(value.tokenIndexOffset),
  };
}

function toRawCollectionBrowseInfo(
  value: CollectionBrowseInfo,
): RawCollectionBrowseInfo {
  return {
    totalSupply: toRawOption(value.totalSupply),
    tokenIndexOffset: toRawOption(value.tokenIndexOffset),
  };
}

function fromRawCollectionDividendConfig(
  value: RawCollectionDividendConfig,
): CollectionDividendConfig {
  return {
    enabled: value.enabled,
  };
}

function fromRawWalletLocation(value: RawWalletLocation): WalletLocation {
  if ("Minted" in value) return "Minted";
  if ("Registered" in value) return "Registered";
  return "Vaulted";
}

function fromRawListingStatus(value: RawListingStatus): ListingStatus {
  if ("Sold" in value) return ListingStatus.Sold;
  if ("Cancelled" in value) return ListingStatus.Cancelled;
  if ("Settled" in value) return ListingStatus.Settled;
  return ListingStatus.Active;
}

function fromRawNFTMetadata(value: RawNFTMetadata): NFTMetadata {
  return {
    name: fromRawOption(value.name) ?? undefined,
    description: fromRawOption(value.description) ?? undefined,
    imageUrl: fromRawOption(value.imageUrl) ?? undefined,
    attributes: value.attributes,
  };
}

function toRawNFTMetadata(value: NFTMetadata): RawNFTMetadata {
  return {
    name: toRawOption(value.name),
    description: toRawOption(value.description),
    imageUrl: toRawOption(value.imageUrl),
    attributes: value.attributes,
  };
}

function fromRawWalletNFT(value: RawWalletNFT): WalletNFT {
  return {
    id: value.id,
    tokenId: value.tokenId,
    collectionId: value.collectionId,
    owner: value.owner,
    metadata: fromRawNFTMetadata(value.metadata),
    location: fromRawWalletLocation(value.location),
    registeredAt: value.registeredAt,
  };
}

function fromRawCollection(value: RawCollection): Collection {
  const browseInfo = fromRawOption(value.browseInfo);
  const dividendConfig = fromRawOption(value.dividendConfig);
  return {
    id: value.id,
    name: value.name,
    description: value.description,
    imageUrl: value.imageUrl,
    standard: fromRawNFTStandard(value.standard),
    symbol: value.symbol,
    canisterId: value.canisterId,
    kind: fromRawCollectionKind(value.kind),
    browseInfo:
      browseInfo == null ? undefined : fromRawCollectionBrowseInfo(browseInfo),
    dividendConfig:
      dividendConfig == null
        ? undefined
        : fromRawCollectionDividendConfig(dividendConfig),
  };
}

function fromRawCollectionBrowseStats(
  value: RawCollectionBrowseStats,
): CollectionBrowseStats {
  return {
    collectionId: value.collectionId,
    totalCount: value.totalCount,
    visibleCount: value.visibleCount,
    coverage: fromRawCollectionBrowseCoverage(value.coverage),
    note: value.note,
  };
}

function fromRawCollectionNFTPage(
  value: RawCollectionNFTPage,
): CollectionNFTPage {
  return {
    nfts: value.nfts.map(fromRawWalletNFT),
    nextCursor: fromRawOption(value.nextCursor) ?? undefined,
    totalCount: value.totalCount,
    coverage: fromRawCollectionBrowseCoverage(value.coverage),
    note: value.note,
  };
}

function fromRawFixedListing(value: RawFixedListing): FixedListing {
  return {
    id: value.id,
    status: fromRawListingStatus(value.status),
    createdAt: value.createdAt,
    seller: value.seller,
    nftId: value.nftId,
    price: value.price,
  };
}

function fromRawAuctionListing(value: RawAuctionListing): AuctionListing {
  return {
    id: value.id,
    status: fromRawListingStatus(value.status),
    highestBidder: fromRawOption(value.highestBidder) ?? undefined,
    endTime: value.endTime,
    createdAt: value.createdAt,
    seller: value.seller,
    highestBid: value.highestBid,
    nftId: value.nftId,
    startingBid: value.startingBid,
  };
}

function fromRawAuctionEscrow(value: RawAuctionEscrow): AuctionEscrow {
  return {
    amount: value.amount,
    bidder: value.bidder,
    createdAt: value.createdAt,
    depositedBlock: value.depositedBlock,
    escrowId: value.escrowId,
    feeReserve: value.feeReserve,
    ledgerFeeE8s: value.ledgerFeeE8s,
    listingId: value.listingId,
  };
}

function fromRawMarketplaceFeeConfig(
  value: RawMarketplaceFeeConfig,
): MarketplaceFeeConfig {
  return {
    auctionBidFeeReserveE8s: value.auctionBidFeeReserveE8s,
    ledgerFeeE8s: value.ledgerFeeE8s,
    mintlabFeeBasisPoints: value.mintlabFeeBasisPoints,
    mintlabFeeRecipient: fromRawOption(value.mintlabFeeRecipient),
  };
}

function fromRawActiveListing(value: RawActiveListing): ActiveListing {
  if ("Fixed" in value) {
    return { __kind__: "Fixed", Fixed: fromRawFixedListing(value.Fixed) };
  }
  return { __kind__: "Auction", Auction: fromRawAuctionListing(value.Auction) };
}

function fromRawActiveListingDetail(
  value: RawActiveListingDetail,
): ActiveListingDetail {
  return {
    listing: fromRawActiveListing(value.listing),
    nft: fromRawWalletNFT(value.nft),
  };
}

function fromRawMintConfig(value: RawMintConfig): MintConfig {
  return {
    collectionId: fromRawOption(value.collectionId),
    payoutAccount: fromRawOption(value.payoutAccount),
    mintPriceE8s: value.mintPriceE8s,
    mintEnabled: value.mintEnabled,
    collectionCreationPayoutAccount: fromRawOption(
      value.collectionCreationPayoutAccount,
    ),
    collectionCreationPriceE8s: value.collectionCreationPriceE8s,
    collectionCreationEnabled: value.collectionCreationEnabled,
    mainMintPayoutAccount: fromRawOption(value.mainMintPayoutAccount),
    mainMintPriceE8s: value.mainMintPriceE8s,
    mainMintEnabled: value.mainMintEnabled,
    collectionCanisterWasmUploaded: value.collectionCanisterWasmUploaded,
    collectionCanisterCycles: value.collectionCanisterCycles,
  };
}

function fromRawModerationCategories(
  value: RawModerationCategorySettings,
): ModerationCategorySettings {
  return {
    nudityOrSexual: value.nudityOrSexual,
    graphicViolence: value.graphicViolence,
    explicitLanguage: value.explicitLanguage,
    hateOrHarassment: value.hateOrHarassment,
    hateSymbols: value.hateSymbols,
    illegalOrDangerous: value.illegalOrDangerous,
    selfHarm: value.selfHarm,
    otherNsfw: value.otherNsfw,
  };
}

function toRawModerationCategories(
  value: ModerationCategorySettings,
): RawModerationCategorySettings {
  return {
    nudityOrSexual: value.nudityOrSexual,
    graphicViolence: value.graphicViolence,
    explicitLanguage: value.explicitLanguage,
    hateOrHarassment: value.hateOrHarassment,
    hateSymbols: value.hateSymbols,
    illegalOrDangerous: value.illegalOrDangerous,
    selfHarm: value.selfHarm,
    otherNsfw: value.otherNsfw,
  };
}

function fromRawPublicModerationConfig(
  value: RawPublicModerationConfig,
): PublicModerationConfig {
  return {
    enabled: value.enabled,
    apiKeyConfigured: value.apiKeyConfigured,
    model: value.model,
    categories: fromRawModerationCategories(value.categories),
    userMessage: value.userMessage,
  };
}

function fromRawCollectionCreationQuote(
  value: RawCollectionCreationQuote,
): CollectionCreationQuote {
  return {
    collectionCanisterCycles: value.collectionCanisterCycles,
    factoryReserveCycles: value.factoryReserveCycles,
    totalCyclesToConvert: value.totalCyclesToConvert,
    cycleCostE8s: value.cycleCostE8s,
    minimumCreationPriceE8s: value.minimumCreationPriceE8s,
    collectionCreationPriceE8s: value.collectionCreationPriceE8s,
    adminPayoutE8s: value.adminPayoutE8s,
    ledgerFeeE8s: value.ledgerFeeE8s,
    cycleTransferFeeE8s: value.cycleTransferFeeE8s,
    adminPayoutFeeE8s: value.adminPayoutFeeE8s,
    totalUserDebitE8s: value.totalUserDebitE8s,
    xdrPermyriadPerIcp: value.xdrPermyriadPerIcp,
    rateTimestampSeconds: value.rateTimestampSeconds,
  };
}

function fromRawCollectionCanisterStatus(
  value: RawCollectionCanisterStatus,
): CollectionCanisterStatus {
  return {
    collectionId: value.collectionId,
    canisterId: value.canisterId,
    appCanisterId: value.appCanisterId,
    controllers: value.controllers,
    cycles: value.cycles,
    moduleInstalled: value.moduleInstalled,
    freezingThresholdSeconds: value.freezingThresholdSeconds,
    idleCyclesBurnedPerDay: value.idleCyclesBurnedPerDay,
  };
}

function fromRawCollectionCanisterControllers(
  value: RawCollectionCanisterControllers,
): CollectionCanisterControllers {
  return {
    collectionId: value.collectionId,
    canisterId: value.canisterId,
    appCanisterId: value.appCanisterId,
    controllers: value.controllers,
  };
}

function fromRawCollectionCycleTopUpQuote(
  value: RawCollectionCycleTopUpQuote,
): CollectionCycleTopUpQuote {
  return {
    cyclesToTopUp: value.cyclesToTopUp,
    cycleCostE8s: value.cycleCostE8s,
    ledgerFeeE8s: value.ledgerFeeE8s,
    totalUserDebitE8s: value.totalUserDebitE8s,
    xdrPermyriadPerIcp: value.xdrPermyriadPerIcp,
    rateTimestampSeconds: value.rateTimestampSeconds,
  };
}

function fromRawMintReceipt(value: RawMintReceipt): MintReceipt {
  return {
    nft: fromRawWalletNFT(value.nft),
    paymentBlock: value.paymentBlock,
  };
}

function fromRawCollectionCreationReceipt(
  value: RawCollectionCreationReceipt,
): CollectionCreationReceipt {
  return {
    collection: fromRawCollection(value.collection),
    paymentBlock: value.paymentBlock,
  };
}

function fromRawCollectionCycleTopUpReceipt(
  value: RawCollectionCycleTopUpReceipt,
): CollectionCycleTopUpReceipt {
  return {
    collectionId: value.collectionId,
    canisterId: value.canisterId,
    cyclesRequested: value.cyclesRequested,
    cyclesMinted: value.cyclesMinted,
    cycleCostE8s: value.cycleCostE8s,
    totalUserDebitE8s: value.totalUserDebitE8s,
    paymentBlock: value.paymentBlock,
    cycleBalance: fromRawOption(value.cycleBalance),
  };
}

function fromRawAppCycleTopUpReceipt(
  value: RawAppCycleTopUpReceipt,
): AppCycleTopUpReceipt {
  return {
    canisterId: value.canisterId,
    cyclesRequested: value.cyclesRequested,
    cyclesMinted: value.cyclesMinted,
    cycleCostE8s: value.cycleCostE8s,
    totalUserDebitE8s: value.totalUserDebitE8s,
    paymentBlock: value.paymentBlock,
    cycleBalance: fromRawOption(value.cycleBalance),
  };
}

function fromRawCollectionDividendInfo(
  value: RawCollectionDividendInfo,
): CollectionDividendInfo {
  return {
    collectionId: value.collectionId,
    enabled: value.enabled,
    accountId: value.accountId,
    balanceE8s: value.balanceE8s,
    processedBalanceE8s: value.processedBalanceE8s,
    pendingE8s: value.pendingE8s,
    nftCount: value.nftCount,
  };
}

function fromRawNFTDividend(value: RawNFTDividend): NFTDividend {
  return {
    nft: fromRawWalletNFT(value.nft),
    collection: fromRawCollection(value.collection),
    claimableE8s: value.claimableE8s,
  };
}

function fromRawDividendSyncReceipt(
  value: RawDividendSyncReceipt,
): DividendSyncReceipt {
  return {
    collectionId: value.collectionId,
    depositedE8s: value.depositedE8s,
    distributedE8s: value.distributedE8s,
    shareE8s: value.shareE8s,
    remainderE8s: value.remainderE8s,
    nftCount: value.nftCount,
    balanceE8s: value.balanceE8s,
  };
}

function fromRawDividendClaimReceipt(
  value: RawDividendClaimReceipt,
): DividendClaimReceipt {
  return {
    nft: fromRawWalletNFT(value.nft),
    collection: fromRawCollection(value.collection),
    paidE8s: value.paidE8s,
    feeE8s: value.feeE8s,
    blockIndex: value.blockIndex,
  };
}

function fromRawTransferError(value: RawTransferError): TransferError {
  if ("TxTooOld" in value)
    return { __kind__: "TxTooOld", TxTooOld: value.TxTooOld };
  if ("BadFee" in value) return { __kind__: "BadFee", BadFee: value.BadFee };
  if ("TxDuplicate" in value)
    return { __kind__: "TxDuplicate", TxDuplicate: value.TxDuplicate };
  if ("TxCreatedInFuture" in value) {
    return { __kind__: "TxCreatedInFuture", TxCreatedInFuture: null };
  }
  return {
    __kind__: "InsufficientFunds",
    InsufficientFunds: value.InsufficientFunds,
  };
}

function fromRawTransferResult(value: RawTransferResult): TransferResult {
  if ("Ok" in value) return { __kind__: "Ok", Ok: value.Ok };
  return { __kind__: "Err", Err: fromRawTransferError(value.Err) };
}

function fromWalletResult(
  value: { ok: RawWalletNFT } | { err: string },
): { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawWalletNFT(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromTextResult(
  value: { ok: string } | { err: string },
): { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string } {
  if ("ok" in value) return { __kind__: "ok", ok: value.ok };
  return { __kind__: "err", err: value.err };
}

function fromMintResult(
  value: { ok: RawMintReceipt } | { err: string },
): { __kind__: "ok"; ok: MintReceipt } | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawMintReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionCreationResult(
  value: { ok: RawCollectionCreationReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: CollectionCreationReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawCollectionCreationReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionCycleTopUpResult(
  value: { ok: RawCollectionCycleTopUpReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: CollectionCycleTopUpReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawCollectionCycleTopUpReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromAppCycleTopUpResult(
  value: { ok: RawAppCycleTopUpReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: AppCycleTopUpReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawAppCycleTopUpReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionResult(
  value: { ok: RawCollection } | { err: string },
): { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawCollection(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionCanisterControllersResult(
  value: { ok: RawCollectionCanisterControllers } | { err: string },
):
  | { __kind__: "ok"; ok: CollectionCanisterControllers }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return {
      __kind__: "ok",
      ok: fromRawCollectionCanisterControllers(value.ok),
    };
  }
  return { __kind__: "err", err: value.err };
}

function fromDividendSyncResult(
  value: { ok: RawDividendSyncReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: DividendSyncReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawDividendSyncReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromDividendClaimResult(
  value: { ok: RawDividendClaimReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: DividendClaimReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawDividendClaimReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromPreviewResult(
  value: { ok: Array<RawWalletNFT> } | { err: string },
): { __kind__: "ok"; ok: Array<WalletNFT> } | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: value.ok.map(fromRawWalletNFT) };
  }
  return { __kind__: "err", err: value.err };
}

function fromSyncResult(
  value: { ok: { errors: Array<string>; newCount: bigint } } | { err: string },
):
  | { __kind__: "ok"; ok: { errors: Array<string>; newCount: bigint } }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: value.ok };
  }
  return { __kind__: "err", err: value.err };
}

export class Backend implements backendInterface {
  constructor(
    private readonly actor: ActorSubclass<any>,
    _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
    private readonly agent: Agent,
    private readonly processError?: (error: unknown) => never,
  ) {
    void _uploadFile;
    void _downloadFile;
  }

  getAgent(): Agent {
    return this.agent;
  }

  private async run<T>(operation: () => Promise<T>): Promise<T> {
    if (!this.processError) {
      return operation();
    }
    try {
      return await operation();
    } catch (error) {
      this.processError(error);
      throw new Error("unreachable");
    }
  }

  async addCollection(
    name: string,
    description: string,
    canisterId: Principal,
    standard: NFTStandard,
    imageUrl: string,
    symbol: string,
    browseInfo: CollectionBrowseInfo | null,
  ): Promise<Collection> {
    return fromRawCollection(
      await this.run(() =>
        this.actor.addCollection(
          name,
          description,
          canisterId,
          toRawNFTStandard(standard),
          imageUrl,
          symbol,
          toRawOption(
            browseInfo == null ? null : toRawCollectionBrowseInfo(browseInfo),
          ),
        ),
      ),
    );
  }

  async bootstrapAdmin(): Promise<void> {
    return this.run(() => this.actor.bootstrapAdmin());
  }

  async buyFixedListing(listingId: ListingId): Promise<void> {
    return this.run(() => this.actor.buyFixedListing(listingId));
  }

  async cancelListing(listingId: ListingId): Promise<void> {
    return this.run(() => this.actor.cancelListing(listingId));
  }

  async claimVaultDeposit(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  > {
    return fromWalletResult(
      await this.run(() => this.actor.claimVaultDeposit(collectionId, tokenId)),
    );
  }

  async configureMarketplaceFeeRecipient(
    recipient: AccountIdentifier | null,
  ): Promise<MarketplaceFeeConfig> {
    return fromRawMarketplaceFeeConfig(
      await this.run(() =>
        this.actor.configureMarketplaceFeeRecipient(toRawOption(recipient)),
      ),
    );
  }

  async configureMinting(
    name: string,
    description: string,
    symbol: string,
    imageUrl: string,
    collectionCreationPayoutAccount: AccountIdentifier | null,
    collectionCreationPriceE8s: bigint,
    collectionCreationEnabled: boolean,
    mainMintPayoutAccount: AccountIdentifier | null,
    mainMintPriceE8s: bigint,
    mainMintEnabled: boolean,
    mainMintDividendsEnabled: boolean,
    collectionCanisterCycles: bigint,
  ): Promise<Collection> {
    return fromRawCollection(
      await this.run(() =>
        this.actor.configureMinting(
          name,
          description,
          symbol,
          imageUrl,
          toRawOption(collectionCreationPayoutAccount),
          collectionCreationPriceE8s,
          collectionCreationEnabled,
          toRawOption(mainMintPayoutAccount),
          mainMintPriceE8s,
          mainMintEnabled,
          mainMintDividendsEnabled,
          collectionCanisterCycles,
        ),
      ),
    );
  }

  async configureModeration(
    enabled: boolean,
    apiKey: string | null,
    clearApiKey: boolean,
    model: string,
    categories: ModerationCategorySettings,
    userMessage: string,
  ): Promise<PublicModerationConfig> {
    return fromRawPublicModerationConfig(
      await this.run(() =>
        this.actor.configureModeration(
          enabled,
          toRawOption(apiKey),
          clearApiKey,
          model,
          toRawModerationCategories(categories),
          userMessage,
        ),
      ),
    );
  }

  async createAuctionListing(
    nftId: NFTId,
    startingBid: bigint,
    endTime: bigint,
  ): Promise<AuctionListing> {
    return fromRawAuctionListing(
      await this.run(() =>
        this.actor.createAuctionListing(nftId, startingBid, endTime),
      ),
    );
  }

  async createUserCollection(
    name: string,
    description: string,
    symbol: string,
    imageUrl: string,
    dividendsEnabled: boolean,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCreationResult(
      await this.run(() =>
        this.actor.createUserCollection(
          name,
          description,
          symbol,
          imageUrl,
          dividendsEnabled,
        ),
      ),
    );
  }

  async createFixedListing(nftId: NFTId, price: bigint): Promise<FixedListing> {
    return fromRawFixedListing(
      await this.run(() => this.actor.createFixedListing(nftId, price)),
    );
  }

  async quoteCollectionCreationCost(
    collectionCanisterCycles: bigint,
    collectionCreationPriceE8s: bigint,
  ): Promise<CollectionCreationQuote> {
    return fromRawCollectionCreationQuote(
      await this.run(() =>
        this.actor.quoteCollectionCreationCost(
          collectionCanisterCycles,
          collectionCreationPriceE8s,
        ),
      ),
    );
  }

  async quoteCollectionCycleTopUp(
    cyclesToTopUp: bigint,
  ): Promise<CollectionCycleTopUpQuote> {
    return fromRawCollectionCycleTopUpQuote(
      await this.run(() => this.actor.quoteCollectionCycleTopUp(cyclesToTopUp)),
    );
  }

  async quoteAppCanisterCycleTopUp(
    cyclesToTopUp: bigint,
  ): Promise<CollectionCycleTopUpQuote> {
    return fromRawCollectionCycleTopUpQuote(
      await this.run(() =>
        this.actor.quoteAppCanisterCycleTopUp(cyclesToTopUp),
      ),
    );
  }

  async claimNFTDividend(
    nftId: NFTId,
  ): Promise<
    | { __kind__: "ok"; ok: DividendClaimReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromDividendClaimResult(
      await this.run(() => this.actor.claimNFTDividend(nftId)),
    );
  }

  async getActiveListingDetails(): Promise<Array<ActiveListingDetail>> {
    const result = (await this.run(() =>
      this.actor.getActiveListingDetails(),
    )) as Array<RawActiveListingDetail>;
    return result.map(fromRawActiveListingDetail);
  }

  async getActiveListings(): Promise<Array<ActiveListing>> {
    const result = (await this.run(() =>
      this.actor.getActiveListings(),
    )) as Array<RawActiveListing>;
    return result.map(fromRawActiveListing);
  }

  async getAdminPrincipal(): Promise<Principal | null> {
    return fromRawOption(await this.run(() => this.actor.getAdminPrincipal()));
  }

  async getCollection(id: CollectionId): Promise<Collection | null> {
    const result = (await this.run(() => this.actor.getCollection(id))) as
      | []
      | [RawCollection];
    const value = fromRawOption(result);
    return value == null ? null : fromRawCollection(value);
  }

  async getCollectionBrowseStats(
    collectionId: CollectionId,
  ): Promise<CollectionBrowseStats> {
    return fromRawCollectionBrowseStats(
      await this.run(() => this.actor.getCollectionBrowseStats(collectionId)),
    );
  }

  async getCollectionCreator(
    collectionId: CollectionId,
  ): Promise<Principal | null> {
    return fromRawOption(
      await this.run(() => this.actor.getCollectionCreator(collectionId)),
    );
  }

  async getCollectionDividendAccountId(
    collectionId: CollectionId,
  ): Promise<AccountIdentifier> {
    return this.run(() =>
      this.actor.getCollectionDividendAccountId(collectionId),
    );
  }

  async getCollectionDividendBalances(
    collectionId: CollectionId,
  ): Promise<Array<[string, bigint]>> {
    return this.run(() =>
      this.actor.getCollectionDividendBalances(collectionId),
    );
  }

  async refreshCollectionDividendBalances(
    collectionId: CollectionId,
  ): Promise<Array<[string, bigint]>> {
    return this.run(() =>
      this.actor.refreshCollectionDividendBalances(collectionId),
    );
  }

  async getCollectionDividendInfo(
    collectionId: CollectionId,
  ): Promise<CollectionDividendInfo | null> {
    const result = (await this.run(() =>
      this.actor.getCollectionDividendInfo(collectionId),
    )) as [] | [RawCollectionDividendInfo];
    const value = fromRawOption(result);
    return value == null ? null : fromRawCollectionDividendInfo(value);
  }

  async getCollectionNFT(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<WalletNFT | null> {
    const result = (await this.run(() =>
      this.actor.getCollectionNFT(collectionId, tokenId),
    )) as [] | [RawWalletNFT];
    const value = fromRawOption(result);
    return value == null ? null : fromRawWalletNFT(value);
  }

  async getCollectionNFTPage(
    collectionId: CollectionId,
    cursor: string | null,
    limit: bigint | null,
  ): Promise<CollectionNFTPage> {
    return fromRawCollectionNFTPage(
      await this.run(() =>
        this.actor.getCollectionNFTPage(
          collectionId,
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async getCollectionNFTs(
    collectionId: CollectionId,
  ): Promise<Array<WalletNFT>> {
    const result = (await this.run(() =>
      this.actor.getCollectionNFTs(collectionId),
    )) as Array<RawWalletNFT>;
    return result.map(fromRawWalletNFT);
  }

  async getMarketplaceFeeConfig(): Promise<MarketplaceFeeConfig> {
    return fromRawMarketplaceFeeConfig(
      await this.run(() => this.actor.getMarketplaceFeeConfig()),
    );
  }

  async getMintConfig(): Promise<MintConfig> {
    return fromRawMintConfig(await this.run(() => this.actor.getMintConfig()));
  }

  async getModerationConfig(): Promise<PublicModerationConfig> {
    return fromRawPublicModerationConfig(
      await this.run(() => this.actor.getModerationConfig()),
    );
  }

  async getMyDividendNFTs(): Promise<Array<NFTDividend>> {
    const result = (await this.run(() =>
      this.actor.getMyDividendNFTs(),
    )) as Array<RawNFTDividend>;
    return result.map(fromRawNFTDividend);
  }

  async getMyPendingAuctionRefunds(): Promise<Array<AuctionEscrow>> {
    const result = (await this.run(() =>
      this.actor.getMyPendingAuctionRefunds(),
    )) as Array<RawAuctionEscrow>;
    return result.map(fromRawAuctionEscrow);
  }

  async refreshMyDividendNFTs(): Promise<Array<NFTDividend>> {
    const result = (await this.run(() =>
      this.actor.refreshMyDividendNFTs(),
    )) as Array<RawNFTDividend>;
    return result.map(fromRawNFTDividend);
  }

  async getMyCreatedCollections(): Promise<Array<Collection>> {
    const result = (await this.run(() =>
      this.actor.getMyCreatedCollections(),
    )) as Array<RawCollection>;
    return result.map(fromRawCollection);
  }

  async getMyCollectionCanisterStatuses(): Promise<
    Array<CollectionCanisterStatus>
  > {
    const result = (await this.run(() =>
      this.actor.getMyCollectionCanisterStatuses(),
    )) as Array<RawCollectionCanisterStatus>;
    return result.map(fromRawCollectionCanisterStatus);
  }

  async getCollectionCanisterControllers(
    collectionId: CollectionId,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCanisterControllersResult(
      await this.run(() =>
        this.actor.getCollectionCanisterControllers(collectionId),
      ),
    );
  }

  async addCollectionCanisterController(
    collectionId: CollectionId,
    controller: Principal,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCanisterControllersResult(
      await this.run(() =>
        this.actor.addCollectionCanisterController(collectionId, controller),
      ),
    );
  }

  async removeCollectionCanisterController(
    collectionId: CollectionId,
    controller: Principal,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCanisterControllersResult(
      await this.run(() =>
        this.actor.removeCollectionCanisterController(collectionId, controller),
      ),
    );
  }

  async getNFTStats(user: Principal): Promise<NFTStats> {
    return this.run(() => this.actor.getNFTStats(user));
  }

  async getUserAccountId(): Promise<AccountIdentifier> {
    return this.run(() => this.actor.getUserAccountId());
  }

  async getUserICPBalance(): Promise<bigint> {
    return this.run(() => this.actor.getUserICPBalance());
  }

  async getUserNFTs(user: Principal): Promise<Array<WalletNFT>> {
    const result = (await this.run(() =>
      this.actor.getUserNFTs(user),
    )) as Array<RawWalletNFT>;
    return result.map(fromRawWalletNFT);
  }

  async getVaultAccountId(): Promise<AccountIdentifier> {
    return this.run(() => this.actor.getVaultAccountId());
  }

  async getVaultPrincipal(): Promise<Principal> {
    return this.run(() => this.actor.getVaultPrincipal());
  }

  async isAdmin(): Promise<boolean> {
    return this.run(() => this.actor.isAdmin());
  }

  async isNFTInUserWallet(
    collectionId: CollectionId,
    tokenId: string,
    user: UserId,
  ): Promise<boolean> {
    return this.run(() =>
      this.actor.isNFTInUserWallet(collectionId, tokenId, user),
    );
  }

  async listCollections(): Promise<Array<Collection>> {
    const result = (await this.run(() =>
      this.actor.listCollections(),
    )) as Array<RawCollection>;
    return result.map(fromRawCollection);
  }

  async mintCollectionNFT(
    collectionId: CollectionId,
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  > {
    return fromWalletResult(
      await this.run(() =>
        this.actor.mintCollectionNFT(collectionId, toRawNFTMetadata(metadata)),
      ),
    );
  }

  async mintUserNFT(
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: MintReceipt } | { __kind__: "err"; err: string }
  > {
    return fromMintResult(
      await this.run(() => this.actor.mintUserNFT(toRawNFTMetadata(metadata))),
    );
  }

  async placeBid(
    listingId: ListingId,
    amount: bigint,
  ): Promise<AuctionListing> {
    return fromRawAuctionListing(
      await this.run(() => this.actor.placeBid(listingId, amount)),
    );
  }

  async prepareVaultDeposit(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<
    { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }
  > {
    return fromTextResult(
      await this.run(() =>
        this.actor.prepareVaultDeposit(collectionId, tokenId),
      ),
    );
  }

  async previewMyCollectionNFTs(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Array<WalletNFT> } | { __kind__: "err"; err: string }
  > {
    return fromPreviewResult(
      await this.run(() => this.actor.previewMyCollectionNFTs(collectionId)),
    );
  }

  async registerNFT(
    collectionId: CollectionId,
    tokenId: string,
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  > {
    return fromWalletResult(
      await this.run(() =>
        this.actor.registerNFT(
          collectionId,
          tokenId,
          toRawNFTMetadata(metadata),
        ),
      ),
    );
  }

  async removeCollection(id: CollectionId): Promise<boolean> {
    return this.run(() => this.actor.removeCollection(id));
  }

  async retryAuctionRefund(escrowId: bigint): Promise<boolean> {
    return this.run(() => this.actor.retryAuctionRefund(escrowId));
  }

  async retryInstallCollectionCanister(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string }
  > {
    return fromCollectionResult(
      await this.run(() =>
        this.actor.retryInstallCollectionCanister(collectionId),
      ),
    );
  }

  async topUpCollectionCanisterCycles(
    collectionId: CollectionId,
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCycleTopUpResult(
      await this.run(() =>
        this.actor.topUpCollectionCanisterCycles(collectionId, cyclesToTopUp),
      ),
    );
  }

  async topUpAppCanisterCycles(
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: AppCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromAppCycleTopUpResult(
      await this.run(() => this.actor.topUpAppCanisterCycles(cyclesToTopUp)),
    );
  }

  async topUpCanisterCycles(
    targetCanister: Principal,
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: AppCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromAppCycleTopUpResult(
      await this.run(() =>
        this.actor.topUpCanisterCycles(targetCanister, cyclesToTopUp),
      ),
    );
  }

  async upgradeCollectionCanister(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string }
  > {
    return fromCollectionResult(
      await this.run(() => this.actor.upgradeCollectionCanister(collectionId)),
    );
  }

  async sendNFT(
    nftId: NFTId,
    recipient: Principal,
  ): Promise<
    { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }
  > {
    return fromTextResult(
      await this.run(() => this.actor.sendNFT(nftId, recipient)),
    );
  }

  async setCollectionCanisterWasm(wasm: Uint8Array): Promise<void> {
    return this.run(() => this.actor.setCollectionCanisterWasm(wasm));
  }

  async settleAuction(listingId: ListingId): Promise<void> {
    return this.run(() => this.actor.settleAuction(listingId));
  }

  async syncUserNFTs(): Promise<
    | { __kind__: "ok"; ok: { errors: Array<string>; newCount: bigint } }
    | { __kind__: "err"; err: string }
  > {
    return fromSyncResult(await this.run(() => this.actor.syncUserNFTs()));
  }

  async syncCollectionDividends(
    collectionId: CollectionId,
  ): Promise<
    | { __kind__: "ok"; ok: DividendSyncReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromDividendSyncResult(
      await this.run(() => this.actor.syncCollectionDividends(collectionId)),
    );
  }

  async transferICPOut(
    to: AccountIdentifier,
    amount: bigint,
  ): Promise<TransferResult> {
    return fromRawTransferResult(
      await this.run(() => this.actor.transferICPOut(to, amount)),
    );
  }
}

export function createActor(
  canisterId: string,
  uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
  options: CreateActorOptions = {},
): Backend {
  void uploadFile;
  void downloadFile;
  const agent =
    options.agent ||
    HttpAgent.createSync({
      ...options.agentOptions,
    });
  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.",
    );
  }
  const actor = Actor.createActor<any>(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
  return new Backend(
    actor,
    uploadFile,
    downloadFile,
    agent,
    options.processError,
  );
}
