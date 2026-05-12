import type { Collection, WalletNFT } from "@/types";
import { Actor, HttpAgent } from "@icp-sdk/core/agent";
import type { IDL } from "@icp-sdk/core/candid";
import type { Principal } from "@icp-sdk/core/principal";

type ExtUser = { principal: Principal } | { address: string };

type ExtTransferRequest = {
  from: ExtUser;
  to: ExtUser;
  token: string;
  amount: bigint;
  memo: Uint8Array;
  notify: boolean;
  subaccount: [] | [Uint8Array];
};

type ExtTransferResponse = { ok: bigint } | { err: unknown };

type ExtActor = {
  transfer: (request: ExtTransferRequest) => Promise<ExtTransferResponse>;
  ext_transfer: (request: ExtTransferRequest) => Promise<ExtTransferResponse>;
};

type Dip721Result = { Ok: bigint } | { Err: unknown };

type Dip721Actor = {
  transfer: (recipient: Principal, tokenId: bigint) => Promise<Dip721Result>;
  dip721_transfer: (
    recipient: Principal,
    tokenId: bigint,
  ) => Promise<Dip721Result>;
  transferFromDip721: (
    from: Principal,
    recipient: Principal,
    tokenId: bigint,
  ) => Promise<Dip721Result>;
};

type Icrc7TransferArg = {
  from_subaccount: [] | [Uint8Array];
  to: {
    owner: Principal;
    subaccount: [] | [Uint8Array];
  };
  token_id: bigint;
  memo: [] | [Uint8Array];
  created_at_time: [] | [bigint];
};

type Icrc7TransferResult = { Ok: bigint } | { Err: unknown };

type Icrc7Actor = {
  icrc7_transfer: (
    args: Icrc7TransferArg[],
  ) => Promise<Array<[] | [Icrc7TransferResult]>>;
};

interface TransferRegisteredExternalNFTInput {
  identity: unknown;
  owner: Principal;
  recipient: Principal;
  collection: Collection;
  nft: WalletNFT;
}

export async function transferRegisteredExternalNFT({
  identity,
  owner,
  recipient,
  collection,
  nft,
}: TransferRegisteredExternalNFTInput): Promise<string> {
  if (collection.kind !== "External") {
    throw new Error(
      "Only imported external NFTs use direct collection transfer",
    );
  }

  switch (collection.standard.__kind__) {
    case "EXT":
      return transferEXT(identity, owner, recipient, collection, nft);
    case "DIP721":
      return transferDIP721(identity, owner, recipient, collection, nft);
    case "ICRC7":
      return transferICRC7(identity, recipient, collection, nft);
    case "Other":
      throw new Error(
        `Direct transfers are not supported for ${collection.standard.Other} collections yet`,
      );
  }
}

function createExternalActor<T>(
  identity: unknown,
  canisterId: Principal,
  idlFactory: IDL.InterfaceFactory,
): T {
  const agent = HttpAgent.createSync({
    identity: identity as any,
  });
  return Actor.createActor<any>(idlFactory, {
    agent,
    canisterId: canisterId.toString(),
  }) as T;
}

async function transferEXT(
  identity: unknown,
  owner: Principal,
  recipient: Principal,
  collection: Collection,
  nft: WalletNFT,
): Promise<string> {
  const actor = createExternalActor<ExtActor>(
    identity,
    collection.canisterId,
    extIdlFactory,
  );
  const request: ExtTransferRequest = {
    from: { principal: owner },
    to: { principal: recipient },
    token: nft.tokenId,
    amount: 1n,
    memo: new Uint8Array(),
    notify: false,
    subaccount: [],
  };
  const errors: string[] = [];

  for (const method of ["transfer", "ext_transfer"] as const) {
    try {
      const result = await actor[method](request);
      if ("ok" in result) {
        return `EXT transfer ${result.ok.toString()}`;
      }
      errors.push(`${method}: ${variantToText(result.err)}`);
    } catch (error) {
      errors.push(`${method}: ${errorToText(error)}`);
    }
  }

  throw new Error(`EXT transfer failed. ${lastMessage(errors)}`);
}

async function transferDIP721(
  identity: unknown,
  owner: Principal,
  recipient: Principal,
  collection: Collection,
  nft: WalletNFT,
): Promise<string> {
  const tokenId = numericTokenId(nft.tokenId, "DIP721");
  const actor = createExternalActor<Dip721Actor>(
    identity,
    collection.canisterId,
    dip721IdlFactory,
  );
  const attempts: Array<{
    name: string;
    run: () => Promise<Dip721Result>;
  }> = [
    {
      name: "transfer",
      run: () => actor.transfer(recipient, tokenId),
    },
    {
      name: "dip721_transfer",
      run: () => actor.dip721_transfer(recipient, tokenId),
    },
    {
      name: "transferFromDip721",
      run: () => actor.transferFromDip721(owner, recipient, tokenId),
    },
  ];
  const errors: string[] = [];

  for (const attempt of attempts) {
    try {
      const result = await attempt.run();
      if ("Ok" in result) {
        return `DIP721 transfer ${result.Ok.toString()}`;
      }
      errors.push(`${attempt.name}: ${variantToText(result.Err)}`);
    } catch (error) {
      errors.push(`${attempt.name}: ${errorToText(error)}`);
    }
  }

  throw new Error(`DIP721 transfer failed. ${lastMessage(errors)}`);
}

async function transferICRC7(
  identity: unknown,
  recipient: Principal,
  collection: Collection,
  nft: WalletNFT,
): Promise<string> {
  const tokenId = numericTokenId(nft.tokenId, "ICRC-7");
  const actor = createExternalActor<Icrc7Actor>(
    identity,
    collection.canisterId,
    icrc7IdlFactory,
  );
  const response = await actor.icrc7_transfer([
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
  ]);

  if (response.length === 0) {
    throw new Error("ICRC-7 transfer returned no result");
  }
  const first = response[0];
  if (first.length === 0) {
    throw new Error("ICRC-7 transfer was not processed");
  }

  const result = first[0];
  if ("Ok" in result) {
    return `ICRC-7 transfer ${result.Ok.toString()}`;
  }
  throw new Error(`ICRC-7 transfer failed. ${variantToText(result.Err)}`);
}

const extIdlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const extUser = IDL.Variant({
    address: IDL.Text,
    principal: IDL.Principal,
  });
  const request = IDL.Record({
    amount: IDL.Nat,
    from: extUser,
    memo: IDL.Vec(IDL.Nat8),
    notify: IDL.Bool,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    to: extUser,
    token: IDL.Text,
  });
  const commonError = IDL.Variant({
    CannotNotify: IDL.Text,
    InsufficientBalance: IDL.Null,
    InvalidToken: IDL.Text,
    Other: IDL.Text,
    Rejected: IDL.Null,
    Unauthorized: IDL.Text,
  });
  const response = IDL.Variant({
    ok: IDL.Nat,
    err: commonError,
  });
  return IDL.Service({
    transfer: IDL.Func([request], [response], []),
    ext_transfer: IDL.Func([request], [response], []),
  });
};

const dip721IdlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const error = IDL.Variant({
    ZeroAddress: IDL.Null,
    InvalidTokenId: IDL.Null,
    Unauthorized: IDL.Null,
    UnauthorizedOwner: IDL.Null,
    UnauthorizedOperator: IDL.Null,
    TokenNotFound: IDL.Null,
    OwnerNotFound: IDL.Null,
    OperatorNotFound: IDL.Null,
    SelfTransfer: IDL.Null,
    SelfApprove: IDL.Null,
    ExistedNFT: IDL.Null,
    Other: IDL.Text,
  });
  const result = IDL.Variant({
    Ok: IDL.Nat,
    Err: error,
  });
  return IDL.Service({
    transfer: IDL.Func([IDL.Principal, IDL.Nat], [result], []),
    dip721_transfer: IDL.Func([IDL.Principal, IDL.Nat], [result], []),
    transferFromDip721: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Nat],
      [result],
      [],
    ),
  });
};

const icrc7IdlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const transferArg = IDL.Record({
    to: account,
    token_id: IDL.Nat,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
  });
  const transferError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    Duplicate: IDL.Record({
      duplicate_of: IDL.Nat,
    }),
    NonExistingTokenId: IDL.Null,
    Unauthorized: IDL.Null,
    CreatedInFuture: IDL.Record({
      ledger_time: IDL.Nat64,
    }),
    InvalidRecipient: IDL.Null,
    GenericBatchError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    TooOld: IDL.Null,
  });
  const transferResult = IDL.Variant({
    Ok: IDL.Nat,
    Err: transferError,
  });
  return IDL.Service({
    icrc7_transfer: IDL.Func(
      [IDL.Vec(transferArg)],
      [IDL.Vec(IDL.Opt(transferResult))],
      [],
    ),
  });
};

function numericTokenId(tokenId: string, standard: string): bigint {
  if (!/^\d+$/.test(tokenId)) {
    throw new Error(`${standard} token IDs must be numeric`);
  }
  return BigInt(tokenId);
}

function variantToText(value: unknown): string {
  if (value == null) {
    return "unknown error";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value !== "object") {
    return String(value);
  }

  const record = value as Record<string, unknown>;
  const tag = Object.keys(record)[0];
  if (!tag) {
    return "unknown error";
  }
  const payload = record[tag];
  if (payload == null) {
    return tag;
  }
  if (typeof payload === "string") {
    return `${tag}: ${payload}`;
  }
  if (typeof payload === "object") {
    const message = (payload as Record<string, unknown>).message;
    if (typeof message === "string" && message.length > 0) {
      return `${tag}: ${message}`;
    }
  }
  return tag;
}

function errorToText(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return variantToText(error);
}

function lastMessage(messages: string[]): string {
  return messages[messages.length - 1] ?? "No compatible transfer method found";
}
