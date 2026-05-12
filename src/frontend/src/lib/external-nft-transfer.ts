import type { Collection, WalletNFT } from "@/backend-client";
import { Actor, type Agent } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";

type TransferArgs = {
  agent: Agent;
  collection: Collection;
  nft: WalletNFT;
  owner: Principal;
  recipient: Principal;
};

type ExtTransferError =
  | { CannotNotify: string }
  | { InsufficientBalance: null }
  | { InvalidToken: string }
  | { Rejected: null }
  | { Unauthorized: string }
  | { Other: string };

type ExtTransferResponse = { ok: bigint } | { err: ExtTransferError };

type Dip721Error =
  | { Unauthorized: null }
  | { InvalidTokenId: null }
  | { ZeroAddress: null }
  | { Other: string }
  | { ExistedNFT: null }
  | { SelfTransfer: null }
  | { TokenNotFound: null }
  | { OwnerNotFound: null }
  | { OperatorNotFound: null }
  | { SelfApprove: null }
  | { UnauthorizedOwner: null }
  | { UnauthorizedOperator: null };

type Dip721TransferResponse = { Ok: bigint } | { Err: Dip721Error };

type Icrc7TransferError =
  | { NonExistingTokenId: null }
  | { InvalidRecipient: null }
  | { Unauthorized: null }
  | { TooOld: null }
  | { CreatedInFuture: { ledger_time: bigint } }
  | { Duplicate: { duplicate_of: bigint } }
  | { GenericError: { error_code: bigint; message: string } }
  | { GenericBatchError: { error_code: bigint; message: string } };

type Icrc7TransferResult = { Ok: bigint } | { Err: Icrc7TransferError };

const extIdlFactory = ({ IDL: idl }) => {
  const AccountUser = idl.Variant({
    principal: idl.Principal,
    address: idl.Text,
  });
  const TransferRequest = idl.Record({
    to: AccountUser,
    token: idl.Text,
    notify: idl.Bool,
    from: AccountUser,
    memo: idl.Vec(idl.Nat8),
    subaccount: idl.Opt(idl.Vec(idl.Nat8)),
    amount: idl.Nat,
  });
  const TransferError = idl.Variant({
    CannotNotify: idl.Text,
    InsufficientBalance: idl.Null,
    InvalidToken: idl.Text,
    Rejected: idl.Null,
    Unauthorized: idl.Text,
    Other: idl.Text,
  });
  const TransferResponse = idl.Variant({
    ok: idl.Nat,
    err: TransferError,
  });
  return idl.Service({
    ext_transfer: idl.Func([TransferRequest], [TransferResponse], []),
    transfer: idl.Func([TransferRequest], [TransferResponse], []),
  });
};

const dip721IdlFactory = ({ IDL: idl }) => {
  const Dip721Error = idl.Variant({
    Unauthorized: idl.Null,
    InvalidTokenId: idl.Null,
    ZeroAddress: idl.Null,
    Other: idl.Text,
    ExistedNFT: idl.Null,
    SelfTransfer: idl.Null,
    TokenNotFound: idl.Null,
    OwnerNotFound: idl.Null,
    OperatorNotFound: idl.Null,
    SelfApprove: idl.Null,
    UnauthorizedOwner: idl.Null,
    UnauthorizedOperator: idl.Null,
  });
  const NatResult = idl.Variant({
    Ok: idl.Nat,
    Err: Dip721Error,
  });
  return idl.Service({
    transfer: idl.Func([idl.Principal, idl.Nat], [NatResult], []),
    dip721_transfer: idl.Func([idl.Principal, idl.Nat], [NatResult], []),
    transferFromDip721: idl.Func(
      [idl.Principal, idl.Principal, idl.Nat],
      [NatResult],
      [],
    ),
  });
};

const icrc7IdlFactory = ({ IDL: idl }) => {
  const Account = idl.Record({
    owner: idl.Principal,
    subaccount: idl.Opt(idl.Vec(idl.Nat8)),
  });
  const TransferArg = idl.Record({
    from_subaccount: idl.Opt(idl.Vec(idl.Nat8)),
    to: Account,
    token_id: idl.Nat,
    memo: idl.Opt(idl.Vec(idl.Nat8)),
    created_at_time: idl.Opt(idl.Nat64),
  });
  const TransferError = idl.Variant({
    NonExistingTokenId: idl.Null,
    InvalidRecipient: idl.Null,
    Unauthorized: idl.Null,
    TooOld: idl.Null,
    CreatedInFuture: idl.Record({ ledger_time: idl.Nat64 }),
    Duplicate: idl.Record({ duplicate_of: idl.Nat }),
    GenericError: idl.Record({
      error_code: idl.Nat,
      message: idl.Text,
    }),
    GenericBatchError: idl.Record({
      error_code: idl.Nat,
      message: idl.Text,
    }),
  });
  const TransferResult = idl.Variant({
    Ok: idl.Nat,
    Err: TransferError,
  });
  return idl.Service({
    icrc7_transfer: idl.Func(
      [idl.Vec(TransferArg)],
      [idl.Vec(idl.Opt(TransferResult))],
      [],
    ),
  });
};

export async function transferRegisteredNFT({
  agent,
  collection,
  nft,
  owner,
  recipient,
}: TransferArgs): Promise<string> {
  // Registered NFTs stay in the user's account on the external collection canister,
  // so the transfer must be signed by the user's authenticated browser agent.
  if (nft.location !== "Registered") {
    throw new Error("Only registered external NFTs use direct wallet transfer");
  }
  if (collection.kind !== "External") {
    throw new Error("Only imported external collections use direct transfer");
  }
  if (nft.owner.toString() !== owner.toString()) {
    throw new Error("This NFT is registered under a different principal");
  }

  switch (collection.standard.__kind__) {
    case "EXT":
      await transferExtNFT(agent, collection, nft, owner, recipient);
      return "External NFT transferred successfully";
    case "DIP721":
      await transferDip721NFT(agent, collection, nft, owner, recipient);
      return "DIP721 NFT transferred successfully";
    case "ICRC7":
      await transferIcrc7NFT(agent, collection, nft, recipient);
      return "ICRC-7 NFT transferred successfully";
    case "Other":
      throw new Error(
        `Direct transfer is not supported for ${collection.standard.Other} collections yet`,
      );
  }
}

async function transferExtNFT(
  agent: Agent,
  collection: Collection,
  nft: WalletNFT,
  owner: Principal,
  recipient: Principal,
) {
  const actor = Actor.createActor<any>(extIdlFactory, {
    agent,
    canisterId: collection.canisterId.toString(),
  });
  const request = {
    from: { principal: owner },
    to: { principal: recipient },
    token: nft.tokenId,
    amount: 1n,
    memo: new Uint8Array(),
    notify: false,
    subaccount: [],
  };

  let lastError = "EXT transfer method not available";
  for (const method of ["ext_transfer", "transfer"] as const) {
    try {
      const result = (await actor[method](request)) as ExtTransferResponse;
      if ("ok" in result) {
        return;
      }
      lastError = `EXT transfer rejected: ${extTransferErrorToText(result.err)}`;
    } catch (error) {
      lastError = `Transfer call failed: ${errorMessage(error)}`;
    }
  }
  throw new Error(lastError);
}

async function transferDip721NFT(
  agent: Agent,
  collection: Collection,
  nft: WalletNFT,
  owner: Principal,
  recipient: Principal,
) {
  const actor = Actor.createActor<any>(dip721IdlFactory, {
    agent,
    canisterId: collection.canisterId.toString(),
  });
  const tokenId = parseTokenNat(nft.tokenId, "DIP721");
  let lastError = "DIP721 transfer method not available";

  for (const transferCall of [
    () => actor.transfer(recipient, tokenId),
    () => actor.dip721_transfer(recipient, tokenId),
    () => actor.transferFromDip721(owner, recipient, tokenId),
  ]) {
    try {
      const result = (await transferCall()) as Dip721TransferResponse;
      if ("Ok" in result) {
        return;
      }
      lastError = `DIP721 transfer rejected: ${dip721ErrorToText(result.Err)}`;
    } catch (error) {
      lastError = `Transfer call failed: ${errorMessage(error)}`;
    }
  }
  throw new Error(lastError);
}

async function transferIcrc7NFT(
  agent: Agent,
  collection: Collection,
  nft: WalletNFT,
  recipient: Principal,
) {
  const actor = Actor.createActor<any>(icrc7IdlFactory, {
    agent,
    canisterId: collection.canisterId.toString(),
  });
  const tokenId = parseTokenNat(nft.tokenId, "ICRC-7");
  const result = (await actor.icrc7_transfer([
    {
      from_subaccount: [],
      to: {
        owner: recipient,
        subaccount: [],
      },
      token_id: tokenId,
      memo: [],
      created_at_time: [],
    },
  ])) as Array<[] | [Icrc7TransferResult]>;

  if (result.length === 0 || result[0].length === 0) {
    throw new Error("ICRC-7 transfer was not processed");
  }
  const transferResult = result[0][0];
  if ("Err" in transferResult) {
    throw new Error(
      `ICRC-7 transfer rejected: ${icrc7TransferErrorToText(transferResult.Err)}`,
    );
  }
}

function parseTokenNat(tokenId: string, standard: string): bigint {
  try {
    const parsed = BigInt(tokenId);
    if (parsed < 0n) {
      throw new Error("negative token ID");
    }
    return parsed;
  } catch {
    throw new Error(`Invalid ${standard} token ID`);
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function extTransferErrorToText(error: ExtTransferError): string {
  if ("CannotNotify" in error) return "The recipient could not be notified";
  if ("InsufficientBalance" in error) return "Insufficient balance";
  if ("InvalidToken" in error) return `Invalid token: ${error.InvalidToken}`;
  if ("Rejected" in error)
    return "Transfer rejected by the collection canister";
  if ("Unauthorized" in error) return "Unauthorized";
  return error.Other;
}

function dip721ErrorToText(error: Dip721Error): string {
  if ("Unauthorized" in error) return "Unauthorized";
  if ("InvalidTokenId" in error) return "Invalid token ID";
  if ("ZeroAddress" in error) return "Cannot transfer to the zero address";
  if ("Other" in error) return error.Other;
  if ("ExistedNFT" in error) return "NFT already exists";
  if ("SelfTransfer" in error)
    return "Cannot transfer an NFT to the same owner";
  if ("TokenNotFound" in error) return "Token not found";
  if ("OwnerNotFound" in error) return "Owner not found";
  if ("OperatorNotFound" in error) return "Operator not found";
  if ("SelfApprove" in error) return "Cannot approve yourself";
  if ("UnauthorizedOwner" in error) return "Unauthorized owner";
  return "Unauthorized operator";
}

function icrc7TransferErrorToText(error: Icrc7TransferError): string {
  if ("NonExistingTokenId" in error) return "Token does not exist";
  if ("InvalidRecipient" in error) return "Invalid recipient";
  if ("Unauthorized" in error) return "Unauthorized";
  if ("TooOld" in error) return "Transfer request is too old";
  if ("CreatedInFuture" in error) {
    return `Transfer timestamp is in the future relative to ledger time ${error.CreatedInFuture.ledger_time.toString()}`;
  }
  if ("Duplicate" in error) {
    return `Duplicate transfer detected at transaction ${error.Duplicate.duplicate_of.toString()}`;
  }
  if ("GenericError" in error) return error.GenericError.message;
  return error.GenericBatchError.message;
}
