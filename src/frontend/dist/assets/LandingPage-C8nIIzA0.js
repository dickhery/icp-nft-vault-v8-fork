import { c as createLucideIcon, i as useNavigate, j as jsxRuntimeExports, m as motion, B as Button, W as Wallet, Z as Zap } from "./index-C71bI6gW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode);
const features = [
  {
    icon: Wallet,
    title: "Mintlab Wallet",
    description: "Hold your ICP NFTs, sync what you already own, and keep every collection canister close at hand."
  },
  {
    icon: LayoutGrid,
    title: "Community Collections",
    description: "Import supported collections from around ICP or create your own collection for everyone in Mintlab to enjoy."
  },
  {
    icon: Zap,
    title: "Open Marketplace",
    description: "Mint, list, auction, transfer, and trade NFTs while keeping full on-chain custody."
  }
];
function LandingPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col min-h-[calc(100vh-4rem)]",
      "data-ocid": "landing.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "pointer-events-none absolute inset-0 -z-0",
              "aria-hidden": "true",
              style: {
                background: "radial-gradient(ellipse 60% 50% at 50% 20%, oklch(var(--accent) / 0.12) 0%, transparent 70%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 32 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              className: "relative z-10 max-w-3xl mx-auto space-y-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { duration: 0.4, delay: 0.1 },
                    className: "inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent uppercase tracking-widest",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent animate-pulse" }),
                      "Live on Internet Computer"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-5xl md:text-7xl text-foreground leading-[1.05] tracking-tight", children: [
                  "Mintlab.",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        backgroundImage: "linear-gradient(135deg, oklch(var(--accent)), oklch(var(--primary)))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      },
                      children: "Open by Default."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed", children: "Mintlab is a permissionless ICP NFT app where anyone can import collections, launch a paid creator collection, mint, trade, and move NFTs across the ecosystem." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 12 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.4, delay: 0.25 },
                    className: "flex flex-col sm:flex-row gap-3 justify-center pt-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "lg",
                          className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2 font-semibold px-8 shadow-lg",
                          onClick: () => navigate({ to: "/marketplace" }),
                          "data-ocid": "landing.explore_marketplace_button",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-4 h-4" }),
                            "Explore Marketplace"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "lg",
                          variant: "outline",
                          className: "border-border/60 hover:bg-muted/40 transition-smooth gap-2 font-semibold px-8",
                          onClick: () => navigate({ to: "/wallet" }),
                          "data-ocid": "landing.open_wallet_button",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4" }),
                            "Open Wallet"
                          ]
                        }
                      )
                    ]
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "section",
          {
            className: "border-t border-border bg-muted/30 px-6 py-16",
            "data-ocid": "landing.features_section",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0 },
                  whileInView: { opacity: 1 },
                  viewport: { once: true },
                  transition: { duration: 0.4 },
                  className: "text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10",
                  children: "Everything you need, on-chain"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: features.map(({ icon: Icon, title, description }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.4, delay: i * 0.1 },
                  className: "bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-accent/40 transition-smooth",
                  "data-ocid": `landing.feature.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-accent" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground", children: title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: description })
                    ] })
                  ]
                },
                title
              )) })
            ] })
          }
        )
      ]
    }
  );
}
export {
  LandingPage as default
};
