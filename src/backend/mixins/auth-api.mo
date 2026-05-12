import AuthLib "../lib/auth";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (authState : AuthLib.AdminState) {

  /// Called on every authenticated interaction to bootstrap admin on first use
  public shared ({ caller }) func bootstrapAdmin() : async () {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    AuthLib.initAdmin(authState, caller);
  };

  /// Returns true if caller is the admin principal
  public shared query ({ caller }) func isAdmin() : async Bool {
    AuthLib.isAdmin(authState, caller);
  };

  /// Returns the stored admin principal (null if not yet bootstrapped)
  public query func getAdminPrincipal() : async ?Principal {
    AuthLib.getAdminPrincipal(authState);
  };
};
