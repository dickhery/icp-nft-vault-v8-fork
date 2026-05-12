import CommonTypes "common";
import CollectionTypes "collections";

module {
  public type UserId = CommonTypes.UserId;
  public type CollectionId = CollectionTypes.CollectionId;
  public type AccountIdentifier = CommonTypes.AccountIdentifier;

  public type NFTId = Nat;
  public type WalletLocation = { #Registered; #Vaulted; #Minted };

  public type NFTMetadata = {
    name : ?Text;
    description : ?Text;
    imageUrl : ?Text;
    attributes : [(Text, Text)];
  };

  public type WalletNFT = {
    id : NFTId;
    owner : UserId;
    collectionId : CollectionId;
    tokenId : Text; // token identifier within the collection
    metadata : NFTMetadata;
    location : WalletLocation;
    registeredAt : CommonTypes.Timestamp;
  };

  public type NFTStats = {
    totalCount : Nat;
    perCollection : [(CollectionId, Nat)];
  };

  public type DepositPreparation = {
    user : UserId;
    collectionId : CollectionId;
    tokenId : Text;
    preparedAt : CommonTypes.Timestamp;
  };
};
