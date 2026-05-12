import CollectionTypes "collections";
import CommonTypes "common";
import WalletTypes "wallet";

module {
  public type CollectionDividendInfo = {
    collectionId : CollectionTypes.CollectionId;
    enabled : Bool;
    accountId : CommonTypes.AccountIdentifier;
    balanceE8s : Nat64;
    processedBalanceE8s : Nat64;
    pendingE8s : Nat64;
    nftCount : Nat;
  };

  public type NFTDividend = {
    nft : WalletTypes.WalletNFT;
    collection : CollectionTypes.Collection;
    claimableE8s : Nat64;
  };

  public type DividendSyncReceipt = {
    collectionId : CollectionTypes.CollectionId;
    depositedE8s : Nat64;
    distributedE8s : Nat64;
    shareE8s : Nat64;
    remainderE8s : Nat64;
    nftCount : Nat;
    balanceE8s : Nat64;
  };

  public type DividendClaimReceipt = {
    nft : WalletTypes.WalletNFT;
    collection : CollectionTypes.Collection;
    paidE8s : Nat64;
    feeE8s : Nat64;
    blockIndex : Nat64;
  };
};
