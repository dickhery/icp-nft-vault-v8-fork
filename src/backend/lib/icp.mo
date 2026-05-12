import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Nat64 "mo:core/Nat64";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import CommonTypes "../types/common";

module {
  // ICP Ledger canister interface (subset we need)
  public type TransferFee = {
    transfer_fee : CommonTypes.Tokens;
  };

  public type Ledger = actor {
    account_balance : query ({ account : CommonTypes.AccountIdentifier }) -> async CommonTypes.Tokens;
    transfer_fee : query ({}) -> async TransferFee;
    transfer : ({
      to : CommonTypes.AccountIdentifier;
      fee : CommonTypes.Tokens;
      memo : Nat64;
      from_subaccount : ?Blob;
      amount : CommonTypes.Tokens;
      created_at_time : ?{ timestamp_nanos : Nat64 };
    }) -> async CommonTypes.TransferResult;
  };

  public let LEDGER_CANISTER_ID : Text = "ryjl3-tyaaa-aaaaa-aaaba-cai";
  public let CYCLES_MINTING_CANISTER_ID : Text = "rkp4c-7iaaa-aaaaa-aaaca-cai";
  public let DEFAULT_FEE : Nat64 = 10_000; // 0.0001 ICP in e8s
  public let CMC_TOP_UP_MEMO : Nat64 = 1_347_768_404; // "TPUP" as a legacy ICP ledger memo
  public let E8S_PER_ICP : Nat = 100_000_000;
  public let CYCLES_PER_XDR : Nat = 1_000_000_000_000;

  public type IcpXdrConversionRate = {
    xdr_permyriad_per_icp : Nat64;
    timestamp_seconds : Nat64;
  };

  public type IcpXdrConversionRateResponse = {
    certificate : Blob;
    data : IcpXdrConversionRate;
    hash_tree : Blob;
  };

  public type NotifyTopUpArg = {
    block_index : Nat64;
    canister_id : Principal;
  };

  public type NotifyError = {
    #Refunded : {
      block_index : ?Nat64;
      reason : Text;
    };
    #Processing;
    #TransactionTooOld : Nat64;
    #InvalidTransaction : Text;
    #Other : {
      error_code : Nat64;
      error_message : Text;
    };
  };

  public type NotifyTopUpResult = {
    #Ok : Nat;
    #Err : NotifyError;
  };

  public type CyclesMintingCanister = actor {
    get_icp_xdr_conversion_rate : shared query () -> async IcpXdrConversionRateResponse;
    notify_top_up : shared NotifyTopUpArg -> async NotifyTopUpResult;
  };

  /// Get the ICP balance for an account identifier
  public func getBalance(ledger : Ledger, account : CommonTypes.AccountIdentifier) : async* Nat64 {
    let result = await ledger.account_balance({ account });
    result.e8s;
  };

  /// Query the current ICP ledger transfer fee, falling back to the documented default.
  public func getTransferFee(ledger : Ledger) : async* Nat64 {
    try {
      let result = await ledger.transfer_fee({});
      result.transfer_fee.e8s;
    } catch (_error) {
      DEFAULT_FEE;
    };
  };

  /// Transfer ICP from a user's subaccount to an external account identifier
  public func transferOut(
    ledger : Ledger,
    fromSubaccount : ?Blob,
    to : CommonTypes.AccountIdentifier,
    amount : Nat64,
    memo : Nat64,
  ) : async* CommonTypes.TransferResult {
    await* transferOutWithFee(ledger, fromSubaccount, to, amount, memo, DEFAULT_FEE);
  };

  /// Transfer ICP with an explicitly queried fee.
  public func transferOutWithFee(
    ledger : Ledger,
    fromSubaccount : ?Blob,
    to : CommonTypes.AccountIdentifier,
    amount : Nat64,
    memo : Nat64,
    feeE8s : Nat64,
  ) : async* CommonTypes.TransferResult {
    await ledger.transfer({
      to;
      fee = { e8s = feeE8s };
      memo;
      from_subaccount = fromSubaccount;
      amount = { e8s = amount };
      created_at_time = ?{
        timestamp_nanos = Nat64.fromNat(Int.abs(Time.now()));
      };
    });
  };

  /// A 32-byte zero subaccount blob (the default account for any principal)
  public func zeroSubaccount() : Blob {
    Blob.fromArray(Array.tabulate<Nat8>(32, func(_) = 0));
  };

  /// Derive a 32-byte subaccount blob from a principal
  public func principalToSubaccount(p : Principal) : Blob {
    // A subaccount is a 32-byte blob. The first byte encodes the principal length,
    // followed by principal bytes, then zero-padded to 32 bytes.
    let principalBytes = p.toBlob().toArray();
    let len = principalBytes.size();
    let sub = Array.tabulate<Nat8>(
      32,
      func(i) {
        if (i == 0) {
          len.toNat8();
        } else if (i <= len) {
          principalBytes[i - 1];
        } else {
          0;
        };
      },
    );
    Blob.fromArray(sub);
  };

  /// Derive a full ICP account identifier from a canister principal + subaccount
  public func accountIdentifier(canister : Principal, subaccount : Blob) : CommonTypes.AccountIdentifier {
    canister.toLedgerAccount(?subaccount);
  };

  /// Account controlled by the CMC where ICP must be sent before notify_top_up.
  public func cmcTopUpAccount(targetCanister : Principal) : CommonTypes.AccountIdentifier {
    accountIdentifier(
      Principal.fromText(CYCLES_MINTING_CANISTER_ID),
      principalToSubaccount(targetCanister),
    );
  };

  /// Convert requested cycles to ICP e8s using the CMC's xdr_permyriad_per_icp rate.
  public func cyclesToE8s(cycles : Nat, xdrPermyriadPerIcp : Nat64) : Nat64 {
    let rate = Nat64.toNat(xdrPermyriadPerIcp);
    if (rate == 0) {
      Runtime.trap("Invalid ICP/XDR conversion rate");
    };
    let denominator = rate * CYCLES_PER_XDR;
    let numerator = cycles * 10_000 * E8S_PER_ICP;
    Nat64.fromNat(ceilDiv(numerator, denominator));
  };

  /// Derive the deterministic 32-byte subaccount used by a collection dividend pool.
  public func collectionDividendSubaccount(collectionId : Nat) : Blob {
    let prefix : [Nat8] = [77, 76, 68, 73, 86]; // "MLDIV"
    Blob.fromArray(
      Array.tabulate<Nat8>(
        32,
        func(i) {
          if (i < prefix.size()) {
            prefix[i];
          } else if (i >= 24) {
            Nat8.fromNat((collectionId / pow256(31 - i)) % 256);
          } else {
            0;
          };
        },
      )
    );
  };

  /// Derive an isolated marketplace auction escrow subaccount.
  public func marketplaceEscrowSubaccount(escrowId : Nat) : Blob {
    let prefix : [Nat8] = [77, 76, 65, 85, 67]; // "MLAUC"
    Blob.fromArray(
      Array.tabulate<Nat8>(
        32,
        func(i) {
          if (i < prefix.size()) {
            prefix[i];
          } else if (i >= 24) {
            Nat8.fromNat((escrowId / pow256(31 - i)) % 256);
          } else {
            0;
          };
        },
      )
    );
  };

  public func transferErrorText(error : CommonTypes.TransferError) : Text {
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

  func pow256(exp : Nat) : Nat {
    var result : Nat = 1;
    var i : Nat = 0;
    while (i < exp) {
      result *= 256;
      i += 1;
    };
    result;
  };

  func ceilDiv(numerator : Nat, denominator : Nat) : Nat {
    if (denominator == 0) {
      Runtime.trap("Cannot divide by zero");
    };
    if (numerator == 0) {
      0;
    } else {
      ((numerator - 1) / denominator) + 1;
    };
  };
};
