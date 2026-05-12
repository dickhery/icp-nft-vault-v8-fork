import AuthLib "lib/auth";
import CollectionsLib "lib/collections";
import MintLib "lib/mint";
import WalletLib "lib/wallet";
import MarketplaceLib "lib/marketplace";
import DividendsLib "lib/dividends";
import Principal "mo:core/Principal";

import AuthApi "mixins/auth-api";
import CollectionsApi "mixins/collections-api";
import MintApi "mixins/mint-api";
import WalletApi "mixins/wallet-api";
import ICPApi "mixins/icp-api";
import MarketplaceApi "mixins/marketplace-api";
import BrowseApi "mixins/browse-api";
import DividendsApi "mixins/dividends-api";

persistent actor Backend {
  // ── Stable state ──────────────────────────────────────────────────────────
  let authState = AuthLib.newState();
  let collectionsState = CollectionsLib.newState();
  let mintState = MintLib.newState();
  let moderationState = MintLib.newModerationState();
  let walletState = WalletLib.newState();
  let marketplaceState = MarketplaceLib.newState();
  let marketplacePaymentState = MarketplaceLib.newPaymentState();
  let dividendsState = DividendsLib.newState();

  // ── Mixin composition ─────────────────────────────────────────────────────
  include AuthApi(authState);
  include CollectionsApi(collectionsState, authState);
  include MintApi(mintState, moderationState, collectionsState, walletState, authState, Principal.fromActor(Backend));
  include WalletApi(
    walletState,
    collectionsState,
    marketplaceState,
    mintState,
    Principal.fromActor(Backend),
  );
  include ICPApi(Principal.fromActor(Backend));
  include MarketplaceApi(
    marketplaceState,
    marketplacePaymentState,
    walletState,
    mintState,
    authState,
    Principal.fromActor(Backend),
  );
  include DividendsApi(
    dividendsState,
    collectionsState,
    walletState,
    marketplaceState,
    mintState,
    Principal.fromActor(Backend),
  );
  include BrowseApi(
    walletState,
    collectionsState,
    marketplaceState,
    mintState,
    Principal.fromActor(Backend),
  );
};
