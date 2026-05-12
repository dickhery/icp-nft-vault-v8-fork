import { Layout } from "@/components/Layout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const WalletPage = lazy(() => import("@/pages/WalletPage"));
const MarketplacePage = lazy(() => import("@/pages/MarketplacePage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const ICPAccountPage = lazy(() => import("@/pages/ICPAccountPage"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const CollectionsPage = lazy(() => import("@/pages/CollectionsPage"));
const DividendsPage = lazy(() => import("@/pages/DividendsPage"));

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center min-h-[40vh]">
            <LoadingSpinner size="lg" label="Loading…" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: WalletPage,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace",
  component: MarketplacePage,
});

const icpAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/icp-account",
  component: ICPAccountPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const collectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collections",
  component: CollectionsPage,
});

const dividendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dividends",
  component: DividendsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  walletRoute,
  marketplaceRoute,
  icpAccountRoute,
  adminRoute,
  collectionsRoute,
  dividendsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
