import CollectionTypes "collections";
import WalletTypes "wallet";

module {
  public type CollectionBrowseCoverage = { #Full; #Partial };

  public type CollectionBrowseStats = {
    collectionId : CollectionTypes.CollectionId;
    totalCount : Nat;
    visibleCount : Nat;
    coverage : CollectionBrowseCoverage;
    note : Text;
  };

  public type CollectionNFTPage = {
    nfts : [WalletTypes.WalletNFT];
    nextCursor : ?Text;
    totalCount : Nat;
    coverage : CollectionBrowseCoverage;
    note : Text;
  };
};
