import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Cycles "mo:core/Cycles";
import Error "mo:core/Error";
import CollectionsLib "../lib/collections";
import HttpMedia "../lib/http-media";
import IcpLib "../lib/icp";
import MintLib "../lib/mint";
import WalletLib "../lib/wallet";
import AuthLib "../lib/auth";
import CommonTypes "../types/common";
import CollectionTypes "../types/collections";
import MintTypes "../types/mint";
import WalletTypes "../types/wallet";
import NFTStandards "../lib/nft-standards";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

mixin (
  mintState : MintLib.MintState,
  moderationState : MintLib.ModerationState,
  collectionsState : CollectionsLib.CollectionsState,
  walletState : WalletLib.WalletState,
  authState : AuthLib.AdminState,
  canisterId : Principal,
) {
  type CanisterSettings = {
    controllers : ?[Principal];
    compute_allocation : ?Nat;
    memory_allocation : ?Nat;
    freezing_threshold : ?Nat;
  };

  type CreateCanisterResult = {
    canister_id : Principal;
  };

  type InstallCodeMode = {
    #install;
    #reinstall;
    #upgrade : ?{
      skip_pre_upgrade : ?Bool;
      wasm_memory_persistence : ?{
        #keep;
        #replace;
      };
    };
  };

  type InstallCodeArgs = {
    mode : InstallCodeMode;
    canister_id : Principal;
    wasm_module : Blob;
    arg : Blob;
    sender_canister_version : ?Nat64;
  };

  type DepositCyclesArgs = {
    canister_id : Principal;
  };

  type HttpHeader = {
    name : Text;
    value : Text;
  };

  type HttpRequestResult = {
    status : Nat;
    body : Blob;
    headers : [HttpHeader];
  };

  type HttpRequestArgs = {
    url : Text;
    method : { #get; #put; #head; #post; #delete };
    max_response_bytes : ?Nat64;
    body : ?Blob;
    transform : ?{
      function : shared query {
        context : Blob;
        response : HttpRequestResult;
      } -> async HttpRequestResult;
      context : Blob;
    };
    headers : [HttpHeader];
    is_replicated : ?Bool;
  };

  type CanisterStatusSettings = {
    controllers : [Principal];
    freezing_threshold : Nat;
  };

  type CanisterStatusResult = {
    cycles : Nat;
    module_hash : ?Blob;
    idle_cycles_burned_per_day : Nat;
    settings : CanisterStatusSettings;
  };

  type CollectionCanisterInitArgs = {
    owner : Principal;
    parent : Principal;
    name : Text;
    description : Text;
    symbol : Text;
    logo : Text;
  };

  type ChildMintResult = {
    #ok : { tokenId : Nat; transactionId : Nat };
    #err : Text;
  };

  type ChildCollectionActor = actor {
    mintlab_mint : (Principal, WalletTypes.NFTMetadata) -> async ChildMintResult;
  };

  type ChildCollectionInfoActor = actor {
    mintlab_collection_owner : () -> async Principal;
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

  type EXTListing = {
    locked : ?EXTTime;
    price : Nat64;
    seller : Principal;
  };

  type EXTTokensExtResult = {
    #ok : [(EXTTokenIndex, ?EXTListing, ?Blob)];
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

  type AssetHttpRequest = HttpMedia.HttpRequest;
  type AssetHttpResponse = HttpMedia.HttpResponse;

  func managementCanister() : actor {
    create_canister : shared ({
      settings : ?CanisterSettings;
      sender_canister_version : ?Nat64;
    }) -> async CreateCanisterResult;
    install_code : shared InstallCodeArgs -> async ();
    deposit_cycles : shared DepositCyclesArgs -> async ();
    canister_status : shared DepositCyclesArgs -> async CanisterStatusResult;
    update_settings : shared ({
      canister_id : Principal;
      settings : CanisterSettings;
      sender_canister_version : ?Nat64;
    }) -> async ();
    http_request : shared HttpRequestArgs -> async HttpRequestResult;
  } {
    actor "aaaaa-aa";
  };

  public query func getMintConfig() : async MintTypes.MintConfig {
    MintLib.getConfig(mintState);
  };

  public query func getModerationConfig() : async MintTypes.PublicModerationConfig {
    MintLib.getPublicModerationConfig(moderationState);
  };

  public shared ({ caller }) func configureModeration(
    enabled : Bool,
    apiKey : ?Text,
    clearApiKey : Bool,
    model : Text,
    categories : MintTypes.ModerationCategorySettings,
    userMessage : Text,
  ) : async MintTypes.PublicModerationConfig {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not AuthLib.isAdmin(authState, caller)) Runtime.trap("Unauthorized: admin only");
    let trimmedModel = Text.trim(model, #char ' ');
    let trimmedMessage = Text.trim(userMessage, #char ' ');
    let normalizedApiKey = switch (apiKey) {
      case (?value) {
        let trimmed = Text.trim(value, #char ' ');
        if (trimmed == "") null else ?trimmed;
      };
      case null null;
    };
    MintLib.configureModeration(
      moderationState,
      enabled,
      normalizedApiKey,
      clearApiKey,
      trimmedModel,
      categories,
      trimmedMessage,
    );
    MintLib.getPublicModerationConfig(moderationState);
  };

  public query func transformModerationResponse(
    args : {
      context : Blob;
      response : HttpRequestResult;
    }
  ) : async HttpRequestResult {
    let normalized = switch (Text.decodeUtf8(args.response.body)) {
      case (?body) {
        if (args.response.status != 200) {
          "ERROR";
        } else if (Text.contains(body, #text "MINTLAB_MODERATION_BLOCK")) {
          "BLOCK";
        } else if (Text.contains(body, #text "MINTLAB_MODERATION_ALLOW")) {
          "ALLOW";
        } else {
          "UNKNOWN";
        };
      };
      case null "ERROR";
    };
    {
      status = 200;
      body = Text.encodeUtf8(normalized);
      headers = [];
    };
  };

  public func quoteCollectionCreationCost(
    collectionCanisterCycles : Nat,
    collectionCreationPriceE8s : Nat64,
  ) : async MintTypes.CollectionCreationQuote {
    await collectionCreationQuoteFor(
      normalizedCollectionCanisterCycles(collectionCanisterCycles),
      collectionCreationPriceE8s,
    );
  };

  public shared ({ caller }) func getMyCreatedCollections() : async [CollectionTypes.Collection] {
    if (Principal.isAnonymous(caller)) {
      return [];
    };
    var collections : [CollectionTypes.Collection] = [];
    for (collectionId in (await manageableMintedCollectionIds(caller)).values()) {
      switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
        case (?collection) {
          if (collection.kind == #Minted) {
            collections := Array.concat<CollectionTypes.Collection>(collections, [collection]);
          };
        };
        case null {};
      };
    };
    collections;
  };

  public shared ({ caller }) func getMyCollectionCanisterStatuses() : async [MintTypes.CollectionCanisterStatus] {
    if (Principal.isAnonymous(caller)) {
      return [];
    };
    var statuses : [MintTypes.CollectionCanisterStatus] = [];
    for (collectionId in (await manageableMintedCollectionIds(caller)).values()) {
      switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
        case (?collection) {
          if (collection.kind == #Minted and not Principal.equal(collection.canisterId, canisterId)) {
            switch (await collectionCanisterStatus(collection.canisterId)) {
              case (?status) {
                statuses := Array.concat<MintTypes.CollectionCanisterStatus>(
                  statuses,
                  [collectionCanisterStatusRecord(collection.id, collection.canisterId, status)],
                );
              };
              case null {};
            };
          };
        };
        case null {};
      };
    };
    statuses;
  };

  public shared ({ caller }) func getCollectionCanisterControllers(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : MintTypes.CollectionCanisterControllers; #err : Text } {
    switch (await currentCollectionControllers(caller, collectionId)) {
      case (#err(message)) #err(message);
      case (#ok(info)) {
        #ok(collectionCanisterControllersRecord(info.collection.id, info.collection.canisterId, info.controllers));
      };
    };
  };

  public shared ({ caller }) func addCollectionCanisterController(
    collectionId : CollectionTypes.CollectionId,
    controller : Principal,
  ) : async { #ok : MintTypes.CollectionCanisterControllers; #err : Text } {
    if (Principal.isAnonymous(controller)) {
      return #err("Controller principal cannot be anonymous");
    };
    switch (await currentCollectionControllers(caller, collectionId)) {
      case (#err(message)) #err(message);
      case (#ok(info)) {
        let nextControllers = appendController(info.controllers, controller);
        if (nextControllers.size() == info.controllers.size()) {
          return #ok(collectionCanisterControllersRecord(info.collection.id, info.collection.canisterId, info.controllers));
        };
        try {
          await updateCollectionCanisterControllers(info.collection.canisterId, nextControllers);
          #ok(collectionCanisterControllersRecord(info.collection.id, info.collection.canisterId, nextControllers));
        } catch (error) {
          #err("Could not add controller: " # Error.message(error));
        };
      };
    };
  };

  public shared ({ caller }) func removeCollectionCanisterController(
    collectionId : CollectionTypes.CollectionId,
    controller : Principal,
  ) : async { #ok : MintTypes.CollectionCanisterControllers; #err : Text } {
    switch (await currentCollectionControllers(caller, collectionId)) {
      case (#err(message)) #err(message);
      case (#ok(info)) {
        if (not principalArrayContains(info.controllers, controller)) {
          return #err("That principal is not a controller of this collection canister");
        };
        if (info.controllers.size() <= 1) {
          return #err("Cannot remove the final controller from a collection canister");
        };
        let nextControllers = removeController(info.controllers, controller);
        if (nextControllers.size() == 0) {
          return #err("Cannot remove the final controller from a collection canister");
        };
        try {
          await updateCollectionCanisterControllers(info.collection.canisterId, nextControllers);
          #ok(collectionCanisterControllersRecord(info.collection.id, info.collection.canisterId, nextControllers));
        } catch (error) {
          #err("Could not remove controller: " # Error.message(error));
        };
      };
    };
  };

  public func quoteCollectionCycleTopUp(
    cyclesToTopUp : Nat
  ) : async MintTypes.CollectionCycleTopUpQuote {
    await collectionCycleTopUpQuoteFor(normalizedCollectionTopUpCycles(cyclesToTopUp));
  };

  public func quoteAppCanisterCycleTopUp(
    cyclesToTopUp : Nat
  ) : async MintTypes.CollectionCycleTopUpQuote {
    await collectionCycleTopUpQuoteFor(normalizedCollectionTopUpCycles(cyclesToTopUp));
  };

  public shared ({ caller }) func topUpAppCanisterCycles(
    cyclesToTopUp : Nat,
  ) : async { #ok : MintTypes.AppCycleTopUpReceipt; #err : Text } {
    await topUpCanisterCyclesFor(caller, canisterId, cyclesToTopUp);
  };

  public shared ({ caller }) func topUpCanisterCycles(
    targetCanister : Principal,
    cyclesToTopUp : Nat,
  ) : async { #ok : MintTypes.AppCycleTopUpReceipt; #err : Text } {
    if (Principal.isAnonymous(targetCanister)) {
      return #err("Choose a valid canister to top up");
    };
    await topUpCanisterCyclesFor(caller, targetCanister, cyclesToTopUp);
  };

  func topUpCanisterCyclesFor(
    caller : Principal,
    targetCanister : Principal,
    cyclesToTopUp : Nat,
  ) : async { #ok : MintTypes.AppCycleTopUpReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to top up a canister");
    };
    let normalizedCycles = normalizedCollectionTopUpCycles(cyclesToTopUp);
    let quote = try {
      await collectionCycleTopUpQuoteFor(normalizedCycles);
    } catch (error) {
      return #err("Could not fetch the ICP-to-cycles conversion rate: " # Error.message(error));
    };

    try {
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      let userSubaccount = IcpLib.principalToSubaccount(caller);
      let userAccount = IcpLib.accountIdentifier(canisterId, userSubaccount);
      let userBalance = await* IcpLib.getBalance(ledger, userAccount);
      if (userBalance < quote.totalUserDebitE8s) {
        return #err(
          "Insufficient ICP in your in-app account. Required: " #
          Nat64.toText(quote.totalUserDebitE8s) #
          " e8s including ledger fee. Current balance: " #
          Nat64.toText(userBalance) #
          " e8s"
        );
      };

      let paymentResult = await* IcpLib.transferOut(
        ledger,
        ?userSubaccount,
        IcpLib.cmcTopUpAccount(targetCanister),
        quote.cycleCostE8s,
        IcpLib.CMC_TOP_UP_MEMO,
      );
      let paymentBlock = switch (paymentResult) {
        case (#Err(error)) {
          return #err("Canister cycles payment failed: " # transferErrorText(error));
        };
        case (#Ok(value)) value;
      };

      let cmc = actor (IcpLib.CYCLES_MINTING_CANISTER_ID) : IcpLib.CyclesMintingCanister;
      let topUpResult = await notifyTopUpWithRetries(cmc, paymentBlock, targetCanister);
      let cyclesMinted = switch (topUpResult) {
        case (#Err(error)) {
          return #err(
            "Canister cycles conversion failed for ICP block " #
            Nat64.toText(paymentBlock) #
            ": " #
            notifyErrorText(error)
          );
        };
        case (#Ok(value)) value;
      };
      let cycleBalance = if (Principal.equal(targetCanister, canisterId)) {
        ?Cycles.balance();
      } else {
        switch (await collectionCanisterStatus(targetCanister)) {
          case (?status) ?status.cycles;
          case null null;
        };
      };
      #ok({
        canisterId = targetCanister;
        cyclesRequested = normalizedCycles;
        cyclesMinted;
        cycleCostE8s = quote.cycleCostE8s;
        totalUserDebitE8s = quote.totalUserDebitE8s;
        paymentBlock;
        cycleBalance;
      });
    } catch (error) {
      #err("Canister top-up failed: " # Error.message(error));
    };
  };

  public query func getCollectionCreator(
    collectionId : CollectionTypes.CollectionId
  ) : async ?Principal {
    WalletLib.getManagedCollectionOwner(walletState, collectionId);
  };

  public shared ({ caller }) func configureMinting(
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
    collectionCreationPayoutAccount : ?MintTypes.AccountIdentifier,
    collectionCreationPriceE8s : Nat64,
    collectionCreationEnabled : Bool,
    mainMintPayoutAccount : ?MintTypes.AccountIdentifier,
    mainMintPriceE8s : Nat64,
    mainMintEnabled : Bool,
    mainMintDividendsEnabled : Bool,
    collectionCanisterCycles : Nat,
  ) : async CollectionTypes.Collection {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not AuthLib.isAdmin(authState, caller)) Runtime.trap("Unauthorized: admin only");
    validateCollectionProfile(name, description, symbol, imageUrl);
    let collection = switch (MintLib.getConfig(mintState).collectionId) {
      case (?collectionId) {
        switch (
          CollectionsLib.updateCollection(
            collectionsState,
            collectionId,
            name,
            description,
            canisterId,
            #ICRC7,
            imageUrl,
            symbol,
            null,
            if (mainMintDividendsEnabled) ?{ enabled = true } else null,
          )
        ) {
          case (?updated) updated;
          case null {
            CollectionsLib.addCollection(
              collectionsState,
              name,
              description,
              canisterId,
              #ICRC7,
              imageUrl,
              symbol,
              #Minted,
              null,
              if (mainMintDividendsEnabled) ?{ enabled = true } else null,
            );
          };
        };
      };
      case null {
        CollectionsLib.addCollection(
          collectionsState,
          name,
          description,
          canisterId,
          #ICRC7,
          imageUrl,
          symbol,
          #Minted,
          null,
          if (mainMintDividendsEnabled) ?{ enabled = true } else null,
        );
      };
    };
    MintLib.configure(
      mintState,
      ?collection.id,
      collectionCreationPayoutAccount,
      collectionCreationPriceE8s,
      collectionCreationEnabled,
      mainMintPayoutAccount,
      mainMintPriceE8s,
      mainMintEnabled,
      normalizedCollectionCanisterCycles(collectionCanisterCycles),
    );
    collection;
  };

  public shared ({ caller }) func setCollectionCanisterWasm(
    wasm : Blob
  ) : async () {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not AuthLib.isAdmin(authState, caller)) Runtime.trap("Unauthorized: admin only");
    if (wasm.size() == 0) Runtime.trap("Collection canister WASM is required");
    if (wasm.size() > 1_900_000) {
      Runtime.trap("Collection canister WASM must be under 1.9 MB for a single install call");
    };
    MintLib.setCollectionCanisterWasm(mintState, wasm);
  };

  public shared ({ caller }) func createUserCollection(
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
    dividendsEnabled : Bool,
  ) : async { #ok : MintTypes.CollectionCreationReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to create a collection");
    };
    switch (validateCollectionProfileResult(name, description, symbol, imageUrl)) {
      case (?message) return #err(message);
      case null {};
    };
    let config = MintLib.getConfig(mintState);
    if (not config.collectionCreationEnabled) {
      return #err("Collection creation is currently disabled");
    };
    let canisterCycles = normalizedCollectionCanisterCycles(config.collectionCanisterCycles);
    if (not config.collectionCanisterWasmUploaded) {
      return #err("The admin has not uploaded the collection canister WASM yet");
    };
    let wasm = switch (MintLib.getCollectionCanisterWasm(mintState)) {
      case null return #err("The collection canister WASM is missing");
      case (?value) value;
    };
    switch (await maybeModerateCollection(name, description, symbol, imageUrl)) {
      case (?message) return #err(message);
      case null {};
    };
    let quote = try {
      await collectionCreationQuoteFor(canisterCycles, config.collectionCreationPriceE8s);
    } catch (error) {
      return #err("Could not fetch the ICP-to-cycles conversion rate: " # Error.message(error));
    };
    if (config.collectionCreationPriceE8s < quote.minimumCreationPriceE8s) {
      return #err(
        "The collection creation fee is below the current cycles cost. Ask the admin to set it to at least " #
        Nat64.toText(quote.minimumCreationPriceE8s) #
        " e8s"
      );
    };
    let payoutAccount = if (quote.adminPayoutE8s > 0) {
      switch (config.collectionCreationPayoutAccount) {
        case null return #err("The collection creation payout account has not been configured");
        case (?value) {
          if (value.size() != 32) {
            return #err("The collection creation payout account must be a 32-byte ICP account identifier");
          };
          value;
        };
      };
    } else {
      Blob.fromArray([]);
    };
    if (not MintLib.acquireCollectionCreate(mintState, caller)) {
      return #err("A collection is already being created for your account");
    };

    try {
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      let userSubaccount = IcpLib.principalToSubaccount(caller);
      let userAccount = IcpLib.accountIdentifier(canisterId, userSubaccount);
      let userBalance = await* IcpLib.getBalance(ledger, userAccount);
      if (userBalance < quote.totalUserDebitE8s) {
        return #err(
          "Insufficient ICP in your in-app account. Required: " #
          Nat64.toText(quote.totalUserDebitE8s) #
          " e8s including ledger fees. Current balance: " #
          Nat64.toText(userBalance) #
          " e8s"
        );
      };

      let cyclePaymentResult = await* IcpLib.transferOut(
        ledger,
        ?userSubaccount,
        IcpLib.cmcTopUpAccount(canisterId),
        quote.cycleCostE8s,
        IcpLib.CMC_TOP_UP_MEMO,
      );
      let cyclePaymentBlock = switch (cyclePaymentResult) {
        case (#Err(error)) {
          return #err("Cycles payment failed: " # transferErrorText(error));
        };
        case (#Ok(value)) value;
      };

      let cmc = actor (IcpLib.CYCLES_MINTING_CANISTER_ID) : IcpLib.CyclesMintingCanister;
      let topUpResult = await notifyTopUpWithRetries(cmc, cyclePaymentBlock, canisterId);
      switch (topUpResult) {
        case (#Err(error)) {
          return #err(
            "Cycles conversion failed for ICP block " #
            Nat64.toText(cyclePaymentBlock) #
            ": " #
            notifyErrorText(error)
          );
        };
        case (#Ok(_cyclesMinted)) {};
      };

      if (Cycles.balance() <= canisterCycles + minimumFactoryReserveCycles()) {
        return #err(
          "ICP was converted to cycles, but the app canister still does not have enough cycles to create, fund, and install the collection canister"
        );
      };

      let blockIndex = if (quote.adminPayoutE8s > 0) {
        let payoutResult = await* IcpLib.transferOut(
          ledger,
          ?userSubaccount,
          payoutAccount,
          quote.adminPayoutE8s,
          Nat64.fromNat(collectionsState.nextId),
        );
        switch (payoutResult) {
          case (#Err(error)) {
            return #err("Admin payout failed: " # transferErrorText(error));
          };
          case (#Ok(value)) value;
        };
      } else {
        cyclePaymentBlock;
      };

      let childCanisterId = await createEmptyCollectionCanister(
        caller,
        canisterCycles,
      );

      let collection = CollectionsLib.addCollection(
        collectionsState,
        name,
        description,
        childCanisterId,
        #ICRC7,
        imageUrl,
        symbol,
        #Minted,
        null,
        if (dividendsEnabled) ?{ enabled = true } else null,
      );
      WalletLib.setManagedCollectionOwner(walletState, collection.id, caller);
      try {
        await installCollectionCode(
          childCanisterId,
          wasm,
          {
            owner = caller;
            parent = canisterId;
            name;
            description;
            symbol;
            logo = imageUrl;
          },
        );
      } catch (_installError) {
        try {
          await ensureCollectionCanisterInstallCycles(childCanisterId);
          await installCollectionCode(
            childCanisterId,
            wasm,
            {
              owner = caller;
              parent = canisterId;
              name;
              description;
              symbol;
              logo = imageUrl;
            },
          );
        } catch (retryError) {
          return #err(
            "Collection canister was created but install failed. Retry installation from the collection card. " #
            Error.message(retryError)
          );
        };
      };
      #ok({
        collection;
        paymentBlock = blockIndex;
      });
    } catch (error) {
      #err("Collection canister setup failed: " # Error.message(error));
    } finally {
      MintLib.releaseCollectionCreate(mintState, caller);
    };
  };

  public shared ({ caller }) func retryInstallCollectionCanister(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : CollectionTypes.Collection; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to retry collection setup");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      return #err("Only Mintlab collections use this installer");
    };
    let owner = switch (WalletLib.getManagedCollectionOwner(walletState, collectionId)) {
      case null {
        if (AuthLib.isAdmin(authState, caller)) {
          caller;
        } else {
          return #err("This Mintlab collection is not assigned to a creator account");
        };
      };
      case (?owner) {
        if (not Principal.equal(owner, caller) and not AuthLib.isAdmin(authState, caller)) {
          return #err("Only the collection creator or admin can retry installation");
        };
        owner;
      };
    };
    let wasm = switch (MintLib.getCollectionCanisterWasm(mintState)) {
      case null return #err("The collection canister WASM is missing");
      case (?value) value;
    };
    try {
      switch (await collectionCanisterStatus(collection.canisterId)) {
        case (?status) {
          switch (status.module_hash) {
            case (?_) return #ok(collection);
            case null {};
          };
        };
        case null {};
      };
      await ensureCollectionCanisterInstallCycles(collection.canisterId);
      await installCollectionCode(
        collection.canisterId,
        wasm,
        {
          owner;
          parent = canisterId;
          name = collection.name;
          description = collection.description;
          symbol = collection.symbol;
          logo = collection.imageUrl;
        },
      );
      #ok(collection);
    } catch (error) {
      #err("Collection canister install failed: " # Error.message(error));
    };
  };

  public shared ({ caller }) func upgradeCollectionCanister(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : CollectionTypes.Collection; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to update collection setup");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      return #err("Only Mintlab collections use this installer");
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      if (AuthLib.isAdmin(authState, caller)) {
        return #ok(collection);
      };
      return #err("The main app collection is updated when the app canister is deployed");
    };
    let owner = switch (WalletLib.getManagedCollectionOwner(walletState, collectionId)) {
      case null {
        if (AuthLib.isAdmin(authState, caller)) {
          caller;
        } else {
          return #err("This Mintlab collection is not assigned to a creator account");
        };
      };
      case (?value) value;
    };
    if (not Principal.equal(owner, caller) and not AuthLib.isAdmin(authState, caller)) {
      return #err("Only the collection creator or admin can update this collection canister");
    };
    let wasm = switch (MintLib.getCollectionCanisterWasm(mintState)) {
      case null return #err("The collection canister WASM is missing");
      case (?value) value;
    };
    try {
      switch (await collectionCanisterStatus(collection.canisterId)) {
        case (?status) {
          switch (status.module_hash) {
            case null {
              await ensureCollectionCanisterInstallCycles(collection.canisterId);
              await installCollectionCode(
                collection.canisterId,
                wasm,
                {
                  owner;
                  parent = canisterId;
                  name = collection.name;
                  description = collection.description;
                  symbol = collection.symbol;
                  logo = collection.imageUrl;
                },
              );
              return #ok(collection);
            };
            case (?_) {};
          };
        };
        case null return #err("Could not read the collection canister status");
      };
      await ensureCollectionCanisterInstallCycles(collection.canisterId);
      await installCollectionCodeWithMode(
        collection.canisterId,
        wasm,
        {
          owner;
          parent = canisterId;
          name = collection.name;
          description = collection.description;
          symbol = collection.symbol;
          logo = collection.imageUrl;
        },
        enhancedOrthogonalPersistenceUpgradeMode(),
      );
      #ok(collection);
    } catch (error) {
      #err("Collection canister update failed: " # Error.message(error));
    };
  };

  public shared ({ caller }) func topUpCollectionCanisterCycles(
    collectionId : CollectionTypes.CollectionId,
    cyclesToTopUp : Nat,
  ) : async { #ok : MintTypes.CollectionCycleTopUpReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to top up a collection canister");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      return #err("Only Mintlab collection canisters can be topped up through this flow");
    };
    switch (WalletLib.getManagedCollectionOwner(walletState, collectionId)) {
      case null return #err("This Mintlab collection is not assigned to a creator account");
      case (?owner) {
        if (not Principal.equal(owner, caller) and not AuthLib.isAdmin(authState, caller)) {
          return #err("Only the collection creator or admin can top up this collection canister");
        };
      };
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      return #err("The main app canister cannot be topped up with this collection flow");
    };
    let normalizedCycles = normalizedCollectionTopUpCycles(cyclesToTopUp);
    let quote = try {
      await collectionCycleTopUpQuoteFor(normalizedCycles);
    } catch (error) {
      return #err("Could not fetch the ICP-to-cycles conversion rate: " # Error.message(error));
    };

    try {
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      let userSubaccount = IcpLib.principalToSubaccount(caller);
      let userAccount = IcpLib.accountIdentifier(canisterId, userSubaccount);
      let userBalance = await* IcpLib.getBalance(ledger, userAccount);
      if (userBalance < quote.totalUserDebitE8s) {
        return #err(
          "Insufficient ICP in your in-app account. Required: " #
          Nat64.toText(quote.totalUserDebitE8s) #
          " e8s including ledger fee. Current balance: " #
          Nat64.toText(userBalance) #
          " e8s"
        );
      };

      let paymentResult = await* IcpLib.transferOut(
        ledger,
        ?userSubaccount,
        IcpLib.cmcTopUpAccount(collection.canisterId),
        quote.cycleCostE8s,
        IcpLib.CMC_TOP_UP_MEMO,
      );
      let paymentBlock = switch (paymentResult) {
        case (#Err(error)) {
          return #err("Cycles top-up payment failed: " # transferErrorText(error));
        };
        case (#Ok(value)) value;
      };

      let cmc = actor (IcpLib.CYCLES_MINTING_CANISTER_ID) : IcpLib.CyclesMintingCanister;
      let topUpResult = await notifyTopUpWithRetries(cmc, paymentBlock, collection.canisterId);
      let cyclesMinted = switch (topUpResult) {
        case (#Err(error)) {
          return #err(
            "Cycles conversion failed for ICP block " #
            Nat64.toText(paymentBlock) #
            ": " #
            notifyErrorText(error)
          );
        };
        case (#Ok(value)) value;
      };
      let cycleBalance = switch (await collectionCanisterStatus(collection.canisterId)) {
        case (?status) ?status.cycles;
        case null null;
      };
      #ok({
        collectionId;
        canisterId = collection.canisterId;
        cyclesRequested = normalizedCycles;
        cyclesMinted;
        cycleCostE8s = quote.cycleCostE8s;
        totalUserDebitE8s = quote.totalUserDebitE8s;
        paymentBlock;
        cycleBalance;
      });
    } catch (error) {
      #err("Collection canister top-up failed: " # Error.message(error));
    };
  };

  public shared ({ caller }) func mintUserNFT(
    metadata : WalletTypes.NFTMetadata,
  ) : async { #ok : MintTypes.MintReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to mint");
    };
    let config = MintLib.getConfig(mintState);
    if (not config.mainMintEnabled) {
      return #err("Main collection minting is currently disabled");
    };
    let collectionId = switch (config.collectionId) {
      case null return #err("The main Mintlab collection has not been configured yet");
      case (?value) value;
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Minting collection is missing");
      case (?value) value;
    };
    let payoutAccount = if (config.mainMintPriceE8s > 0) {
      switch (config.mainMintPayoutAccount) {
        case null return #err("Main collection mint payout account has not been configured");
        case (?value) value;
      };
    } else {
      Blob.fromArray([]);
    };
    switch (validateMintMetadata(metadata)) {
      case (?message) return #err(message);
      case null {};
    };
    switch (await maybeModerateNFT(metadata)) {
      case (?message) return #err(message);
      case null {};
    };

    let blockIndex = if (config.mainMintPriceE8s > 0) {
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      let userSubaccount = IcpLib.principalToSubaccount(caller);
      let paymentResult = await* IcpLib.transferOut(
        ledger,
        ?userSubaccount,
        payoutAccount,
        config.mainMintPriceE8s,
        Nat64.fromNat(mintState.nextTokenId),
      );
      switch (paymentResult) {
        case (#Err(#InsufficientFunds({ balance }))) {
          return #err(
            "Insufficient ICP in your in-app account. Current balance: " # Nat64.toText(balance.e8s) # " e8s"
          );
        };
        case (#Err(#BadFee({ expected_fee }))) {
          return #err(
            "Ledger rejected the fee. Expected fee: " # Nat64.toText(expected_fee.e8s) # " e8s"
          );
        };
        case (#Err(#TxDuplicate({ duplicate_of }))) {
          return #err("Duplicate payment detected at block " # Nat64.toText(duplicate_of));
        };
        case (#Err(_)) {
          return #err("ICP payment failed");
        };
        case (#Ok(value)) value;
      };
    } else {
      0 : Nat64;
    };

    let token = MintLib.mintToken(
      mintState,
      caller,
      MintLib.attachManagedCollectionMetadata(
        metadata,
        collection.id,
        collection.name,
        collection.symbol,
      ),
    );
    let nft = WalletLib.registerNFT(
      walletState,
      caller,
      collectionId,
      Nat.toText(token.tokenId),
      MintLib.publicMetadata(token.metadata),
      #Minted,
    );
    #ok({
      nft;
      paymentBlock = blockIndex;
    });
  };

  public shared ({ caller }) func mintCollectionNFT(
    collectionId : CollectionTypes.CollectionId,
    metadata : WalletTypes.NFTMetadata,
  ) : async { #ok : WalletTypes.WalletNFT; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to mint");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      return #err("Only Mintlab collections can mint through this flow");
    };
    switch (WalletLib.getManagedCollectionOwner(walletState, collectionId)) {
      case null return #err("This Mintlab collection is not assigned to a creator account");
      case (?owner) {
        if (not Principal.equal(owner, caller)) {
          return #err("You can only mint into collections that you created");
        };
      };
    };
    switch (validateMintMetadata(metadata)) {
      case (?message) return #err(message);
      case null {};
    };
    switch (await maybeModerateNFT(metadata)) {
      case (?message) return #err(message);
      case null {};
    };

    if (Principal.equal(collection.canisterId, canisterId)) {
      let token = MintLib.mintToken(
        mintState,
        caller,
        MintLib.attachManagedCollectionMetadata(
          metadata,
          collection.id,
          collection.name,
          collection.symbol,
        ),
      );
      let nft = WalletLib.registerNFT(
        walletState,
        caller,
        collection.id,
        Nat.toText(token.tokenId),
        MintLib.publicMetadata(token.metadata),
        #Minted,
      );
      return #ok(nft);
    };

    let child : ChildCollectionActor = actor (collection.canisterId.toText());
    let mintResult = try {
      await child.mintlab_mint(caller, metadata);
    } catch (error) {
      return #err("Collection canister mint failed: " # Error.message(error));
    };
    switch (mintResult) {
      case (#err(message)) #err(message);
      case (#ok(receipt)) {
        let nft = WalletLib.registerNFT(
          walletState,
          caller,
          collection.id,
          Nat.toText(receipt.tokenId),
          metadata,
          #Minted,
        );
        #ok(nft);
      };
    };
  };

  public shared ({ caller }) func transferFromDip721(
    from : Principal,
    to : Principal,
    tokenId : Nat,
  ) : async NFTStandards.DIP721NatResult {
    if (not Principal.equal(caller, from) and not Principal.equal(caller, canisterId)) {
      return #Err(#Unauthorized);
    };
    switch (MintLib.transferToken(mintState, tokenId, from, to)) {
      case (#err("Minted token not found")) #Err(#InvalidTokenId);
      case (#err(_)) #Err(#Unauthorized);
      case (#ok(transfer)) {
        syncTransferredManagedNFT(from, to, transfer.token);
        #Ok(tokenId);
      };
    };
  };

  public shared ({ caller }) func transfer(
    to : Principal,
    tokenId : Nat,
  ) : async NFTStandards.DIP721NatResult {
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
    };
    await transferFromDip721(caller, to, tokenId);
  };

  public query func dip721_owner_token_identifiers(
    owner : Principal,
  ) : async NFTStandards.DIP721TokensResult {
    #Ok(MintLib.ownerTokenIdsNat(mintState, owner));
  };

  public query func dip721_token_metadata(
    token_id : Nat,
  ) : async NFTStandards.DIP721MetadataResult {
    MintLib.tokenMetadataResult(mintState, token_id);
  };

  public query func balance(request : EXTBalanceRequest) : async EXTBalanceResponse {
    extBalance(request);
  };

  public query func ext_balance(request : EXTBalanceRequest) : async EXTBalanceResponse {
    extBalance(request);
  };

  public query func tokens_ext(account : EXTAccountIdentifier) : async EXTTokensExtResult {
    #ok(ownerMainTokenIndexesForAccount(account));
  };

  public query func ext_metadata(tokenIdentifier : EXTTokenIdentifier) : async EXTMetadataResult {
    switch (extTokenIdFromIdentifier(tokenIdentifier)) {
      case null #err(#InvalidToken(tokenIdentifier));
      case (?tokenId) {
        switch (extMetadataForMainTokenId(tokenId)) {
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
        switch (mainTokenById(tokenId)) {
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
        switch (mainTokenById(tokenId)) {
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
        switch (mainTokenById(tokenId)) {
          case null #ok(0);
          case (?_) #ok(1);
        };
      };
    };
  };

  public query func getRegistry() : async [(EXTTokenIndex, EXTAccountIdentifier)] {
    var registry : [(EXTTokenIndex, EXTAccountIdentifier)] = [];
    for (token in currentCollectionTokens().values()) {
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
    for (token in currentCollectionTokens().values()) {
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

  public query func http_request(request : AssetHttpRequest) : async AssetHttpResponse {
    httpAssetResponse(request);
  };

  public func http_request_update(request : AssetHttpRequest) : async AssetHttpResponse {
    httpAssetResponse(request);
  };

  public shared ({ caller }) func ext_transfer(request : EXTTransferRequest) : async EXTTransferResponse {
    extTransfer(caller, request);
  };

  public query func icrc7_collection_metadata() : async [(Text, NFTStandards.ICRC7Value)] {
    let collection = currentMintCollection();
    [
      (
        "icrc7:symbol",
        #Text(
          switch (collection) {
            case (?value) value.symbol;
            case null "MINT";
          }
        ),
      ),
      (
        "icrc7:name",
        #Text(
          switch (collection) {
            case (?value) value.name;
            case null "Mintlab Collection";
          }
        ),
      ),
      (
        "icrc7:description",
        #Text(
          switch (collection) {
            case (?value) value.description;
            case null "";
          }
        ),
      ),
      (
        "icrc7:logo",
        #Text(
          switch (collection) {
            case (?value) value.imageUrl;
            case null "";
          }
        ),
      ),
      (
        "icrc7:total_supply",
        #Nat(currentCollectionSupply()),
      ),
      ("icrc7:max_query_batch_size", #Nat(maxQueryBatchSize())),
      ("icrc7:max_update_batch_size", #Nat(maxUpdateBatchSize())),
      ("icrc7:default_take_value", #Nat(defaultTakeValue())),
      ("icrc7:max_take_value", #Nat(maxTakeValue())),
      ("icrc7:max_memo_size", #Nat(maxMemoSize())),
    ];
  };

  public query func icrc7_symbol() : async Text {
    switch (currentMintCollection()) {
      case (?collection) collection.symbol;
      case null "MINT";
    };
  };

  public query func icrc7_name() : async Text {
    switch (currentMintCollection()) {
      case (?collection) collection.name;
      case null "Mintlab Collection";
    };
  };

  public query func icrc7_description() : async ?Text {
    switch (currentMintCollection()) {
      case (?collection) ?collection.description;
      case null null;
    };
  };

  public query func icrc7_logo() : async ?Text {
    switch (currentMintCollection()) {
      case (?collection) {
        if (collection.imageUrl == "") {
          null;
        } else {
          ?collection.imageUrl;
        };
      };
      case null null;
    };
  };

  public query func icrc7_total_supply() : async Nat {
    currentCollectionSupply();
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
    token_ids : [Nat],
  ) : async [?NFTStandards.ICRC7TokenMetadata] {
    var result : [?NFTStandards.ICRC7TokenMetadata] = [];
    for (tokenId in token_ids.values()) {
      let metadata = switch (currentMintCollectionId()) {
        case null null;
        case (?collectionId) {
          switch (MintLib.getToken(mintState, tokenId)) {
            case (?token) {
              if (MintLib.tokenBelongsToCollection(token, collectionId, currentMintCollectionId())) {
                MintLib.tokenMetadataPairs(mintState, tokenId);
              } else {
                null;
              };
            };
            case null null;
          };
        };
      };
      result := Array.concat<?NFTStandards.ICRC7TokenMetadata>(
        result,
        [metadata],
      );
    };
    result;
  };

  public query func icrc7_owner_of(
    token_ids : [Nat],
  ) : async [?NFTStandards.ICRC7Account] {
    var result : [?NFTStandards.ICRC7Account] = [];
    for (tokenId in token_ids.values()) {
      let ownerAccount = switch (MintLib.getToken(mintState, tokenId)) {
        case (?token) {
          switch (currentMintCollectionId()) {
            case (?collectionId) {
              if (MintLib.tokenBelongsToCollection(token, collectionId, currentMintCollectionId())) {
                ?defaultAccount(token.owner);
              } else {
                null;
              };
            };
            case null null;
          };
        };
        case null null;
      };
      result := Array.concat<?NFTStandards.ICRC7Account>(result, [ownerAccount]);
    };
    result;
  };

  public query func icrc7_balance_of(
    accounts : [NFTStandards.ICRC7Account],
  ) : async [Nat] {
    var balances : [Nat] = [];
    for (account in accounts.values()) {
      let balance = if (isDefaultSubaccount(account.subaccount)) {
        switch (currentMintCollectionId()) {
          case null 0;
          case (?collectionId) {
            MintLib.ownerTokensForCollection(
              mintState,
              account.owner,
              collectionId,
              currentMintCollectionId(),
            ).size();
          };
        };
      } else {
        0;
      };
      balances := Array.concat<Nat>(balances, [balance]);
    };
    balances;
  };

  public query func icrc7_tokens(prev : ?Nat, take : ?Nat) : async [Nat] {
    paginateTokenIds(currentCollectionTokenIds(), prev, take);
  };

  public query func icrc7_tokens_of(
    account : NFTStandards.ICRC7Account,
    prev : ?Nat,
    take : ?Nat,
  ) : async [Nat] {
    if (not isDefaultSubaccount(account.subaccount)) {
      return [];
    };
    switch (currentMintCollectionId()) {
      case null [];
      case (?collectionId) {
        let tokens = MintLib.ownerTokensForCollection(
          mintState,
          account.owner,
          collectionId,
          currentMintCollectionId(),
        );
        var tokenIds : [Nat] = [];
        for (token in tokens.values()) {
          tokenIds := Array.concat<Nat>(tokenIds, [token.tokenId]);
        };
        paginateTokenIds(tokenIds, prev, take);
      };
    };
  };

  public shared ({ caller }) func icrc7_transfer(
    args : [NFTStandards.ICRC7TransferArg]
  ) : async [?NFTStandards.ICRC7TransferResult] {
    var results : [?NFTStandards.ICRC7TransferResult] = [];

    for (arg in args.values()) {
      let response = if (Principal.isAnonymous(caller)) {
        ?#Err(#Unauthorized);
      } else if (not isDefaultSubaccount(arg.from_subaccount)) {
        ?#Err(#Unauthorized);
      } else if (Principal.equal(arg.to.owner, caller) and isDefaultSubaccount(arg.to.subaccount)) {
        ?#Err(#InvalidRecipient);
      } else {
        switch (currentMintCollectionId()) {
          case null ?#Err(#NonExistingTokenId);
          case (?collectionId) {
            switch (MintLib.getToken(mintState, arg.token_id)) {
              case null ?#Err(#NonExistingTokenId);
              case (?token) {
                if (not MintLib.tokenBelongsToCollection(token, collectionId, currentMintCollectionId())) {
                  ?#Err(#NonExistingTokenId);
                } else {
                  switch (MintLib.transferToken(mintState, arg.token_id, caller, arg.to.owner)) {
                    case (#err("Minted token not found")) ?#Err(#NonExistingTokenId);
                    case (#err(message)) ?#Err(#GenericError({ error_code = 1; message }));
                    case (#ok(transfer)) {
                      syncTransferredManagedNFT(caller, arg.to.owner, transfer.token);
                      ?#Ok(transfer.transactionId);
                    };
                  };
                };
              };
            };
          };
        };
      };
      results := Array.concat<?NFTStandards.ICRC7TransferResult>(results, [response]);
    };
    results;
  };

  public query func icrc10_supported_standards() : async [NFTStandards.SupportedStandard] {
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

  func manageableMintedCollectionIds(caller : Principal) : async [CollectionTypes.CollectionId] {
    var collectionIds = WalletLib.getManagedCollectionsByOwner(walletState, caller);
    let callerIsAdmin = AuthLib.isAdmin(authState, caller);
    for (collection in CollectionsLib.getCollections(collectionsState).values()) {
      if (collection.kind == #Minted and not containsCollectionId(collectionIds, collection.id)) {
        if (callerIsAdmin) {
          collectionIds := appendCollectionId(collectionIds, collection.id);
        } else if (not Principal.equal(collection.canisterId, canisterId)) {
          switch (await collectionCanisterOwner(collection.canisterId)) {
            case (?owner) {
              if (Principal.equal(owner, caller)) {
                WalletLib.setManagedCollectionOwner(walletState, collection.id, caller);
                collectionIds := appendCollectionId(collectionIds, collection.id);
              };
            };
            case null {};
          };
        };
      };
    };
    collectionIds;
  };

  func collectionCanisterOwner(childCanisterId : Principal) : async ?Principal {
    try {
      let child : ChildCollectionInfoActor = actor (childCanisterId.toText());
      ?(await child.mintlab_collection_owner());
    } catch (_error) {
      null;
    };
  };

  func containsCollectionId(ids : [CollectionTypes.CollectionId], target : CollectionTypes.CollectionId) : Bool {
    for (id in ids.values()) {
      if (id == target) {
        return true;
      };
    };
    false;
  };

  func appendCollectionId(
    ids : [CollectionTypes.CollectionId],
    id : CollectionTypes.CollectionId,
  ) : [CollectionTypes.CollectionId] {
    if (containsCollectionId(ids, id)) {
      ids;
    } else {
      Array.concat<CollectionTypes.CollectionId>(ids, [id]);
    };
  };

  func currentMintCollection() : ?CollectionTypes.Collection {
    switch (MintLib.getConfig(mintState).collectionId) {
      case (?collectionId) CollectionsLib.getCollection(collectionsState, collectionId);
      case null null;
    };
  };

  func currentMintCollectionId() : ?CollectionTypes.CollectionId {
    MintLib.getConfig(mintState).collectionId;
  };

  func currentCollectionSupply() : Nat {
    currentCollectionTokenIds().size();
  };

  func currentCollectionTokenIds() : [Nat] {
    switch (currentMintCollectionId()) {
      case null [];
      case (?collectionId) {
        var ids : [Nat] = [];
        for (
          token in MintLib.tokensForCollection(
            mintState,
            collectionId,
            currentMintCollectionId(),
          ).values()
        ) {
          ids := Array.concat<Nat>(ids, [token.tokenId]);
        };
        ids;
      };
    };
  };

  func currentCollectionTokens() : [MintTypes.MintedToken] {
    switch (currentMintCollectionId()) {
      case null [];
      case (?collectionId) {
        MintLib.tokensForCollection(mintState, collectionId, currentMintCollectionId());
      };
    };
  };

  func mainTokenById(tokenId : Nat) : ?MintTypes.MintedToken {
    switch (currentMintCollectionId()) {
      case null null;
      case (?collectionId) {
        switch (MintLib.getToken(mintState, tokenId)) {
          case (?token) {
            if (MintLib.tokenBelongsToCollection(token, collectionId, currentMintCollectionId())) {
              ?token;
            } else {
              null;
            };
          };
          case null null;
        };
      };
    };
  };

  func extBalance(request : EXTBalanceRequest) : EXTBalanceResponse {
    switch (extTokenIdFromIdentifier(request.token)) {
      case null #err(#InvalidToken(request.token));
      case (?tokenId) {
        switch (mainTokenById(tokenId)) {
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
    switch (mainTokenById(tokenId)) {
      case null return #err(#InvalidToken(request.token));
      case (?_) {};
    };
    switch (MintLib.transferToken(mintState, tokenId, from, to)) {
      case (#ok(transfer)) {
        syncTransferredManagedNFT(from, to, transfer.token);
        #ok(0);
      };
      case (#err("Minted token not found")) #err(#InvalidToken(request.token));
      case (#err("You do not own this minted NFT")) #err(#Unauthorized(accountIdHex(from)));
      case (#err(message)) #err(#Other(message));
    };
  };

  func ownerMainTokenIndexesForAccount(
    account : EXTAccountIdentifier
  ) : [(EXTTokenIndex, ?EXTListing, ?Blob)] {
    var result : [(EXTTokenIndex, ?EXTListing, ?Blob)] = [];
    for (token in currentCollectionTokens().values()) {
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
    let collectionBytes = Blob.toArray(Principal.toBlob(canisterId));
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

  func extMetadataForMainTokenId(tokenId : Nat) : ?EXTMetadata {
    switch (mainTokenById(tokenId)) {
      case (?token) {
        let imageUrl = mainTokenAssetUrl(token);
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
            asset = mainCollectionLogo();
            metadata = ?#json(
              "{" #
              "\"name\":" # debug_show (mainCollectionName()) # "," #
              "\"description\":" # debug_show (mainCollectionDescription()) # "," #
              "\"image\":" # debug_show (mainCollectionLogo()) # "," #
              "\"image_url\":" # debug_show (mainCollectionLogo()) # "," #
              "\"url\":" # debug_show (mainCollectionLogo()) # "," #
              "\"thumb\":" # debug_show (mainCollectionLogo()) # "," #
              "\"thumbnail\":" # debug_show (mainCollectionLogo()) # "," #
              "\"collection\":" # mainCollectionMetadataJson() # "," #
              "\"attributes\":[]" #
              "}"
            );
            name = mainCollectionName();
            thumbnail = mainCollectionLogo();
          });
        } else {
          null;
        };
      };
    };
  };

  func extMetadataJson(token : MintTypes.MintedToken) : Text {
    let imageUrl = mainTokenAssetUrl(token);
    "{" #
    "\"name\":" # debug_show (tokenName(token)) # "," #
    "\"description\":" # debug_show (tokenDescription(token)) # "," #
    "\"image\":" # debug_show (imageUrl) # "," #
    "\"image_url\":" # debug_show (imageUrl) # "," #
    "\"url\":" # debug_show (imageUrl) # "," #
    "\"thumb\":" # debug_show (imageUrl) # "," #
    "\"thumbnail\":" # debug_show (imageUrl) # "," #
    "\"collection\":" # mainCollectionMetadataJson() # "," #
    "\"attributes\":" # extAttributesJson(token.metadata.attributes) #
    "}";
  };

  func mainCollectionMetadataJson() : Text {
    "{" #
    "\"name\":" # debug_show (mainCollectionName()) # "," #
    "\"symbol\":" # debug_show (mainCollectionSymbol()) # "," #
    "\"description\":" # debug_show (mainCollectionDescription()) # "," #
    "\"canister_id\":" # debug_show (canisterId.toText()) #
    "}";
  };

  func mainTokenOriginalImageUrl(token : MintTypes.MintedToken) : Text {
    switch (token.metadata.imageUrl) {
      case (?value) value;
      case null mainCollectionLogo();
    };
  };

  func mainTokenAssetUrl(token : MintTypes.MintedToken) : Text {
    switch (HttpMedia.tokenAssetUrl(canisterId, token.tokenId)) {
      case (?value) value;
      case null mainTokenOriginalImageUrl(token);
    };
  };

  func httpAssetResponse(request : AssetHttpRequest) : AssetHttpResponse {
    switch (HttpMedia.tokenIdFromUrl(request.url, canisterId)) {
      case null HttpMedia.notFoundResponse();
      case (?tokenId) {
        switch (mainTokenById(tokenId)) {
          case (?token) HttpMedia.imageResponse(mainTokenOriginalImageUrl(token));
          case null HttpMedia.notFoundResponse();
        };
      };
    };
  };

  func extAttributesJson(attributes : [(Text, Text)]) : Text {
    var result =
      "[" #
      "{\"trait_type\":\"Collection\",\"value\":" # debug_show (mainCollectionName()) # "}," #
      "{\"trait_type\":\"Collection Symbol\",\"value\":" # debug_show (mainCollectionSymbol()) # "}," #
      "{\"trait_type\":\"Collection Canister\",\"value\":" # debug_show (canisterId.toText()) # "}";
    for ((key, value) in attributes.values()) {
      if (isManagedCollectionAttribute(key)) {
        continue;
      };
      result #= ",";
      result #= "{\"trait_type\":" # debug_show (key) # ",\"value\":" # debug_show (value) # "}";
    };
    result # "]";
  };

  func tokenName(token : MintTypes.MintedToken) : Text {
    switch (token.metadata.name) {
      case (?value) value;
      case null mainCollectionName() # " #" # Nat.toText(token.tokenId);
    };
  };

  func tokenDescription(token : MintTypes.MintedToken) : Text {
    switch (token.metadata.description) {
      case (?value) value;
      case null mainCollectionDescription();
    };
  };

  func mainCollectionName() : Text {
    switch (currentMintCollection()) {
      case (?collection) collection.name;
      case null "Mintlab Collection";
    };
  };

  func mainCollectionDescription() : Text {
    switch (currentMintCollection()) {
      case (?collection) collection.description;
      case null "";
    };
  };

  func mainCollectionSymbol() : Text {
    switch (currentMintCollection()) {
      case (?collection) collection.symbol;
      case null "MINT";
    };
  };

  func mainCollectionLogo() : Text {
    switch (currentMintCollection()) {
      case (?collection) collection.imageUrl;
      case null "";
    };
  };

  func isManagedCollectionAttribute(key : Text) : Bool {
    key == "mintlab:collection_id" or
    key == "mintlab:collection_name" or
    key == "mintlab:collection_symbol";
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

  func syncTransferredManagedNFT(
    from : Principal,
    to : Principal,
    token : MintTypes.MintedToken,
  ) {
    switch (resolvedCollectionId(token)) {
      case null {};
      case (?collectionId) {
        switch (WalletLib.findByCollectionToken(walletState, collectionId, Nat.toText(token.tokenId))) {
          case (?nft) {
            ignore WalletLib.transferManagedNFT(walletState, nft.id, from, to, #Minted);
          };
          case null {};
        };
      };
    };
  };

  func resolvedCollectionId(token : MintTypes.MintedToken) : ?CollectionTypes.CollectionId {
    MintLib.tokenCollectionId(token, MintLib.getConfig(mintState).collectionId);
  };

  func validateMintMetadata(
    metadata : WalletTypes.NFTMetadata
  ) : ?Text {
    switch (metadata.imageUrl) {
      case (?imageUrl) {
        if (imageUrl.size() > 1_500_000) {
          ?"Uploaded image is too large for on-chain storage";
        } else {
          null;
        };
      };
      case null ?"Minting requires an uploaded image";
    };
  };

  func maybeModerateCollection(
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
  ) : async ?Text {
    await moderateUpload(
      "collection",
      name,
      description,
      "Symbol: " # symbol,
      imageUrl,
    );
  };

  func maybeModerateNFT(
    metadata : WalletTypes.NFTMetadata
  ) : async ?Text {
    let title = switch (metadata.name) {
      case (?value) value;
      case null "";
    };
    let description = switch (metadata.description) {
      case (?value) value;
      case null "";
    };
    var attributes = "";
    for ((key, value) in metadata.attributes.values()) {
      attributes #= "\nAttribute " # key # ": " # value;
    };
    let imageUrl = switch (metadata.imageUrl) {
      case (?value) value;
      case null "";
    };
    await moderateUpload("NFT", title, description, attributes, imageUrl);
  };

  func moderateUpload(
    kind : Text,
    title : Text,
    description : Text,
    extraText : Text,
    imageUrl : Text,
  ) : async ?Text {
    let config = MintLib.getModerationConfig(moderationState);
    if (not config.enabled) {
      return null;
    };
    if (not hasActiveModerationRules(config.categories)) {
      return null;
    };
    let apiKey = switch (config.apiKey) {
      case (?value) value;
      case null return null;
    };
    if (not isSupportedModerationImage(imageUrl)) {
      return ?"Moderation currently supports JPG and PNG uploads. Please upload a JPG or PNG image. No ICP was transferred.";
    };

    let prompt = moderationPrompt(kind, title, description, extraText, config);
    let response = try {
      await callXaiModeration(apiKey, config.model, prompt, imageUrl);
    } catch (error) {
      return null;
    };
    if (response.status != 200) {
      return null;
    };
    switch (Text.decodeUtf8(response.body)) {
      case (?"ALLOW") null;
      case (?"BLOCK") ?moderationDeclineReason(config);
      case (_) null;
    };
  };

  func callXaiModeration(
    apiKey : Text,
    model : Text,
    prompt : Text,
    imageUrl : Text,
  ) : async HttpRequestResult {
    let body = Text.encodeUtf8(
      "{" #
      "\"model\":" #
      jsonString(model) #
      "," #
      "\"store\":false," #
      "\"temperature\":0," #
      "\"max_output_tokens\":16," #
      "\"input\":[{\"role\":\"user\",\"content\":[" #
      "{\"type\":\"input_image\",\"image_url\":" #
      jsonString(imageUrl) #
      ",\"detail\":\"low\"}," #
      "{\"type\":\"input_text\",\"text\":" #
      jsonString(prompt) #
      "}" #
      "]}]" #
      "}"
    );
    let request : HttpRequestArgs = {
      url = "https://api.x.ai/v1/responses";
      method = #post;
      max_response_bytes = ?10_000;
      headers = [
        { name = "Host"; value = "api.x.ai" },
        { name = "User-Agent"; value = "mintlab-moderation-canister" },
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer " # apiKey },
      ];
      body = ?body;
      transform = ?{
        function = transformModerationResponse;
        context = Blob.fromArray([]);
      };
      is_replicated = null;
    };
    let ic = managementCanister();
    await (with cycles = httpRequestCost(request)) ic.http_request(request);
  };

  func jsonString(value : Text) : Text {
    let escapedBackslash = Text.replace(value, #text "\\", "\\\\");
    let escapedQuote = Text.replace(escapedBackslash, #text "\"", "\\\"");
    let escapedNewline = Text.replace(escapedQuote, #text "\n", "\\n");
    let escapedCarriageReturn = Text.replace(escapedNewline, #text "\r", "\\r");
    let escapedTab = Text.replace(escapedCarriageReturn, #text "\t", "\\t");
    "\"" # escapedTab # "\"";
  };

  func httpRequestCost(request : HttpRequestArgs) : Nat {
    var requestSize = request.url.size();
    for (header in request.headers.values()) {
      requestSize += header.name.size();
      requestSize += header.value.size();
    };
    switch (request.body) {
      case (?body) requestSize += body.size();
      case null {};
    };
    switch (request.transform) {
      case (?transform) {
        requestSize += transform.context.size();
        requestSize += 256;
      };
      case null {};
    };
    let maxResponseBytes = switch (request.max_response_bytes) {
      case (?value) value;
      case null (2_000_000 : Nat64);
    };
    49_140_000 + (5_200 * requestSize) + (10_400 * Nat64.toNat(maxResponseBytes));
  };

  func moderationPrompt(
    kind : Text,
    title : Text,
    description : Text,
    extraText : Text,
    config : MintTypes.ModerationConfig,
  ) : Text {
    "You are a strict content moderation classifier for an NFT minting app. " #
    "Review the " #
    kind #
    " title, description, extra text, visible image content, visible text, and visible symbols. " #
    "Block the upload only when it violates one or more of these configured blocked categories: " #
    activeModerationCategoryText(config.categories) #
    ". Output exactly one token and no other text: MINTLAB_MODERATION_ALLOW or MINTLAB_MODERATION_BLOCK.\n\n" #
    "Title: " #
    title #
    "\nDescription: " #
    description #
    "\nExtra text: " #
    extraText;
  };

  func moderationDeclineReason(config : MintTypes.ModerationConfig) : Text {
    "Upload declined by moderation. " # config.userMessage;
  };

  func isSupportedModerationImage(imageUrl : Text) : Bool {
    Text.startsWith(imageUrl, #text "data:image/png;base64,") or
    Text.startsWith(imageUrl, #text "data:image/jpeg;base64,") or
    Text.startsWith(imageUrl, #text "data:image/jpg;base64,") or
    Text.startsWith(imageUrl, #text "https://");
  };

  func hasActiveModerationRules(categories : MintTypes.ModerationCategorySettings) : Bool {
    categories.nudityOrSexual or
    categories.graphicViolence or
    categories.explicitLanguage or
    categories.hateOrHarassment or
    categories.hateSymbols or
    categories.illegalOrDangerous or
    categories.selfHarm or
    categories.otherNsfw;
  };

  func activeModerationCategoryText(categories : MintTypes.ModerationCategorySettings) : Text {
    var labels : [Text] = [];
    if (categories.nudityOrSexual) {
      labels := Array.concat<Text>(labels, ["nudity or sexual content"]);
    };
    if (categories.graphicViolence) {
      labels := Array.concat<Text>(labels, ["graphic violence or gore"]);
    };
    if (categories.explicitLanguage) {
      labels := Array.concat<Text>(labels, ["explicit words or profanity"]);
    };
    if (categories.hateOrHarassment) {
      labels := Array.concat<Text>(labels, ["hate, harassment, or slurs"]);
    };
    if (categories.hateSymbols) {
      labels := Array.concat<Text>(labels, ["hate symbols or extremist symbols"]);
    };
    if (categories.illegalOrDangerous) {
      labels := Array.concat<Text>(labels, ["illegal or dangerous activity"]);
    };
    if (categories.selfHarm) {
      labels := Array.concat<Text>(labels, ["self-harm content"]);
    };
    if (categories.otherNsfw) {
      labels := Array.concat<Text>(labels, ["other NSFW content"]);
    };
    if (labels.size() == 0) {
      "none";
    } else {
      Text.join(labels.values(), ", ");
    };
  };

  func validateCollectionProfile(
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
  ) {
    switch (validateCollectionProfileResult(name, description, symbol, imageUrl)) {
      case (?message) Runtime.trap(message);
      case null {};
    };
  };

  func validateCollectionProfileResult(
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
  ) : ?Text {
    if (name == "") {
      return ?"Collection name is required";
    };
    if (symbol == "") {
      return ?"Collection symbol is required";
    };
    if (description == "") {
      return ?"Collection description is required";
    };
    if (imageUrl == "") {
      return ?"Collection image is required";
    };
    if (imageUrl.size() > 1_500_000) {
      return ?"Collection image is too large for on-chain storage";
    };
    null;
  };

  func createEmptyCollectionCanister(
    owner : Principal,
    cyclesToAttach : Nat,
  ) : async Principal {
    let ic = managementCanister();
    let createResult = await (with cycles = cyclesToAttach) ic.create_canister({
      settings = ?{
        controllers = ?[canisterId, owner];
        compute_allocation = null;
        memory_allocation = null;
        freezing_threshold = ?2_592_000;
      };
      sender_canister_version = null;
    });
    createResult.canister_id;
  };

  func installCollectionCode(
    childCanisterId : Principal,
    wasm : Blob,
    initArgs : CollectionCanisterInitArgs,
  ) : async () {
    await installCollectionCodeWithMode(childCanisterId, wasm, initArgs, #install);
  };

  func installCollectionCodeWithMode(
    childCanisterId : Principal,
    wasm : Blob,
    initArgs : CollectionCanisterInitArgs,
    mode : InstallCodeMode,
  ) : async () {
    let ic = managementCanister();
    await ic.install_code({
      mode;
      canister_id = childCanisterId;
      wasm_module = wasm;
      arg = to_candid (initArgs);
      sender_canister_version = null;
    });
  };

  func enhancedOrthogonalPersistenceUpgradeMode() : InstallCodeMode {
    #upgrade(
      ?{
        skip_pre_upgrade = null;
        wasm_memory_persistence = ?(#keep);
      }
    );
  };

  func topUpCollectionCanister(
    childCanisterId : Principal,
    cyclesToAttach : Nat,
  ) : async () {
    if (cyclesToAttach == 0) {
      return;
    };
    if (Cycles.balance() <= cyclesToAttach + minimumFactoryOperatingReserveCycles()) {
      Runtime.trap("The app canister needs more cycles before it can top up and install this collection canister");
    };
    let ic = managementCanister();
    await (with cycles = cyclesToAttach) ic.deposit_cycles({
      canister_id = childCanisterId;
    });
  };

  func collectionCanisterStatus(
    childCanisterId : Principal
  ) : async ?CanisterStatusResult {
    try {
      let ic = managementCanister();
      ?(await ic.canister_status({ canister_id = childCanisterId }));
    } catch (_error) {
      null;
    };
  };

  func currentCollectionControllers(
    caller : Principal,
    collectionId : CollectionTypes.CollectionId,
  ) : async {
    #ok : {
      collection : CollectionTypes.Collection;
      controllers : [Principal];
    };
    #err : Text;
  } {
    let collection = switch (await manageableMintedCollection(caller, collectionId)) {
      case (#err(message)) return #err(message);
      case (#ok(value)) value;
    };
    switch (await collectionCanisterStatus(collection.canisterId)) {
      case (?status) {
        #ok({
          collection;
          controllers = status.settings.controllers;
        });
      };
      case null {
        #err("Could not read this collection canister's controllers. Mintlab may no longer be a controller of the canister.");
      };
    };
  };

  func manageableMintedCollection(
    caller : Principal,
    collectionId : CollectionTypes.CollectionId,
  ) : async { #ok : CollectionTypes.Collection; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to manage collection controllers");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      return #err("Only Mintlab collection canisters have controllers managed through this flow");
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      return #err("The main app collection is controlled by the app deployment, not this collection flow");
    };
    let manageableIds = await manageableMintedCollectionIds(caller);
    if (not containsCollectionId(manageableIds, collectionId)) {
      return #err("Only the collection creator or admin can manage this collection canister");
    };
    #ok(collection);
  };

  func updateCollectionCanisterControllers(
    childCanisterId : Principal,
    controllers : [Principal],
  ) : async () {
    let ic = managementCanister();
    await ic.update_settings({
      canister_id = childCanisterId;
      settings = {
        controllers = ?controllers;
        compute_allocation = null;
        memory_allocation = null;
        freezing_threshold = null;
      };
      sender_canister_version = null;
    });
  };

  func collectionCanisterControllersRecord(
    collectionId : CollectionTypes.CollectionId,
    childCanisterId : Principal,
    controllers : [Principal],
  ) : MintTypes.CollectionCanisterControllers {
    {
      collectionId;
      canisterId = childCanisterId;
      appCanisterId = canisterId;
      controllers;
    };
  };

  func collectionCanisterStatusRecord(
    collectionId : CollectionTypes.CollectionId,
    childCanisterId : Principal,
    status : CanisterStatusResult,
  ) : MintTypes.CollectionCanisterStatus {
    {
      collectionId;
      canisterId = childCanisterId;
      appCanisterId = canisterId;
      controllers = status.settings.controllers;
      cycles = status.cycles;
      moduleInstalled = switch (status.module_hash) {
        case null false;
        case (?_) true;
      };
      freezingThresholdSeconds = status.settings.freezing_threshold;
      idleCyclesBurnedPerDay = status.idle_cycles_burned_per_day;
    };
  };

  func principalArrayContains(values : [Principal], target : Principal) : Bool {
    for (value in values.values()) {
      if (Principal.equal(value, target)) {
        return true;
      };
    };
    false;
  };

  func appendController(values : [Principal], controller : Principal) : [Principal] {
    if (principalArrayContains(values, controller)) {
      values;
    } else {
      Array.concat<Principal>(values, [controller]);
    };
  };

  func removeController(values : [Principal], controller : Principal) : [Principal] {
    Array.filter<Principal>(
      values,
      func(value) {
        not Principal.equal(value, controller);
      },
    );
  };

  func ensureCollectionCanisterInstallCycles(
    childCanisterId : Principal
  ) : async () {
    switch (await collectionCanisterStatus(childCanisterId)) {
      case (?status) {
        let target = minimumInstallReadyCycles();
        if (status.cycles < target) {
          await topUpCollectionCanister(childCanisterId, target - status.cycles);
        };
      };
      case null {
        await topUpCollectionCanister(childCanisterId, installRetryTopUpCycles());
      };
    };
  };

  func normalizedCollectionCanisterCycles(requested : Nat) : Nat {
    let minimum = minimumCollectionCanisterCycles();
    if (requested < minimum) {
      minimum;
    } else {
      requested;
    };
  };

  func normalizedCollectionTopUpCycles(requested : Nat) : Nat {
    let minimum = minimumCollectionTopUpCycles();
    let maximum = maximumCollectionTopUpCycles();
    if (requested < minimum) {
      minimum;
    } else if (requested > maximum) {
      maximum;
    } else {
      requested;
    };
  };

  func minimumFactoryReserveCycles() : Nat {
    500_000_000_000;
  };

  func minimumFactoryOperatingReserveCycles() : Nat {
    100_000_000_000;
  };

  func minimumCollectionCanisterCycles() : Nat {
    2_000_000_000_000;
  };

  func minimumInstallReadyCycles() : Nat {
    1_250_000_000_000;
  };

  func installRetryTopUpCycles() : Nat {
    250_000_000_000;
  };

  func minimumCollectionTopUpCycles() : Nat {
    100_000_000_000;
  };

  func maximumCollectionTopUpCycles() : Nat {
    10_000_000_000_000;
  };

  func collectionCreationQuoteFor(
    canisterCycles : Nat,
    creationPriceE8s : Nat64,
  ) : async MintTypes.CollectionCreationQuote {
    let cmc = actor (IcpLib.CYCLES_MINTING_CANISTER_ID) : IcpLib.CyclesMintingCanister;
    let rate = (await cmc.get_icp_xdr_conversion_rate()).data;
    let factoryReserveCycles = minimumFactoryReserveCycles();
    let totalCyclesToConvert = canisterCycles + factoryReserveCycles;
    let cycleCostE8s = IcpLib.cyclesToE8s(totalCyclesToConvert, rate.xdr_permyriad_per_icp);
    let adminPayoutE8s = if (creationPriceE8s > cycleCostE8s) {
      creationPriceE8s - cycleCostE8s;
    } else {
      0 : Nat64;
    };
    let adminPayoutFeeE8s = if (adminPayoutE8s > 0) {
      IcpLib.DEFAULT_FEE;
    } else {
      0 : Nat64;
    };
    {
      collectionCanisterCycles = canisterCycles;
      factoryReserveCycles;
      totalCyclesToConvert;
      cycleCostE8s;
      minimumCreationPriceE8s = cycleCostE8s;
      collectionCreationPriceE8s = creationPriceE8s;
      adminPayoutE8s;
      ledgerFeeE8s = IcpLib.DEFAULT_FEE;
      cycleTransferFeeE8s = IcpLib.DEFAULT_FEE;
      adminPayoutFeeE8s;
      totalUserDebitE8s = creationPriceE8s + IcpLib.DEFAULT_FEE + adminPayoutFeeE8s;
      xdrPermyriadPerIcp = rate.xdr_permyriad_per_icp;
      rateTimestampSeconds = rate.timestamp_seconds;
    };
  };

  func collectionCycleTopUpQuoteFor(
    cyclesToTopUp : Nat
  ) : async MintTypes.CollectionCycleTopUpQuote {
    let cmc = actor (IcpLib.CYCLES_MINTING_CANISTER_ID) : IcpLib.CyclesMintingCanister;
    let rate = (await cmc.get_icp_xdr_conversion_rate()).data;
    let cycleCostE8s = IcpLib.cyclesToE8s(cyclesToTopUp, rate.xdr_permyriad_per_icp);
    {
      cyclesToTopUp;
      cycleCostE8s;
      ledgerFeeE8s = IcpLib.DEFAULT_FEE;
      totalUserDebitE8s = cycleCostE8s + IcpLib.DEFAULT_FEE;
      xdrPermyriadPerIcp = rate.xdr_permyriad_per_icp;
      rateTimestampSeconds = rate.timestamp_seconds;
    };
  };

  func transferErrorText(error : CommonTypes.TransferError) : Text {
    switch (error) {
      case (#InsufficientFunds({ balance })) {
        "insufficient ICP. Current balance: " # Nat64.toText(balance.e8s) # " e8s";
      };
      case (#BadFee({ expected_fee })) {
        "ledger rejected the fee. Expected fee: " # Nat64.toText(expected_fee.e8s) # " e8s";
      };
      case (#TxDuplicate({ duplicate_of })) {
        "duplicate payment detected at block " # Nat64.toText(duplicate_of);
      };
      case (#TxTooOld(_)) {
        "transaction is too old";
      };
      case (#TxCreatedInFuture) {
        "transaction was created in the future";
      };
    };
  };

  func notifyErrorText(error : IcpLib.NotifyError) : Text {
    switch (error) {
      case (#Refunded({ block_index; reason })) {
        let blockText = switch (block_index) {
          case null "";
          case (?value) " Refund block: " # Nat64.toText(value) # ".";
        };
        "CMC refunded the top-up. " # reason # "." # blockText;
      };
      case (#Processing) {
        "CMC is still processing the top-up. Do not submit another collection creation payment; contact the admin with this block.";
      };
      case (#TransactionTooOld(blockIndex)) {
        "CMC says the top-up transaction is too old at block " # Nat64.toText(blockIndex);
      };
      case (#InvalidTransaction(message)) {
        "CMC rejected the transaction: " # message;
      };
      case (#Other({ error_code; error_message })) {
        "CMC error " # Nat64.toText(error_code) # ": " # error_message;
      };
    };
  };

  func notifyTopUpWithRetries(
    cmc : IcpLib.CyclesMintingCanister,
    blockIndex : Nat64,
    targetCanister : Principal,
  ) : async IcpLib.NotifyTopUpResult {
    var attempts : Nat = 0;
    var lastResult : IcpLib.NotifyTopUpResult = #Err(#Processing);
    while (attempts < 5) {
      let result = await cmc.notify_top_up({
        block_index = blockIndex;
        canister_id = targetCanister;
      });
      switch (result) {
        case (#Err(#Processing)) {
          lastResult := result;
          attempts += 1;
        };
        case (_) return result;
      };
    };
    lastResult;
  };

  func defaultAccount(owner : Principal) : NFTStandards.ICRC7Account {
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
