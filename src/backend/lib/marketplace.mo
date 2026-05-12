import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/marketplace";
import WalletTypes "../types/wallet";

module {
  public let MINTLAB_FEE_BASIS_POINTS : Nat = 200; // 2%
  public let BASIS_POINTS_DENOMINATOR : Nat = 10_000;
  public let AUCTION_SETTLEMENT_TRANSFER_COUNT : Nat = 2;

  public type MarketplaceState = {
    fixedListings : Map.Map<Types.ListingId, Types.FixedListing>;
    auctionListings : Map.Map<Types.ListingId, Types.AuctionListing>;
    bids : Map.Map<Types.ListingId, [Types.Bid]>;
    escrowedNFTs : Map.Map<Types.ListingId, WalletTypes.WalletNFT>;
    var nextId : Nat;
  };

  public type MarketplacePaymentState = {
    auctionEscrows : Map.Map<Types.ListingId, Types.AuctionEscrow>;
    pendingRefunds : Map.Map<Nat, Types.AuctionEscrow>;
    listingLocks : Map.Map<Types.ListingId, Bool>;
    var nextEscrowId : Nat;
    var mintlabFeeRecipient : ?Types.AccountIdentifier;
  };

  public func newState() : MarketplaceState {
    {
      fixedListings = Map.empty<Types.ListingId, Types.FixedListing>();
      auctionListings = Map.empty<Types.ListingId, Types.AuctionListing>();
      bids = Map.empty<Types.ListingId, [Types.Bid]>();
      escrowedNFTs = Map.empty<Types.ListingId, WalletTypes.WalletNFT>();
      var nextId = 1;
    };
  };

  public func newPaymentState() : MarketplacePaymentState {
    {
      auctionEscrows = Map.empty<Types.ListingId, Types.AuctionEscrow>();
      pendingRefunds = Map.empty<Nat, Types.AuctionEscrow>();
      listingLocks = Map.empty<Types.ListingId, Bool>();
      var nextEscrowId = 1;
      var mintlabFeeRecipient = null;
    };
  };

  public func getFeeConfig(
    state : MarketplacePaymentState,
    ledgerFeeE8s : Nat64,
  ) : Types.MarketplaceFeeConfig {
    {
      mintlabFeeBasisPoints = MINTLAB_FEE_BASIS_POINTS;
      mintlabFeeRecipient = state.mintlabFeeRecipient;
      ledgerFeeE8s;
      auctionBidFeeReserveE8s = auctionBidFeeReserve(ledgerFeeE8s);
    };
  };

  public func setMintlabFeeRecipient(
    state : MarketplacePaymentState,
    recipient : ?Types.AccountIdentifier,
  ) {
    state.mintlabFeeRecipient := recipient;
  };

  public func mintlabFee(amount : Nat64) : Nat64 {
    Nat64.fromNat((Nat64.toNat(amount) * MINTLAB_FEE_BASIS_POINTS) / BASIS_POINTS_DENOMINATOR);
  };

  public func sellerProceeds(amount : Nat64) : Nat64 {
    amount - mintlabFee(amount);
  };

  public func auctionBidFeeReserve(ledgerFeeE8s : Nat64) : Nat64 {
    Nat64.fromNat(Nat64.toNat(ledgerFeeE8s) * AUCTION_SETTLEMENT_TRANSFER_COUNT);
  };

  public func auctionBidEscrowDeposit(amount : Nat64, ledgerFeeE8s : Nat64) : Nat64 {
    Nat64.fromNat(Nat64.toNat(amount) + Nat64.toNat(auctionBidFeeReserve(ledgerFeeE8s)));
  };

  public func totalBidderDebit(amount : Nat64, ledgerFeeE8s : Nat64) : Nat64 {
    Nat64.fromNat(Nat64.toNat(auctionBidEscrowDeposit(amount, ledgerFeeE8s)) + Nat64.toNat(ledgerFeeE8s));
  };

  public func fixedPurchaseLedgerFeeCount(amount : Nat64) : Nat64 {
    if (mintlabFee(amount) > 0) 2 else 1;
  };

  public func totalFixedBuyerDebit(amount : Nat64, ledgerFeeE8s : Nat64) : Nat64 {
    Nat64.fromNat(
      Nat64.toNat(amount) + (Nat64.toNat(ledgerFeeE8s) * Nat64.toNat(fixedPurchaseLedgerFeeCount(amount)))
    );
  };

  public func auctionRefundPayoutAmount(escrow : Types.AuctionEscrow, refundFeeE8s : Nat64) : Nat64 {
    let reserve = Nat64.toNat(escrow.feeReserve);
    let refundFee = Nat64.toNat(refundFeeE8s);
    let returnedReserve = if (reserve <= refundFee) 0 else Int.abs(Int.fromNat(reserve) - Int.fromNat(refundFee));
    Nat64.fromNat(Nat64.toNat(escrow.amount) + returnedReserve);
  };

  public func peekNextEscrowId(state : MarketplacePaymentState) : Nat {
    state.nextEscrowId;
  };

  public func recordAuctionEscrow(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
    escrow : Types.AuctionEscrow,
  ) {
    if (escrow.escrowId >= state.nextEscrowId) {
      state.nextEscrowId := escrow.escrowId + 1;
    };
    Map.add(state.auctionEscrows, Nat.compare, listingId, escrow);
  };

  public func getAuctionEscrow(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
  ) : ?Types.AuctionEscrow {
    Map.get(state.auctionEscrows, Nat.compare, listingId);
  };

  public func removeAuctionEscrow(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
  ) : ?Types.AuctionEscrow {
    let current = Map.get(state.auctionEscrows, Nat.compare, listingId);
    Map.remove(state.auctionEscrows, Nat.compare, listingId);
    current;
  };

  public func queueAuctionRefund(
    state : MarketplacePaymentState,
    escrow : Types.AuctionEscrow,
  ) {
    Map.add(state.pendingRefunds, Nat.compare, escrow.escrowId, escrow);
  };

  public func removePendingRefund(
    state : MarketplacePaymentState,
    escrowId : Nat,
  ) : ?Types.AuctionEscrow {
    let current = Map.get(state.pendingRefunds, Nat.compare, escrowId);
    Map.remove(state.pendingRefunds, Nat.compare, escrowId);
    current;
  };

  public func getPendingRefund(
    state : MarketplacePaymentState,
    escrowId : Nat,
  ) : ?Types.AuctionEscrow {
    Map.get(state.pendingRefunds, Nat.compare, escrowId);
  };

  public func getPendingRefundsByBidder(
    state : MarketplacePaymentState,
    bidder : Types.UserId,
  ) : [Types.AuctionEscrow] {
    var refunds : [Types.AuctionEscrow] = [];
    for ((_, escrow) in Map.entries(state.pendingRefunds)) {
      if (Principal.equal(escrow.bidder, bidder)) {
        refunds := Array.concat<Types.AuctionEscrow>(refunds, [escrow]);
      };
    };
    refunds;
  };

  public func acquireListingLock(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
  ) : Bool {
    switch (Map.get(state.listingLocks, Nat.compare, listingId)) {
      case (?_) false;
      case null {
        Map.add(state.listingLocks, Nat.compare, listingId, true);
        true;
      };
    };
  };

  public func releaseListingLock(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
  ) {
    Map.remove(state.listingLocks, Nat.compare, listingId);
  };

  public func createFixedListing(
    state : MarketplaceState,
    seller : Types.UserId,
    escrowedNFT : WalletTypes.WalletNFT,
    price : Nat64,
  ) : Types.FixedListing {
    let id = state.nextId;
    state.nextId += 1;
    let listing : Types.FixedListing = {
      id;
      seller;
      nftId = escrowedNFT.id;
      price;
      status = #Active;
      createdAt = Time.now();
    };
    Map.add(state.fixedListings, Nat.compare, id, listing);
    Map.add(state.escrowedNFTs, Nat.compare, id, escrowedNFT);
    listing;
  };

  public func createAuctionListing(
    state : MarketplaceState,
    seller : Types.UserId,
    escrowedNFT : WalletTypes.WalletNFT,
    startingBid : Nat64,
    endTime : Types.Timestamp,
  ) : Types.AuctionListing {
    let id = state.nextId;
    state.nextId += 1;
    let listing : Types.AuctionListing = {
      id;
      seller;
      nftId = escrowedNFT.id;
      startingBid;
      endTime;
      highestBidder = null;
      highestBid = 0;
      status = #Active;
      createdAt = Time.now();
    };
    Map.add(state.auctionListings, Nat.compare, id, listing);
    Map.add(state.escrowedNFTs, Nat.compare, id, escrowedNFT);
    listing;
  };

  public func getActiveListings(state : MarketplaceState) : [Types.ActiveListing] {
    var listings : [Types.ActiveListing] = [];
    for ((_, listing) in Map.entries(state.fixedListings)) {
      if (listing.status == #Active) {
        listings := Array.concat<Types.ActiveListing>(listings, [#Fixed(listing)]);
      };
    };
    for ((_, listing) in Map.entries(state.auctionListings)) {
      if (listing.status == #Active) {
        listings := Array.concat<Types.ActiveListing>(listings, [#Auction(listing)]);
      };
    };
    listings;
  };

  public func getActiveListingDetails(state : MarketplaceState) : [Types.ActiveListingDetail] {
    var listings : [Types.ActiveListingDetail] = [];
    for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (listing.status == #Active) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            listings := Array.concat<Types.ActiveListingDetail>(
              listings,
              [{ listing = #Fixed(listing); nft }],
            );
          };
          case null {};
        };
      };
    };
    for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (listing.status == #Active) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            listings := Array.concat<Types.ActiveListingDetail>(
              listings,
              [{ listing = #Auction(listing); nft }],
            );
          };
          case null {};
        };
      };
    };
    listings;
  };

  public func settleFixedListing(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?Types.FixedListing {
    switch (Map.get(state.fixedListings, Nat.compare, listingId)) {
      case null null;
      case (?listing) {
        if (listing.status != #Active) return null;
        let updated : Types.FixedListing = { listing with status = #Sold };
        Map.remove(state.fixedListings, Nat.compare, listingId);
        ?updated;
      };
    };
  };

  public func placeBid(
    state : MarketplaceState,
    listingId : Types.ListingId,
    bidder : Types.UserId,
    amount : Nat64,
  ) : ?Types.AuctionListing {
    switch (Map.get(state.auctionListings, Nat.compare, listingId)) {
      case null null;
      case (?listing) {
        if (listing.status != #Active) return null;
        let minimum = if (listing.highestBid == 0) listing.startingBid else listing.highestBid + 1;
        if (amount < minimum) return null;
        let updated : Types.AuctionListing = {
          listing with
          highestBidder = ?bidder;
          highestBid = amount;
        };
        Map.add(state.auctionListings, Nat.compare, listingId, updated);
        let history = switch (Map.get(state.bids, Nat.compare, listingId)) {
          case (?existing) existing;
          case null [];
        };
        Map.add(
          state.bids,
          Nat.compare,
          listingId,
          Array.concat<Types.Bid>(
            history,
            [
              {
                listingId;
                bidder;
                amount;
                placedAt = Time.now();
              },
            ],
          ),
        );
        ?updated;
      };
    };
  };

  public func settleAuction(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?Types.AuctionListing {
    switch (Map.get(state.auctionListings, Nat.compare, listingId)) {
      case null null;
      case (?listing) {
        if (listing.status != #Active or Time.now() < listing.endTime) return null;
        let updated : Types.AuctionListing = { listing with status = #Settled };
        Map.remove(state.auctionListings, Nat.compare, listingId);
        Map.remove(state.bids, Nat.compare, listingId);
        ?updated;
      };
    };
  };

  public func cancelListing(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?Types.ActiveListing {
    switch (Map.get(state.fixedListings, Nat.compare, listingId)) {
      case (?listing) {
        if (listing.status != #Active) return null;
        let updated : Types.FixedListing = { listing with status = #Cancelled };
        Map.remove(state.fixedListings, Nat.compare, listingId);
        return ?#Fixed(updated);
      };
      case null {};
    };
    switch (Map.get(state.auctionListings, Nat.compare, listingId)) {
      case (?listing) {
        if (listing.status != #Active) return null;
        let updated : Types.AuctionListing = { listing with status = #Cancelled };
        Map.remove(state.auctionListings, Nat.compare, listingId);
        Map.remove(state.bids, Nat.compare, listingId);
        return ?#Auction(updated);
      };
      case null {};
    };
    null;
  };

  public func getFixedListing(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?Types.FixedListing {
    Map.get(state.fixedListings, Nat.compare, listingId);
  };

  public func getAuctionListing(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?Types.AuctionListing {
    Map.get(state.auctionListings, Nat.compare, listingId);
  };

  public func getEscrowedNFT(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?WalletTypes.WalletNFT {
    Map.get(state.escrowedNFTs, Nat.compare, listingId);
  };

  public func getActiveEscrowedNFTsBySeller(
    state : MarketplaceState,
    seller : Types.UserId,
  ) : [WalletTypes.WalletNFT] {
    var nfts : [WalletTypes.WalletNFT] = [];
    for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (listing.status == #Active and Principal.equal(listing.seller, seller)) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
          };
          case null {};
        };
      };
    };
    for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (listing.status == #Active and Principal.equal(listing.seller, seller)) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
          };
          case null {};
        };
      };
    };
    nfts;
  };

  public func getActiveEscrowedNFTsByCollection(
    state : MarketplaceState,
    collectionId : WalletTypes.CollectionId,
  ) : [WalletTypes.WalletNFT] {
    var nfts : [WalletTypes.WalletNFT] = [];
    for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (listing.status == #Active) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            if (nft.collectionId == collectionId) {
              nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
            };
          };
          case null {};
        };
      };
    };
    for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (listing.status == #Active) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            if (nft.collectionId == collectionId) {
              nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
            };
          };
          case null {};
        };
      };
    };
    nfts;
  };

  public func getActiveEscrowedNFTsBySellerAndCollection(
    state : MarketplaceState,
    seller : Types.UserId,
    collectionId : WalletTypes.CollectionId,
  ) : [WalletTypes.WalletNFT] {
    var nfts : [WalletTypes.WalletNFT] = [];
    for (nft in getActiveEscrowedNFTsBySeller(state, seller).values()) {
      if (nft.collectionId == collectionId) {
        nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
      };
    };
    nfts;
  };

  public func findActiveEscrowedNFT(
    state : MarketplaceState,
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : ?WalletTypes.WalletNFT {
    label searchFixed for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (listing.status != #Active) {
        continue searchFixed;
      };
      switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
        case (?nft) {
          if (nft.collectionId == collectionId and nft.tokenId == tokenId) {
            return ?nft;
          };
        };
        case null {};
      };
    };
    label searchAuction for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (listing.status != #Active) {
        continue searchAuction;
      };
      switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
        case (?nft) {
          if (nft.collectionId == collectionId and nft.tokenId == tokenId) {
            return ?nft;
          };
        };
        case null {};
      };
    };
    null;
  };

  public func takeEscrowedNFT(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?WalletTypes.WalletNFT {
    let escrowedNFT = Map.get(state.escrowedNFTs, Nat.compare, listingId);
    switch (escrowedNFT) {
      case null null;
      case (?nft) {
        Map.remove(state.escrowedNFTs, Nat.compare, listingId);
        ?nft;
      };
    };
  };

  public func clearListingsForToken(
    state : MarketplaceState,
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : Nat {
    var listingIds : [Types.ListingId] = [];
    for ((listingId, nft) in Map.entries(state.escrowedNFTs)) {
      if (nft.collectionId == collectionId and nft.tokenId == tokenId) {
        listingIds := appendListingId(listingIds, listingId);
      };
    };
    for (listingId in listingIds.values()) {
      Map.remove(state.fixedListings, Nat.compare, listingId);
      Map.remove(state.auctionListings, Nat.compare, listingId);
      Map.remove(state.bids, Nat.compare, listingId);
      Map.remove(state.escrowedNFTs, Nat.compare, listingId);
    };
    listingIds.size();
  };

  func appendListingId(
    listingIds : [Types.ListingId],
    listingId : Types.ListingId,
  ) : [Types.ListingId] {
    for (existing in listingIds.values()) {
      if (existing == listingId) {
        return listingIds;
      };
    };
    Array.concat<Types.ListingId>(listingIds, [listingId]);
  };
};
