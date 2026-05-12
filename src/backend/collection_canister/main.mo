import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import HttpMedia "../lib/http-media";

persistent actor class MintlabCollection(init : {
  owner : Principal;
  parent : Principal;
  name : Text;
  description : Text;
  symbol : Text;
  logo : Text;
}) = this {
  type NFTMetadata = {
    name : ?Text;
    description : ?Text;
    imageUrl : ?Text;
    attributes : [(Text, Text)];
  };

  type MintedToken = {
    tokenId : Nat;
    owner : Principal;
    metadata : NFTMetadata;
    mintedAt : Nat64;
    mintedBy : Principal;
    transferredAt : ?Nat64;
    transferredBy : ?Principal;
  };

  type MintlabNFT = {
    tokenId : Nat;
    metadata : NFTMetadata;
  };

  type ICRC7Subaccount = Blob;

  type ICRC7Account = {
    owner : Principal;
    subaccount : ?ICRC7Subaccount;
  };

  type ICRC7Value = {
    #Blob : Blob;
    #Text : Text;
    #Nat : Nat;
    #Int : Int;
    #Array : [ICRC7Value];
    #Map : [(Text, ICRC7Value)];
  };

  type ICRC7TokenMetadata = [(Text, ICRC7Value)];

  type ICRC7TransferArg = {
    from_subaccount : ?Blob;
    to : ICRC7Account;
    token_id : Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };

  type ICRC7TransferError = {
    #NonExistingTokenId;
    #InvalidRecipient;
    #Unauthorized;
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #GenericError : { error_code : Nat; message : Text };
    #GenericBatchError : { error_code : Nat; message : Text };
  };

  type ICRC7TransferResult = {
    #Ok : Nat;
    #Err : ICRC7TransferError;
  };

  type SupportedStandard = {
    name : Text;
    url : Text;
  };

  type DIP721NftError = {
    #UnauthorizedOperator;
    #SelfTransfer;
    #TokenNotFound;
    #UnauthorizedOwner;
    #SelfApprove;
    #OperatorNotFound;
    #ExistedNFT;
    #OwnerNotFound;
  };

  type DIP721NatResult = {
    #Ok : Nat;
    #Err : DIP721NftError;
  };

  type DIP721BoolResult = {
    #Ok : Bool;
    #Err : DIP721NftError;
  };

  type DIP721PrincipalResult = {
    #Ok : ?Principal;
    #Err : DIP721NftError;
  };

  type DIP721TokenIdsResult = {
    #Ok : [Nat];
    #Err : DIP721NftError;
  };

  type DIP721GenericValue = {
    #Nat64Content : Nat64;
    #BoolContent : Bool;
    #IntContent : Int;
    #NatContent : Nat;
    #BlobContent : Blob;
    #Principal : Principal;
    #TextContent : Text;
    #NestedContent : [(Text, DIP721GenericValue)];
  };

  type DIP721TokenMetadata = {
    transferred_at : ?Nat64;
    transferred_by : ?Principal;
    owner : ?Principal;
    operator : ?Principal;
    approved_at : ?Nat64;
    approved_by : ?Principal;
    properties : [(Text, DIP721GenericValue)];
    is_burned : Bool;
    token_identifier : Nat;
    burned_at : ?Nat64;
    burned_by : ?Principal;
    minted_at : Nat64;
    minted_by : Principal;
  };

  type DIP721TokenMetadataResult = {
    #Ok : DIP721TokenMetadata;
    #Err : DIP721NftError;
  };

  type DIP721CollectionMetadata = {
    logo : ?Text;
    name : ?Text;
    created_at : Nat64;
    upgraded_at : Nat64;
    custodians : [Principal];
    symbol : ?Text;
  };

  type DIP721SupportedInterface = {
    #Burn;
    #Mint;
    #Approval;
  };

  type EXTTokenIdentifier = Text;
  type EXTAccountIdentifier = Text;
  type EXTBalance = Nat;
  type EXTTokenIndex = Nat32;
  type EXTSubAccount = Blob;
  type EXTMemo = Blob;
  type EXTTime = Int;

  type EXTUser = {
    #address : EXTAccountIdentifier;
    #principal : Principal;
  };

  type EXTCommonError = {
    #InvalidToken : EXTTokenIdentifier;
    #Other : Text;
  };

  type EXTBalanceRequest = {
    token : EXTTokenIdentifier;
    user : EXTUser;
  };

  type EXTBalanceResponse = {
    #ok : EXTBalance;
    #err : EXTCommonError;
  };

  type EXTMetadataContainer = {
    #blob : Blob;
    #data : [EXTMetadataValue];
    #json : Text;
  };

  type EXTMetadataValue = (
    Text,
    {
      #blob : Blob;
      #nat : Nat;
      #nat8 : Nat8;
      #text : Text;
    },
  );

  type EXTMetadata = {
    #fungible : {
      decimals : Nat8;
      metadata : ?EXTMetadataContainer;
      name : Text;
      symbol : Text;
    };
    #nonfungible : {
      asset : Text;
      metadata : ?EXTMetadataContainer;
      name : Text;
      thumbnail : Text;
    };
  };

  type EXTMetadataResult = {
    #ok : EXTMetadata;
    #err : EXTCommonError;
  };

  type EXTMetadataLegacy = {
    #fungible : {
      decimals : Nat8;
      metadata : ?Blob;
      name : Text;
      symbol : Text;
    };
    #nonfungible : { metadata : ?Blob };
  };

  type EXTMetadataLegacyResult = {
    #ok : EXTMetadataLegacy;
    #err : EXTCommonError;
  };

  type EXTListing = {
    locked : ?EXTTime;
    price : Nat64;
    seller : Principal;
  };

  type EXTTokensExtResult = {
    #ok : [(EXTTokenIndex, ?EXTListing, ?Blob)];
    #err : EXTCommonError;
  };

  type EXTTokensResult = {
    #ok : [EXTTokenIndex];
    #err : EXTCommonError;
  };

  type EXTTransferRequest = {
    amount : EXTBalance;
    from : EXTUser;
    memo : EXTMemo;
    notify : Bool;
    subaccount : ?EXTSubAccount;
    to : EXTUser;
    token : EXTTokenIdentifier;
  };

  type EXTTransferResponse = {
    #ok : EXTBalance;
    #err : {
      #CannotNotify : EXTAccountIdentifier;
      #InsufficientBalance;
      #InvalidToken : EXTTokenIdentifier;
      #Other : Text;
      #Rejected;
      #Unauthorized : EXTAccountIdentifier;
    };
  };

  type HttpRequest = HttpMedia.HttpRequest;
  type HttpResponse = HttpMedia.HttpResponse;

  let tokens = Map.empty<Nat, MintedToken>();
  var nextTokenId : Nat = 1;
  var nextTransactionId : Nat = 0;
  let collectionOwner : Principal = init.owner;
  let parentCanister : Principal = init.parent;
  var collectionName : Text = init.name;
  var collectionDescription : Text = init.description;
  var collectionSymbol : Text = init.symbol;
  var collectionLogo : Text = init.logo;

  public shared ({ caller }) func mintlab_mint(
    to : Principal,
    metadata : NFTMetadata,
  ) : async { #ok : { tokenId : Nat; transactionId : Nat }; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not Principal.equal(caller, parentCanister) and not Principal.equal(caller, collectionOwner)) {
      return #err("Only the parent app or collection owner can mint");
    };
    if (Principal.isAnonymous(to)) {
      return #err("Cannot mint to the anonymous principal");
    };
    switch (validateMetadata(metadata)) {
      case (?message) return #err(message);
      case null {};
    };
    let transactionId = allocateTransactionId();
    let tokenId = nextTokenId;
    nextTokenId += 1;
    let now = Nat64.fromNat(Int.abs(Time.now()));
    let token : MintedToken = {
      tokenId;
      owner = to;
      metadata;
      mintedAt = now;
      mintedBy = if (Principal.equal(caller, parentCanister)) to else caller;
      transferredAt = null;
      transferredBy = null;
    };
    Map.add(tokens, Nat.compare, tokenId, token);
    #ok({ tokenId; transactionId });
  };

  public shared ({ caller }) func mintlab_transfer_from(
    from : Principal,
    to : Principal,
    tokenId : Nat,
  ) : async { #ok : Nat; #err : Text } {
    if (not Principal.equal(caller, parentCanister)) {
      return #err("Only the parent app can use app-mediated transfers");
    };
    switch (transferToken(tokenId, from, to)) {
      case (#err(message)) #err(message);
      case (#ok(transactionId)) #ok(transactionId);
    };
  };

  public shared ({ caller }) func mintlab_update_collection(
    name : Text,
    description : Text,
    symbol : Text,
    logo : Text,
  ) : async { #ok; #err : Text } {
    if (not Principal.equal(caller, collectionOwner) and not Principal.equal(caller, parentCanister)) {
      return #err("Only the collection owner or parent app can update collection metadata");
    };
    if (name == "" or symbol == "") {
      return #err("Collection name and symbol are required");
    };
    collectionName := name;
    collectionDescription := description;
    collectionSymbol := symbol;
    collectionLogo := logo;
    #ok;
  };

  public query func mintlab_collection_owner() : async Principal {
    collectionOwner;
  };

  public shared ({ caller }) func mintlab_token_ids(
    prev : ?Nat,
    take : ?Nat,
  ) : async [Nat] {
    if (not Principal.equal(caller, parentCanister)) {
      return [];
    };
    paginateTokenIds(tokenIds(), prev, take);
  };

  public shared ({ caller }) func mintlab_nfts_of(
    owner : Principal,
    prev : ?Nat,
    take : ?Nat,
  ) : async [MintlabNFT] {
    if (not Principal.equal(caller, parentCanister)) {
      return [];
    };
    let ids = paginateTokenIds(ownerTokenIdsNat(owner), prev, take);
    var result : [MintlabNFT] = [];
    for (tokenId in ids.values()) {
      switch (Map.get(tokens, Nat.compare, tokenId)) {
        case null {};
        case (?token) {
          result := Array.concat<MintlabNFT>(
            result,
            [
              {
                tokenId = token.tokenId;
                metadata = token.metadata;
              }
            ],
          );
        };
      };
    };
    result;
  };

  public shared ({ caller }) func mintlab_owner_of(
    tokenIds : [Nat],
  ) : async [?ICRC7Account] {
    if (not Principal.equal(caller, parentCanister)) {
      return [];
    };
    var result : [?ICRC7Account] = [];
    for (tokenId in tokenIds.values()) {
      let ownerAccount = switch (Map.get(tokens, Nat.compare, tokenId)) {
        case (?token) ?defaultAccount(token.owner);
        case null null;
      };
      result := Array.concat<?ICRC7Account>(result, [ownerAccount]);
    };
    result;
  };

  public query func icrc7_collection_metadata() : async [(Text, ICRC7Value)] {
    [
      ("icrc7:symbol", #Text(collectionSymbol)),
      ("icrc7:name", #Text(collectionName)),
      ("icrc7:description", #Text(collectionDescription)),
      ("icrc7:logo", #Text(collectionLogo)),
      ("icrc7:total_supply", #Nat(Map.size(tokens))),
      ("icrc7:max_query_batch_size", #Nat(maxQueryBatchSize())),
      ("icrc7:max_update_batch_size", #Nat(maxUpdateBatchSize())),
      ("icrc7:default_take_value", #Nat(defaultTakeValue())),
      ("icrc7:max_take_value", #Nat(maxTakeValue())),
      ("icrc7:max_memo_size", #Nat(maxMemoSize())),
    ];
  };

  public query func icrc7_symbol() : async Text {
    collectionSymbol;
  };

  public query func icrc7_name() : async Text {
    collectionName;
  };

  public query func icrc7_description() : async ?Text {
    if (collectionDescription == "") null else ?collectionDescription;
  };

  public query func icrc7_logo() : async ?Text {
    if (collectionLogo == "") null else ?collectionLogo;
  };

  public query func icrc7_total_supply() : async Nat {
    Map.size(tokens);
  };

  public query func icrc7_supply_cap() : async ?Nat {
    null;
  };

  public query func icrc7_max_query_batch_size() : async ?Nat {
    ?maxQueryBatchSize();
  };

  public query func icrc7_max_update_batch_size() : async ?Nat {
    ?maxUpdateBatchSize();
  };

  public query func icrc7_default_take_value() : async ?Nat {
    ?defaultTakeValue();
  };

  public query func icrc7_max_take_value() : async ?Nat {
    ?maxTakeValue();
  };

  public query func icrc7_max_memo_size() : async ?Nat {
    ?maxMemoSize();
  };

  public query func icrc7_atomic_batch_transfers() : async ?Bool {
    ?false;
  };

  public query func icrc7_tx_window() : async ?Nat {
    null;
  };

  public query func icrc7_permitted_drift() : async ?Nat {
    null;
  };

  public query func icrc7_token_metadata(
    tokenIds : [Nat],
  ) : async [?ICRC7TokenMetadata] {
    var result : [?ICRC7TokenMetadata] = [];
    for (tokenId in tokenIds.values()) {
      result := Array.concat<?ICRC7TokenMetadata>(result, [tokenMetadataPairs(tokenId)]);
    };
    result;
  };

  public query func icrc7_owner_of(
    tokenIds : [Nat],
  ) : async [?ICRC7Account] {
    var result : [?ICRC7Account] = [];
    for (tokenId in tokenIds.values()) {
      let ownerAccount = switch (Map.get(tokens, Nat.compare, tokenId)) {
        case (?token) ?defaultAccount(token.owner);
        case null null;
      };
      result := Array.concat<?ICRC7Account>(result, [ownerAccount]);
    };
    result;
  };

  public query func icrc7_balance_of(
    accounts : [ICRC7Account],
  ) : async [Nat] {
    var balances : [Nat] = [];
    for (account in accounts.values()) {
      let balance = if (isDefaultSubaccount(account.subaccount)) {
        ownerTokenIdsNat(account.owner).size();
      } else {
        0;
      };
      balances := Array.concat<Nat>(balances, [balance]);
    };
    balances;
  };

  public query func icrc7_tokens(prev : ?Nat, take : ?Nat) : async [Nat] {
    paginateTokenIds(tokenIds(), prev, take);
  };

  public query func icrc7_tokens_of(
    account : ICRC7Account,
    prev : ?Nat,
    take : ?Nat,
  ) : async [Nat] {
    if (not isDefaultSubaccount(account.subaccount)) {
      return [];
    };
    paginateTokenIds(ownerTokenIdsNat(account.owner), prev, take);
  };

  public shared ({ caller }) func icrc7_transfer(
    args : [ICRC7TransferArg]
  ) : async [?ICRC7TransferResult] {
    var results : [?ICRC7TransferResult] = [];
    var processed : Nat = 0;
    for (arg in args.values()) {
      if (processed >= maxUpdateBatchSize()) {
        return results;
      };
      let response = if (Principal.isAnonymous(caller)) {
        ?#Err(#Unauthorized);
      } else if (not isDefaultSubaccount(arg.from_subaccount)) {
        ?#Err(#Unauthorized);
      } else if (Principal.equal(arg.to.owner, caller) and isDefaultSubaccount(arg.to.subaccount)) {
        ?#Err(#InvalidRecipient);
      } else {
        switch (transferToken(arg.token_id, caller, arg.to.owner)) {
          case (#err("Token not found")) ?#Err(#NonExistingTokenId);
          case (#err("Unauthorized")) ?#Err(#Unauthorized);
          case (#err(message)) ?#Err(#GenericError({ error_code = 1; message }));
          case (#ok(transactionId)) ?#Ok(transactionId);
        };
      };
      results := Array.concat<?ICRC7TransferResult>(results, [response]);
      processed += 1;
    };
    results;
  };

  public query func icrc10_supported_standards() : async [SupportedStandard] {
    [
      {
        name = "ICRC-7";
        url = "https://github.com/dfinity/ICRC/ICRCs/ICRC-7";
      },
      {
        name = "ICRC-10";
        url = "https://github.com/dfinity/ICRC/ICRCs/ICRC-10";
      },
      {
        name = "DIP721";
        url = "https://github.com/Psychedelic/DIP721";
      },
      {
        name = "EXT";
        url = "https://github.com/Toniq-Labs/ext-v2-token";
      },
    ];
  };

  public query func balance(request : EXTBalanceRequest) : async EXTBalanceResponse {
    extBalance(request);
  };

  public query func ext_balance(request : EXTBalanceRequest) : async EXTBalanceResponse {
    extBalance(request);
  };

  public query func tokens_ext(account : EXTAccountIdentifier) : async EXTTokensExtResult {
    #ok(ownerTokenIndexesForAccount(account));
  };

  public query func ext_metadata(tokenIdentifier : EXTTokenIdentifier) : async EXTMetadataResult {
    switch (extTokenIdFromIdentifier(tokenIdentifier)) {
      case null #err(#InvalidToken(tokenIdentifier));
      case (?tokenId) {
        switch (extMetadataForTokenId(tokenId)) {
          case (?value) #ok(value);
          case null #err(#InvalidToken(tokenIdentifier));
        };
      };
    };
  };

  public query func ext_bearer(tokenIdentifier : EXTTokenIdentifier) : async {
    #ok : EXTAccountIdentifier;
    #err : EXTCommonError;
  } {
    switch (extTokenIdFromIdentifier(tokenIdentifier)) {
      case null #err(#InvalidToken(tokenIdentifier));
      case (?tokenId) {
        switch (Map.get(tokens, Nat.compare, tokenId)) {
          case null #err(#InvalidToken(tokenIdentifier));
          case (?token) #ok(accountIdHex(token.owner));
        };
      };
    };
  };

  public query func supply(tokenIdentifier : EXTTokenIdentifier) : async {
    #ok : EXTBalance;
    #err : EXTCommonError;
  } {
    switch (extTokenIdFromIdentifier(tokenIdentifier)) {
      case null #err(#InvalidToken(tokenIdentifier));
      case (?tokenId) {
        switch (Map.get(tokens, Nat.compare, tokenId)) {
          case null #ok(0);
          case (?_) #ok(1);
        };
      };
    };
  };

  public query func extdata_supply(tokenIdentifier : EXTTokenIdentifier) : async {
    #ok : EXTBalance;
    #err : EXTCommonError;
  } {
    switch (extTokenIdFromIdentifier(tokenIdentifier)) {
      case null #err(#InvalidToken(tokenIdentifier));
      case (?tokenId) {
        switch (Map.get(tokens, Nat.compare, tokenId)) {
          case null #ok(0);
          case (?_) #ok(1);
        };
      };
    };
  };

  public query func getRegistry() : async [(EXTTokenIndex, EXTAccountIdentifier)] {
    var registry : [(EXTTokenIndex, EXTAccountIdentifier)] = [];
    for (token in Map.values(tokens)) {
      switch (extTokenIndexFromTokenId(token.tokenId)) {
        case null {};
        case (?index) {
          registry := Array.concat<(EXTTokenIndex, EXTAccountIdentifier)>(
            registry,
            [(index, accountIdHex(token.owner))],
          );
        };
      };
    };
    registry;
  };

  public query func getTokens() : async [(EXTTokenIndex, EXTMetadataLegacy)] {
    var result : [(EXTTokenIndex, EXTMetadataLegacy)] = [];
    for (token in Map.values(tokens)) {
      switch (extTokenIndexFromTokenId(token.tokenId)) {
        case null {};
        case (?index) {
          result := Array.concat<(EXTTokenIndex, EXTMetadataLegacy)>(
            result,
            [(index, #nonfungible({ metadata = ?Blob.fromArray([]) }))],
          );
        };
      };
    };
    result;
  };

  public query func extensions() : async [Text] {
    ["@ext/common", "@ext/nonfungible"];
  };

  public query func ext_extensions() : async [Text] {
    ["@ext/common", "@ext/nonfungible"];
  };

  public query func http_request(request : HttpRequest) : async HttpResponse {
    httpAssetResponse(request);
  };

  public func http_request_update(request : HttpRequest) : async HttpResponse {
    httpAssetResponse(request);
  };

  public shared ({ caller }) func ext_transfer(request : EXTTransferRequest) : async EXTTransferResponse {
    extTransfer(caller, request);
  };

  public query func balanceOf(owner : Principal) : async DIP721NatResult {
    #Ok(ownerTokenIdsNat(owner).size());
  };

  public query func dip721_balance_of(owner : Principal) : async DIP721NatResult {
    #Ok(ownerTokenIdsNat(owner).size());
  };

  public query func ownerTokenIdentifiers(owner : Principal) : async DIP721TokenIdsResult {
    #Ok(ownerTokenIdsNat(owner));
  };

  public query func dip721_owner_token_identifiers(owner : Principal) : async DIP721TokenIdsResult {
    #Ok(ownerTokenIdsNat(owner));
  };

  public query func ownerOf(tokenId : Nat) : async DIP721PrincipalResult {
    switch (Map.get(tokens, Nat.compare, tokenId)) {
      case null #Err(#TokenNotFound);
      case (?token) #Ok(?token.owner);
    };
  };

  public query func dip721_owner_of(tokenId : Nat) : async DIP721PrincipalResult {
    switch (Map.get(tokens, Nat.compare, tokenId)) {
      case null #Err(#TokenNotFound);
      case (?token) #Ok(?token.owner);
    };
  };

  public query func tokenMetadata(tokenId : Nat) : async DIP721TokenMetadataResult {
    switch (dip721TokenMetadata(tokenId)) {
      case null #Err(#TokenNotFound);
      case (?value) #Ok(value);
    };
  };

  public query func dip721_token_metadata(tokenId : Nat) : async DIP721TokenMetadataResult {
    switch (dip721TokenMetadata(tokenId)) {
      case null #Err(#TokenNotFound);
      case (?value) #Ok(value);
    };
  };

  public shared ({ caller }) func transfer(to : Principal, tokenId : Nat) : async DIP721NatResult {
    transferDip721(caller, to, tokenId);
  };

  public shared ({ caller }) func dip721_transfer(to : Principal, tokenId : Nat) : async DIP721NatResult {
    transferDip721(caller, to, tokenId);
  };

  public query func totalSupply() : async Nat {
    Map.size(tokens);
  };

  public query func dip721_total_supply() : async Nat {
    Map.size(tokens);
  };

  public query func name() : async ?Text {
    ?collectionName;
  };

  public query func dip721_name() : async ?Text {
    ?collectionName;
  };

  public query func symbol() : async ?Text {
    ?collectionSymbol;
  };

  public query func dip721_symbol() : async ?Text {
    ?collectionSymbol;
  };

  public query func logo() : async ?Text {
    if (collectionLogo == "") null else ?collectionLogo;
  };

  public query func dip721_logo() : async ?Text {
    if (collectionLogo == "") null else ?collectionLogo;
  };

  public query func metadata() : async DIP721CollectionMetadata {
    {
      logo = if (collectionLogo == "") null else ?collectionLogo;
      name = ?collectionName;
      created_at = 0;
      upgraded_at = 0;
      custodians = [collectionOwner, parentCanister];
      symbol = ?collectionSymbol;
    };
  };

  public query func dip721_metadata() : async DIP721CollectionMetadata {
    {
      logo = if (collectionLogo == "") null else ?collectionLogo;
      name = ?collectionName;
      created_at = 0;
      upgraded_at = 0;
      custodians = [collectionOwner, parentCanister];
      symbol = ?collectionSymbol;
    };
  };

  public query func supportedInterfaces() : async [DIP721SupportedInterface] {
    [];
  };

  public query func dip721_supported_interfaces() : async [DIP721SupportedInterface] {
    [];
  };

  func transferToken(
    tokenId : Nat,
    from : Principal,
    to : Principal,
  ) : { #ok : Nat; #err : Text } {
    if (Principal.isAnonymous(to)) {
      return #err("Invalid recipient");
    };
    switch (Map.get(tokens, Nat.compare, tokenId)) {
      case null #err("Token not found");
      case (?token) {
        if (not Principal.equal(token.owner, from)) {
          return #err("Unauthorized");
        };
        let transactionId = allocateTransactionId();
        let transferredAt = Nat64.fromNat(Int.abs(Time.now()));
        Map.add(
          tokens,
          Nat.compare,
          tokenId,
          {
            token with
            owner = to;
            transferredAt = ?transferredAt;
            transferredBy = ?from;
          },
        );
        #ok(transactionId);
      };
    };
  };

  func transferDip721(
    caller : Principal,
    to : Principal,
    tokenId : Nat,
  ) : DIP721NatResult {
    if (Principal.isAnonymous(caller)) {
      return #Err(#UnauthorizedOwner);
    };
    switch (transferToken(tokenId, caller, to)) {
      case (#ok(transactionId)) #Ok(transactionId);
      case (#err("Token not found")) #Err(#TokenNotFound);
      case (#err("Unauthorized")) #Err(#UnauthorizedOwner);
      case (#err(_)) #Err(#UnauthorizedOperator);
    };
  };

  func extBalance(request : EXTBalanceRequest) : EXTBalanceResponse {
    switch (extTokenIdFromIdentifier(request.token)) {
      case null #err(#InvalidToken(request.token));
      case (?tokenId) {
        switch (Map.get(tokens, Nat.compare, tokenId)) {
          case null #ok(0);
          case (?token) {
            let ownsToken = switch (request.user) {
              case (#principal(owner)) Principal.equal(owner, token.owner);
              case (#address(account)) account == accountIdHex(token.owner);
            };
            #ok(if (ownsToken) 1 else 0);
          };
        };
      };
    };
  };

  func extTransfer(caller : Principal, request : EXTTransferRequest) : EXTTransferResponse {
    if (Principal.isAnonymous(caller)) {
      return #err(#Unauthorized(""));
    };
    if (request.amount != 1) {
      return #err(#Other("EXT NFT transfers require amount 1"));
    };
    let from = switch (request.from) {
      case (#principal(value)) value;
      case (#address(value)) return #err(#Unauthorized(value));
    };
    if (not Principal.equal(caller, from)) {
      return #err(#Unauthorized(accountIdHex(from)));
    };
    let to = switch (request.to) {
      case (#principal(value)) value;
      case (#address(_)) return #err(#Other("Transfers to account identifiers are not supported"));
    };
    let tokenId = switch (extTokenIdFromIdentifier(request.token)) {
      case null return #err(#InvalidToken(request.token));
      case (?value) value;
    };
    switch (transferToken(tokenId, from, to)) {
      case (#ok(_)) #ok(0);
      case (#err("Token not found")) #err(#InvalidToken(request.token));
      case (#err("Unauthorized")) #err(#Unauthorized(accountIdHex(from)));
      case (#err(message)) #err(#Other(message));
    };
  };

  func ownerTokenIndexesForAccount(
    account : EXTAccountIdentifier
  ) : [(EXTTokenIndex, ?EXTListing, ?Blob)] {
    var result : [(EXTTokenIndex, ?EXTListing, ?Blob)] = [];
    for (token in Map.values(tokens)) {
      if (account == accountIdHex(token.owner)) {
        switch (extTokenIndexFromTokenId(token.tokenId)) {
          case null {};
          case (?index) {
            result := Array.concat<(EXTTokenIndex, ?EXTListing, ?Blob)>(
              result,
              [(index, null, null)],
            );
          };
        };
      };
    };
    result;
  };

  func extTokenIndexFromTokenId(tokenId : Nat) : ?EXTTokenIndex {
    if (tokenId == 0) {
      return null;
    };
    let index = Nat.sub(tokenId, 1);
    if (index > 4_294_967_295) {
      return null;
    };
    ?Nat32.fromNat(index);
  };

  func extTokenIdFromIdentifier(identifier : EXTTokenIdentifier) : ?Nat {
    let bytes = Blob.toArray(Principal.fromText(identifier).toBlob());
    let size = bytes.size();
    if (size < 8) {
      return null;
    };
    if (bytes[0] != 10 or bytes[1] != 116 or bytes[2] != 105 or bytes[3] != 100) {
      return null;
    };
    let collectionBytes = Blob.toArray(Principal.fromActor(this).toBlob());
    if (size != collectionBytes.size() + 8) {
      return null;
    };
    var i = 0;
    while (i < collectionBytes.size()) {
      if (bytes[4 + i] != collectionBytes[i]) {
        return null;
      };
      i += 1;
    };
    let index =
      (((Nat8.toNat(bytes[size - 4]) * 256 + Nat8.toNat(bytes[size - 3])) * 256 + Nat8.toNat(bytes[size - 2])) * 256) +
      Nat8.toNat(bytes[size - 1]);
    ?(index + 1);
  };

  func extMetadataForTokenId(tokenId : Nat) : ?EXTMetadata {
    switch (Map.get(tokens, Nat.compare, tokenId)) {
      case (?token) {
        let imageUrl = tokenAssetUrl(token);
        ?#nonfungible({
          asset = imageUrl;
          metadata = ?#json(extMetadataJson(token));
          name = tokenName(token);
          thumbnail = imageUrl;
        });
      };
      case null {
        if (tokenId == 1) {
          ?#nonfungible({
            asset = collectionLogo;
            metadata = ?#json(
              "{" #
              "\"name\":" # debug_show (collectionName) # "," #
              "\"description\":" # debug_show (collectionDescription) # "," #
              "\"image\":" # debug_show (collectionLogo) # "," #
              "\"image_url\":" # debug_show (collectionLogo) # "," #
              "\"url\":" # debug_show (collectionLogo) # "," #
              "\"thumb\":" # debug_show (collectionLogo) # "," #
              "\"thumbnail\":" # debug_show (collectionLogo) # "," #
              "\"collection\":" # collectionMetadataJson() # "," #
              "\"attributes\":[]" #
              "}"
            );
            name = collectionName;
            thumbnail = collectionLogo;
          });
        } else {
          null;
        };
      };
    };
  };

  func extMetadataJson(token : MintedToken) : Text {
    let imageUrl = tokenAssetUrl(token);
    "{" #
    "\"name\":" # debug_show (tokenName(token)) # "," #
    "\"description\":" # debug_show (tokenDescription(token)) # "," #
    "\"image\":" # debug_show (imageUrl) # "," #
    "\"image_url\":" # debug_show (imageUrl) # "," #
    "\"url\":" # debug_show (imageUrl) # "," #
    "\"thumb\":" # debug_show (imageUrl) # "," #
    "\"thumbnail\":" # debug_show (imageUrl) # "," #
    "\"collection\":" # collectionMetadataJson() # "," #
    "\"attributes\":" # extAttributesJson(token.metadata.attributes) #
    "}";
  };

  func collectionMetadataJson() : Text {
    "{" #
    "\"name\":" # debug_show (collectionName) # "," #
    "\"symbol\":" # debug_show (collectionSymbol) # "," #
    "\"description\":" # debug_show (collectionDescription) # "," #
    "\"canister_id\":" # debug_show (Principal.fromActor(this).toText()) #
    "}";
  };

  func tokenOriginalImageUrl(token : MintedToken) : Text {
    switch (token.metadata.imageUrl) {
      case (?value) value;
      case null collectionLogo;
    };
  };

  func tokenAssetUrl(token : MintedToken) : Text {
    switch (HttpMedia.tokenAssetUrl(Principal.fromActor(this), token.tokenId)) {
      case (?value) value;
      case null tokenOriginalImageUrl(token);
    };
  };

  func httpAssetResponse(request : HttpRequest) : HttpResponse {
    switch (HttpMedia.tokenIdFromUrl(request.url, Principal.fromActor(this))) {
      case null HttpMedia.notFoundResponse();
      case (?tokenId) {
        switch (Map.get(tokens, Nat.compare, tokenId)) {
          case (?token) HttpMedia.imageResponse(tokenOriginalImageUrl(token));
          case null HttpMedia.notFoundResponse();
        };
      };
    };
  };

  func extAttributesJson(attributes : [(Text, Text)]) : Text {
    var result =
      "[" #
      "{\"trait_type\":\"Collection\",\"value\":" # debug_show (collectionName) # "}," #
      "{\"trait_type\":\"Collection Symbol\",\"value\":" # debug_show (collectionSymbol) # "}," #
      "{\"trait_type\":\"Collection Canister\",\"value\":" # debug_show (Principal.fromActor(this).toText()) # "}";
    for ((key, value) in attributes.values()) {
      if (isManagedCollectionAttribute(key)) {
        continue;
      };
      result #= ",";
      result #= "{\"trait_type\":" # debug_show (key) # ",\"value\":" # debug_show (value) # "}";
    };
    result # "]";
  };

  func tokenName(token : MintedToken) : Text {
    switch (token.metadata.name) {
      case (?value) value;
      case null collectionName # " #" # Nat.toText(token.tokenId);
    };
  };

  func tokenDescription(token : MintedToken) : Text {
    switch (token.metadata.description) {
      case (?value) value;
      case null collectionDescription;
    };
  };

  func accountIdHex(owner : Principal) : Text {
    bytesToHex(owner.toLedgerAccount(null));
  };

  func bytesToHex(bytes : Blob) : Text {
    var result = "";
    for (byte in Blob.toArray(bytes).values()) {
      result #= hexByte(byte);
    };
    result;
  };

  func hexByte(byte : Nat8) : Text {
    let value = Nat8.toNat(byte);
    hexDigit(value / 16) # hexDigit(value % 16);
  };

  func hexDigit(value : Nat) : Text {
    switch (value) {
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
      case _ "f";
    };
  };

  func tokenMetadataPairs(tokenId : Nat) : ?ICRC7TokenMetadata {
    switch (Map.get(tokens, Nat.compare, tokenId)) {
      case null null;
      case (?token) {
        var properties : ICRC7TokenMetadata = [];
        switch (token.metadata.name) {
          case (?value) {
            properties := Array.concat<(Text, ICRC7Value)>(
              properties,
              [
                ("name", #Text(value)),
                ("icrc7:name", #Text(value)),
              ],
            );
          };
          case null {};
        };
        switch (token.metadata.description) {
          case (?value) {
            properties := Array.concat<(Text, ICRC7Value)>(
              properties,
              [
                ("description", #Text(value)),
                ("icrc7:description", #Text(value)),
              ],
            );
          };
          case null {};
        };
        switch (token.metadata.imageUrl) {
          case (?_) {
            let assetUrl = tokenAssetUrl(token);
            properties := Array.concat<(Text, ICRC7Value)>(
              properties,
              [
                ("image", #Text(assetUrl)),
                ("image_url", #Text(assetUrl)),
                ("url", #Text(assetUrl)),
                ("thumb", #Text(assetUrl)),
                ("thumbnail", #Text(assetUrl)),
                ("icrc7:image", #Text(assetUrl)),
                ("icrc7:logo", #Text(assetUrl)),
              ],
            );
          };
          case null {};
        };
        let publicAttrs = publicAttributes(token.metadata.attributes);
        if (publicAttrs.size() > 0) {
          var attributePairs : [(Text, ICRC7Value)] = [];
          for ((key, value) in publicAttrs.values()) {
            attributePairs := Array.concat<(Text, ICRC7Value)>(
              attributePairs,
              [(key, #Text(value))],
            );
          };
          properties := Array.concat<(Text, ICRC7Value)>(
            properties,
            [("attributes", #Map(attributePairs))],
          );
        };
        ?properties;
      };
    };
  };

  func dip721TokenMetadata(tokenId : Nat) : ?DIP721TokenMetadata {
    switch (Map.get(tokens, Nat.compare, tokenId)) {
      case null null;
      case (?token) {
        var properties : [(Text, DIP721GenericValue)] = [];
        switch (token.metadata.name) {
          case (?value) {
            properties := Array.concat<(Text, DIP721GenericValue)>(properties, [("name", #TextContent(value))]);
          };
          case null {};
        };
        switch (token.metadata.description) {
          case (?value) {
            properties := Array.concat<(Text, DIP721GenericValue)>(properties, [("description", #TextContent(value))]);
          };
          case null {};
        };
        switch (token.metadata.imageUrl) {
          case (?_) {
            let assetUrl = tokenAssetUrl(token);
            properties := Array.concat<(Text, DIP721GenericValue)>(
              properties,
              [
                ("image", #TextContent(assetUrl)),
                ("image_url", #TextContent(assetUrl)),
                ("url", #TextContent(assetUrl)),
                ("thumb", #TextContent(assetUrl)),
                ("thumbnail", #TextContent(assetUrl)),
              ],
            );
          };
          case null {};
        };
        for ((key, value) in publicAttributes(token.metadata.attributes).values()) {
          properties := Array.concat<(Text, DIP721GenericValue)>(
            properties,
            [(key, #TextContent(value))],
          );
        };
        ?{
          transferred_at = token.transferredAt;
          transferred_by = token.transferredBy;
          owner = ?token.owner;
          operator = null;
          approved_at = null;
          approved_by = null;
          properties;
          is_burned = false;
          token_identifier = token.tokenId;
          burned_at = null;
          burned_by = null;
          minted_at = token.mintedAt;
          minted_by = token.mintedBy;
        };
      };
    };
  };

  func validateMetadata(metadata : NFTMetadata) : ?Text {
    switch (metadata.imageUrl) {
      case null return ?"Minting requires an uploaded image";
      case (?imageUrl) {
        if (imageUrl == "") {
          return ?"Minting requires an uploaded image";
        };
        if (imageUrl.size() > 1_500_000) {
          return ?"Uploaded image is too large for on-chain storage";
        };
      };
    };
    if (metadata.attributes.size() > 50) {
      return ?"Use 50 or fewer attributes";
    };
    null;
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

  func isManagedCollectionAttribute(key : Text) : Bool {
    key == "mintlab:collection_id" or
    key == "mintlab:collection_name" or
    key == "mintlab:collection_symbol";
  };

  func defaultAccount(owner : Principal) : ICRC7Account {
    {
      owner;
      subaccount = null;
    };
  };

  func isDefaultSubaccount(subaccount : ?Blob) : Bool {
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

  func tokenIds() : [Nat] {
    var ids : [Nat] = [];
    for ((tokenId, _) in Map.entries(tokens)) {
      ids := Array.concat<Nat>(ids, [tokenId]);
    };
    ids;
  };

  func ownerTokenIdsNat(owner : Principal) : [Nat] {
    var ids : [Nat] = [];
    for (token in Map.values(tokens)) {
      if (Principal.equal(token.owner, owner)) {
        ids := Array.concat<Nat>(ids, [token.tokenId]);
      };
    };
    ids;
  };

  func paginateTokenIds(tokenIds : [Nat], prev : ?Nat, take : ?Nat) : [Nat] {
    let limitedTake = normalizedTake(take);
    if (limitedTake == 0) {
      return [];
    };
    var page : [Nat] = [];
    for (tokenId in tokenIds.values()) {
      switch (prev) {
        case (?previous) {
          if (tokenId <= previous) {
            continue;
          };
        };
        case null {};
      };
      if (page.size() >= limitedTake) {
        return page;
      };
      page := Array.concat<Nat>(page, [tokenId]);
    };
    page;
  };

  func normalizedTake(take : ?Nat) : Nat {
    switch (take) {
      case null defaultTakeValue();
      case (?requested) {
        if (requested > maxTakeValue()) {
          maxTakeValue();
        } else {
          requested;
        };
      };
    };
  };

  func allocateTransactionId() : Nat {
    let transactionId = nextTransactionId;
    nextTransactionId += 1;
    transactionId;
  };

  func defaultTakeValue() : Nat {
    100;
  };

  func maxTakeValue() : Nat {
    100;
  };

  func maxQueryBatchSize() : Nat {
    100;
  };

  func maxUpdateBatchSize() : Nat {
    25;
  };

  func maxMemoSize() : Nat {
    256;
  };
};
