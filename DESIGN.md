# Design Brief: ICP NFT Wallet & Marketplace

## Aesthetic & Tone
Premium crypto-native dark platform. Luxury tech aesthetic with authoritative, professional voice. Feels like a high-end NFT marketplace (Rarible, Foundation). Deep immersion, not minimalist. Focus on trust and clarity over decoration.

## Color Palette

| Token | Light L | Light C | Light H | Dark L | Dark C | Dark H | Purpose |
|-------|---------|---------|---------|--------|--------|--------|---------|
| Primary | 0.55 | 0.12 | 240 | 0.68 | 0.18 | 240 | Cool blue, CTA, primary buttons |
| Secondary | 0.65 | 0.15 | 280 | 0.72 | 0.20 | 280 | Purple-blue, secondary UI |
| Accent | 0.62 | 0.2 | 290 | 0.7 | 0.22 | 290 | Electric violet, NFT highlights, price badges |
| Background | 0.95 | — | — | 0.08 | — | — | Light neutral / deep near-black |
| Card | 0.97 | — | — | 0.12 | — | — | Elevated surfaces, NFT display |
| Success | — | 0.22 | 120 | — | 0.22 | 120 | Transaction complete |

## Typography
**Display**: Bricolage Grotesque (geometric, modern, tech-native). **Body**: DM Sans (clean, legible, trusted). **Mono**: Geist Mono (crypto code, balances, transaction hashes).

## Structural Zones
- **Header/Nav**: `bg-card` with `border-b border-border`. Sticky, contains logo, auth state, admin button.
- **Main Content**: `bg-background`. Grid-based NFT wallet, marketplace sections.
- **NFT Card**: `bg-card` with `nft-card-glow` shadow. Subtle 1px border, accent overlay on hover.
- **Marketplace Section**: Alt `bg-muted/15` with clear price typography in accent color, bid indicators.
- **Footer**: `bg-muted/20` with `border-t border-border`.

## Elevation & Depth
Cards use `nft-card-glow` (inset highlight + outer glow at accent color). Hover triggers `nft-card-glow-hover` for intensity. No deep shadows — focus is on border + light effects.

## Spacing & Rhythm
Desktop: 8px grid (16px, 24px, 32px). Card padding: 16px. Gap between cards: 20px. Marketplace price labels: 12px mono, bold, accent color.

## Component Patterns
- **NFT Card**: image + metadata + `price-badge`. Hover: glow intensifies, metadata fades slightly.
- **Price Badge**: Rounded pill, accent background, white text, mono font.
- **Bid Indicator**: `bid-typography` (accent, mono, bold) for active bids.
- **Marketplace Grid**: 3–4 columns (responsive), clear price positioning.

## Motion
Smooth default: `transition-smooth` (0.3s ease-in-out). Entrance: fade-in + scale-up. Hover: glow intensify, no bounce.

## Constraints
- No rainbow palettes or color chaos. Accent violet + primary blue only.
- Cards never float or have deep shadows — depth is via color + glows only.
- Price typography always in accent color, never muted.
- Do not exceed 3 font sizes across the app (display, body, small).

## Signature Detail
NFT cards with electric violet glow overlay on hover. Feels exclusive, premium, like viewing rare digital art. Accent color commands attention on prices and bid indicators, reinforcing marketplace value.
