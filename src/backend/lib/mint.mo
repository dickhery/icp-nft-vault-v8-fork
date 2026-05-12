import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import NFTStandards "nft-standards";
import Types "../types/mint";
import WalletTypes "../types/wallet";

module {
  public type MintState = {
    tokens : Map.Map<Nat, Types.MintedToken>;
    pendingCollectionCreates : Map.Map<Principal, Bool>;
    var nextTokenId : Nat;
    var nextTransactionId : Nat;
    var config : Types.MintConfig;
    var collectionCanisterWasm : ?Blob;
  };

  public type ModerationState = {
    var config : Types.ModerationConfig;
  };

  public func newState() : MintState {
    {
      tokens = Map.empty<Nat, Types.MintedToken>();
      pendingCollectionCreates = Map.empty<Principal, Bool>();
      var nextTokenId = 1;
      var nextTransactionId = 0;
      var config = {
        collectionId = null;
        payoutAccount = null;
        mintPriceE8s = 0;
        mintEnabled = false;
        collectionCreationPayoutAccount = null;
        collectionCreationPriceE8s = 0;
        collectionCreationEnabled = false;
        mainMintPayoutAccount = null;
        mainMintPriceE8s = 0;
        mainMintEnabled = false;
        collectionCanisterWasmUploaded = false;
        collectionCanisterCycles = 2_000_000_000_000;
      };
      var collectionCanisterWasm = null;
    };
  };

  public func newModerationState() : ModerationState {
    { var config = defaultModerationConfig() };
  };

  public func defaultModerationCategories() : Types.ModerationCategorySettings {
    {
      nudityOrSexual = true;
      graphicViolence = true;
      explicitLanguage = true;
      hateOrHarassment = true;
      hateSymbols = true;
      illegalOrDangerous = true;
      selfHarm = true;
      otherNsfw = true;
    };
  };

  public func defaultModerationUserMessage() : Text {
    "Uploads cannot include nudity or sexual content, graphic violence, explicit language, hate or harassment, hate symbols, illegal or dangerous activity, self-harm content, or other NSFW material.";
  };

  public func defaultModerationConfig() : Types.ModerationConfig {
    {
      enabled = false;
      apiKey = null;
      model = "grok-4.3";
      categories = defaultModerationCategories();
      userMessage = defaultModerationUserMessage();
    };
  };

  public func getConfig(state : MintState) : Types.MintConfig {
    state.config;
  };

  public func getModerationConfig(state : ModerationState) : Types.ModerationConfig {
    state.config;
  };

  public func getPublicModerationConfig(state : ModerationState) : Types.PublicModerationConfig {
    let config = state.config;
    {
      enabled = config.enabled;
      apiKeyConfigured = config.apiKey != null;
      model = config.model;
      categories = config.categories;
      userMessage = config.userMessage;
    };
  };

  public func configureModeration(
    state : ModerationState,
    enabled : Bool,
    apiKey : ?Text,
    clearApiKey : Bool,
    model : Text,
    categories : Types.ModerationCategorySettings,
    userMessage : Text,
  ) {
    let current = state.config;
    let nextApiKey = switch (apiKey) {
      case (?value) ?value;
      case null {
        if (clearApiKey) {
          null;
        } else {
          current.apiKey;
        };
      };
    };
    state.config := {
      enabled;
      apiKey = nextApiKey;
      model = if (model == "") "grok-4.3" else model;
      categories;
      userMessage = if (userMessage == "") defaultModerationUserMessage() else userMessage;
    };
  };

  public func configure(
    state : MintState,
    collectionId : ?Types.CollectionId,
    collectionCreationPayoutAccount : ?Types.AccountIdentifier,
    collectionCreationPriceE8s : Nat64,
    collectionCreationEnabled : Bool,
    mainMintPayoutAccount : ?Types.AccountIdentifier,
    mainMintPriceE8s : Nat64,
    mainMintEnabled : Bool,
    collectionCanisterCycles : Nat,
  ) {
    state.config := {
      collectionId;
      payoutAccount = collectionCreationPayoutAccount;
      mintPriceE8s = collectionCreationPriceE8s;
      mintEnabled = collectionCreationEnabled;
      collectionCreationPayoutAccount;
      collectionCreationPriceE8s;
      collectionCreationEnabled;
      mainMintPayoutAccount;
      mainMintPriceE8s;
      mainMintEnabled;
      collectionCanisterWasmUploaded = state.collectionCanisterWasm != null;
      collectionCanisterCycles;
    };
  };

  public func setCollectionCanisterWasm(state : MintState, wasm : Blob) {
    state.collectionCanisterWasm := ?wasm;
    state.config := {
      state.config with
      collectionCanisterWasmUploaded = true;
    };
  };

  public func getCollectionCanisterWasm(state : MintState) : ?Blob {
    state.collectionCanisterWasm;
  };

  public func acquireCollectionCreate(state : MintState, caller : Principal) : Bool {
    switch (Map.get(state.pendingCollectionCreates, Principal.compare, caller)) {
      case (?_) false;
      case null {
        Map.add(state.pendingCollectionCreates, Principal.compare, caller, true);
        true;
      };
    };
  };

  public func releaseCollectionCreate(state : MintState, caller : Principal) {
    Map.remove(state.pendingCollectionCreates, Principal.compare, caller);
  };

  public func mintToken(
    state : MintState,
    owner : Principal,
    metadata : WalletTypes.NFTMetadata,
  ) : Types.MintedToken {
    let tokenId = state.nextTokenId;
    state.nextTokenId += 1;
    ignore allocateTransactionId(state);
    let mintedAt = Nat64.fromNat(Int.abs(Time.now()));
    let token : Types.MintedToken = {
      tokenId;
      owner;
      metadata;
      mintedAt;
      mintedBy = owner;
      transferredAt = null;
      transferredBy = null;
    };
    Map.add(state.tokens, Nat.compare, tokenId, token);
    token;
  };

  public func getToken(state : MintState, tokenId : Nat) : ?Types.MintedToken {
    Map.get(state.tokens, Nat.compare, tokenId);
  };

  public func attachManagedCollectionMetadata(
    metadata : WalletTypes.NFTMetadata,
    collectionId : Types.CollectionId,
    collectionName : Text,
    collectionSymbol : Text,
  ) : WalletTypes.NFTMetadata {
    {
      metadata with
      attributes = Array.concat<(Text, Text)>(
        publicAttributes(metadata.attributes),
        [
          (managedCollectionIdKey(), Nat.toText(collectionId)),
          (managedCollectionNameKey(), collectionName),
          (managedCollectionSymbolKey(), collectionSymbol),
        ],
      );
    };
  };

  public func publicMetadata(metadata : WalletTypes.NFTMetadata) : WalletTypes.NFTMetadata {
    {
      metadata with
      attributes = publicAttributes(metadata.attributes);
    };
  };

  public func tokenCollectionId(
    token : Types.MintedToken,
    legacyCollectionId : ?Types.CollectionId,
  ) : ?Types.CollectionId {
    switch (managedCollectionIdFromAttributes(token.metadata.attributes)) {
      case (?collectionId) ?collectionId;
      case null legacyCollectionId;
    };
  };

  public func tokenBelongsToCollection(
    token : Types.MintedToken,
    collectionId : Types.CollectionId,
    legacyCollectionId : ?Types.CollectionId,
  ) : Bool {
    switch (tokenCollectionId(token, legacyCollectionId)) {
      case (?resolvedCollectionId) resolvedCollectionId == collectionId;
      case null false;
    };
  };

  public func ownerTokensForCollection(
    state : MintState,
    owner : Principal,
    collectionId : Types.CollectionId,
    legacyCollectionId : ?Types.CollectionId,
  ) : [Types.MintedToken] {
    var tokens : [Types.MintedToken] = [];
    for (token in Map.values(state.tokens)) {
      if (
        Principal.equal(token.owner, owner) and
        tokenBelongsToCollection(token, collectionId, legacyCollectionId)
      ) {
        tokens := Array.concat<Types.MintedToken>(tokens, [token]);
      };
    };
    tokens;
  };

  public func tokensForCollection(
    state : MintState,
    collectionId : Types.CollectionId,
    legacyCollectionId : ?Types.CollectionId,
  ) : [Types.MintedToken] {
    var tokens : [Types.MintedToken] = [];
    for (token in Map.values(state.tokens)) {
      if (tokenBelongsToCollection(token, collectionId, legacyCollectionId)) {
        tokens := Array.concat<Types.MintedToken>(tokens, [token]);
      };
    };
    tokens;
  };

  public func transferToken(
    state : MintState,
    tokenId : Nat,
    from : Principal,
    to : Principal,
  ) : { #ok : Types.MintTransfer; #err : Text } {
    switch (Map.get(state.tokens, Nat.compare, tokenId)) {
      case null #err("Minted token not found");
      case (?token) {
        if (not Principal.equal(token.owner, from)) {
          return #err("You do not own this minted NFT");
        };
        let transferredAt = Nat64.fromNat(Int.abs(Time.now()));
        let updated : Types.MintedToken = {
          token with
          owner = to;
          transferredAt = ?transferredAt;
          transferredBy = ?from;
        };
        Map.add(state.tokens, Nat.compare, tokenId, updated);
        #ok({
          token = updated;
          transactionId = allocateTransactionId(state);
        });
      };
    };
  };

  public func ownerTokenIds(state : MintState, owner : Principal) : [Nat32] {
    var tokenIds : [Nat32] = [];
    for (token in Map.values(state.tokens)) {
      if (Principal.equal(token.owner, owner)) {
        tokenIds := Array.concat<Nat32>(tokenIds, [Nat32.fromNat(token.tokenId)]);
      };
    };
    tokenIds;
  };

  public func ownerTokenIdsNat(state : MintState, owner : Principal) : [Nat] {
    var tokenIds : [Nat] = [];
    for (token in Map.values(state.tokens)) {
      if (Principal.equal(token.owner, owner)) {
        tokenIds := Array.concat<Nat>(tokenIds, [token.tokenId]);
      };
    };
    tokenIds;
  };

  public func allTokens(state : MintState) : [Types.MintedToken] {
    var tokens : [Types.MintedToken] = [];
    for (token in Map.values(state.tokens)) {
      tokens := Array.concat<Types.MintedToken>(tokens, [token]);
    };
    tokens;
  };

  public func totalSupply(state : MintState) : Nat {
    Map.size(state.tokens);
  };

  public func tokenIds(state : MintState) : [Nat] {
    var ids : [Nat] = [];
    for ((tokenId, _) in Map.entries(state.tokens)) {
      ids := Array.concat<Nat>(ids, [tokenId]);
    };
    ids;
  };

  public func tokenMetadataPairs(
    state : MintState,
    tokenId : Nat,
  ) : ?NFTStandards.ICRC7TokenMetadata {
    switch (Map.get(state.tokens, Nat.compare, tokenId)) {
      case null null;
      case (?token) {
        var properties : NFTStandards.ICRC7TokenMetadata = [];
        switch (token.metadata.name) {
          case (?name) {
            properties := Array.concat<(Text, NFTStandards.ICRC7Value)>(
              properties,
              [
                ("name", #Text(name)),
                ("icrc7:name", #Text(name)),
              ],
            );
          };
          case null {};
        };
        switch (token.metadata.description) {
          case (?description) {
            properties := Array.concat<(Text, NFTStandards.ICRC7Value)>(
              properties,
              [
                ("description", #Text(description)),
                ("icrc7:description", #Text(description)),
              ],
            );
          };
          case null {};
        };
        switch (token.metadata.imageUrl) {
          case (?imageUrl) {
            properties := Array.concat<(Text, NFTStandards.ICRC7Value)>(
              properties,
              [
                ("image", #Text(imageUrl)),
                ("image_url", #Text(imageUrl)),
                ("url", #Text(imageUrl)),
                ("icrc7:image", #Text(imageUrl)),
                ("icrc7:logo", #Text(imageUrl)),
              ],
            );
          };
          case null {};
        };
        let publicAttrs = publicAttributes(token.metadata.attributes);
        if (publicAttrs.size() > 0) {
          var attributePairs : [(Text, NFTStandards.ICRC7Value)] = [];
          for ((key, value) in publicAttrs.values()) {
            attributePairs := Array.concat<(Text, NFTStandards.ICRC7Value)>(
              attributePairs,
              [(key, #Text(value))],
            );
          };
          properties := Array.concat<(Text, NFTStandards.ICRC7Value)>(
            properties,
            [("attributes", #Map(attributePairs))],
          );
        };
        ?properties;
      };
    };
  };

  public func tokenMetadataResult(
    state : MintState,
    tokenId : Nat,
  ) : NFTStandards.DIP721MetadataResult {
    switch (Map.get(state.tokens, Nat.compare, tokenId)) {
      case null #Err(#InvalidTokenId);
      case (?token) {
        let properties = tokenMetadataProperties(token);
        #Ok({
          transferred_at = token.transferredAt;
          transferred_by = token.transferredBy;
          owner = ?token.owner;
          operator = null;
          properties;
          is_burned = false;
          token_identifier = token.tokenId;
          burned_at = null;
          burned_by = null;
          approved_at = null;
          approved_by = null;
          minted_at = token.mintedAt;
          minted_by = token.mintedBy;
        });
      };
    };
  };

  func tokenMetadataProperties(
    token : Types.MintedToken,
  ) : [(Text, NFTStandards.TokenMetadataValue)] {
    var properties : [(Text, NFTStandards.TokenMetadataValue)] = [];
    switch (token.metadata.name) {
      case (?name) {
        properties := Array.concat<(Text, NFTStandards.TokenMetadataValue)>(
          properties,
          [("name", #TextContent(name))],
        );
      };
      case null {};
    };
    switch (token.metadata.description) {
      case (?description) {
        properties := Array.concat<(Text, NFTStandards.TokenMetadataValue)>(
          properties,
          [("description", #TextContent(description))],
        );
      };
      case null {};
    };
    switch (token.metadata.imageUrl) {
      case (?imageUrl) {
        properties := Array.concat<(Text, NFTStandards.TokenMetadataValue)>(
          properties,
          [
            ("image", #TextContent(imageUrl)),
            ("image_url", #TextContent(imageUrl)),
            ("url", #TextContent(imageUrl)),
          ],
        );
      };
      case null {};
    };
    for ((key, value) in publicAttributes(token.metadata.attributes).values()) {
      properties := Array.concat<(Text, NFTStandards.TokenMetadataValue)>(
        properties,
        [(key, #TextContent(value))],
      );
    };
    properties;
  };

  func allocateTransactionId(state : MintState) : Nat {
    let transactionId = state.nextTransactionId;
    state.nextTransactionId += 1;
    transactionId;
  };

  func publicAttributes(attributes : [(Text, Text)]) : [(Text, Text)] {
    var filtered : [(Text, Text)] = [];
    for ((key, value) in attributes.values()) {
      if (not isManagedCollectionAttribute(key)) {
        filtered := Array.concat<(Text, Text)>(filtered, [(key, value)]);
      };
    };
    filtered;
  };

  func managedCollectionIdFromAttributes(
    attributes : [(Text, Text)]
  ) : ?Types.CollectionId {
    for ((key, value) in attributes.values()) {
      if (key == managedCollectionIdKey()) {
        return Nat.fromText(value);
      };
    };
    null;
  };

  func isManagedCollectionAttribute(key : Text) : Bool {
    key == managedCollectionIdKey() or
    key == managedCollectionNameKey() or
    key == managedCollectionSymbolKey();
  };

  func managedCollectionIdKey() : Text {
    "mintlab:collection_id";
  };

  func managedCollectionNameKey() : Text {
    "mintlab:collection_name";
  };

  func managedCollectionSymbolKey() : Text {
    "mintlab:collection_symbol";
  };
};
