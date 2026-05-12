// Re-export all backend types for use across the frontend
export type {
  Tokens,
  FixedListing,
  WalletNFT,
  NFTStandard,
  AuctionListing,
  AuctionEscrow,
  ActiveListing,
  ActiveListingDetail,
  MarketplaceFeeConfig,
  UserId,
  ListingId,
  Collection,
  CollectionDividendConfig,
  CollectionDividendInfo,
  CollectionBrowseCoverage,
  CollectionBrowseInfo,
  CollectionBrowseStats,
  TransferResult,
  AccountIdentifier,
  CollectionNFTPage,
  NFTStats,
  NFTMetadata,
  MintConfig,
  ModerationCategorySettings,
  PublicModerationConfig,
  CollectionCreationQuote,
  CollectionCanisterStatus,
  CollectionCanisterControllers,
  CollectionCycleTopUpQuote,
  MintReceipt,
  CollectionCreationReceipt,
  CollectionCycleTopUpReceipt,
  AppCycleTopUpReceipt,
  DividendClaimReceipt,
  DividendSyncReceipt,
  NFTDividend,
  CollectionKind,
  WalletLocation,
  CollectionId,
  TransferError,
  NFTId,
  backendInterface,
} from "../backend-client";

export { ListingStatus } from "../backend-client";

export type { Principal } from "@icp-sdk/core/principal";

export interface NavItem {
  label: string;
  href: string;
}

export type ViewMode = "grid" | "list";
