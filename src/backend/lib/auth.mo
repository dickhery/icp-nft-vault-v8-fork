import Principal "mo:core/Principal";

module {
  public type AdminState = { var adminPrincipal : ?Principal };

  /// Initialise fresh admin state
  public func newState() : AdminState {
    { var adminPrincipal = null };
  };

  /// Register the first caller as admin; no-op if already set
  public func initAdmin(state : AdminState, caller : Principal) {
    switch (state.adminPrincipal) {
      case null { state.adminPrincipal := ?caller };
      case (?_) {};
    };
  };

  /// Returns true when caller is the stored admin principal
  public func isAdmin(state : AdminState, caller : Principal) : Bool {
    switch (state.adminPrincipal) {
      case (?admin) { Principal.equal(admin, caller) };
      case null { false };
    };
  };

  /// Return the current admin principal (may be null if none set yet)
  public func getAdminPrincipal(state : AdminState) : ?Principal {
    state.adminPrincipal;
  };
};
