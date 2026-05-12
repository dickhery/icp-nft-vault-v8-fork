import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Error "mo:core/Error";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import CollectionsLib "../lib/collections";
import DividendsLib "../lib/dividends";
import IcpLib "../lib/icp";
import MarketplaceLib "../lib/marketplace";
import MintLib "../lib/mint";
import NFTStandards "../lib/nft-standards";
import WalletLib "../lib/wallet";
import CollectionTypes "../types/collections";
import CommonTypes "../types/common";
import DividendTypes "../types/dividends";
import WalletTypes "../types/wallet";

mixin (
  dividendsState : DividendsLib.DividendsState,
  collectionsState : CollectionsLib.CollectionsState,
  walletState : WalletLib.WalletState,
  marketplaceState : MarketplaceLib.MarketplaceState,
  mintState : MintLib.MintState,
  canisterId : Principal,
) {
  type ChildCollectionOwnerActor = actor {
    icrc7_owner_of : ([Nat]) -> async [?NFTStandards.ICRC7Account];
  };

  type ChildMintlabNFT = {
    tokenId : Nat;
    metadata : WalletTypes.NFTMetadata;
  };

  type ChildCollectionDividendActor = actor {
    mintlab_token_ids : (?Nat, ?Nat) -> async [Nat];
    mintlab_nfts_of : (Principal, ?Nat, ?Nat) -> async [ChildMintlabNFT];
    mintlab_owner_of : ([Nat]) -> async [?NFTStandards.ICRC7Account];
  };

  transient let CHILD_TOKEN_PAGE_SIZE : Nat = 100;
  transient let CHILD_NFT_PAGE_SIZE : Nat = 1;
  transient let DIVIDEND_IMAGE_TEXT_LIMIT : Nat = 96_000;
  transient let DIVIDEND_NAME_TEXT_LIMIT : Nat = 256;
  transient let DIVIDEND_DESCRIPTION_TEXT_LIMIT : Nat = 2_000;
  transient let DIVIDEND_ATTRIBUTE_LIMIT : Nat = 20;
  transient let DIVIDEND_ATTRIBUTE_KEY_LIMIT : Nat = 128;
  transient let DIVIDEND_ATTRIBUTE_VALUE_LIMIT : Nat = 512;

  public shared func getCollectionDividendInfo(
    collectionId : CollectionTypes.CollectionId
  ) : async ?DividendTypes.CollectionDividendInfo {
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return null;
      case (?value) value;
    };
    let accountId = collectionDividendAccountId(collectionId);
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let balanceE8s = await* IcpLib.getBalance(ledger, accountId);
    let tokenIds = await* mintedTokenIds(collectionId);
    ?{
      collectionId;
      enabled = DividendsLib.collectionEnabled(collection);
      accountId;
      balanceE8s;
      processedBalanceE8s = DividendsLib.processedBalance(dividendsState, collectionId);
      pendingE8s = DividendsLib.totalClaimableForCollection(
        dividendsState,
        collectionId,
        tokenIds,
      );
      nftCount = tokenIds.size();
    };
  };

  public query func getCollectionDividendBalances(
    collectionId : CollectionTypes.CollectionId
  ) : async [(Text, Nat64)] {
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null [];
      case (?collection) {
        if (not DividendsLib.collectionEnabled(collection)) {
          [];
        } else {
          DividendsLib.collectionBalances(dividendsState, collectionId, cachedMintedTokenIds(collectionId));
        };
      };
    };
  };

  public shared func refreshCollectionDividendBalances(
    collectionId : CollectionTypes.CollectionId
  ) : async [(Text, Nat64)] {
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null [];
      case (?collection) {
        if (not DividendsLib.collectionEnabled(collection)) {
          [];
        } else {
          DividendsLib.collectionBalances(dividendsState, collectionId, await* mintedTokenIds(collectionId));
        };
      };
    };
  };

  public shared ({ caller }) func getMyDividendNFTs() : async [DividendTypes.NFTDividend] {
    await* refreshedDividendEntries(caller);
  };

  public shared ({ caller }) func refreshMyDividendNFTs() : async [DividendTypes.NFTDividend] {
    await* refreshedDividendEntries(caller);
  };

  func refreshedDividendEntries(caller : Principal) : async* [DividendTypes.NFTDividend] {
    if (Principal.isAnonymous(caller)) {
      return [];
    };
    let nfts = await* refreshedDividendNFTs(caller);
    dividendEntriesForNFTs(nfts);
  };

  func refreshedDividendNFTs(caller : Principal) : async* [WalletTypes.WalletNFT] {
    var nfts = userAndListedNFTs(caller);
    for (collection in CollectionsLib.getCollections(collectionsState).values()) {
      if (DividendsLib.collectionEnabled(collection)) {
        switch (collection.kind) {
          case (#Minted) {
            if (Principal.equal(collection.canisterId, canisterId)) {
              var owned : [WalletTypes.WalletNFT] = [];
              for (
                token in MintLib.ownerTokensForCollection(
                  mintState,
                  caller,
                  collection.id,
                  MintLib.getConfig(mintState).collectionId,
                ).values()
              ) {
                let tokenId = Nat.toText(token.tokenId);
                let registered = registerDividendNFT(
                  caller,
                  collection.id,
                  tokenId,
                  MintLib.publicMetadata(token.metadata),
                  #Minted,
                );
                owned := appendDistinctCollectionToken(
                  owned,
                  registered,
                );
              };
              nfts := replaceUnlistedCollectionNFTs(nfts, caller, collection.id, owned);
            } else {
              nfts := await* refreshMintlabChildDividendNFTs(caller, collection, nfts);
            };
          };
          case (#External) {
            nfts := await* refreshOnChainDividendNFTs(caller, collection, #Registered, nfts);
          };
        };
      };
    };
    nfts;
  };

  func refreshMintlabChildDividendNFTs(
    caller : Principal,
    collection : CollectionTypes.Collection,
    current : [WalletTypes.WalletNFT],
  ) : async* [WalletTypes.WalletNFT] {
    let child : ChildCollectionDividendActor = actor (collection.canisterId.toText());
    var prev : ?Nat = null;
    var owned : [WalletTypes.WalletNFT] = [];

    label paginate loop {
      let page = try {
        await child.mintlab_nfts_of(caller, prev, ?CHILD_NFT_PAGE_SIZE);
      } catch (_error) {
        switch (await* refreshOnChainDividendNFTsIfAny(caller, collection, #Minted, current)) {
          case (?fallback) return fallback;
          case null return current;
        };
      };
      if (page.size() == 0 and owned.size() == 0) {
        switch (await* refreshOnChainDividendNFTsIfAny(caller, collection, #Minted, current)) {
          case (?fallback) return fallback;
          case null return current;
        };
      } else if (page.size() == 0) {
        break paginate;
      };
      for (preview in page.values()) {
        let tokenId = Nat.toText(preview.tokenId);
        let registered = registerDividendNFT(
          caller,
          collection.id,
          tokenId,
          preview.metadata,
          #Minted,
        );
        owned := appendDistinctCollectionToken(
          owned,
          registered,
        );
      };
      if (page.size() < CHILD_NFT_PAGE_SIZE) {
        break paginate;
      };
      prev := ?page[page.size() - 1].tokenId;
    };

    if (owned.size() == 0) {
      return current;
    };
    replaceUnlistedCollectionNFTs(current, caller, collection.id, owned);
  };

  func refreshOnChainDividendNFTsIfAny(
    caller : Principal,
    collection : CollectionTypes.Collection,
    location : WalletTypes.WalletLocation,
    current : [WalletTypes.WalletNFT],
  ) : async* ?[WalletTypes.WalletNFT] {
    let accountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
    switch (await* WalletLib.previewUserOwnedNFTs(collection, caller, accountId)) {
      case (#err(_)) {
        await* refreshPublicICRC7DividendNFTsIfAny(caller, collection, location, current);
      };
      case (#ok(previews)) {
        if (previews.size() == 0) {
          return await* refreshPublicICRC7DividendNFTsIfAny(caller, collection, location, current);
        };
        var owned : [WalletTypes.WalletNFT] = [];
        for (preview in previews.values()) {
          let registered = registerDividendNFT(
            caller,
            collection.id,
            preview.tokenId,
            preview.metadata,
            location,
          );
          owned := appendDistinctCollectionToken(
            owned,
            registered,
          );
        };
        ?replaceUnlistedCollectionNFTs(current, caller, collection.id, owned);
      };
    };
  };

  func refreshOnChainDividendNFTs(
    caller : Principal,
    collection : CollectionTypes.Collection,
    location : WalletTypes.WalletLocation,
    current : [WalletTypes.WalletNFT],
  ) : async* [WalletTypes.WalletNFT] {
    let accountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
    switch (await* WalletLib.previewUserOwnedNFTs(collection, caller, accountId)) {
      case (#err(_)) {
        switch (await* refreshPublicICRC7DividendNFTsIfAny(caller, collection, location, current)) {
          case (?fallback) fallback;
          case null current;
        };
      };
      case (#ok(previews)) {
        if (previews.size() == 0) {
          return switch (await* refreshPublicICRC7DividendNFTsIfAny(caller, collection, location, current)) {
            case (?fallback) fallback;
            case null current;
          };
        };
        var owned : [WalletTypes.WalletNFT] = [];
        for (preview in previews.values()) {
          let registered = registerDividendNFT(
            caller,
            collection.id,
            preview.tokenId,
            preview.metadata,
            location,
          );
          owned := appendDistinctCollectionToken(
            owned,
            registered,
          );
        };
        replaceUnlistedCollectionNFTs(current, caller, collection.id, owned);
      };
    };
  };

  func refreshPublicICRC7DividendNFTsIfAny(
    caller : Principal,
    collection : CollectionTypes.Collection,
    location : WalletTypes.WalletLocation,
    current : [WalletTypes.WalletNFT],
  ) : async* ?[WalletTypes.WalletNFT] {
    if (collection.standard != #ICRC7) {
      return null;
    };

    let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
    let account : NFTStandards.ICRC7Account = {
      owner = caller;
      subaccount = null;
    };
    var prev : ?Nat = null;
    var owned : [WalletTypes.WalletNFT] = [];

    label paginate loop {
      let tokenIds = try {
        await canister.icrc7_tokens_of(account, prev, ?CHILD_TOKEN_PAGE_SIZE);
      } catch (_error) {
        return null;
      };
      if (tokenIds.size() == 0) {
        break paginate;
      };

      for (tokenId in tokenIds.values()) {
        let tokenText = Nat.toText(tokenId);
        let registered = registerDividendNFT(
          caller,
          collection.id,
          tokenText,
          fallbackDividendMetadata(collection, tokenText),
          location,
        );
        owned := appendDistinctCollectionToken(owned, registered);
      };

      if (tokenIds.size() < CHILD_TOKEN_PAGE_SIZE) {
        break paginate;
      };
      prev := ?tokenIds[tokenIds.size() - 1];
    };

    if (owned.size() == 0) {
      null;
    } else {
      ?replaceUnlistedCollectionNFTs(current, caller, collection.id, owned);
    };
  };

  func registerDividendNFT(
    owner : Principal,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    metadata : WalletTypes.NFTMetadata,
    location : WalletTypes.WalletLocation,
  ) : WalletTypes.WalletNFT {
    let registered = WalletLib.registerNFT(
      walletState,
      owner,
      collectionId,
      tokenId,
      compactNFTMetadata(metadata),
      location,
    );
    ignore MarketplaceLib.clearListingsForToken(marketplaceState, collectionId, tokenId);
    registered;
  };

  func dividendEntriesForNFTs(
    nfts : [WalletTypes.WalletNFT]
  ) : [DividendTypes.NFTDividend] {
    var dividends : [DividendTypes.NFTDividend] = [];
    for (nft in nfts.values()) {
      switch (CollectionsLib.getCollection(collectionsState, nft.collectionId)) {
        case null {};
        case (?collection) {
          if (DividendsLib.collectionEnabled(collection)) {
            dividends := Array.concat<DividendTypes.NFTDividend>(
              dividends,
              [
                {
                  nft = compactDividendNFT(nft);
                  collection = compactDividendCollection(collection);
                  claimableE8s = DividendsLib.claimableFor(
                    dividendsState,
                    nft.collectionId,
                    nft.tokenId,
                  );
                }
              ],
            );
          };
        };
      };
    };
    dividends;
  };

  public shared ({ caller }) func syncCollectionDividends(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : DividendTypes.DividendSyncReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to check collection dividends");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (not DividendsLib.collectionEnabled(collection)) {
      return #err("Dividends are not enabled for this collection");
    };
    if (collection.kind != #Minted) {
      return #err("Dividends are only available for Mintlab-created collections");
    };
    let tokenIds = await* mintedTokenIds(collectionId);
    if (tokenIds.size() == 0) {
      return #err("This collection has no minted NFTs to distribute to yet");
    };
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let balanceE8s = await* IcpLib.getBalance(ledger, collectionDividendAccountId(collectionId));
    #ok(DividendsLib.distributeNewBalance(dividendsState, collectionId, tokenIds, balanceE8s));
  };

  public shared ({ caller }) func claimNFTDividend(
    nftId : WalletTypes.NFTId
  ) : async { #ok : DividendTypes.DividendClaimReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to collect dividends");
    };
    let nft = switch (findDividendNFTCandidate(caller, nftId)) {
      case null return #err("NFT not found in the dividend index");
      case (?value) value;
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, nft.collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (not DividendsLib.collectionEnabled(collection)) {
      return #err("Dividends are not enabled for this collection");
    };
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let feeE8s = await* IcpLib.getTransferFee(ledger);
    let verifiedNft = switch (await* verifyDividendClaimOwner(caller, collection, nft)) {
      case (#ok(value)) value;
      case (#err(message)) return #err(message);
    };
    let claimable = DividendsLib.claimableFor(dividendsState, nft.collectionId, nft.tokenId);
    if (claimable == 0) {
      return #err("No dividends are available for this NFT yet");
    };
    if (claimable <= feeE8s) {
      return #err(
        "Dividend balance must exceed the ICP transfer fee of " #
        Nat64.toText(feeE8s) #
        " e8s before it can be collected"
      );
    };

    let key = DividendsLib.nftKey(nft.collectionId, nft.tokenId);
    if (not DividendsLib.acquireClaim(dividendsState, key)) {
      return #err("A dividend claim is already processing for this NFT");
    };

    DividendsLib.setClaimable(dividendsState, nft.collectionId, nft.tokenId, 0);
    try {
      let userAccount = IcpLib.accountIdentifier(canisterId, IcpLib.principalToSubaccount(caller));
      let result = await* IcpLib.transferOutWithFee(
        ledger,
        ?IcpLib.collectionDividendSubaccount(nft.collectionId),
        userAccount,
        claimable - feeE8s,
        Nat64.fromNat(nft.id),
        feeE8s,
      );
      switch (result) {
        case (#Ok(blockIndex)) {
          DividendsLib.reduceProcessedBalance(dividendsState, nft.collectionId, claimable);
          DividendsLib.releaseClaim(dividendsState, key);
          #ok({
            nft = compactDividendNFT(verifiedNft);
            collection = compactDividendCollection(collection);
            paidE8s = claimable - feeE8s;
            feeE8s;
            blockIndex;
          });
        };
        case (#Err(error)) {
          ignore error;
          DividendsLib.addClaimable(dividendsState, nft.collectionId, nft.tokenId, claimable);
          DividendsLib.releaseClaim(dividendsState, key);
          #err("ICP dividend transfer failed");
        };
      };
    } catch (e) {
      DividendsLib.addClaimable(dividendsState, nft.collectionId, nft.tokenId, claimable);
      DividendsLib.releaseClaim(dividendsState, key);
      #err("ICP dividend transfer failed: " # Error.message(e));
    };
  };

  func verifyDividendClaimOwner(
    caller : Principal,
    collection : CollectionTypes.Collection,
    nft : WalletTypes.WalletNFT,
  ) : async* { #ok : WalletTypes.WalletNFT; #err : Text } {
    if (collection.kind != #Minted or nft.location != #Minted) {
      if (Principal.equal(nft.owner, caller) or isActiveListingSeller(caller, nft.id)) {
        return #ok(nft);
      };
      return #err("You are not the current owner of this NFT");
    };

    let tokenNat = switch (Nat.fromText(nft.tokenId)) {
      case null return #err("Minted dividend token IDs must be numeric");
      case (?value) value;
    };

    if (Principal.equal(collection.canisterId, canisterId)) {
      switch (MintLib.getToken(mintState, tokenNat)) {
        case null return #err("Minted token not found");
        case (?token) {
          if (Principal.equal(token.owner, caller)) {
            return #ok(repairDividendNFTOwner(caller, nft));
          };
          if (Principal.equal(token.owner, canisterId) and isActiveListingSeller(caller, nft.id)) {
            return #ok(nft);
          };
          return #err("You are not the current owner of this NFT");
        };
      };
    };

    let owners = try {
      let child : ChildCollectionDividendActor = actor (collection.canisterId.toText());
      await child.mintlab_owner_of([tokenNat]);
    } catch (error) {
      let child : ChildCollectionOwnerActor = actor (collection.canisterId.toText());
      try {
        await child.icrc7_owner_of([tokenNat]);
      } catch (_fallbackError) {
        return #err("Could not verify current NFT ownership: " # Error.message(error));
      };
    };
    if (owners.size() == 0) {
      return #err("Collection canister returned no owner for this NFT");
    };
    switch (owners[0]) {
      case null #err("NFT not found in the collection canister");
      case (?account) {
        if (not isDividendDefaultSubaccount(account.subaccount)) {
          return #err("Dividend claims are only supported for NFTs held in the owner's default account");
        };
        if (Principal.equal(account.owner, caller)) {
          #ok(repairDividendNFTOwner(caller, nft));
        } else if (Principal.equal(account.owner, canisterId) and isActiveListingSeller(caller, nft.id)) {
          #ok(nft);
        } else {
          #err("You are not the current owner of this NFT");
        };
      };
    };
  };

  func repairDividendNFTOwner(
    caller : Principal,
    nft : WalletTypes.WalletNFT,
  ) : WalletTypes.WalletNFT {
    if (Principal.equal(nft.owner, caller)) {
      ignore MarketplaceLib.clearListingsForToken(marketplaceState, nft.collectionId, nft.tokenId);
      {
        nft with
        metadata = compactNFTMetadata(nft.metadata);
      };
    } else {
      let registered = registerDividendNFT(
        caller,
        nft.collectionId,
        nft.tokenId,
        nft.metadata,
        nft.location,
      );
      registered;
    };
  };

  func fallbackDividendMetadata(
    collection : CollectionTypes.Collection,
    tokenId : Text,
  ) : WalletTypes.NFTMetadata {
    {
      name = compactOptionalText(?(collection.name # " #" # tokenId), DIVIDEND_NAME_TEXT_LIMIT);
      description = compactOptionalText(nonEmptyText(collection.description), DIVIDEND_DESCRIPTION_TEXT_LIMIT);
      imageUrl = compactOptionalImageUrl(nonEmptyText(collection.imageUrl));
      attributes = [];
    };
  };

  func compactDividendNFT(nft : WalletTypes.WalletNFT) : WalletTypes.WalletNFT {
    {
      nft with
      metadata = compactNFTMetadata(nft.metadata);
    };
  };

  func compactDividendCollection(
    collection : CollectionTypes.Collection
  ) : CollectionTypes.Collection {
    {
      collection with
      description = if (collection.description.size() <= DIVIDEND_DESCRIPTION_TEXT_LIMIT) {
        collection.description
      } else {
        ""
      };
      imageUrl = switch (compactOptionalImageUrl(nonEmptyText(collection.imageUrl))) {
        case (?value) value;
        case null "";
      };
    };
  };

  func compactNFTMetadata(metadata : WalletTypes.NFTMetadata) : WalletTypes.NFTMetadata {
    var attributes : [(Text, Text)] = [];
    label copyAttributes for ((key, value) in metadata.attributes.values()) {
      if (attributes.size() >= DIVIDEND_ATTRIBUTE_LIMIT) {
        break copyAttributes;
      };
      if (
        key.size() <= DIVIDEND_ATTRIBUTE_KEY_LIMIT and
        value.size() <= DIVIDEND_ATTRIBUTE_VALUE_LIMIT
      ) {
        attributes := Array.concat<(Text, Text)>(attributes, [(key, value)]);
      };
    };

    {
      name = compactOptionalText(metadata.name, DIVIDEND_NAME_TEXT_LIMIT);
      description = compactOptionalText(metadata.description, DIVIDEND_DESCRIPTION_TEXT_LIMIT);
      imageUrl = compactOptionalImageUrl(metadata.imageUrl);
      attributes;
    };
  };

  func compactOptionalImageUrl(imageUrl : ?Text) : ?Text {
    switch (imageUrl) {
      case (?value) {
        if (value != "" and value.size() <= DIVIDEND_IMAGE_TEXT_LIMIT) {
          ?value
        } else {
          null
        };
      };
      case null null;
    };
  };

  func compactOptionalText(value : ?Text, limit : Nat) : ?Text {
    switch (value) {
      case (?text) {
        if (text != "" and text.size() <= limit) {
          ?text
        } else {
          null
        };
      };
      case null null;
    };
  };

  func nonEmptyText(value : Text) : ?Text {
    if (value == "") {
      null
    } else {
      ?value
    };
  };

  func isActiveListingSeller(caller : Principal, nftId : WalletTypes.NFTId) : Bool {
    for (listed in MarketplaceLib.getActiveEscrowedNFTsBySeller(marketplaceState, caller).values()) {
      if (listed.id == nftId) {
        return true;
      };
    };
    false;
  };

  func isDividendDefaultSubaccount(subaccount : ?Blob) : Bool {
    switch (subaccount) {
      case null true;
      case (?bytes) {
        for (byte in Blob.toArray(bytes).values()) {
          if (byte != 0) {
            return false;
          };
        };
        true;
      };
    };
  };

  public query func getCollectionDividendAccountId(
    collectionId : CollectionTypes.CollectionId
  ) : async CommonTypes.AccountIdentifier {
    collectionDividendAccountId(collectionId);
  };

  func collectionDividendAccountId(
    collectionId : CollectionTypes.CollectionId
  ) : CommonTypes.AccountIdentifier {
    IcpLib.accountIdentifier(canisterId, IcpLib.collectionDividendSubaccount(collectionId));
  };

  func cachedMintedTokenIds(collectionId : CollectionTypes.CollectionId) : [Text] {
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case (?collection) {
        if (collection.kind == #Minted and not Principal.equal(collection.canisterId, canisterId)) {
          return indexedMintedTokenIds(collection.id);
        };
      };
      case null {};
    };
    localMintedTokenIds(collectionId);
  };

  func mintedTokenIds(collectionId : CollectionTypes.CollectionId) : async* [Text] {
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case (?collection) {
        if (collection.kind == #Minted and not Principal.equal(collection.canisterId, canisterId)) {
          return await* childMintedTokenIds(collection);
        };
      };
      case null {};
    };
    localMintedTokenIds(collectionId);
  };

  func localMintedTokenIds(collectionId : CollectionTypes.CollectionId) : [Text] {
    var tokenIds : [Text] = [];
    for (
      token in MintLib.tokensForCollection(
        mintState,
        collectionId,
        MintLib.getConfig(mintState).collectionId,
      ).values()
    ) {
      tokenIds := Array.concat<Text>(tokenIds, [Nat.toText(token.tokenId)]);
    };
    tokenIds;
  };

  func childMintedTokenIds(collection : CollectionTypes.Collection) : async* [Text] {
    let child : ChildCollectionDividendActor = actor (collection.canisterId.toText());
    var prev : ?Nat = null;
    var tokenIds : [Text] = [];

    label paginate loop {
      let page = try {
        await child.mintlab_token_ids(prev, ?CHILD_TOKEN_PAGE_SIZE);
      } catch (_error) {
        return await* publicICRC7MintedTokenIdsOrIndexed(collection);
      };
      if (page.size() == 0) {
        break paginate;
      };
      for (tokenId in page.values()) {
        tokenIds := appendUniqueText(tokenIds, Nat.toText(tokenId));
      };
      if (page.size() < CHILD_TOKEN_PAGE_SIZE) {
        break paginate;
      };
      prev := ?page[page.size() - 1];
    };

    if (tokenIds.size() == 0) {
      await* publicICRC7MintedTokenIdsOrIndexed(collection);
    } else {
      tokenIds;
    };
  };

  func publicICRC7MintedTokenIdsOrIndexed(
    collection : CollectionTypes.Collection
  ) : async* [Text] {
    switch (await* publicICRC7MintedTokenIds(collection)) {
      case (?tokenIds) {
        if (tokenIds.size() == 0) {
          indexedMintedTokenIds(collection.id);
        } else {
          tokenIds;
        };
      };
      case null indexedMintedTokenIds(collection.id);
    };
  };

  func publicICRC7MintedTokenIds(
    collection : CollectionTypes.Collection
  ) : async* ?[Text] {
    let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
    var prev : ?Nat = null;
    var tokenIds : [Text] = [];

    label paginate loop {
      let page = try {
        await canister.icrc7_tokens(prev, ?CHILD_TOKEN_PAGE_SIZE);
      } catch (_error) {
        return null;
      };
      if (page.size() == 0) {
        break paginate;
      };
      for (tokenId in page.values()) {
        tokenIds := appendUniqueText(tokenIds, Nat.toText(tokenId));
      };
      if (page.size() < CHILD_TOKEN_PAGE_SIZE) {
        break paginate;
      };
      prev := ?page[page.size() - 1];
    };

    ?tokenIds;
  };

  func indexedMintedTokenIds(collectionId : CollectionTypes.CollectionId) : [Text] {
    var tokenIds : [Text] = [];
    for ((_, nft) in Map.entries(walletState.nfts)) {
      if (nft.collectionId == collectionId and nft.location == #Minted) {
        tokenIds := appendUniqueText(tokenIds, nft.tokenId);
      };
    };
    for (nft in MarketplaceLib.getActiveEscrowedNFTsByCollection(marketplaceState, collectionId).values()) {
      tokenIds := appendUniqueText(tokenIds, nft.tokenId);
    };
    tokenIds;
  };

  func appendUniqueText(values : [Text], value : Text) : [Text] {
    for (existing in values.values()) {
      if (existing == value) {
        return values;
      };
    };
    Array.concat<Text>(values, [value]);
  };

  func replaceUnlistedCollectionNFTs(
    current : [WalletTypes.WalletNFT],
    caller : Principal,
    collectionId : CollectionTypes.CollectionId,
    replacements : [WalletTypes.WalletNFT],
  ) : [WalletTypes.WalletNFT] {
    var nfts : [WalletTypes.WalletNFT] = [];
    for (nft in current.values()) {
      if (
        nft.collectionId != collectionId or
        nft.location == #Vaulted or
        isActiveListingSeller(caller, nft.id)
      ) {
        nfts := appendDistinctCollectionToken(nfts, nft);
      };
    };
    for (nft in replacements.values()) {
      nfts := appendDistinctCollectionToken(nfts, nft);
    };
    nfts;
  };

  func appendDistinctCollectionToken(
    nfts : [WalletTypes.WalletNFT],
    nft : WalletTypes.WalletNFT,
  ) : [WalletTypes.WalletNFT] {
    for (existing in nfts.values()) {
      if (existing.collectionId == nft.collectionId and existing.tokenId == nft.tokenId) {
        return nfts;
      };
    };
    Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
  };

  func userAndListedNFTs(caller : Principal) : [WalletTypes.WalletNFT] {
    var nfts = WalletLib.getUserNFTs(walletState, caller);
    for (listed in MarketplaceLib.getActiveEscrowedNFTsBySeller(marketplaceState, caller).values()) {
      if (not containsNFT(nfts, listed.id)) {
        nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [listed]);
      };
    };
    nfts;
  };

  func findDividendNFTCandidate(caller : Principal, nftId : WalletTypes.NFTId) : ?WalletTypes.WalletNFT {
    switch (WalletLib.getNFT(walletState, nftId)) {
      case (?nft) {
        if (nft.location == #Minted) {
          return ?nft;
        };
        if (Principal.equal(nft.owner, caller)) {
          return ?nft;
        };
      };
      case null {};
    };
    for (listed in MarketplaceLib.getActiveEscrowedNFTsBySeller(marketplaceState, caller).values()) {
      if (listed.id == nftId) {
        return ?listed;
      };
    };
    null;
  };

  func containsNFT(nfts : [WalletTypes.WalletNFT], nftId : WalletTypes.NFTId) : Bool {
    for (nft in nfts.values()) {
      if (nft.id == nftId) {
        return true;
      };
    };
    false;
  };
};
