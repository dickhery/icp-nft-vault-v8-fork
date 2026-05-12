import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Char "mo:core/Char";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Nat16 "mo:core/Nat16";
import Nat32 "mo:core/Nat32";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import VarArray "mo:core/VarArray";

module {
  public type HeaderField = (Text, Text);

  public type HttpRequest = {
    body : Blob;
    headers : [HeaderField];
    method : Text;
    url : Text;
  };

  public type HttpResponse = {
    body : Blob;
    headers : [HeaderField];
    status_code : Nat16;
    upgrade : Bool;
  };

  public func tokenAssetUrl(canisterId : Principal, tokenId : Nat) : ?Text {
    switch (extTokenIdentifier(canisterId, tokenId)) {
      case null null;
      case (?identifier) {
        ?("https://" # canisterId.toText() # ".raw.icp0.io/?tokenid=" # identifier);
      };
    };
  };

  public func tokenIdFromUrl(url : Text, canisterId : Principal) : ?Nat {
    switch (firstQueryValue(url, ["tokenid", "tokenId", "token_id", "id"])) {
      case null null;
      case (?value) {
        switch (Nat.fromText(value)) {
          case (?tokenId) ?tokenId;
          case null extTokenIdFromIdentifier(value, canisterId);
        };
      };
    };
  };

  public func imageResponse(imageUrl : Text) : HttpResponse {
    switch (dataUrlMedia(imageUrl)) {
      case (?media) {
        {
          status_code = 200;
          headers = [
            ("Content-Type", media.contentType),
            ("Cache-Control", "public, max-age=31536000, immutable"),
            ("Access-Control-Allow-Origin", "*"),
          ];
          body = media.body;
          upgrade = false;
        };
      };
      case null {
        switch (redirectTarget(imageUrl)) {
          case (?target) redirectResponse(target);
          case null notFoundResponse();
        };
      };
    };
  };

  public func notFoundResponse() : HttpResponse {
    {
      status_code = 404;
      headers = [
        ("Content-Type", "text/plain; charset=utf-8"),
        ("Cache-Control", "no-store"),
        ("Access-Control-Allow-Origin", "*"),
      ];
      body = Text.encodeUtf8("NFT image not found");
      upgrade = false;
    };
  };

  func redirectResponse(target : Text) : HttpResponse {
    {
      status_code = 302;
      headers = [
        ("Location", target),
        ("Cache-Control", "public, max-age=31536000, immutable"),
        ("Access-Control-Allow-Origin", "*"),
      ];
      body = Blob.fromArray([]);
      upgrade = false;
    };
  };

  func redirectTarget(imageUrl : Text) : ?Text {
    if (Text.startsWith(imageUrl, #text "https://") or Text.startsWith(imageUrl, #text "http://")) {
      ?imageUrl;
    } else if (Text.startsWith(imageUrl, #text "ipfs://ipfs/")) {
      switch (Text.stripStart(imageUrl, #text "ipfs://ipfs/")) {
        case (?path) ?("https://ipfs.io/ipfs/" # path);
        case null null;
      };
    } else if (Text.startsWith(imageUrl, #text "ipfs://")) {
      switch (Text.stripStart(imageUrl, #text "ipfs://")) {
        case (?path) ?("https://ipfs.io/ipfs/" # path);
        case null null;
      };
    } else if (Text.startsWith(imageUrl, #text "ar://")) {
      switch (Text.stripStart(imageUrl, #text "ar://")) {
        case (?path) ?("https://arweave.net/" # path);
        case null null;
      };
    } else if (Text.startsWith(imageUrl, #text "//")) {
      switch (Text.stripStart(imageUrl, #text "//")) {
        case (?path) ?("https://" # path);
        case null null;
      };
    } else {
      null;
    };
  };

  func dataUrlMedia(imageUrl : Text) : ?{ contentType : Text; body : Blob } {
    if (not Text.startsWith(imageUrl, #text "data:")) {
      return null;
    };
    let parts = Text.split(imageUrl, #char ',');
    let metadata = switch (parts.next()) {
      case (?value) value;
      case null return null;
    };
    let payload = switch (parts.next()) {
      case (?value) value;
      case null return null;
    };
    let metadataBody = switch (Text.stripStart(metadata, #text "data:")) {
      case (?value) value;
      case null return null;
    };
    let contentType = switch (Text.split(metadataBody, #char ';').next()) {
      case (?value) {
        if (value == "") {
          "application/octet-stream";
        } else {
          value;
        };
      };
      case null "application/octet-stream";
    };
    let body = if (Text.contains(metadataBody, #text ";base64")) {
      switch (base64Decode(payload)) {
        case (?value) value;
        case null return null;
      };
    } else {
      Text.encodeUtf8(payload);
    };
    ?{ contentType; body };
  };

  func extTokenIdentifier(canisterId : Principal, tokenId : Nat) : ?Text {
    if (tokenId == 0) {
      return null;
    };
    let index = Nat.sub(tokenId, 1);
    if (index > 4_294_967_295) {
      return null;
    };
    let indexBytes = nat32Bytes(Nat32.fromNat(index));
    let prefix : [Nat8] = [10, 116, 105, 100];
    let combined = Array.concat<Nat8>(
      Array.concat<Nat8>(prefix, Blob.toArray(canisterId.toBlob())),
      indexBytes,
    );
    ?Principal.fromBlob(Blob.fromArray(combined)).toText();
  };

  func extTokenIdFromIdentifier(identifier : Text, canisterId : Principal) : ?Nat {
    let bytes = Blob.toArray(Principal.fromText(identifier).toBlob());
    let size = bytes.size();
    if (size < 8) {
      return null;
    };
    if (bytes[0] != 10 or bytes[1] != 116 or bytes[2] != 105 or bytes[3] != 100) {
      return null;
    };
    let canisterBytes = Blob.toArray(canisterId.toBlob());
    if (size != canisterBytes.size() + 8) {
      return null;
    };
    var i = 0;
    while (i < canisterBytes.size()) {
      if (bytes[4 + i] != canisterBytes[i]) {
        return null;
      };
      i += 1;
    };
    let index =
      (((Nat8.toNat(bytes[size - 4]) * 256 + Nat8.toNat(bytes[size - 3])) * 256 + Nat8.toNat(bytes[size - 2])) * 256) +
      Nat8.toNat(bytes[size - 1]);
    ?(index + 1);
  };

  func nat32Bytes(value : Nat32) : [Nat8] {
    let number = Nat32.toNat(value);
    [
      Nat8.fromNat((number / 16_777_216) % 256),
      Nat8.fromNat((number / 65_536) % 256),
      Nat8.fromNat((number / 256) % 256),
      Nat8.fromNat(number % 256),
    ];
  };

  func firstQueryValue(url : Text, keys : [Text]) : ?Text {
    let queryText = switch (queryPart(url)) {
      case (?value) value;
      case null return null;
    };
    for (pair in Text.split(queryText, #char '&')) {
      for (key in keys.values()) {
        switch (Text.stripStart(pair, #text (key # "="))) {
          case (?value) return ?value;
          case null {};
        };
      };
    };
    null;
  };

  func queryPart(url : Text) : ?Text {
    let parts = Text.split(url, #char '?');
    ignore parts.next();
    parts.next();
  };

  func base64Decode(input : Text) : ?Blob {
    var inputLength : Nat = 0;
    var inputPadding : Nat = 0;
    var sawInputPadding = false;

    for (char in input.chars()) {
      if (Char.isWhitespace(char)) {
      } else if (char == '=') {
        sawInputPadding := true;
        inputPadding += 1;
        inputLength += 1;
      } else {
        if (sawInputPadding) {
          return null;
        };
        switch (base64Value(char)) {
          case null return null;
          case (?_) inputLength += 1;
        };
      };
    };

    if (inputLength % 4 != 0 or inputPadding > 2) {
      return null;
    };

    let maxOutputSize = (inputLength / 4) * 3;
    if (inputPadding > maxOutputSize) {
      return null;
    };
    let outputSize = Nat.sub(maxOutputSize, inputPadding);
    let output = VarArray.repeat<Nat8>(0, outputSize);
    var quartet : [Nat] = [];
    var padding : Nat = 0;
    var outIndex : Nat = 0;

    for (char in input.chars()) {
      if (Char.isWhitespace(char)) {
        // Whitespace inside data URLs is unusual, but harmless to ignore.
      } else if (char == '=') {
        padding += 1;
        quartet := Array.concat<Nat>(quartet, [0]);
      } else {
        switch (base64Value(char)) {
          case (?value) quartet := Array.concat<Nat>(quartet, [value]);
          case null return null;
        };
      };

      if (quartet.size() == 4) {
        if (padding > 2) {
          return null;
        };
        let triple = quartet[0] * 262_144 + quartet[1] * 4_096 + quartet[2] * 64 + quartet[3];
        output[outIndex] := Nat8.fromNat((triple / 65_536) % 256);
        outIndex += 1;
        if (padding < 2) {
          output[outIndex] := Nat8.fromNat((triple / 256) % 256);
          outIndex += 1;
        };
        if (padding < 1) {
          output[outIndex] := Nat8.fromNat(triple % 256);
          outIndex += 1;
        };
        quartet := [];
        padding := 0;
      };
    };

    if (quartet.size() != 0) {
      return null;
    };
    if (outIndex != outputSize) {
      return null;
    };
    ?Blob.fromVarArray(output);
  };

  func base64Value(char : Char) : ?Nat {
    let code = Nat32.toNat(Char.toNat32(char));
    if (code >= 65 and code <= 90) {
      ?(code - 65);
    } else if (code >= 97 and code <= 122) {
      ?(code - 71);
    } else if (code >= 48 and code <= 57) {
      ?(code + 4);
    } else if (char == '+') {
      ?62;
    } else if (char == '/') {
      ?63;
    } else {
      null;
    };
  };
};
