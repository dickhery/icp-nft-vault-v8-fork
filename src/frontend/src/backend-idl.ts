/* eslint-disable */

// @ts-nocheck

import { IDL } from "@icp-sdk/core/candid";

export const idlFactory = ({ IDL }) => {
  const ICRC7Value = IDL.Rec();
  const TokenMetadataValue = IDL.Rec();
  const NFTStandard = IDL.Variant({
    'EXT' : IDL.Null,
    'ICRC7' : IDL.Null,
    'DIP721' : IDL.Null,
    'Other' : IDL.Text,
  });
  const CollectionBrowseInfo = IDL.Record({
    'tokenIndexOffset' : IDL.Opt(IDL.Nat),
    'totalSupply' : IDL.Opt(IDL.Nat),
  });
  const CollectionId = IDL.Nat;
  const CollectionKind = IDL.Variant({
    'Minted' : IDL.Null,
    'External' : IDL.Null,
  });
  const CollectionDividendConfig = IDL.Record({ 'enabled' : IDL.Bool });
  const Collection = IDL.Record({
    'id' : CollectionId,
    'browseInfo' : IDL.Opt(CollectionBrowseInfo),
    'kind' : CollectionKind,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'imageUrl' : IDL.Text,
    'standard' : NFTStandard,
    'symbol' : IDL.Text,
    'canisterId' : IDL.Principal,
    'dividendConfig' : IDL.Opt(CollectionDividendConfig),
  });
  const ListingId = IDL.Nat;
  const NFTId = IDL.Nat;
  const UserId = IDL.Principal;
  const NFTMetadata = IDL.Record({
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'imageUrl' : IDL.Opt(IDL.Text),
    'attributes' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const Timestamp = IDL.Int;
  const WalletLocation = IDL.Variant({
    'Vaulted' : IDL.Null,
    'Minted' : IDL.Null,
    'Registered' : IDL.Null,
  });
  const WalletNFT = IDL.Record({
    'id' : NFTId,
    'tokenId' : IDL.Text,
    'collectionId' : CollectionId,
    'owner' : UserId,
    'metadata' : NFTMetadata,
    'registeredAt' : Timestamp,
    'location' : WalletLocation,
  });
  const DividendClaimReceipt = IDL.Record({
    'nft' : WalletNFT,
    'collection' : Collection,
    'feeE8s' : IDL.Nat64,
    'blockIndex' : IDL.Nat64,
    'paidE8s' : IDL.Nat64,
  });
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const ListingStatus = IDL.Variant({
    'Sold' : IDL.Null,
    'Active' : IDL.Null,
    'Cancelled' : IDL.Null,
    'Settled' : IDL.Null,
  });
  const AuctionListing = IDL.Record({
    'id' : ListingId,
    'status' : ListingStatus,
    'highestBidder' : IDL.Opt(UserId),
    'endTime' : Timestamp,
    'createdAt' : Timestamp,
    'seller' : UserId,
    'highestBid' : IDL.Nat64,
    'nftId' : NFTId,
    'startingBid' : IDL.Nat64,
  });
  const FixedListing = IDL.Record({
    'id' : ListingId,
    'status' : ListingStatus,
    'createdAt' : Timestamp,
    'seller' : UserId,
    'nftId' : NFTId,
    'price' : IDL.Nat64,
  });
  const CollectionCreationReceipt = IDL.Record({
    'collection' : Collection,
    'paymentBlock' : IDL.Nat64,
  });
  const DIP721Error = IDL.Variant({
    'ZeroAddress' : IDL.Null,
    'InvalidTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'UnauthorizedOwner' : IDL.Null,
    'UnauthorizedOperator' : IDL.Null,
    'TokenNotFound' : IDL.Null,
    'OwnerNotFound' : IDL.Null,
    'OperatorNotFound' : IDL.Null,
    'SelfTransfer' : IDL.Null,
    'SelfApprove' : IDL.Null,
    'ExistedNFT' : IDL.Null,
    'Other' : IDL.Text,
  });
  const DIP721TokensResult = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Nat),
    'Err' : DIP721Error,
  });
  TokenMetadataValue.fill(
    IDL.Variant({
      'Nat64Content' : IDL.Nat64,
      'BoolContent' : IDL.Bool,
      'Nat8Content' : IDL.Nat8,
      'IntContent' : IDL.Int,
      'NatContent' : IDL.Nat,
      'BlobContent' : IDL.Vec(IDL.Nat8),
      'NestedContent' : IDL.Vec(IDL.Tuple(IDL.Text, TokenMetadataValue)),
      'Principal' : IDL.Principal,
      'PrincipalContent' : IDL.Principal,
      'TextContent' : IDL.Text,
    }),
  );
  const TokenMetadata = IDL.Record({
    'transferred_at' : IDL.Opt(IDL.Nat64),
    'transferred_by' : IDL.Opt(IDL.Principal),
    'owner' : IDL.Opt(IDL.Principal),
    'operator' : IDL.Opt(IDL.Principal),
    'approved_at' : IDL.Opt(IDL.Nat64),
    'approved_by' : IDL.Opt(IDL.Principal),
    'properties' : IDL.Vec(IDL.Tuple(IDL.Text, TokenMetadataValue)),
    'is_burned' : IDL.Bool,
    'token_identifier' : IDL.Nat,
    'burned_at' : IDL.Opt(IDL.Nat64),
    'burned_by' : IDL.Opt(IDL.Principal),
    'minted_at' : IDL.Nat64,
    'minted_by' : IDL.Principal,
  });
  const DIP721MetadataResult = IDL.Variant({
    'Ok' : TokenMetadata,
    'Err' : DIP721Error,
  });
  const ActiveListing = IDL.Variant({
    'Fixed' : FixedListing,
    'Auction' : AuctionListing,
  });
  const ActiveListingDetail = IDL.Record({
    'nft' : WalletNFT,
    'listing' : ActiveListing,
  });
  const MarketplaceFeeConfig = IDL.Record({
    'auctionBidFeeReserveE8s' : IDL.Nat64,
    'ledgerFeeE8s' : IDL.Nat64,
    'mintlabFeeBasisPoints' : IDL.Nat,
    'mintlabFeeRecipient' : IDL.Opt(AccountIdentifier),
  });
  const CollectionBrowseCoverage = IDL.Variant({
    'Full' : IDL.Null,
    'Partial' : IDL.Null,
  });
  const CollectionBrowseStats = IDL.Record({
    'collectionId' : CollectionId,
    'note' : IDL.Text,
    'totalCount' : IDL.Nat,
    'visibleCount' : IDL.Nat,
    'coverage' : CollectionBrowseCoverage,
  });
  const CollectionDividendInfo = IDL.Record({
    'accountId' : AccountIdentifier,
    'collectionId' : CollectionId,
    'nftCount' : IDL.Nat,
    'enabled' : IDL.Bool,
    'balanceE8s' : IDL.Nat64,
    'processedBalanceE8s' : IDL.Nat64,
    'pendingE8s' : IDL.Nat64,
  });
  const CollectionNFTPage = IDL.Record({
    'nfts' : IDL.Vec(WalletNFT),
    'note' : IDL.Text,
    'totalCount' : IDL.Nat,
    'coverage' : CollectionBrowseCoverage,
    'nextCursor' : IDL.Opt(IDL.Text),
  });
  const AuctionEscrow = IDL.Record({
    'amount' : IDL.Nat64,
    'bidder' : UserId,
    'createdAt' : Timestamp,
    'depositedBlock' : IDL.Nat64,
    'escrowId' : IDL.Nat,
    'feeReserve' : IDL.Nat64,
    'ledgerFeeE8s' : IDL.Nat64,
    'listingId' : ListingId,
  });
  const MintConfig = IDL.Record({
    'collectionCreationPriceE8s' : IDL.Nat64,
    'collectionCreationEnabled' : IDL.Bool,
    'collectionId' : IDL.Opt(CollectionId),
    'payoutAccount' : IDL.Opt(AccountIdentifier),
    'mainMintEnabled' : IDL.Bool,
    'mainMintPriceE8s' : IDL.Nat64,
    'mintEnabled' : IDL.Bool,
    'mintPriceE8s' : IDL.Nat64,
    'collectionCreationPayoutAccount' : IDL.Opt(AccountIdentifier),
    'collectionCanisterWasmUploaded' : IDL.Bool,
    'mainMintPayoutAccount' : IDL.Opt(AccountIdentifier),
    'collectionCanisterCycles' : IDL.Nat,
  });
  const ModerationCategorySettings = IDL.Record({
    'explicitLanguage' : IDL.Bool,
    'graphicViolence' : IDL.Bool,
    'hateOrHarassment' : IDL.Bool,
    'hateSymbols' : IDL.Bool,
    'illegalOrDangerous' : IDL.Bool,
    'nudityOrSexual' : IDL.Bool,
    'otherNsfw' : IDL.Bool,
    'selfHarm' : IDL.Bool,
  });
  const PublicModerationConfig = IDL.Record({
    'apiKeyConfigured' : IDL.Bool,
    'categories' : ModerationCategorySettings,
    'enabled' : IDL.Bool,
    'model' : IDL.Text,
    'userMessage' : IDL.Text,
  });
  const CollectionCanisterStatus = IDL.Record({
    'appCanisterId' : IDL.Principal,
    'collectionId' : CollectionId,
    'moduleInstalled' : IDL.Bool,
    'controllers' : IDL.Vec(IDL.Principal),
    'cycles' : IDL.Nat,
    'freezingThresholdSeconds' : IDL.Nat,
    'idleCyclesBurnedPerDay' : IDL.Nat,
    'canisterId' : IDL.Principal,
  });
  const CollectionCanisterControllers = IDL.Record({
    'appCanisterId' : IDL.Principal,
    'controllers' : IDL.Vec(IDL.Principal),
    'canisterId' : IDL.Principal,
    'collectionId' : CollectionId,
  });
  const CollectionCanisterControllersResult = IDL.Variant({
    'ok' : CollectionCanisterControllers,
    'err' : IDL.Text,
  });
  const NFTDividend = IDL.Record({
    'nft' : WalletNFT,
    'collection' : Collection,
    'claimableE8s' : IDL.Nat64,
  });
  const NFTStats = IDL.Record({
    'totalCount' : IDL.Nat,
    'perCollection' : IDL.Vec(IDL.Tuple(CollectionId, IDL.Nat)),
  });
  const SupportedStandard = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
  const ICRC7Subaccount = IDL.Vec(IDL.Nat8);
  const ICRC7Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(ICRC7Subaccount),
  });
  ICRC7Value.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : IDL.Vec(IDL.Tuple(IDL.Text, ICRC7Value)),
      'Nat' : IDL.Nat,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
      'Array' : IDL.Vec(ICRC7Value),
    })
  );
  const ICRC7TokenMetadata = IDL.Vec(IDL.Tuple(IDL.Text, ICRC7Value));
  const ICRC7TransferArg = IDL.Record({
    'to' : ICRC7Account,
    'token_id' : IDL.Nat,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
  });
  const ICRC7TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'NonExistingTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'InvalidRecipient' : IDL.Null,
    'GenericBatchError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TooOld' : IDL.Null,
  });
  const ICRC7TransferResult = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : ICRC7TransferError,
  });
  const MintReceipt = IDL.Record({
    'nft' : WalletNFT,
    'paymentBlock' : IDL.Nat64,
  });
  const CollectionCreationQuote = IDL.Record({
    'cycleCostE8s' : IDL.Nat64,
    'ledgerFeeE8s' : IDL.Nat64,
    'collectionCreationPriceE8s' : IDL.Nat64,
    'rateTimestampSeconds' : IDL.Nat64,
    'cycleTransferFeeE8s' : IDL.Nat64,
    'minimumCreationPriceE8s' : IDL.Nat64,
    'xdrPermyriadPerIcp' : IDL.Nat64,
    'factoryReserveCycles' : IDL.Nat,
    'totalCyclesToConvert' : IDL.Nat,
    'totalUserDebitE8s' : IDL.Nat64,
    'adminPayoutE8s' : IDL.Nat64,
    'adminPayoutFeeE8s' : IDL.Nat64,
    'collectionCanisterCycles' : IDL.Nat,
  });
  const CollectionCycleTopUpQuote = IDL.Record({
    'cycleCostE8s' : IDL.Nat64,
    'ledgerFeeE8s' : IDL.Nat64,
    'rateTimestampSeconds' : IDL.Nat64,
    'xdrPermyriadPerIcp' : IDL.Nat64,
    'totalUserDebitE8s' : IDL.Nat64,
    'cyclesToTopUp' : IDL.Nat,
  });
  const DividendSyncReceipt = IDL.Record({
    'collectionId' : CollectionId,
    'shareE8s' : IDL.Nat64,
    'nftCount' : IDL.Nat,
    'distributedE8s' : IDL.Nat64,
    'depositedE8s' : IDL.Nat64,
    'balanceE8s' : IDL.Nat64,
    'remainderE8s' : IDL.Nat64,
  });
  const CollectionCycleTopUpReceipt = IDL.Record({
    'cycleCostE8s' : IDL.Nat64,
    'collectionId' : CollectionId,
    'cycleBalance' : IDL.Opt(IDL.Nat),
    'cyclesRequested' : IDL.Nat,
    'paymentBlock' : IDL.Nat64,
    'totalUserDebitE8s' : IDL.Nat64,
    'cyclesMinted' : IDL.Nat,
    'canisterId' : IDL.Principal,
  });
  const AppCycleTopUpReceipt = IDL.Record({
    'cycleCostE8s' : IDL.Nat64,
    'cycleBalance' : IDL.Opt(IDL.Nat),
    'cyclesRequested' : IDL.Nat,
    'paymentBlock' : IDL.Nat64,
    'totalUserDebitE8s' : IDL.Nat64,
    'cyclesMinted' : IDL.Nat,
    'canisterId' : IDL.Principal,
  });
  const DIP721NatResult = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : DIP721Error });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const TransferError = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat64 }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const TransferResult = IDL.Variant({
    'Ok' : IDL.Nat64,
    'Err' : TransferError,
  });
  return IDL.Service({
    'addCollection' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Principal,
          NFTStandard,
          IDL.Text,
          IDL.Text,
          IDL.Opt(CollectionBrowseInfo),
        ],
        [Collection],
        [],
      ),
    'addCollectionCanisterController' : IDL.Func(
        [CollectionId, IDL.Principal],
        [CollectionCanisterControllersResult],
        [],
      ),
    'bootstrapAdmin' : IDL.Func([], [], []),
    'buyFixedListing' : IDL.Func([ListingId], [], []),
    'cancelListing' : IDL.Func([ListingId], [], []),
    'claimNFTDividend' : IDL.Func(
        [NFTId],
        [IDL.Variant({ 'ok' : DividendClaimReceipt, 'err' : IDL.Text })],
        [],
      ),
    'claimVaultDeposit' : IDL.Func(
        [CollectionId, IDL.Text],
        [IDL.Variant({ 'ok' : WalletNFT, 'err' : IDL.Text })],
        [],
      ),
    'configureMarketplaceFeeRecipient' : IDL.Func(
        [IDL.Opt(AccountIdentifier)],
        [MarketplaceFeeConfig],
        [],
      ),
    'configureMinting' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(AccountIdentifier),
          IDL.Nat64,
          IDL.Bool,
          IDL.Opt(AccountIdentifier),
          IDL.Nat64,
          IDL.Bool,
          IDL.Bool,
          IDL.Nat,
        ],
        [Collection],
        [],
      ),
    'configureModeration' : IDL.Func(
        [
          IDL.Bool,
          IDL.Opt(IDL.Text),
          IDL.Bool,
          IDL.Text,
          ModerationCategorySettings,
          IDL.Text,
        ],
        [PublicModerationConfig],
        [],
      ),
    'createAuctionListing' : IDL.Func(
        [NFTId, IDL.Nat64, IDL.Int],
        [AuctionListing],
        [],
      ),
    'createFixedListing' : IDL.Func([NFTId, IDL.Nat64], [FixedListing], []),
    'createUserCollection' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool],
        [IDL.Variant({ 'ok' : CollectionCreationReceipt, 'err' : IDL.Text })],
        [],
      ),
    'dip721_owner_token_identifiers' : IDL.Func(
        [IDL.Principal],
        [DIP721TokensResult],
        ['query'],
      ),
    'dip721_token_metadata' : IDL.Func(
        [IDL.Nat],
        [DIP721MetadataResult],
        ['query'],
      ),
    'getActiveListingDetails' : IDL.Func(
        [],
        [IDL.Vec(ActiveListingDetail)],
        ['query'],
      ),
    'getActiveListings' : IDL.Func([], [IDL.Vec(ActiveListing)], ['query']),
    'getAdminPrincipal' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getCollection' : IDL.Func(
        [CollectionId],
        [IDL.Opt(Collection)],
        ['query'],
      ),
    'getCollectionBrowseStats' : IDL.Func(
        [CollectionId],
        [CollectionBrowseStats],
        [],
      ),
    'getCollectionCanisterControllers' : IDL.Func(
        [CollectionId],
        [CollectionCanisterControllersResult],
        [],
      ),
    'getCollectionCreator' : IDL.Func(
        [CollectionId],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'getCollectionDividendAccountId' : IDL.Func(
        [CollectionId],
        [AccountIdentifier],
        ['query'],
      ),
    'getCollectionDividendBalances' : IDL.Func(
        [CollectionId],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64))],
        ['query'],
      ),
    'getCollectionDividendInfo' : IDL.Func(
        [CollectionId],
        [IDL.Opt(CollectionDividendInfo)],
        [],
      ),
    'getCollectionNFT' : IDL.Func(
        [CollectionId, IDL.Text],
        [IDL.Opt(WalletNFT)],
        ['query'],
      ),
    'getCollectionNFTPage' : IDL.Func(
        [CollectionId, IDL.Opt(IDL.Text), IDL.Opt(IDL.Nat)],
        [CollectionNFTPage],
        [],
      ),
    'getCollectionNFTs' : IDL.Func([CollectionId], [IDL.Vec(WalletNFT)], []),
    'getMarketplaceFeeConfig' : IDL.Func([], [MarketplaceFeeConfig], []),
    'getMintConfig' : IDL.Func([], [MintConfig], ['query']),
    'getModerationConfig' : IDL.Func(
        [],
        [PublicModerationConfig],
        ['query'],
      ),
    'getMyCollectionCanisterStatuses' : IDL.Func(
        [],
        [IDL.Vec(CollectionCanisterStatus)],
        [],
      ),
    'getMyCreatedCollections' : IDL.Func([], [IDL.Vec(Collection)], []),
    'getMyDividendNFTs' : IDL.Func([], [IDL.Vec(NFTDividend)], []),
    'getMyPendingAuctionRefunds' : IDL.Func(
        [],
        [IDL.Vec(AuctionEscrow)],
        [],
      ),
    'getNFTStats' : IDL.Func([IDL.Principal], [NFTStats], ['query']),
    'getUserAccountId' : IDL.Func([], [AccountIdentifier], ['query']),
    'getUserICPBalance' : IDL.Func([], [IDL.Nat64], []),
    'getUserNFTs' : IDL.Func([IDL.Principal], [IDL.Vec(WalletNFT)], ['query']),
    'getVaultAccountId' : IDL.Func([], [AccountIdentifier], ['query']),
    'getVaultPrincipal' : IDL.Func([], [IDL.Principal], ['query']),
    'icrc10_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(SupportedStandard)],
        ['query'],
      ),
    'icrc7_atomic_batch_transfers' : IDL.Func(
        [],
        [IDL.Opt(IDL.Bool)],
        ['query'],
      ),
    'icrc7_balance_of' : IDL.Func(
        [IDL.Vec(ICRC7Account)],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'icrc7_collection_metadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, ICRC7Value))],
        ['query'],
      ),
    'icrc7_default_take_value' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_description' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'icrc7_logo' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'icrc7_max_memo_size' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_max_query_batch_size' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_max_take_value' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_max_update_batch_size' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc7_owner_of' : IDL.Func(
        [IDL.Vec(IDL.Nat)],
        [IDL.Vec(IDL.Opt(ICRC7Account))],
        ['query'],
      ),
    'icrc7_permitted_drift' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_supply_cap' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc7_token_metadata' : IDL.Func(
        [IDL.Vec(IDL.Nat)],
        [IDL.Vec(IDL.Opt(ICRC7TokenMetadata))],
        ['query'],
      ),
    'icrc7_tokens' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'icrc7_tokens_of' : IDL.Func(
        [ICRC7Account, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'icrc7_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc7_transfer' : IDL.Func(
        [IDL.Vec(ICRC7TransferArg)],
        [IDL.Vec(IDL.Opt(ICRC7TransferResult))],
        [],
      ),
    'icrc7_tx_window' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'isAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isNFTInUserWallet' : IDL.Func(
        [CollectionId, IDL.Text, UserId],
        [IDL.Bool],
        ['query'],
      ),
    'listCollections' : IDL.Func([], [IDL.Vec(Collection)], ['query']),
    'mintCollectionNFT' : IDL.Func(
        [CollectionId, NFTMetadata],
        [IDL.Variant({ 'ok' : WalletNFT, 'err' : IDL.Text })],
        [],
      ),
    'mintUserNFT' : IDL.Func(
        [NFTMetadata],
        [IDL.Variant({ 'ok' : MintReceipt, 'err' : IDL.Text })],
        [],
      ),
    'placeBid' : IDL.Func([ListingId, IDL.Nat64], [AuctionListing], []),
    'prepareVaultDeposit' : IDL.Func(
        [CollectionId, IDL.Text],
        [IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text })],
        [],
      ),
    'previewMyCollectionNFTs' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : IDL.Vec(WalletNFT), 'err' : IDL.Text })],
        [],
      ),
    'quoteCollectionCreationCost' : IDL.Func(
        [IDL.Nat, IDL.Nat64],
        [CollectionCreationQuote],
        [],
      ),
    'quoteCollectionCycleTopUp' : IDL.Func(
        [IDL.Nat],
        [CollectionCycleTopUpQuote],
        [],
      ),
    'quoteAppCanisterCycleTopUp' : IDL.Func(
        [IDL.Nat],
        [CollectionCycleTopUpQuote],
        [],
      ),
    'refreshCollectionDividendBalances' : IDL.Func(
        [CollectionId],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64))],
        [],
      ),
    'refreshMyDividendNFTs' : IDL.Func([], [IDL.Vec(NFTDividend)], []),
    'registerNFT' : IDL.Func(
        [CollectionId, IDL.Text, NFTMetadata],
        [IDL.Variant({ 'ok' : WalletNFT, 'err' : IDL.Text })],
        [],
      ),
    'removeCollection' : IDL.Func([CollectionId], [IDL.Bool], []),
    'removeCollectionCanisterController' : IDL.Func(
        [CollectionId, IDL.Principal],
        [CollectionCanisterControllersResult],
        [],
      ),
    'retryAuctionRefund' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'retryInstallCollectionCanister' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : Collection, 'err' : IDL.Text })],
        [],
      ),
    'sendNFT' : IDL.Func(
        [NFTId, IDL.Principal],
        [IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text })],
        [],
      ),
    'setCollectionCanisterWasm' : IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    'settleAuction' : IDL.Func([ListingId], [], []),
    'syncCollectionDividends' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : DividendSyncReceipt, 'err' : IDL.Text })],
        [],
      ),
    'syncUserNFTs' : IDL.Func(
        [],
        [
          IDL.Variant({
            'ok' : IDL.Record({
              'errors' : IDL.Vec(IDL.Text),
              'newCount' : IDL.Nat,
            }),
            'err' : IDL.Text,
          }),
        ],
        [],
      ),
    'topUpCollectionCanisterCycles' : IDL.Func(
        [CollectionId, IDL.Nat],
        [IDL.Variant({ 'ok' : CollectionCycleTopUpReceipt, 'err' : IDL.Text })],
        [],
      ),
    'topUpAppCanisterCycles' : IDL.Func(
        [IDL.Nat],
        [IDL.Variant({ 'ok' : AppCycleTopUpReceipt, 'err' : IDL.Text })],
        [],
      ),
    'topUpCanisterCycles' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [IDL.Variant({ 'ok' : AppCycleTopUpReceipt, 'err' : IDL.Text })],
        [],
      ),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [DIP721NatResult], []),
    'transferFromDip721' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [DIP721NatResult],
        [],
      ),
    'transferICPOut' : IDL.Func(
        [AccountIdentifier, IDL.Nat64],
        [TransferResult],
        [],
      ),
    'upgradeCollectionCanister' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : Collection, 'err' : IDL.Text })],
        [],
      ),
  });
};
export const idlService = idlFactory({ IDL });
export const idlInitArgs = [];
export const init = ({ IDL }) => { return []; };
