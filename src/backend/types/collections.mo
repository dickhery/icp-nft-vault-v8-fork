module {
  public type CollectionId = Nat;

  public type NFTStandard = { #EXT; #DIP721; #ICRC7; #Other : Text };
  public type CollectionKind = { #External; #Minted };
  public type CollectionDividendConfig = {
    enabled : Bool;
  };
  public type CollectionBrowseInfo = {
    totalSupply : ?Nat;
    tokenIndexOffset : ?Nat;
  };

  public type Collection = {
    id : CollectionId;
    name : Text;
    description : Text;
    canisterId : Principal;
    standard : NFTStandard;
    imageUrl : Text;
    symbol : Text;
    kind : CollectionKind;
    browseInfo : ?CollectionBrowseInfo;
    dividendConfig : ?CollectionDividendConfig;
  };
};
