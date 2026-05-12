import IcpLib "../lib/icp";
import CommonTypes "../types/common";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (canisterId : Principal) {

  /// Query the caller's ICP subaccount balance (on-chain ledger call)
  public shared ({ caller }) func getUserICPBalance() : async Nat64 {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let sub = IcpLib.principalToSubaccount(caller);
    let account = IcpLib.accountIdentifier(canisterId, sub);
    await* IcpLib.getBalance(ledger, account);
  };

  /// Transfer ICP from the caller's subaccount to an external account identifier
  public shared ({ caller }) func transferICPOut(
    to : CommonTypes.AccountIdentifier,
    amount : Nat64,
  ) : async CommonTypes.TransferResult {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (amount <= IcpLib.DEFAULT_FEE) Runtime.trap("Amount must exceed the transfer fee");
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let sub = IcpLib.principalToSubaccount(caller);
    await* IcpLib.transferOut(ledger, ?sub, to, amount, 0);
  };
};
