import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Principal "mo:core/Principal";
import WalletLib "../lib/wallet";
import IcpLib "../lib/icp";
import MarketplaceLib "../lib/marketplace";
import MintLib "../lib/mint";
import CollectionLib "../lib/collections";
import WalletTypes "../types/wallet";
import CollectionTypes "../types/collections";

mixin (
  walletState : WalletLib.WalletState,
  collectionsState : CollectionLib.CollectionsState,
  marketplaceState : MarketplaceLib.MarketplaceState,
  mintState : MintLib.MintState,
) {
  public func getCollectionNFTs(
    collectionId : CollectionTypes.CollectionId,
  ) : async [WalletTypes.WalletNFT] {
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null return [];
      case (?value) value;
    };

    var knownNFTs : [WalletTypes.WalletNFT] = [];
    for ((_, nft) in Map.entries(walletState.nfts)) {
      if (nft.collectionId == collectionId) {
        knownNFTs := Array.concat<WalletTypes.WalletNFT>(knownNFTs, [nft]);
      };
    };

    let escrowedNFTs = MarketplaceLib.getActiveEscrowedNFTsByCollection(
      marketplaceState,
      collectionId,
    );

    switch (collection.kind) {
      case (#Minted) {
        var minted : [WalletTypes.WalletNFT] = [];
        for (
          token in MintLib.tokensForCollection(
            mintState,
            collectionId,
            MintLib.getConfig(mintState).collectionId,
          ).values()
        ) {
          let tokenId = Nat.toText(token.tokenId);
          let nft = switch (WalletLib.findByCollectionToken(walletState, collectionId, tokenId)) {
            case (?existing) existing;
            case null {
              {
                id = token.tokenId;
                owner = token.owner;
                collectionId;
                tokenId;
                metadata = MintLib.publicMetadata(token.metadata);
                location = #Minted;
                registeredAt = 0;
              };
            };
          };
          minted := Array.concat<WalletTypes.WalletNFT>(minted, [nft]);
        };
        browseMergeDistinctNFTs(
          browseMergeDistinctNFTs(knownNFTs, escrowedNFTs),
          minted,
        );
      };
      case (#External) {
        switch (await* WalletLib.previewCollectionNFTs(collection)) {
          case (#ok(onChainNFTs)) {
            browseMergeDistinctNFTs(
              browseMergeDistinctNFTs(knownNFTs, escrowedNFTs),
              onChainNFTs,
            );
          };
          case (#err(_)) {
            browseMergeDistinctNFTs(knownNFTs, escrowedNFTs);
          };
        };
      };
    };
  };

  public query func getCollectionNFT(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : async ?WalletTypes.WalletNFT {
    switch (WalletLib.findByCollectionToken(walletState, collectionId, tokenId)) {
      case (?nft) ?nft;
      case null MarketplaceLib.findActiveEscrowedNFT(marketplaceState, collectionId, tokenId);
    };
  };

  public query func isNFTInUserWallet(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    user : WalletTypes.UserId,
  ) : async Bool {
    switch (WalletLib.findByCollectionToken(walletState, collectionId, tokenId)) {
      case null {
        switch (MarketplaceLib.findActiveEscrowedNFT(marketplaceState, collectionId, tokenId)) {
          case null false;
          case (?nft) Principal.equal(nft.owner, user);
        };
      };
      case (?nft) Principal.equal(nft.owner, user);
    };
  };

  public shared ({ caller }) func previewMyCollectionNFTs(
    collectionId : CollectionTypes.CollectionId,
  ) : async { #ok : [WalletTypes.WalletNFT]; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be signed in to preview collection ownership");
    };
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    switch (collection.kind) {
      case (#Minted) {
        var minted : [WalletTypes.WalletNFT] = [];
        for (
          token in MintLib.ownerTokensForCollection(
            mintState,
            caller,
            collectionId,
            MintLib.getConfig(mintState).collectionId,
          ).values()
        ) {
          let tokenId = Nat.toText(token.tokenId);
          let nft = switch (WalletLib.findByCollectionToken(walletState, collectionId, tokenId)) {
            case (?existing) existing;
            case null {
              {
                id = token.tokenId;
                owner = caller;
                collectionId;
                tokenId;
                metadata = MintLib.publicMetadata(token.metadata);
                location = #Minted;
                registeredAt = 0;
              };
            };
          };
          minted := Array.concat<WalletTypes.WalletNFT>(minted, [nft]);
        };
        #ok(
          browseMergeDistinctNFTs(
            minted,
            MarketplaceLib.getActiveEscrowedNFTsBySellerAndCollection(
              marketplaceState,
              caller,
              collectionId,
            ),
          )
        );
      };
      case (#External) {
        let accountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
        let preview = await* WalletLib.previewUserOwnedNFTs(collection, caller, accountId);
        switch (preview) {
          case (#err(message)) #err(message);
          case (#ok(nfts)) {
            #ok(
              browseMergeDistinctNFTs(
                nfts,
                MarketplaceLib.getActiveEscrowedNFTsBySellerAndCollection(
                  marketplaceState,
                  caller,
                  collectionId,
                ),
              )
            );
          };
        };
      };
    };
  };

  func browseMergeDistinctNFTs(
    primary : [WalletTypes.WalletNFT],
    secondary : [WalletTypes.WalletNFT],
  ) : [WalletTypes.WalletNFT] {
    var merged = primary;
    for (nft in secondary.values()) {
      if (not browseContainsCollectionToken(merged, nft.collectionId, nft.tokenId)) {
        merged := Array.concat<WalletTypes.WalletNFT>(merged, [nft]);
      };
    };
    merged;
  };

  func browseContainsCollectionToken(
    nfts : [WalletTypes.WalletNFT],
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : Bool {
    for (nft in nfts.values()) {
      if (nft.collectionId == collectionId and nft.tokenId == tokenId) {
        return true;
      };
    };
    false;
  };
};
