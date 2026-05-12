import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat64 "mo:core/Nat64";
import Text "mo:core/Text";
import CollectionTypes "../types/collections";
import Types "../types/dividends";

module {
  public type DividendsState = {
    claimableE8s : Map.Map<Text, Nat64>;
    processedBalanceE8s : Map.Map<CollectionTypes.CollectionId, Nat64>;
    pendingClaims : Map.Map<Text, Bool>;
  };

  public func newState() : DividendsState {
    {
      claimableE8s = Map.empty<Text, Nat64>();
      processedBalanceE8s = Map.empty<CollectionTypes.CollectionId, Nat64>();
      pendingClaims = Map.empty<Text, Bool>();
    };
  };

  public func collectionEnabled(collection : CollectionTypes.Collection) : Bool {
    switch (collection.dividendConfig) {
      case (?config) config.enabled;
      case null false;
    };
  };

  public func nftKey(collectionId : CollectionTypes.CollectionId, tokenId : Text) : Text {
    Nat.toText(collectionId) # "#" # tokenId;
  };

  public func claimableFor(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : Nat64 {
    switch (Map.get(state.claimableE8s, Text.compare, nftKey(collectionId, tokenId))) {
      case (?amount) amount;
      case null 0;
    };
  };

  public func setClaimable(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    amount : Nat64,
  ) {
    Map.add(state.claimableE8s, Text.compare, nftKey(collectionId, tokenId), amount);
  };

  public func addClaimable(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    amount : Nat64,
  ) {
    let current = claimableFor(state, collectionId, tokenId);
    setClaimable(state, collectionId, tokenId, current + amount);
  };

  public func totalClaimableForCollection(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    tokenIds : [Text],
  ) : Nat64 {
    var total : Nat64 = 0;
    for (tokenId in tokenIds.values()) {
      total += claimableFor(state, collectionId, tokenId);
    };
    total;
  };

  public func processedBalance(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
  ) : Nat64 {
    switch (Map.get(state.processedBalanceE8s, Nat.compare, collectionId)) {
      case (?amount) amount;
      case null 0;
    };
  };

  public func increaseProcessedBalance(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    amount : Nat64,
  ) {
    Map.add(
      state.processedBalanceE8s,
      Nat.compare,
      collectionId,
      processedBalance(state, collectionId) + amount,
    );
  };

  public func reduceProcessedBalance(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    amount : Nat64,
  ) {
    let current = processedBalance(state, collectionId);
    Map.add(
      state.processedBalanceE8s,
      Nat.compare,
      collectionId,
      if (current > amount) current - amount else (0 : Nat64),
    );
  };

  public func distributeNewBalance(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    tokenIds : [Text],
    balanceE8s : Nat64,
  ) : Types.DividendSyncReceipt {
    let processed = processedBalance(state, collectionId);
    let deposited = if (balanceE8s > processed) balanceE8s - processed else (0 : Nat64);
    let nftCount = tokenIds.size();
    let nftCount64 = Nat64.fromNat(nftCount);
    let share = if (nftCount64 == 0) (0 : Nat64) else deposited / nftCount64;
    let distributed = share * nftCount64;
    let remainder = deposited - distributed;

    if (share > 0) {
      for (tokenId in tokenIds.values()) {
        addClaimable(state, collectionId, tokenId, share);
      };
      increaseProcessedBalance(state, collectionId, distributed);
    };

    {
      collectionId;
      depositedE8s = deposited;
      distributedE8s = distributed;
      shareE8s = share;
      remainderE8s = remainder;
      nftCount;
      balanceE8s;
    };
  };

  public func collectionBalances(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    tokenIds : [Text],
  ) : [(Text, Nat64)] {
    var balances : [(Text, Nat64)] = [];
    for (tokenId in tokenIds.values()) {
      balances := Array.concat<(Text, Nat64)>(
        balances,
        [(tokenId, claimableFor(state, collectionId, tokenId))],
      );
    };
    balances;
  };

  public func acquireClaim(state : DividendsState, key : Text) : Bool {
    switch (Map.get(state.pendingClaims, Text.compare, key)) {
      case (?_) false;
      case null {
        Map.add(state.pendingClaims, Text.compare, key, true);
        true;
      };
    };
  };

  public func releaseClaim(state : DividendsState, key : Text) {
    Map.remove(state.pendingClaims, Text.compare, key);
  };
};
