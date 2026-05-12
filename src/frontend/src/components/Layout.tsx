import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CircleDollarSign,
  CreditCard,
  Grid3X3,
  LogIn,
  LogOut,
  Menu,
  Shield,
  ShoppingBag,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Collections", href: "/collections", icon: Grid3X3 },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Dividends", href: "/dividends", icon: CircleDollarSign },
  { label: "ICP Account", href: "/icp-account", icon: CreditCard },
];

function TruncatedPrincipal({ text }: { text: string }) {
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {text.slice(0, 6)}…{text.slice(-4)}
    </span>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login, logout, principalText } =
    useAuth();
  const { isAdmin } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useRouterState({ select: (s) => s.location });
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-card border-b border-border"
        style={{ boxShadow: "0 1px 24px oklch(0.7 0.22 290 / 0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 group"
            data-ocid="logo.link"
          >
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:scale-105 transition-smooth">
              <Zap className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              MINTLAB
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const active = currentPath.startsWith(href);
              return (
                <Link
                  key={href}
                  to={href}
                  data-ocid={`nav.${label.toLowerCase().replace(" ", "_")}.link`}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth",
                    active
                      ? "bg-accent/15 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <Link to="/admin" data-ocid="nav.admin.link">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-1.5 border-accent/40 text-accent hover:bg-accent/10"
                  data-ocid="admin.dashboard.button"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {principalText && <TruncatedPrincipal text={principalText} />}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  data-ocid="auth.logout.button"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1.5">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoading}
                className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
                data-ocid="auth.login.button"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                {isLoading ? "Connecting…" : "Sign In"}
              </Button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-smooth"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              data-ocid="nav.mobile_menu.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <nav
                className="px-4 py-3 flex flex-col gap-1"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map(({ label, href, icon: Icon }) => {
                  const active = currentPath.startsWith(href);
                  return (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setMobileOpen(false)}
                      data-ocid={`mobile.nav.${label.toLowerCase().replace(" ", "_")}.link`}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
                        active
                          ? "bg-accent/15 text-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    data-ocid="mobile.nav.admin.link"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/15 transition-smooth"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-accent" />
            </div>
            <span>
              &copy; {new Date().getFullYear()} Mintlab. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </div>
          <span className="font-mono text-xs">Built on Internet Computer</span>
        </div>
      </footer>
    </div>
  );
}
