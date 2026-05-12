import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Char "mo:core/Char";
import Error "mo:core/Error";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/wallet";
import BrowseTypes "../types/browse";
import CollectionTypes "../types/collections";
import NFTStandards "nft-standards";

module {
  public type WalletState = {
    nfts : Map.Map<Types.NFTId, Types.WalletNFT>;
    userNFTs : Map.Map<Types.UserId, [Types.NFTId]>;
    tokenIndex : Map.Map<Text, Types.NFTId>;
    pendingDeposits : Map.Map<Text, Types.DepositPreparation>;
    var nextId : Nat;
  };

  public func newState() : WalletState {
    {
      nfts = Map.empty<Types.NFTId, Types.WalletNFT>();
      userNFTs = Map.empty<Types.UserId, [Types.NFTId]>();
      tokenIndex = Map.empty<Text, Types.NFTId>();
      pendingDeposits = Map.empty<Text, Types.DepositPreparation>();
      var nextId = 1;
    };
  };

  public func mergeMetadata(
    primary : Types.NFTMetadata,
    fallback : Types.NFTMetadata,
  ) : Types.NFTMetadata {
    {
      name = switch (primary.name) {
        case (?_) primary.name;
        case null fallback.name;
      };
      description = switch (primary.description) {
        case (?_) primary.description;
        case null fallback.description;
      };
      imageUrl = switch (primary.imageUrl) {
        case (?_) primary.imageUrl;
        case null fallback.imageUrl;
      };
      attributes = if (primary.attributes.size() > 0) {
        primary.attributes;
      } else {
        fallback.attributes;
      };
    };
  };

  public func registerNFT(
    state : WalletState,
    owner : Types.UserId,
    collectionId : Types.CollectionId,
    tokenId : Text,
    metadata : Types.NFTMetadata,
    location : Types.WalletLocation,
  ) : Types.WalletNFT {
    let key = tokenKey(collectionId, tokenId);
    let registeredAt = Time.now();
    switch (Map.get(state.tokenIndex, Text.compare, key)) {
      case (?existingId) {
        switch (Map.get(state.nfts, Nat.compare, existingId)) {
          case (?existing) {
            if (not Principal.equal(existing.owner, owner)) {
              removeUserNFTId(state, existing.owner, existingId);
              appendUserNFTId(state, owner, existingId);
            };
            let updated : Types.WalletNFT = {
              existing with
              owner;
              collectionId;
              tokenId;
              metadata = mergeMetadata(metadata, existing.metadata);
              location = preferLocation(existing.location, location);
              registeredAt;
            };
            Map.add(state.nfts, Nat.compare, existingId, updated);
            updated;
          };
          case null {
            Map.remove(state.tokenIndex, Text.compare, key);
            createNFT(state, owner, collectionId, tokenId, metadata, location, registeredAt);
          };
        };
      };
      case null createNFT(state, owner, collectionId, tokenId, metadata, location, registeredAt);
    };
  };

  public func getUserNFTs(state : WalletState, user : Types.UserId) : [Types.WalletNFT] {
    switch (Map.get(state.userNFTs, Principal.compare, user)) {
      case null [];
      case (?ids) {
        var nfts : [Types.WalletNFT] = [];
        for (nftId in ids.values()) {
          switch (Map.get(state.nfts, Nat.compare, nftId)) {
            case (?nft) {
              nfts := Array.concat<Types.WalletNFT>(nfts, [nft]);
            };
            case null {};
          };
        };
        nfts;
      };
    };
  };

  public func getNFTStats(state : WalletState, user : Types.UserId) : Types.NFTStats {
    buildNFTStats(getUserNFTs(state, user));
  };

  public func buildNFTStats(nfts : [Types.WalletNFT]) : Types.NFTStats {
    let counts = Map.empty<Types.CollectionId, Nat>();
    for (nft in nfts.values()) {
      let current = switch (Map.get(counts, Nat.compare, nft.collectionId)) {
        case (?count) count;
        case null 0;
      };
      Map.add(counts, Nat.compare, nft.collectionId, current + 1);
    };
    {
      totalCount = nfts.size();
      perCollection = mapEntriesToArray(counts);
    };
  };

  public func removeNFT(state : WalletState, nftId : Types.NFTId, owner : Types.UserId) {
    switch (Map.get(state.nfts, Nat.compare, nftId)) {
      case (?nft) {
        if (Principal.equal(nft.owner, owner)) {
          deleteNFT(state, nftId);
        };
      };
      case null {};
    };
  };

  public func deleteNFT(state : WalletState, nftId : Types.NFTId) {
    switch (Map.get(state.nfts, Nat.compare, nftId)) {
      case null {};
      case (?nft) {
        Map.remove(state.nfts, Nat.compare, nftId);
        Map.remove(state.tokenIndex, Text.compare, tokenKey(nft.collectionId, nft.tokenId));
        removeUserNFTId(state, nft.owner, nftId);
      };
    };
  };

  public func transferManagedNFT(
    state : WalletState,
    nftId : Types.NFTId,
    currentOwner : Types.UserId,
    nextOwner : Types.UserId,
    location : Types.WalletLocation,
  ) : { #ok : Types.WalletNFT; #err : Text } {
    switch (Map.get(state.nfts, Nat.compare, nftId)) {
      case null #err("NFT not found in app wallet");
      case (?nft) {
        if (not Principal.equal(nft.owner, currentOwner)) {
          return #err("You do not own this NFT");
        };
        removeUserNFTId(state, currentOwner, nftId);
        appendUserNFTId(state, nextOwner, nftId);
        let updated : Types.WalletNFT = {
          nft with
          owner = nextOwner;
          location;
          registeredAt = Time.now();
        };
        Map.add(state.nfts, Nat.compare, nftId, updated);
        #ok(updated);
      };
    };
  };

  public func getNFT(state : WalletState, nftId : Types.NFTId) : ?Types.WalletNFT {
    Map.get(state.nfts, Nat.compare, nftId);
  };

  public func findByCollectionToken(
    state : WalletState,
    collectionId : Types.CollectionId,
    tokenId : Text,
  ) : ?Types.WalletNFT {
    switch (Map.get(state.tokenIndex, Text.compare, tokenKey(collectionId, tokenId))) {
      case null null;
      case (?nftId) Map.get(state.nfts, Nat.compare, nftId);
    };
  };

  public func prepareDeposit(
    state : WalletState,
    user : Types.UserId,
    collectionId : Types.CollectionId,
    tokenId : Text,
  ) : { #ok : Text; #err : Text } {
    let key = tokenKey(collectionId, tokenId);
    switch (Map.get(state.pendingDeposits, Text.compare, key)) {
      case (?existing) {
        if (Principal.equal(existing.user, user)) {
          #ok("Deposit is already prepared for this NFT");
        } else {
          #err("Another user already prepared this deposit");
        };
      };
      case null {
        Map.add(
          state.pendingDeposits,
          Text.compare,
          key,
          {
            user;
            collectionId;
            tokenId;
            preparedAt = Time.now();
          },
        );
        #ok("Deposit prepared. Transfer the NFT into the app vault, then claim it.");
      };
    };
  };

  public func getPreparedDeposit(
    state : WalletState,
    collectionId : Types.CollectionId,
    tokenId : Text,
  ) : ?Types.DepositPreparation {
    Map.get(state.pendingDeposits, Text.compare, tokenKey(collectionId, tokenId));
  };

  public func clearPreparedDeposit(
    state : WalletState,
    collectionId : Types.CollectionId,
    tokenId : Text,
  ) {
    Map.remove(state.pendingDeposits, Text.compare, tokenKey(collectionId, tokenId));
  };

  public func setManagedCollectionOwner(
    state : WalletState,
    collectionId : Types.CollectionId,
    owner : Types.UserId,
  ) {
    Map.add(
      state.pendingDeposits,
      Text.compare,
      collectionOwnerKey(collectionId),
      {
        user = owner;
        collectionId;
        tokenId = collectionOwnerTokenId();
        preparedAt = Time.now();
      },
    );
  };

  public func getManagedCollectionOwner(
    state : WalletState,
    collectionId : Types.CollectionId,
  ) : ?Types.UserId {
    switch (Map.get(state.pendingDeposits, Text.compare, collectionOwnerKey(collectionId))) {
      case null null;
      case (?record) {
        if (record.tokenId == collectionOwnerTokenId()) {
          ?record.user;
        } else {
          null;
        };
      };
    };
  };

  public func getManagedCollectionsByOwner(
    state : WalletState,
    owner : Types.UserId,
  ) : [Types.CollectionId] {
    var collectionIds : [Types.CollectionId] = [];
    for ((key, record) in Map.entries(state.pendingDeposits)) {
      if (
        record.tokenId == collectionOwnerTokenId() and
        Principal.equal(record.user, owner) and
        key == collectionOwnerKey(record.collectionId)
      ) {
        collectionIds := Array.concat<Types.CollectionId>(collectionIds, [record.collectionId]);
      };
    };
    collectionIds;
  };

  public func previewUserOwnedNFTs(
    collection : CollectionTypes.Collection,
    owner : Principal,
    accountId : Blob,
  ) : async* { #ok : [Types.WalletNFT]; #err : Text } {
    await* previewOwnedNFTsWithLocation(collection, owner, accountId, #Registered);
  };

  public func previewCollectionNFTs(
    collection : CollectionTypes.Collection
  ) : async* { #ok : [Types.WalletNFT]; #err : Text } {
    let pageSize : Nat = 40;
    var cursor : ?Text = null;
    var previews : [Types.WalletNFT] = [];

    label paginate loop {
      let pageResult = await* previewCollectionNFTPage(collection, cursor, pageSize);
      switch (pageResult) {
        case (#err(message)) return #err(message);
        case (#ok(page)) {
          previews := Array.concat<Types.WalletNFT>(previews, page.nfts);
          switch (page.nextCursor) {
            case null break paginate;
            case (?nextCursor) cursor := ?nextCursor;
          };
        };
      };
    };

    #ok(previews);
  };

  public func previewCollectionNFTPage(
    collection : CollectionTypes.Collection,
    cursor : ?Text,
    limit : Nat,
  ) : async* { #ok : BrowseTypes.CollectionNFTPage; #err : Text } {
    switch (collection.standard) {
      case (#ICRC7) {
        let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
        await* fetchICRC7CollectionPage(canister, collection, cursor, limit);
      };
      case (#EXT) {
        switch (collectionTokenRange(collection)) {
          case null {
            #err(
              "Collection-wide browsing needs the collection supply for this EXT import. Mintlab can still show NFTs it has already indexed."
            );
          };
          case (?range) {
            let canister : NFTStandards.EXTActor = actor (collection.canisterId.toText());
            await* fetchEXTCollectionPage(canister, collection, cursor, limit, range);
          };
        };
      };
      case (#DIP721) {
        switch (collectionTokenRange(collection)) {
          case null {
            #err(
              "Collection-wide browsing needs the collection supply for this DIP721 import. Mintlab can still show NFTs it has already indexed."
            );
          };
          case (?range) {
            let canister : NFTStandards.DIP721Actor = actor (collection.canisterId.toText());
            await* fetchDIP721CollectionPage(canister, collection, cursor, limit, range);
          };
        };
      };
      case (#Other(standardName)) {
        #err("Collection-wide browsing is not supported for '" # standardName # "' collections");
      };
    };
  };

  public func verifyOwnedNFT(
    collection : CollectionTypes.Collection,
    owner : Principal,
    accountId : Blob,
    tokenId : Text,
    location : Types.WalletLocation,
  ) : async* { #ok : Types.NFTMetadata; #err : Text } {
    var previewError : ?Text = null;
    let previewResult = await* previewOwnedNFTsWithLocation(collection, owner, accountId, location);
    switch (previewResult) {
      case (#err(message)) previewError := ?message;
      case (#ok(nfts)) {
        label search for (nft in nfts.values()) {
          if (tokenMatches(collection, nft.tokenId, tokenId)) {
            return #ok(nft.metadata);
          };
        };
      };
    };
    switch (await* isNFTCurrentlyOwnedBy(collection, owner, accountId, tokenId)) {
      case (#ok(true)) #ok(await* fetchTokenMetadata(collection, tokenId));
      case (#ok(false)) #err("NFT not found in the expected on-chain owner account");
      case (#err(message)) {
        switch (previewError) {
          case (?original) #err(original # ". Direct ownership check also failed: " # message);
          case null #err(message);
        };
      };
    };
  };

  public func canonicalTokenId(
    collection : CollectionTypes.Collection,
    tokenId : Text,
  ) : Text {
    switch (collection.standard) {
      case (#EXT) normalizeEXTTokenIdentifier(collection.canisterId, tokenId);
      case (_) tokenId;
    };
  };

  public func isNFTCurrentlyOwnedBy(
    collection : CollectionTypes.Collection,
    owner : Principal,
    accountId : Blob,
    tokenId : Text,
  ) : async* { #ok : Bool; #err : Text } {
    switch (collection.standard) {
      case (#ICRC7) {
        let tokenNat = switch (Nat.fromText(tokenId)) {
          case null return #err("Invalid ICRC-7 token ID");
          case (?value) value;
        };
        let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
        let owners = try {
          await canister.icrc7_owner_of([tokenNat]);
        } catch (error) {
          return #err("Collection '" # collection.name # "': " # Error.message(error));
        };
        if (owners.size() == 0) {
          return #ok(false);
        };
        switch (owners[0]) {
          case null #ok(false);
          case (?account) #ok(Principal.equal(account.owner, owner));
        };
      };
      case (#DIP721) {
        let tokenNat = switch (Nat.fromText(tokenId)) {
          case null return #err("Invalid DIP721 token ID");
          case (?value) value;
        };
        let canister : NFTStandards.DIP721Actor = actor (collection.canisterId.toText());
        switch (await* fetchDIP721Owner(canister, tokenNat, collection.name)) {
          case (#err(message)) #err(message);
          case (#ok(tokenOwner)) {
            switch (tokenOwner) {
              case null #ok(false);
              case (?value) #ok(Principal.equal(value, owner));
            };
          };
        };
      };
      case (#EXT) {
        let canister : NFTStandards.EXTActor = actor (collection.canisterId.toText());
        let accountIdHex = blobToHex(accountId);
        let tokenIdentifier = normalizeEXTTokenIdentifier(collection.canisterId, tokenId);
        switch (await* fetchEXTOwnerAccountId(canister, tokenIdentifier)) {
          case (#ok(ownerAccountId)) #ok(ownerAccountId == accountIdHex);
          case (#err(_)) {
            switch (await* fetchEXTBalance(canister, tokenIdentifier, accountIdHex)) {
              case (#ok(balance)) #ok(balance > 0);
              case (#err(message)) #err(message);
            };
          };
        };
      };
      case (#Other(standardName)) #err("Ownership checks are not supported for '" # standardName # "' collections");
    };
  };

  public func sendVaultedNFT(
    state : WalletState,
    nftId : Types.NFTId,
    owner : Types.UserId,
    canisterPrincipal : Principal,
    recipient : Principal,
    collection : CollectionTypes.Collection,
  ) : async* { #ok : Text; #err : Text } {
    let nft = switch (Map.get(state.nfts, Nat.compare, nftId)) {
      case null return #err("NFT not found in app vault");
      case (?value) value;
    };
    if (not Principal.equal(nft.owner, owner)) {
      return #err("You do not own this vaulted NFT");
    };
    if (nft.location != #Vaulted) {
      return #err(
        "Only NFTs held in the app vault can be sent from here. Deposit the NFT first or transfer it from the original wallet."
      );
    };

    switch (collection.standard) {
      case (#DIP721) {
        let tokenNat = switch (Nat.fromText(nft.tokenId)) {
          case null return #err("Invalid DIP721 token ID");
          case (?value) value;
        };
        let canister : NFTStandards.DIP721Actor = actor (collection.canisterId.toText());
        switch (await* transferDIP721VaultedNFT(canister, canisterPrincipal, recipient, tokenNat)) {
          case (#ok) {};
          case (#err(message)) return #err(message);
        };
      };
      case (#EXT) {
        let canister : NFTStandards.EXTActor = actor (collection.canisterId.toText());
        let request : NFTStandards.ExtTransferRequest = {
          from = #principal(canisterPrincipal);
          to = #principal(recipient);
          token = normalizeEXTTokenIdentifier(collection.canisterId, nft.tokenId);
          amount = 1;
          fee = null;
          memo = Blob.fromArray([]);
          notify = false;
          subaccount = null;
        };
        switch (await* transferEXTNFT(canister, request)) {
          case (#ok) {};
          case (#err(message)) return #err(message);
        };
      };
      case (#ICRC7) {
        let tokenNat = switch (Nat.fromText(nft.tokenId)) {
          case null return #err("Invalid ICRC-7 token ID");
          case (?value) value;
        };
        let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
        let result = try {
          await canister.icrc7_transfer([
            {
              from_subaccount = null;
              to = {
                owner = recipient;
                subaccount = null;
              };
              token_id = tokenNat;
              memo = null;
              created_at_time = null;
            },
          ]);
        } catch (error) {
          return #err("Transfer call failed: " # Error.message(error));
        };
        if (result.size() == 0) {
          return #err("ICRC-7 transfer returned no result");
        };
        switch (result[0]) {
          case null return #err("ICRC-7 transfer was not processed");
          case (?(#Ok(_))) {};
          case (?(#Err(error))) {
            return #err("ICRC-7 transfer rejected: " # icrc7TransferErrorToText(error));
          };
        };
      };
      case (#Other(standardName)) {
        return #err("Vault transfers are not supported for '" # standardName # "' collections");
      };
    };

    deleteNFT(state, nftId);
    #ok("NFT sent successfully");
  };

  func createNFT(
    state : WalletState,
    owner : Types.UserId,
    collectionId : Types.CollectionId,
    tokenId : Text,
    metadata : Types.NFTMetadata,
    location : Types.WalletLocation,
    registeredAt : Int,
  ) : Types.WalletNFT {
    let id = state.nextId;
    state.nextId += 1;
    let nft : Types.WalletNFT = {
      id;
      owner;
      collectionId;
      tokenId;
      metadata;
      location;
      registeredAt;
    };
    Map.add(state.nfts, Nat.compare, id, nft);
    Map.add(state.tokenIndex, Text.compare, tokenKey(collectionId, tokenId), id);
    appendUserNFTId(state, owner, id);
    nft;
  };

  func preferLocation(
    existing : Types.WalletLocation,
    incoming : Types.WalletLocation,
  ) : Types.WalletLocation {
    switch (existing, incoming) {
      case (#Minted, #Registered) #Minted;
      case (#Vaulted, #Registered) #Vaulted;
      case (_, value) value;
    };
  };

  func appendUserNFTId(state : WalletState, user : Types.UserId, nftId : Types.NFTId) {
    let currentIds = switch (Map.get(state.userNFTs, Principal.compare, user)) {
      case (?ids) ids;
      case null [];
    };
    if (not containsNat(currentIds, nftId)) {
        Map.add(
          state.userNFTs,
          Principal.compare,
          user,
          Array.concat<Types.NFTId>(currentIds, [nftId]),
        );
      };
    };

  func removeUserNFTId(state : WalletState, user : Types.UserId, nftId : Types.NFTId) {
    switch (Map.get(state.userNFTs, Principal.compare, user)) {
      case null {};
      case (?ids) {
        var filtered : [Types.NFTId] = [];
        for (currentId in ids.values()) {
          if (currentId != nftId) {
            filtered := Array.concat<Types.NFTId>(filtered, [currentId]);
          };
        };
        if (filtered.size() == 0) {
          Map.remove(state.userNFTs, Principal.compare, user);
        } else {
          Map.add(state.userNFTs, Principal.compare, user, filtered);
        };
      };
    };
  };

  func containsNat(values : [Nat], target : Nat) : Bool {
    for (value in values.values()) {
      if (value == target) return true;
    };
    false;
  };

  func tokenKey(collectionId : Types.CollectionId, tokenId : Text) : Text {
    Nat.toText(collectionId) # "#" # tokenId;
  };

  func tokenMatches(
    collection : CollectionTypes.Collection,
    canonicalTokenId : Text,
    requestedTokenId : Text,
  ) : Bool {
    if (canonicalTokenId == requestedTokenId) {
      return true;
    };
    switch (collection.standard) {
      case (#EXT) {
        canonicalTokenId == normalizeEXTTokenIdentifier(collection.canisterId, requestedTokenId);
      };
      case (_) false;
    };
  };

  func normalizeEXTTokenIdentifier(canisterId : Principal, tokenId : Text) : Text {
    switch (Nat.fromText(tokenId)) {
      case null tokenId;
      case (?tokenIndex) {
        if (tokenIndex > 4_294_967_295) {
          tokenId;
        } else {
          extTokenIdentifier(canisterId, Nat32.fromNat(tokenIndex));
        };
      };
    };
  };

  func collectionTokenRange(
    collection : CollectionTypes.Collection
  ) : ?{ totalSupply : Nat; tokenIndexOffset : Nat } {
    switch (collection.browseInfo) {
      case null null;
      case (?browseInfo) {
        switch (browseInfo.totalSupply) {
          case null null;
          case (?totalSupply) {
            ?{
              totalSupply;
              tokenIndexOffset = switch (browseInfo.tokenIndexOffset) {
                case (?offset) offset;
                case null 0;
              };
            };
          };
        };
      };
    };
  };

  func cursorToNat(cursor : ?Text) : ?Nat {
    switch (cursor) {
      case null null;
      case (?value) Nat.fromText(value);
    };
  };

  func normalizePreviewLimit(limit : Nat) : Nat {
    if (limit == 0) {
      1;
    } else if (limit > 40) {
      40;
    } else {
      limit;
    };
  };

  func collectionOwnerKey(collectionId : Types.CollectionId) : Text {
    "__mintlab_collection_owner__#" # Nat.toText(collectionId);
  };

  func collectionOwnerTokenId() : Text {
    "__mintlab_collection_owner__";
  };

  func mapEntriesToArray(entries : Map.Map<Types.CollectionId, Nat>) : [(Types.CollectionId, Nat)] {
    var result : [(Types.CollectionId, Nat)] = [];
    for ((collectionId, count) in Map.entries(entries)) {
      result := Array.concat<(Types.CollectionId, Nat)>(result, [(collectionId, count)]);
    };
    result;
  };

  func previewOwnedNFTsWithLocation(
    collection : CollectionTypes.Collection,
    owner : Principal,
    accountId : Blob,
    location : Types.WalletLocation,
  ) : async* { #ok : [Types.WalletNFT]; #err : Text } {
    switch (collection.standard) {
      case (#DIP721) {
        let canister : NFTStandards.DIP721Actor = actor (collection.canisterId.toText());
        switch (await* fetchDIP721OwnerTokenIdentifiers(canister, owner, collection.name)) {
          case (#err(message)) {
            switch (collectionTokenRange(collection)) {
              case (?range) return await* fetchDIP721PreviewsByOwnerScan(canister, collection, owner, location, range);
              case null return #err(message);
            };
          };
          case (#ok(tokenIds)) {
            if (tokenIds.size() == 0) {
              switch (collectionTokenRange(collection)) {
                case (?range) return await* fetchDIP721PreviewsByOwnerScan(canister, collection, owner, location, range);
                case null {};
              };
            };
            var previews : [Types.WalletNFT] = [];
            for (tokenId in tokenIds.values()) {
              let metadata = await* fetchDIP721Metadata(canister, tokenId, collection.name);
              previews := Array.concat<Types.WalletNFT>(
                previews,
                [
                  buildPreviewNFT(
                    owner,
                    collection.id,
                    Nat.toText(tokenId),
                    metadata,
                    location,
                    tokenId,
                  ),
                ],
              );
            };
            #ok(previews);
          };
        };
      };
      case (#EXT) {
        let canister : NFTStandards.EXTActor = actor (collection.canisterId.toText());
        let accountIdHex = blobToHex(accountId);
        let principalHex = blobToHex(owner.toBlob());
        switch (await* fetchEXTTokenIndices(canister, accountIdHex, principalHex, collection.name)) {
          case (#err(message)) {
            switch (collectionTokenRange(collection)) {
              case (?range) return await* fetchEXTPreviewsByOwnerScan(canister, collection, owner, accountIdHex, location, range);
              case null return #err(message);
            };
          };
          case (#ok(tokenIndices)) {
            if (tokenIndices.size() == 0) {
              switch (collectionTokenRange(collection)) {
                case (?range) return await* fetchEXTPreviewsByOwnerScan(canister, collection, owner, accountIdHex, location, range);
                case null {};
              };
            };
            var previews : [Types.WalletNFT] = [];
            for (tokenIndex in tokenIndices.values()) {
              let tokenIdentifier = extTokenIdentifier(collection.canisterId, tokenIndex);
              let metadata = await* fetchEXTMetadata(canister, collection.canisterId, tokenIdentifier, tokenIndex, collection.name);
              previews := Array.concat<Types.WalletNFT>(
                previews,
                [
                  buildPreviewNFT(
                    owner,
                    collection.id,
                    tokenIdentifier,
                    metadata,
                    location,
                    tokenIndex.toNat(),
                  ),
                ],
              );
            };
            #ok(previews);
          };
        };
      };
      case (#ICRC7) {
        let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
        await* fetchICRC7Previews(canister, collection, owner, location);
      };
      case (#Other(standardName)) #err("On-chain preview is not supported for '" # standardName # "' collections");
    };
  };

  func buildPreviewNFT(
    owner : Principal,
    collectionId : Types.CollectionId,
    tokenId : Text,
    metadata : Types.NFTMetadata,
    location : Types.WalletLocation,
    syntheticId : Nat,
  ) : Types.WalletNFT {
    {
      id = syntheticId;
      owner;
      collectionId;
      tokenId;
      metadata;
      location;
      registeredAt = 0;
    };
  };

  func fetchTokenMetadata(
    collection : CollectionTypes.Collection,
    tokenId : Text,
  ) : async* Types.NFTMetadata {
    switch (collection.standard) {
      case (#ICRC7) {
        let tokenNat = switch (Nat.fromText(tokenId)) {
          case null return fallbackTextMetadata(collection.name, tokenId);
          case (?value) value;
        };
        let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
        let metadatas = try {
          await canister.icrc7_token_metadata([tokenNat]);
        } catch (_) {
          [];
        };
        if (metadatas.size() > 0) {
          metadataFromICRC7(metadatas[0], collection.name, tokenNat);
        } else {
          fallbackICRC7Metadata(collection.name, tokenNat);
        };
      };
      case (#DIP721) {
        let tokenNat = switch (Nat.fromText(tokenId)) {
          case null return fallbackTextMetadata(collection.name, tokenId);
          case (?value) value;
        };
        let canister : NFTStandards.DIP721Actor = actor (collection.canisterId.toText());
        await* fetchDIP721Metadata(canister, tokenNat, collection.name);
      };
      case (#EXT) {
        let canister : NFTStandards.EXTActor = actor (collection.canisterId.toText());
        let tokenIdentifier = normalizeEXTTokenIdentifier(collection.canisterId, tokenId);
        await* fetchEXTMetadataWithFallback(
          canister,
          collection.canisterId,
          tokenIdentifier,
          fallbackTextMetadata(collection.name, tokenId),
        );
      };
      case (#Other(_)) fallbackTextMetadata(collection.name, tokenId);
    };
  };

  func fallbackTextMetadata(collectionName : Text, tokenId : Text) : Types.NFTMetadata {
    {
      name = ?(collectionName # " #" # tokenId);
      description = null;
      imageUrl = null;
      attributes = [];
    };
  };

  func fetchDIP721Metadata(
    canister : NFTStandards.DIP721Actor,
    tokenId : Nat,
    collectionName : Text,
  ) : async* Types.NFTMetadata {
    let fallback : Types.NFTMetadata = {
      name = ?(collectionName # " #" # Nat.toText(tokenId));
      description = null;
      imageUrl = null;
      attributes = [];
    };
    let result = switch (await* fetchDIP721TokenMetadataResult(canister, tokenId)) {
      case null return fallback;
      case (?value) value;
    };
    switch (result) {
      case (#Err(_)) fallback;
      case (#Ok(metadata)) {
        var name : ?Text = fallback.name;
        var description : ?Text = null;
        var imageUrl : ?Text = null;
        var attributes : [(Text, Text)] = [];
        for ((key, value) in metadata.properties.values()) {
          let textValue = metadataValueToText(value);
          switch (key) {
            case ("name" or "icrc7:name") name := ?textValue;
            case ("title") {
              if (name == null) {
                name := ?textValue;
              };
            };
            case ("description" or "desc" or "icrc7:description") description := ?textValue;
            case ("image" or "image_url" or "imageUrl" or "icrc7:image" or "icrc7:image_url" or "icrc7:logo" or "logo") imageUrl := ?textValue;
            case ("thumbnail" or "thumb" or "media" or "artifact_uri" or "asset" or "url" or "location" or "preview" or "display" or "animation_url" or "metadata" or "metadata_url" or "token_uri" or "uri") {
              if (imageUrl == null) {
                imageUrl := ?textValue;
              };
            };
            case (_) {
              attributes := Array.concat<(Text, Text)>(attributes, [(key, textValue)]);
            };
          };
        };
        {
          name;
          description;
          imageUrl;
          attributes;
        };
      };
    };
  };

  func fetchEXTMetadata(
    canister : NFTStandards.EXTActor,
    collectionCanisterId : Principal,
    tokenIdentifier : Text,
    tokenIndex : Nat32,
    collectionName : Text,
  ) : async* Types.NFTMetadata {
    let fallback : Types.NFTMetadata = {
      name = ?(collectionName # " #" # Nat.toText(tokenIndex.toNat()));
      description = null;
      imageUrl = null;
      attributes = [];
    };
    await* fetchEXTMetadataWithFallback(canister, collectionCanisterId, tokenIdentifier, fallback);
  };

  func fetchEXTMetadataWithFallback(
    canister : NFTStandards.EXTActor,
    collectionCanisterId : Principal,
    tokenIdentifier : Text,
    fallback : Types.NFTMetadata,
  ) : async* Types.NFTMetadata {
    let richResult = try {
      ?(await canister.ext_metadata(tokenIdentifier));
    } catch (_) {
      null;
    };
    switch (richResult) {
      case (?#ok(richMetadata)) {
        return metadataFromEXTRich(richMetadata, fallback, collectionCanisterId, tokenIdentifier);
      };
      case (_) {};
    };
    let result = try {
      await canister.metadata(tokenIdentifier);
    } catch (_) {
      return fallback;
    };
    switch (result) {
      case (#err(_)) fallback;
      case (#ok(extMetadata)) {
        switch (extMetadata) {
          case (#nonfungible({ metadata = ?value })) {
            switch (value) {
              case (#text(textValue)) {
                metadataFromEXTText(textValue, fallback, ?collectionCanisterId, ?tokenIdentifier);
              };
              case (#blob(blobValue)) {
                switch (Text.decodeUtf8(blobValue)) {
                  case (?textValue) metadataFromEXTText(textValue, fallback, ?collectionCanisterId, ?tokenIdentifier);
                  case null fallback;
                };
              };
              case (_) fallback;
            };
          };
          case (_) fallback;
        };
      };
    };
  };

  func metadataFromEXTRich(
    metadata : NFTStandards.ExtRichMetadata,
    fallback : Types.NFTMetadata,
    collectionCanisterId : Principal,
    tokenIdentifier : Text,
  ) : Types.NFTMetadata {
    switch (metadata) {
      case (#nonfungible(details)) {
        let containerMetadata = metadataFromEXTContainer(details.metadata, fallback, ?collectionCanisterId, ?tokenIdentifier);
        {
          name = firstNonEmptyText([nonEmptyText(details.name), containerMetadata.name]);
          description = containerMetadata.description;
          imageUrl = firstNonEmptyText([
            normalizeEXTMediaReference(collectionCanisterId, tokenIdentifier, details.thumbnail, true),
            containerMetadata.imageUrl,
            normalizeEXTMediaReference(collectionCanisterId, tokenIdentifier, details.asset, false),
          ]);
          attributes = containerMetadata.attributes;
        };
      };
      case (#fungible(_)) fallback;
    };
  };

  func metadataFromEXTContainer(
    metadata : ?NFTStandards.ExtMetadataContainer,
    fallback : Types.NFTMetadata,
    collectionCanisterId : ?Principal,
    tokenIdentifier : ?Text,
  ) : Types.NFTMetadata {
    switch (metadata) {
      case null fallback;
      case (?#json(jsonText)) metadataFromEXTText(jsonText, fallback, collectionCanisterId, tokenIdentifier);
      case (?#blob(blobValue)) {
        switch (Text.decodeUtf8(blobValue)) {
          case (?textValue) metadataFromEXTText(textValue, fallback, collectionCanisterId, tokenIdentifier);
          case null fallback;
        };
      };
      case (?#data(entries)) metadataFromEXTData(entries, fallback, collectionCanisterId, tokenIdentifier);
    };
  };

  func metadataFromEXTData(
    entries : [NFTStandards.ExtMetadataContainerEntry],
    fallback : Types.NFTMetadata,
    collectionCanisterId : ?Principal,
    tokenIdentifier : ?Text,
  ) : Types.NFTMetadata {
    var name = fallback.name;
    var description = fallback.description;
    var imageUrl = fallback.imageUrl;
    var attributes = fallback.attributes;
    for ((key, value) in entries.values()) {
      let textValue = extContainerValueToText(value);
      if (textValue != "") {
        switch (key) {
          case ("name" or "icrc7:name") name := ?textValue;
          case ("title") {
            if (name == null) {
              name := ?textValue;
            };
          };
          case ("description" or "desc" or "icrc7:description") description := ?textValue;
          case ("image" or "image_url" or "imageUrl" or "icrc7:image" or "icrc7:image_url" or "icrc7:logo" or "logo") {
            imageUrl := normalizeMediaReference(collectionCanisterId, tokenIdentifier, textValue, false);
          };
          case ("thumbnail" or "thumb" or "media" or "artifact_uri" or "asset" or "url" or "location" or "preview" or "display" or "animation_url" or "metadata" or "metadata_url" or "token_uri" or "uri") {
            if (imageUrl == null) {
              imageUrl := normalizeMediaReference(
                collectionCanisterId,
                tokenIdentifier,
                textValue,
                key == "thumbnail" or key == "thumb",
              );
            };
          };
          case ("attributes" or "icrc7:token_metadata") {};
          case (_) {
            attributes := Array.concat<(Text, Text)>(attributes, [(key, textValue)]);
          };
        };
      };
    };
    {
      name;
      description;
      imageUrl;
      attributes;
    };
  };

  func metadataFromEXTText(
    textValue : Text,
    fallback : Types.NFTMetadata,
    collectionCanisterId : ?Principal,
    tokenIdentifier : ?Text,
  ) : Types.NFTMetadata {
    let name = firstJsonTextField(textValue, ["name", "title"]);
    let description = firstJsonTextField(textValue, ["description", "desc"]);
    let imageUrl = firstJsonTextField(
      textValue,
      ["image", "image_url", "imageUrl", "icrc7:image", "icrc7:image_url", "icrc7:logo", "logo", "thumbnail", "thumb", "media", "artifact_uri", "asset", "url", "location", "preview", "display", "animation_url", "metadata", "metadata_url", "token_uri", "uri"],
    );
    let normalizedImageUrl = switch (imageUrl) {
      case (?value) normalizeMediaReference(collectionCanisterId, tokenIdentifier, value, false);
      case null null;
    };
    let directImage = if (isLikelyImageReference(textValue)) {
      normalizeMediaReference(collectionCanisterId, tokenIdentifier, textValue, false);
    } else {
      null;
    };
    {
      name = firstNonEmptyText([name, fallback.name]);
      description = firstNonEmptyText([
        description,
        if (directImage == null and not Text.contains(textValue, #text "{")) {
          nonEmptyText(textValue);
        } else {
          fallback.description;
        },
      ]);
      imageUrl = firstNonEmptyText([normalizedImageUrl, directImage, fallback.imageUrl]);
      attributes = fallback.attributes;
    };
  };

  func normalizeMediaReference(
    collectionCanisterId : ?Principal,
    tokenIdentifier : ?Text,
    value : Text,
    preferThumbnail : Bool,
  ) : ?Text {
    switch (collectionCanisterId, tokenIdentifier) {
      case (?canisterId, ?tokenId) {
        normalizeEXTMediaReference(canisterId, tokenId, value, preferThumbnail);
      };
      case (_) nonEmptyText(value);
    };
  };

  func normalizeEXTMediaReference(
    collectionCanisterId : Principal,
    tokenIdentifier : Text,
    value : Text,
    preferThumbnail : Bool,
  ) : ?Text {
    if (value == "") {
      return null;
    };
    if (isLikelyImageReference(value)) {
      return ?value;
    };
    if (Text.startsWith(value, #text "/")) {
      return ?("https://" # collectionCanisterId.toText() # ".raw.icp0.io" # value);
    };
    ?extTokenMediaUrl(
      collectionCanisterId,
      tokenIdentifier,
      preferThumbnail or Text.contains(value, #text "thumbnail") or Text.contains(value, #text "thumb"),
    );
  };

  func extTokenMediaUrl(
    collectionCanisterId : Principal,
    tokenIdentifier : Text,
    thumbnail : Bool,
  ) : Text {
    let base = "https://" # collectionCanisterId.toText() # ".raw.icp0.io/?";
    if (thumbnail) {
      base # "type=thumbnail&tokenid=" # tokenIdentifier;
    } else {
      base # "tokenid=" # tokenIdentifier;
    };
  };

  func firstJsonTextField(textValue : Text, keys : [Text]) : ?Text {
    for (key in keys.values()) {
      switch (jsonTextField(textValue, key)) {
        case (?value) {
          if (value != "") {
            return ?value;
          };
        };
        case null {};
      };
    };
    null;
  };

  func jsonTextField(textValue : Text, key : Text) : ?Text {
    let marker = "\"" # key # "\"";
    let parts = Text.split(textValue, #text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null null;
      case (?afterKey) parseJsonStringAfterKey(afterKey);
    };
  };

  func parseJsonStringAfterKey(textValue : Text) : ?Text {
    var sawColon = false;
    var inString = false;
    var escaped = false;
    var result = "";
    for (char in textValue.chars()) {
      if (not sawColon) {
        if (char == ':') {
          sawColon := true;
        } else if (isJsonWhitespace(char)) {
          // Keep scanning until the field separator.
        } else {
          return null;
        };
      } else if (not inString) {
        if (isJsonWhitespace(char)) {
          // Whitespace before the string value.
        } else if (isJsonQuote(char)) {
          inString := true;
        } else {
          return null;
        };
      } else if (escaped) {
        result #= jsonEscapeToText(char);
        escaped := false;
      } else if (isJsonBackslash(char)) {
        escaped := true;
      } else if (isJsonQuote(char)) {
        return ?result;
      } else {
        result #= Text.fromChar(char);
      };
    };
    null;
  };

  func jsonEscapeToText(char : Char) : Text {
    if (isJsonQuote(char)) {
      "\"";
    } else if (isJsonBackslash(char)) {
      "\\";
    } else if (char == '/') {
      "/";
    } else if (char == 'n') {
      "\n";
    } else if (char == 'r') {
      "\r";
    } else if (char == 't') {
      "\t";
    } else {
      Text.fromChar(char);
    };
  };

  func isJsonQuote(char : Char) : Bool {
    Char.toNat32(char) == 34;
  };

  func isJsonBackslash(char : Char) : Bool {
    Char.toNat32(char) == 92;
  };

  func isJsonWhitespace(char : Char) : Bool {
    char == ' ' or char == '\n' or char == '\r' or char == '\t';
  };

  func firstNonEmptyText(values : [?Text]) : ?Text {
    for (value in values.values()) {
      switch (value) {
        case (?textValue) {
          if (textValue != "") {
            return ?textValue;
          };
        };
        case null {};
      };
    };
    null;
  };

  func nonEmptyText(textValue : Text) : ?Text {
    if (textValue == "") {
      null;
    } else {
      ?textValue;
    };
  };

  func isLikelyImageReference(textValue : Text) : Bool {
    Text.startsWith(textValue, #text "https://") or
    Text.startsWith(textValue, #text "http://") or
    Text.startsWith(textValue, #text "ipfs://") or
    Text.startsWith(textValue, #text "ar://") or
    Text.startsWith(textValue, #text "//") or
    Text.startsWith(textValue, #text "data:image/");
  };

  func extContainerValueToText(
    value : NFTStandards.ExtMetadataContainerValue
  ) : Text {
    switch (value) {
      case (#text(text)) text;
      case (#nat(number)) Nat.toText(number);
      case (#nat8(number)) Nat.toText(number.toNat());
      case (#blob(blobValue)) {
        switch (Text.decodeUtf8(blobValue)) {
          case (?text) text;
          case null blobToHex(blobValue);
        };
      };
    };
  };

  func fetchDIP721OwnerTokenIdentifiers(
    canister : NFTStandards.DIP721Actor,
    owner : Principal,
    collectionName : Text,
  ) : async* { #ok : [Nat]; #err : Text } {
    let primary = try {
      ?(await canister.dip721_owner_token_identifiers(owner));
    } catch (_) {
      null;
    };
    switch (primary) {
      case (?#Ok(tokenIds)) return #ok(tokenIds);
      case (?#Err(error)) {
        return #err("Collection '" # collectionName # "': " # dip721ErrorToText(error));
      };
      case null {};
    };

    let fallback = try {
      ?(await canister.ownerTokenIdentifiers(owner));
    } catch (error) {
      return #err("Collection '" # collectionName # "': " # Error.message(error));
    };
    switch (fallback) {
      case (?#Ok(tokenIds)) #ok(tokenIds);
      case (?#Err(error)) #err("Collection '" # collectionName # "': " # dip721ErrorToText(error));
      case null #err("Collection '" # collectionName # "': token ownership method not available");
    };
  };

  func fetchDIP721TokenMetadataResult(
    canister : NFTStandards.DIP721Actor,
    tokenId : Nat,
  ) : async* ?NFTStandards.DIP721MetadataResult {
    let primary = try {
      ?(await canister.dip721_token_metadata(tokenId));
    } catch (_) {
      null;
    };
    switch (primary) {
      case (?result) ?result;
      case null {
        try {
          ?(await canister.tokenMetadata(tokenId));
        } catch (_) {
          null;
        };
      };
    };
  };

  func fetchDIP721Owner(
    canister : NFTStandards.DIP721Actor,
    tokenId : Nat,
    collectionName : Text,
  ) : async* { #ok : ?Principal; #err : Text } {
    let primary = try {
      ?(await canister.dip721_owner_of(tokenId));
    } catch (_) {
      null;
    };
    switch (primary) {
      case (?#Ok(owner)) return #ok(owner);
      case (?#Err(error)) return #err("Collection '" # collectionName # "': " # dip721ErrorToText(error));
      case null {};
    };

    let fallback = try {
      ?(await canister.ownerOf(tokenId));
    } catch (error) {
      return #err("Collection '" # collectionName # "': " # Error.message(error));
    };
    switch (fallback) {
      case (?#Ok(owner)) #ok(owner);
      case (?#Err(error)) #err("Collection '" # collectionName # "': " # dip721ErrorToText(error));
      case null #err("Collection '" # collectionName # "': token owner method not available");
    };
  };

  func transferDIP721VaultedNFT(
    canister : NFTStandards.DIP721Actor,
    from : Principal,
    recipient : Principal,
    tokenId : Nat,
  ) : async* { #ok; #err : Text } {
    var lastError = "DIP721 transfer method not available";

    let transferResult = try {
      ?(await canister.transfer(recipient, tokenId));
    } catch (error) {
      lastError := "Transfer call failed: " # Error.message(error);
      null;
    };
    switch (transferResult) {
      case (?#Ok(_)) return #ok;
      case (?#Err(error)) lastError := "DIP721 transfer rejected: " # dip721ErrorToText(error);
      case null {};
    };

    let dip721TransferResult = try {
      ?(await canister.dip721_transfer(recipient, tokenId));
    } catch (error) {
      lastError := "Transfer call failed: " # Error.message(error);
      null;
    };
    switch (dip721TransferResult) {
      case (?#Ok(_)) return #ok;
      case (?#Err(error)) lastError := "DIP721 transfer rejected: " # dip721ErrorToText(error);
      case null {};
    };

    let transferFromResult = try {
      ?(await canister.transferFromDip721(from, recipient, tokenId));
    } catch (error) {
      lastError := "Transfer call failed: " # Error.message(error);
      null;
    };
    switch (transferFromResult) {
      case (?#Ok(_)) #ok;
      case (?#Err(error)) #err("DIP721 transfer rejected: " # dip721ErrorToText(error));
      case null #err(lastError);
    };
  };

  func fetchEXTTokenIndices(
    canister : NFTStandards.EXTActor,
    accountIdHex : Text,
    principalHex : Text,
    collectionName : Text,
  ) : async* { #ok : [NFTStandards.TokenIndex]; #err : Text } {
    var tokenIndices : [NFTStandards.TokenIndex] = [];
    var sawAvailableMethod = false;
    var lastError : ?Text = null;

    switch (await* fetchEXTTokenIndicesForAccount(canister, accountIdHex)) {
      case (#ok(values)) {
        sawAvailableMethod := true;
        tokenIndices := appendUniqueTokenIndices(tokenIndices, values);
      };
      case (#err(message)) {
        if (message != "method unavailable") {
          lastError := ?message;
        };
      };
    };

    switch (await* fetchEXTLegacyTokensForAccount(canister, accountIdHex)) {
      case (#ok(values)) {
        sawAvailableMethod := true;
        tokenIndices := appendUniqueTokenIndices(tokenIndices, values);
      };
      case (#err(message)) {
        if (message != "method unavailable") {
          lastError := ?message;
        };
      };
    };

    switch (await* fetchEXTTokenIndicesForAccount(canister, principalHex)) {
      case (#ok(values)) {
        sawAvailableMethod := true;
        tokenIndices := appendUniqueTokenIndices(tokenIndices, values);
      };
      case (#err(message)) {
        if (message != "method unavailable") {
          lastError := ?message;
        };
      };
    };

    switch (await* fetchEXTLegacyTokensForAccount(canister, principalHex)) {
      case (#ok(values)) {
        sawAvailableMethod := true;
        tokenIndices := appendUniqueTokenIndices(tokenIndices, values);
      };
      case (#err(message)) {
        if (message != "method unavailable") {
          lastError := ?message;
        };
      };
    };

    if (tokenIndices.size() > 0 or sawAvailableMethod) {
      #ok(tokenIndices);
    } else {
      switch (lastError) {
        case (?message) #err("Collection '" # collectionName # "': " # message);
        case null #err("Collection '" # collectionName # "': EXT token ownership method not available");
      };
    };
  };

  func appendUniqueTokenIndices(
    existing : [NFTStandards.TokenIndex],
    incoming : [NFTStandards.TokenIndex],
  ) : [NFTStandards.TokenIndex] {
    var result = existing;
    for (tokenIndex in incoming.values()) {
      if (not containsTokenIndex(result, tokenIndex)) {
        result := Array.concat<NFTStandards.TokenIndex>(result, [tokenIndex]);
      };
    };
    result;
  };

  func containsTokenIndex(
    values : [NFTStandards.TokenIndex],
    target : NFTStandards.TokenIndex,
  ) : Bool {
    for (value in values.values()) {
      if (value == target) {
        return true;
      };
    };
    false;
  };

  func fetchEXTTokenIndicesForAccount(
    canister : NFTStandards.EXTActor,
    accountId : Text,
  ) : async* { #ok : [NFTStandards.TokenIndex]; #err : Text } {
    let result = try {
      ?(await canister.tokens_ext(accountId));
    } catch (_) {
      null;
    };
    switch (result) {
      case null #err("method unavailable");
      case (?#err(error)) #err(extCommonErrorToText(error));
      case (?#ok(entries)) {
        var tokenIndices : [NFTStandards.TokenIndex] = [];
        for ((tokenIndex, _, _) in entries.values()) {
          tokenIndices := Array.concat<NFTStandards.TokenIndex>(tokenIndices, [tokenIndex]);
        };
        #ok(tokenIndices);
      };
    };
  };

  func fetchEXTLegacyTokensForAccount(
    canister : NFTStandards.EXTActor,
    accountId : Text,
  ) : async* { #ok : [NFTStandards.TokenIndex]; #err : Text } {
    let result = try {
      ?(await canister.tokens(accountId));
    } catch (_) {
      null;
    };
    switch (result) {
      case null #err("method unavailable");
      case (?#err(error)) #err(extCommonErrorToText(error));
      case (?#ok(tokenIndices)) #ok(tokenIndices);
    };
  };

  func fetchEXTOwnerAccountId(
    canister : NFTStandards.EXTActor,
    tokenIdentifier : Text,
  ) : async* { #ok : Text; #err : Text } {
    let primary = try {
      ?(await canister.ext_bearer(tokenIdentifier));
    } catch (_) {
      null;
    };
    switch (primary) {
      case (?#ok(accountId)) return #ok(accountId);
      case (?#err(error)) return #err(extCommonErrorToText(error));
      case null {};
    };

    let fallback = try {
      ?(await canister.bearer(tokenIdentifier));
    } catch (_) {
      null;
    };
    switch (fallback) {
      case (?#ok(accountId)) #ok(accountId);
      case (?#err(error)) #err(extCommonErrorToText(error));
      case null #err("EXT bearer method not available");
    };
  };

  func fetchEXTBalance(
    canister : NFTStandards.EXTActor,
    tokenIdentifier : Text,
    accountIdHex : Text,
  ) : async* { #ok : Nat; #err : Text } {
    let request : NFTStandards.ExtBalanceRequest = {
      token = tokenIdentifier;
      user = #address(accountIdHex);
    };
    let primary = try {
      ?(await canister.ext_balance(request));
    } catch (_) {
      null;
    };
    switch (primary) {
      case (?#ok(balance)) return #ok(balance);
      case (?#err(error)) return #err(extCommonErrorToText(error));
      case null {};
    };

    let fallback = try {
      ?(await canister.balance(request));
    } catch (_) {
      null;
    };
    switch (fallback) {
      case (?#ok(balance)) #ok(balance);
      case (?#err(error)) #err(extCommonErrorToText(error));
      case null #err("EXT balance method not available");
    };
  };

  func transferEXTNFT(
    canister : NFTStandards.EXTActor,
    request : NFTStandards.ExtTransferRequest,
  ) : async* { #ok; #err : Text } {
    var lastError = "EXT transfer method not available";
    let primary = try {
      ?(await canister.ext_transfer(request));
    } catch (error) {
      lastError := "Transfer call failed: " # Error.message(error);
      null;
    };
    switch (primary) {
      case (?#ok(_)) return #ok;
      case (?#err(error)) lastError := "EXT transfer rejected: " # extErrorToText(error);
      case null {};
    };

    let fallback = try {
      ?(await canister.transfer(request));
    } catch (error) {
      lastError := "Transfer call failed: " # Error.message(error);
      null;
    };
    switch (fallback) {
      case (?#ok(_)) #ok;
      case (?#err(error)) #err("EXT transfer rejected: " # extErrorToText(error));
      case null #err(lastError);
    };
  };

  func fetchICRC7Previews(
    canister : NFTStandards.ICRC7Actor,
    collection : CollectionTypes.Collection,
    owner : Principal,
    location : Types.WalletLocation,
  ) : async* { #ok : [Types.WalletNFT]; #err : Text } {
    let account : NFTStandards.ICRC7Account = {
      owner;
      subaccount = null;
    };
    let pageSize : Nat = 100;
    var prev : ?Nat = null;
    var previews : [Types.WalletNFT] = [];

    label paginate loop {
      let tokenIdsResult = try {
        #ok(await canister.icrc7_tokens_of(account, prev, ?pageSize));
      } catch (error) {
        #err(Error.message(error));
      };
      let tokenIds = switch (tokenIdsResult) {
        case (#ok(value)) value;
        case (#err(_)) {
          return await* fetchICRC7PreviewsByOwnerScan(canister, collection, owner, location);
        };
      };
      if (tokenIds.size() == 0) {
        let balances = try {
          await canister.icrc7_balance_of([account]);
        } catch (_) {
          [];
        };
        if (balances.size() > 0 and balances[0] > 0) {
          return await* fetchICRC7PreviewsByOwnerScan(canister, collection, owner, location);
        };
        let totalSupply = try {
          await canister.icrc7_total_supply();
        } catch (_) {
          0;
        };
        if (totalSupply > 0) {
          return await* fetchICRC7PreviewsByOwnerScan(canister, collection, owner, location);
        };
        break paginate;
      };

      let metadatas = try {
        await canister.icrc7_token_metadata(tokenIds);
      } catch (_error) {
        Array.tabulate<?NFTStandards.ICRC7TokenMetadata>(
          tokenIds.size(),
          func(_) { null },
        );
      };

      var index : Nat = 0;
      for (tokenId in tokenIds.values()) {
        let metadata = if (index < metadatas.size()) {
          metadataFromICRC7(
            metadatas[index],
            collection.name,
            tokenId,
          );
        } else {
          fallbackICRC7Metadata(collection.name, tokenId);
        };
        previews := Array.concat<Types.WalletNFT>(
          previews,
          [
            buildPreviewNFT(
              owner,
              collection.id,
              Nat.toText(tokenId),
              metadata,
              location,
              tokenId,
            ),
          ],
        );
        index += 1;
      };

      if (tokenIds.size() < pageSize) {
        break paginate;
      };
      prev := ?tokenIds[tokenIds.size() - 1];
    };

    #ok(previews);
  };

  func fetchICRC7PreviewsByOwnerScan(
    canister : NFTStandards.ICRC7Actor,
    collection : CollectionTypes.Collection,
    owner : Principal,
    location : Types.WalletLocation,
  ) : async* { #ok : [Types.WalletNFT]; #err : Text } {
    let pageSize : Nat = 100;
    var prev : ?Nat = null;
    var previews : [Types.WalletNFT] = [];

    label paginate loop {
      let tokenIds = try {
        await canister.icrc7_tokens(prev, ?pageSize);
      } catch (error) {
        return #err("Collection '" # collection.name # "': " # Error.message(error));
      };
      if (tokenIds.size() == 0) {
        break paginate;
      };

      let owners = try {
        await canister.icrc7_owner_of(tokenIds);
      } catch (error) {
        return #err("Collection '" # collection.name # "': " # Error.message(error));
      };

      var ownedTokenIds : [Nat] = [];
      var ownerIndex : Nat = 0;
      for (tokenId in tokenIds.values()) {
        if (ownerIndex < owners.size()) {
          switch (owners[ownerIndex]) {
            case (?account) {
              if (Principal.equal(account.owner, owner)) {
                ownedTokenIds := Array.concat<Nat>(ownedTokenIds, [tokenId]);
              };
            };
            case null {};
          };
        };
        ownerIndex += 1;
      };

      if (ownedTokenIds.size() > 0) {
        let metadatas = try {
          await canister.icrc7_token_metadata(ownedTokenIds);
        } catch (_) {
          Array.tabulate<?NFTStandards.ICRC7TokenMetadata>(
            ownedTokenIds.size(),
            func(_) { null },
          );
        };

        var metadataIndex : Nat = 0;
        for (tokenId in ownedTokenIds.values()) {
          let metadata = if (metadataIndex < metadatas.size()) {
            metadataFromICRC7(metadatas[metadataIndex], collection.name, tokenId);
          } else {
            fallbackICRC7Metadata(collection.name, tokenId);
          };
          previews := Array.concat<Types.WalletNFT>(
            previews,
            [
              buildPreviewNFT(
                owner,
                collection.id,
                Nat.toText(tokenId),
                metadata,
                location,
                tokenId,
              ),
            ],
          );
          metadataIndex += 1;
        };
      };

      if (tokenIds.size() < pageSize) {
        break paginate;
      };
      prev := ?tokenIds[tokenIds.size() - 1];
    };

    #ok(previews);
  };

  func fetchEXTPreviewsByOwnerScan(
    canister : NFTStandards.EXTActor,
    collection : CollectionTypes.Collection,
    owner : Principal,
    accountIdHex : Text,
    location : Types.WalletLocation,
    range : { totalSupply : Nat; tokenIndexOffset : Nat },
  ) : async* { #ok : [Types.WalletNFT]; #err : Text } {
    var previews : [Types.WalletNFT] = [];
    let principalHex = blobToHex(owner.toBlob());
    var current = range.tokenIndexOffset;
    let end = range.tokenIndexOffset + range.totalSupply;

    while (current < end) {
      let tokenIndex = Nat32.fromNat(current);
      let tokenIdentifier = extTokenIdentifier(collection.canisterId, tokenIndex);
      switch (await* fetchEXTOwnerAccountId(canister, tokenIdentifier)) {
        case (#ok(ownerAccountId)) {
          if (ownerAccountId == accountIdHex or ownerAccountId == principalHex) {
            let metadata = await* fetchEXTMetadata(canister, collection.canisterId, tokenIdentifier, tokenIndex, collection.name);
            previews := Array.concat<Types.WalletNFT>(
              previews,
              [
                buildPreviewNFT(
                  owner,
                  collection.id,
                  tokenIdentifier,
                  metadata,
                  location,
                  current,
                )
              ],
            );
          };
        };
        case (#err(_)) {};
      };
      current += 1;
    };

    #ok(previews);
  };

  func fetchDIP721PreviewsByOwnerScan(
    canister : NFTStandards.DIP721Actor,
    collection : CollectionTypes.Collection,
    owner : Principal,
    location : Types.WalletLocation,
    range : { totalSupply : Nat; tokenIndexOffset : Nat },
  ) : async* { #ok : [Types.WalletNFT]; #err : Text } {
    var previews : [Types.WalletNFT] = [];
    var current = range.tokenIndexOffset;
    let end = range.tokenIndexOffset + range.totalSupply;

    while (current < end) {
      switch (await* fetchDIP721Owner(canister, current, collection.name)) {
        case (#ok(?tokenOwner)) {
          if (Principal.equal(tokenOwner, owner)) {
            let metadata = await* fetchDIP721Metadata(canister, current, collection.name);
            previews := Array.concat<Types.WalletNFT>(
              previews,
              [
                buildPreviewNFT(
                  owner,
                  collection.id,
                  Nat.toText(current),
                  metadata,
                  location,
                  current,
                )
              ],
            );
          };
        };
        case (#ok(null)) {};
        case (#err(_)) {};
      };
      current += 1;
    };

    #ok(previews);
  };

  func fetchICRC7CollectionPage(
    canister : NFTStandards.ICRC7Actor,
    collection : CollectionTypes.Collection,
    cursor : ?Text,
    limit : Nat,
  ) : async* { #ok : BrowseTypes.CollectionNFTPage; #err : Text } {
    let pageSize : Nat = normalizePreviewLimit(limit);
    let unknownOwner = anonymousPrincipal();
    let prev = cursorToNat(cursor);
    let totalCount = try {
      await canister.icrc7_total_supply();
    } catch (error) {
      return #err("Collection '" # collection.name # "': " # Error.message(error));
    };
    let tokenIds = try {
      await canister.icrc7_tokens(prev, ?pageSize);
    } catch (error) {
      return #err("Collection '" # collection.name # "': " # Error.message(error));
    };
    if (tokenIds.size() == 0) {
      return #ok({
        nfts = [];
        nextCursor = null;
        totalCount;
        coverage = #Full;
        note = "Mintlab can browse the full ICRC-7 collection directly from the collection canister.";
      });
    };

    let metadatas = try {
      await canister.icrc7_token_metadata(tokenIds);
    } catch (error) {
      return #err("Collection '" # collection.name # "': " # Error.message(error));
    };

    let owners = try {
      await canister.icrc7_owner_of(tokenIds);
    } catch (_) {
      Array.tabulate<?NFTStandards.ICRC7Account>(tokenIds.size(), func(_) { null });
    };

    var previews : [Types.WalletNFT] = [];
    var index : Nat = 0;
    label build for (tokenId in tokenIds.values()) {
      let metadata = if (index < metadatas.size()) {
        metadataFromICRC7(metadatas[index], collection.name, tokenId);
      } else {
        fallbackICRC7Metadata(collection.name, tokenId);
      };
      let owner = if (index < owners.size()) {
        switch (owners[index]) {
          case (?account) account.owner;
          case null unknownOwner;
        };
      } else {
        unknownOwner;
      };
      previews := Array.concat<Types.WalletNFT>(
        previews,
        [
          buildPreviewNFT(
            owner,
            collection.id,
            Nat.toText(tokenId),
            metadata,
            #Registered,
            tokenId,
          ),
        ],
      );
      index += 1;
    };

    #ok({
      nfts = previews;
      nextCursor = if (tokenIds.size() < pageSize) {
        null;
      } else {
        ?Nat.toText(tokenIds[tokenIds.size() - 1]);
      };
      totalCount;
      coverage = #Full;
      note = "Mintlab can browse the full ICRC-7 collection directly from the collection canister.";
    });
  };

  func fetchEXTCollectionPage(
    canister : NFTStandards.EXTActor,
    collection : CollectionTypes.Collection,
    cursor : ?Text,
    limit : Nat,
    range : { totalSupply : Nat; tokenIndexOffset : Nat },
  ) : async* { #ok : BrowseTypes.CollectionNFTPage; #err : Text } {
    let pageSize = normalizePreviewLimit(limit);
    let start = switch (cursorToNat(cursor)) {
      case (?value) value;
      case null range.tokenIndexOffset;
    };
    let end = Nat.min(start + pageSize, range.tokenIndexOffset + range.totalSupply);
    let unknownOwner = anonymousPrincipal();
    var previews : [Types.WalletNFT] = [];
    var current = start;

    while (current < end) {
      let tokenIndex = Nat32.fromNat(current);
      let tokenIdentifier = extTokenIdentifier(collection.canisterId, tokenIndex);
      let metadata = await* fetchEXTMetadata(canister, collection.canisterId, tokenIdentifier, tokenIndex, collection.name);
      previews := Array.concat<Types.WalletNFT>(
        previews,
        [
          buildPreviewNFT(
            unknownOwner,
            collection.id,
            tokenIdentifier,
            metadata,
            #Registered,
            current,
          ),
        ],
      );
      current += 1;
    };

    #ok({
      nfts = previews;
      nextCursor = if (end < range.tokenIndexOffset + range.totalSupply) {
        ?Nat.toText(end);
      } else {
        null;
      };
      totalCount = range.totalSupply;
      coverage = #Full;
      note = "Mintlab can browse the full EXT collection using the imported token range.";
    });
  };

  func fetchDIP721CollectionPage(
    canister : NFTStandards.DIP721Actor,
    collection : CollectionTypes.Collection,
    cursor : ?Text,
    limit : Nat,
    range : { totalSupply : Nat; tokenIndexOffset : Nat },
  ) : async* { #ok : BrowseTypes.CollectionNFTPage; #err : Text } {
    let pageSize = normalizePreviewLimit(limit);
    let start = switch (cursorToNat(cursor)) {
      case (?value) value;
      case null range.tokenIndexOffset;
    };
    let end = Nat.min(start + pageSize, range.tokenIndexOffset + range.totalSupply);
    let unknownOwner = anonymousPrincipal();
    var previews : [Types.WalletNFT] = [];
    var current = start;

    while (current < end) {
      let metadata = await* fetchDIP721Metadata(canister, current, collection.name);
      previews := Array.concat<Types.WalletNFT>(
        previews,
        [
          buildPreviewNFT(
            unknownOwner,
            collection.id,
            Nat.toText(current),
            metadata,
            #Registered,
            current,
          ),
        ],
      );
      current += 1;
    };

    #ok({
      nfts = previews;
      nextCursor = if (end < range.tokenIndexOffset + range.totalSupply) {
        ?Nat.toText(end);
      } else {
        null;
      };
      totalCount = range.totalSupply;
      coverage = #Full;
      note = "Mintlab can browse the full DIP721 collection using the imported token range.";
    });
  };

  func fallbackICRC7Metadata(collectionName : Text, tokenId : Nat) : Types.NFTMetadata {
    {
      name = ?(collectionName # " #" # Nat.toText(tokenId));
      description = null;
      imageUrl = null;
      attributes = [];
    };
  };

  func metadataFromICRC7(
    metadata : ?NFTStandards.ICRC7TokenMetadata,
    collectionName : Text,
    tokenId : Nat,
  ) : Types.NFTMetadata {
    let fallback = fallbackICRC7Metadata(collectionName, tokenId);
    let entries = switch (metadata) {
      case (?value) flattenedICRC7MetadataEntries(value);
      case null return fallback;
    };
    var name : ?Text = fallback.name;
    var description : ?Text = null;
    var imageUrl : ?Text = null;
    var attributes : [(Text, Text)] = [];

    for ((key, value) in entries.values()) {
      let textValue = icrc7ValueToText(value);
      switch (key) {
        case ("name" or "icrc7:name") name := ?textValue;
        case ("title") {
          if (name == null) {
            name := ?textValue;
          };
        };
        case ("description" or "desc" or "icrc7:description") description := ?textValue;
        case ("image" or "image_url" or "imageUrl" or "icrc7:image" or "icrc7:image_url" or "icrc7:logo" or "logo") imageUrl := ?textValue;
        case ("thumbnail" or "thumb" or "media" or "artifact_uri" or "asset" or "url" or "location" or "preview" or "display" or "animation_url" or "metadata" or "metadata_url" or "token_uri" or "uri") {
          if (imageUrl == null) {
            imageUrl := ?textValue;
          };
        };
        case ("attributes") {
          switch (value) {
            case (#Map(attributeEntries)) {
              for ((attributeKey, attributeValue) in attributeEntries.values()) {
                attributes := Array.concat<(Text, Text)>(
                  attributes,
                  [(attributeKey, icrc7ValueToText(attributeValue))],
                );
              };
            };
            case (_) {
              attributes := Array.concat<(Text, Text)>(
                attributes,
                [(key, textValue)],
              );
            };
          };
        };
        case ("icrc7:token_metadata") {};
        case (_) {
          attributes := Array.concat<(Text, Text)>(attributes, [(key, textValue)]);
        };
      };
    };

    {
      name;
      description;
      imageUrl;
      attributes;
    };
  };

  func flattenedICRC7MetadataEntries(
    metadata : NFTStandards.ICRC7TokenMetadata,
  ) : NFTStandards.ICRC7TokenMetadata {
    for ((key, value) in metadata.values()) {
      if (key == "icrc7:token_metadata" or key == "icrc7:metadata" or key == "metadata" or key == "properties") {
        switch (value) {
          case (#Map(entries)) {
            var merged = entries;
            for ((outerKey, outerValue) in metadata.values()) {
              if (outerKey != "icrc7:token_metadata") {
                merged := Array.concat<(Text, NFTStandards.ICRC7Value)>(
                  merged,
                  [(outerKey, outerValue)],
                );
              };
            };
            return merged;
          };
          case (_) {};
        };
      };
    };
    metadata;
  };

  func metadataValueToText(value : NFTStandards.TokenMetadataValue) : Text {
    switch (value) {
      case (#TextContent(text)) text;
      case (#NatContent(number)) Nat.toText(number);
      case (#Nat64Content(number)) Nat64.toText(number);
      case (#IntContent(number)) number.toText();
      case (#Nat8Content(number)) Nat.toText(number.toNat());
      case (#BoolContent(value)) {
        if (value) { "true" } else { "false" };
      };
      case (#BlobContent(blob)) {
        switch (Text.decodeUtf8(blob)) {
          case (?text) text;
          case null debug_show(blob);
        };
      };
      case (#NestedContent(entries)) {
        var rendered : [Text] = [];
        for ((key, entryValue) in entries.values()) {
          rendered := Array.concat<Text>(
            rendered,
            [key # ": " # metadataValueToText(entryValue)],
          );
        };
        "{" # Text.join(rendered.values(), ", ") # "}";
      };
      case (#Principal(principal)) principal.toText();
      case (#PrincipalContent(principal)) principal.toText();
    };
  };

  func icrc7ValueToText(value : NFTStandards.ICRC7Value) : Text {
    switch (value) {
      case (#Text(text)) text;
      case (#Nat(number)) Nat.toText(number);
      case (#Int(number)) number.toText();
      case (#Blob(blob)) {
        switch (Text.decodeUtf8(blob)) {
          case (?text) text;
          case null blobToHex(blob);
        };
      };
      case (#Array(values)) {
        var rendered : [Text] = [];
        for (item in values.values()) {
          rendered := Array.concat<Text>(rendered, [icrc7ValueToText(item)]);
        };
        "[" # Text.join(rendered.values(), ", ") # "]";
      };
      case (#Map(entries)) {
        var rendered : [Text] = [];
        for ((key, entryValue) in entries.values()) {
          rendered := Array.concat<Text>(
            rendered,
            [key # ": " # icrc7ValueToText(entryValue)],
          );
        };
        "{" # Text.join(rendered.values(), ", ") # "}";
      };
    };
  };

  func extTokenIdentifier(canisterId : Principal, tokenIndex : Nat32) : Text {
    let prefix : [Nat8] = [10, 116, 105, 100];
    let canisterBytes = canisterId.toBlob().toArray();
    let indexNat = tokenIndex.toNat();
    let indexBytes : [Nat8] = [
      Nat8.fromNat((indexNat / 16777216) % 256),
      Nat8.fromNat((indexNat / 65536) % 256),
      Nat8.fromNat((indexNat / 256) % 256),
      Nat8.fromNat(indexNat % 256),
    ];
    let combined = Array.concat<Nat8>(Array.concat<Nat8>(prefix, canisterBytes), indexBytes);
    Principal.fromBlob(Blob.fromArray(combined)).toText();
  };

  func dip721ErrorToText(error : NFTStandards.DIP721Error) : Text {
    switch (error) {
      case (#Unauthorized) "Unauthorized";
      case (#InvalidTokenId) "Invalid token ID";
      case (#ZeroAddress) "Cannot transfer to the zero address";
      case (#Other(message)) message;
      case (#ExistedNFT) "NFT already exists";
      case (#SelfTransfer) "Cannot transfer an NFT to the same owner";
      case (#TokenNotFound) "Token not found";
      case (#OwnerNotFound) "Owner not found";
      case (#OperatorNotFound) "Operator not found";
      case (#SelfApprove) "Cannot approve yourself";
      case (#UnauthorizedOwner) "Unauthorized owner";
      case (#UnauthorizedOperator) "Unauthorized operator";
    };
  };

  func extErrorToText(error : NFTStandards.ExtTransferError) : Text {
    switch (error) {
      case (#Unauthorized(_)) "Unauthorized";
      case (#InsufficientBalance) "Insufficient balance";
      case (#Rejected) "Transfer rejected by the collection canister";
      case (#InvalidToken(tokenId)) "Invalid token: " # tokenId;
      case (#CannotNotify(_)) "The recipient could not be notified";
      case (#Other(message)) message;
    };
  };

  func extCommonErrorToText(error : NFTStandards.CommonError) : Text {
    switch (error) {
      case (#InvalidToken(tokenId)) "Invalid token: " # tokenId;
      case (#Other(message)) message;
    };
  };

  func icrc7TransferErrorToText(error : NFTStandards.ICRC7TransferError) : Text {
    switch (error) {
      case (#NonExistingTokenId) "Token does not exist";
      case (#InvalidRecipient) "Invalid recipient";
      case (#Unauthorized) "Unauthorized";
      case (#TooOld) "Transfer request is too old";
      case (#CreatedInFuture({ ledger_time })) {
        "Transfer timestamp is in the future relative to ledger time " # Nat64.toText(ledger_time);
      };
      case (#Duplicate({ duplicate_of })) {
        "Duplicate transfer detected at transaction " # Nat.toText(duplicate_of);
      };
      case (#GenericError({ message })) message;
      case (#GenericBatchError({ message })) message;
    };
  };

  func anonymousPrincipal() : Principal {
    Principal.fromText("2vxsx-fae");
  };

  func blobToHex(blob : Blob) : Text {
    let bytes = blob.toArray();
    var result = "";
    for (byte in bytes.values()) {
      let high = (byte.toNat() / 16) % 16;
      let low = byte.toNat() % 16;
      result #= hexDigit(high) # hexDigit(low);
    };
    result;
  };

  func hexDigit(number : Nat) : Text {
    switch (number) {
      case 0 "0";
      case 1 "1";
      case 2 "2";
      case 3 "3";
      case 4 "4";
      case 5 "5";
      case 6 "6";
      case 7 "7";
      case 8 "8";
      case 9 "9";
      case 10 "a";
      case 11 "b";
      case 12 "c";
      case 13 "d";
      case 14 "e";
      case 15 "f";
      case _ "0";
    };
  };
};
