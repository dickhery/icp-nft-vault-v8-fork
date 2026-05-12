module {
  // Cross-cutting identity types
  public type UserId = Principal;
  public type Timestamp = Int; // nanoseconds since epoch (Time.now())
  public type AccountIdentifier = Blob; // raw ICP account identifier bytes

  // ICP Ledger types
  public type Tokens = { e8s : Nat64 };
  public type TransferResult = { #Ok : Nat64; #Err : TransferError };
  public type TransferError = {
    #BadFee : { expected_fee : Tokens };
    #InsufficientFunds : { balance : Tokens };
    #TxTooOld : { allowed_window_nanos : Nat64 };
    #TxCreatedInFuture;
    #TxDuplicate : { duplicate_of : Nat64 };
  };
};
