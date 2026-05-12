import CommonTypes "common";
import WalletTypes "wallet";

module {
  public type ListingId = Nat;
  public type NFTId = WalletTypes.NFTId;
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;
  public type AccountIdentifier = CommonTypes.AccountIdentifier;

  public type ListingStatus = { #Active; #Sold; #Cancelled; #Settled };

  public type FixedListing = {
    id : ListingId;
    seller : UserId;
    nftId : NFTId;
    price : Nat64; // in e8s (ICP smallest unit)
    status : ListingStatus;
    createdAt : Timestamp;
  };

  public type AuctionListing = {
    id : ListingId;
    seller : UserId;
    nftId : NFTId;
    startingBid : Nat64;
    endTime : Timestamp;
    highestBidder : ?UserId;
    highestBid : Nat64;
    status : ListingStatus;
    createdAt : Timestamp;
  };

  public type Bid = {
    listingId : ListingId;
    bidder : UserId;
    amount : Nat64;
    placedAt : Timestamp;
  };

  public type AuctionEscrow = {
    escrowId : Nat;
    listingId : ListingId;
    bidder : UserId;
    amount : Nat64;
    feeReserve : Nat64;
    ledgerFeeE8s : Nat64;
    depositedBlock : Nat64;
    createdAt : Timestamp;
  };

  public type MarketplaceFeeConfig = {
    mintlabFeeBasisPoints : Nat;
    mintlabFeeRecipient : ?AccountIdentifier;
    ledgerFeeE8s : Nat64;
    auctionBidFeeReserveE8s : Nat64;
  };

  public type ActiveListing = {
    #Fixed : FixedListing;
    #Auction : AuctionListing;
  };

  public type ActiveListingDetail = {
    listing : ActiveListing;
    nft : WalletTypes.WalletNFT;
  };
};
