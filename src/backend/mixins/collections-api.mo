import CollectionsLib "../lib/collections";
import AuthLib "../lib/auth";
import CollectionTypes "../types/collections";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  collectionsState : CollectionsLib.CollectionsState,
  authState : AuthLib.AdminState,
) {

  /// Public: import a supported external NFT collection into the shared app directory
  public shared ({ caller }) func addCollection(
    name : Text,
    description : Text,
    canisterId : Principal,
    standard : CollectionTypes.NFTStandard,
    imageUrl : Text,
    symbol : Text,
    browseInfo : ?CollectionTypes.CollectionBrowseInfo,
  ) : async CollectionTypes.Collection {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (name == "") Runtime.trap("Collection name is required");
    if (symbol == "") Runtime.trap("Collection symbol is required");
    validateCollectionImage(imageUrl);
    validateBrowseInfo(browseInfo);
    switch (standard) {
      case (#Other(_)) Runtime.trap("Only EXT, DIP721, and ICRC-7 collections are supported");
      case (_) {};
    };
    switch (CollectionsLib.findExternalCollectionByCanister(collectionsState, canisterId, standard)) {
      case (?existing) {
        let mergedBrowseInfo = mergeBrowseInfo(existing.browseInfo, browseInfo);
        if (mergedBrowseInfo == existing.browseInfo) {
          existing;
        } else {
          switch (
            CollectionsLib.updateCollection(
              collectionsState,
              existing.id,
              existing.name,
              existing.description,
              existing.canisterId,
              existing.standard,
              existing.imageUrl,
              existing.symbol,
              mergedBrowseInfo,
              existing.dividendConfig,
            )
          ) {
            case (?updated) updated;
            case null existing;
          };
        };
      };
      case null {
        CollectionsLib.addCollection(
          collectionsState,
          name,
          description,
          canisterId,
          standard,
          imageUrl,
          symbol,
          #External,
          browseInfo,
          null,
        );
      };
    };
  };

  /// Return all registered collections
  public query func listCollections() : async [CollectionTypes.Collection] {
    CollectionsLib.getCollections(collectionsState);
  };

  /// Return a single collection by id
  public query func getCollection(id : CollectionTypes.CollectionId) : async ?CollectionTypes.Collection {
    CollectionsLib.getCollection(collectionsState, id);
  };

  /// Admin only: remove a collection by id
  public shared ({ caller }) func removeCollection(id : CollectionTypes.CollectionId) : async Bool {
    if (not AuthLib.isAdmin(authState, caller)) Runtime.trap("Unauthorized: admin only");
    CollectionsLib.removeCollection(collectionsState, id);
  };

  func validateBrowseInfo(browseInfo : ?CollectionTypes.CollectionBrowseInfo) {
    switch (browseInfo) {
      case null {};
      case (?info) {
        switch (info.totalSupply) {
          case null {};
          case (?totalSupply) {
            if (totalSupply == 0) {
              Runtime.trap("Collection supply must be greater than zero when provided");
            };
          };
        };
      };
    };
  };

  func validateCollectionImage(imageUrl : Text) {
    if (imageUrl == "") {
      Runtime.trap("Collection image is required");
    };
    if (imageUrl.size() > 1_500_000) {
      Runtime.trap("Collection image is too large for on-chain storage");
    };
  };

  func mergeBrowseInfo(
    existing : ?CollectionTypes.CollectionBrowseInfo,
    incoming : ?CollectionTypes.CollectionBrowseInfo,
  ) : ?CollectionTypes.CollectionBrowseInfo {
    switch (existing, incoming) {
      case (null, null) null;
      case (?value, null) ?value;
      case (null, ?value) ?value;
      case (?current, ?next) {
        ?{
          totalSupply = switch (current.totalSupply) {
            case (?value) ?value;
            case null next.totalSupply;
          };
          tokenIndexOffset = switch (current.tokenIndexOffset) {
            case (?value) ?value;
            case null next.tokenIndexOffset;
          };
        };
      };
    };
  };
};
