import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Types "../types/collections";

module {
  public type CollectionsState = {
    collections : Map.Map<Types.CollectionId, Types.Collection>;
    var nextId : Nat;
  };

  public func newState() : CollectionsState {
    {
      collections = Map.empty<Types.CollectionId, Types.Collection>();
      var nextId = 1;
    };
  };

  public func addCollection(
    state : CollectionsState,
    name : Text,
    description : Text,
    canisterId : Principal,
    standard : Types.NFTStandard,
    imageUrl : Text,
    symbol : Text,
    kind : Types.CollectionKind,
    browseInfo : ?Types.CollectionBrowseInfo,
    dividendConfig : ?Types.CollectionDividendConfig,
  ) : Types.Collection {
    let id = state.nextId;
    state.nextId += 1;
    let collection : Types.Collection = {
      id;
      name;
      description;
      canisterId;
      standard;
      imageUrl;
      symbol;
      kind;
      browseInfo;
      dividendConfig;
    };
    Map.add(state.collections, Nat.compare, id, collection);
    collection;
  };

  public func getCollections(state : CollectionsState) : [Types.Collection] {
    Iter.toArray(Map.values(state.collections));
  };

  public func removeCollection(state : CollectionsState, id : Types.CollectionId) : Bool {
    switch (Map.get(state.collections, Nat.compare, id)) {
      case null false;
      case (?collection) {
        switch (collection.kind) {
          case (#Minted) false;
          case (#External) {
            Map.remove(state.collections, Nat.compare, id);
            true;
          };
        };
      };
    };
  };

  public func getCollection(state : CollectionsState, id : Types.CollectionId) : ?Types.Collection {
    Map.get(state.collections, Nat.compare, id);
  };

  public func findExternalCollectionByCanister(
    state : CollectionsState,
    canisterId : Principal,
    standard : Types.NFTStandard,
  ) : ?Types.Collection {
    for (collection in Map.values(state.collections)) {
      if (
        collection.kind == #External and
        Principal.equal(collection.canisterId, canisterId) and
        collection.standard == standard
      ) {
        return ?collection;
      };
    };
    null;
  };

  public func updateCollection(
    state : CollectionsState,
    id : Types.CollectionId,
    name : Text,
    description : Text,
    canisterId : Principal,
    standard : Types.NFTStandard,
    imageUrl : Text,
    symbol : Text,
    browseInfo : ?Types.CollectionBrowseInfo,
    dividendConfig : ?Types.CollectionDividendConfig,
  ) : ?Types.Collection {
    switch (Map.get(state.collections, Nat.compare, id)) {
      case null null;
      case (?existing) {
        let updated : Types.Collection = {
          id = existing.id;
          name;
          description;
          canisterId;
          standard;
          imageUrl;
          symbol;
          kind = existing.kind;
          browseInfo;
          dividendConfig;
        };
        Map.add(state.collections, Nat.compare, id, updated);
        ?updated;
      };
    };
  };
};
