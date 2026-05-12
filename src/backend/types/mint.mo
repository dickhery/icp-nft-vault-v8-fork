import CommonTypes "common";
import CollectionTypes "collections";
import WalletTypes "wallet";

module {
  public type AccountIdentifier = CommonTypes.AccountIdentifier;
  public type CollectionId = CollectionTypes.CollectionId;

  public type MintConfig = {
    collectionId : ?CollectionId;
    payoutAccount : ?AccountIdentifier;
    mintPriceE8s : Nat64;
    mintEnabled : Bool;
    collectionCreationPayoutAccount : ?AccountIdentifier;
    collectionCreationPriceE8s : Nat64;
    collectionCreationEnabled : Bool;
    mainMintPayoutAccount : ?AccountIdentifier;
    mainMintPriceE8s : Nat64;
    mainMintEnabled : Bool;
    collectionCanisterWasmUploaded : Bool;
    collectionCanisterCycles : Nat;
  };

  public type ModerationCategorySettings = {
    nudityOrSexual : Bool;
    graphicViolence : Bool;
    explicitLanguage : Bool;
    hateOrHarassment : Bool;
    hateSymbols : Bool;
    illegalOrDangerous : Bool;
    selfHarm : Bool;
    otherNsfw : Bool;
  };

  public type ModerationConfig = {
    enabled : Bool;
    apiKey : ?Text;
    model : Text;
    categories : ModerationCategorySettings;
    userMessage : Text;
  };

  public type PublicModerationConfig = {
    enabled : Bool;
    apiKeyConfigured : Bool;
    model : Text;
    categories : ModerationCategorySettings;
    userMessage : Text;
  };

  public type CollectionCreationQuote = {
    collectionCanisterCycles : Nat;
    factoryReserveCycles : Nat;
    totalCyclesToConvert : Nat;
    cycleCostE8s : Nat64;
    minimumCreationPriceE8s : Nat64;
    collectionCreationPriceE8s : Nat64;
    adminPayoutE8s : Nat64;
    ledgerFeeE8s : Nat64;
    cycleTransferFeeE8s : Nat64;
    adminPayoutFeeE8s : Nat64;
    totalUserDebitE8s : Nat64;
    xdrPermyriadPerIcp : Nat64;
    rateTimestampSeconds : Nat64;
  };

  public type CollectionCanisterStatus = {
    collectionId : CollectionId;
    canisterId : Principal;
    appCanisterId : Principal;
    controllers : [Principal];
    cycles : Nat;
    moduleInstalled : Bool;
    freezingThresholdSeconds : Nat;
    idleCyclesBurnedPerDay : Nat;
  };

  public type CollectionCanisterControllers = {
    collectionId : CollectionId;
    canisterId : Principal;
    appCanisterId : Principal;
    controllers : [Principal];
  };

  public type CollectionCycleTopUpQuote = {
    cyclesToTopUp : Nat;
    cycleCostE8s : Nat64;
    ledgerFeeE8s : Nat64;
    totalUserDebitE8s : Nat64;
    xdrPermyriadPerIcp : Nat64;
    rateTimestampSeconds : Nat64;
  };

  public type MintedToken = {
    tokenId : Nat;
    owner : Principal;
    metadata : WalletTypes.NFTMetadata;
    mintedAt : Nat64;
    mintedBy : Principal;
    transferredAt : ?Nat64;
    transferredBy : ?Principal;
  };

  public type MintTransfer = {
    token : MintedToken;
    transactionId : Nat;
  };

  public type MintReceipt = {
    nft : WalletTypes.WalletNFT;
    paymentBlock : Nat64;
  };

  public type CollectionCreationReceipt = {
    collection : CollectionTypes.Collection;
    paymentBlock : Nat64;
  };

  public type CollectionCycleTopUpReceipt = {
    collectionId : CollectionId;
    canisterId : Principal;
    cyclesRequested : Nat;
    cyclesMinted : Nat;
    cycleCostE8s : Nat64;
    totalUserDebitE8s : Nat64;
    paymentBlock : Nat64;
    cycleBalance : ?Nat;
  };

  public type AppCycleTopUpReceipt = {
    canisterId : Principal;
    cyclesRequested : Nat;
    cyclesMinted : Nat;
    cycleCostE8s : Nat64;
    totalUserDebitE8s : Nat64;
    paymentBlock : Nat64;
    cycleBalance : ?Nat;
  };
};
