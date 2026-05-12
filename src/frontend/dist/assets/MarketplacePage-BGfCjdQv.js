import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, g as useComposedRefs, a as cn, b as useBackend, u as useAuth, d as useQueryClient, e as useQuery, B as Button, S as ShoppingBag, h as LoadingSpinner, m as motion, X, f as ue } from "./index-DngK8SgJ.js";
import { C as CollectionBadge, P as PriceDisplay } from "./PriceDisplay-Cq44yU2V.js";
import { E as EmptyState, M as MediaImage } from "./MediaImage-s_aK6QNi.js";
import { T as Tag, P as PaymentConfirmationDialog } from "./PaymentConfirmationDialog-DpeHg7fC.js";
import { c as createCollection, u as useDirection, A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./index-CYvSbtd2.js";
import { a as useId, P as Primitive, c as composeEventHandlers, b as createContextScope, d as useControllableState, e as useCallbackRef, f as Presence, u as useMutation, B as Badge, L as Label, I as Input } from "./badge-BYgMj4sx.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-Dm5T7_x3.js";
import { C as Coins } from "./coins-C4PLBZuJ.js";
import { I as ImageOff } from "./media-JcaPzrnE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8", key: "15492f" }],
  ["path", { d: "m16 16 6-6", key: "vzrcl6" }],
  ["path", { d: "m8 8 6-6", key: "18bi4p" }],
  ["path", { d: "m9 7 8 8", key: "5jnvq1" }],
  ["path", { d: "m21 11-8-8", key: "z4y7zo" }]
];
const Gavel = createLucideIcon("gavel", __iconNode);
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const ICP_E8S = 100000000n;
const MAX_ICP_E8S = 18446744073709551615n;
function formatICPAmount(e8s) {
  const whole = e8s / ICP_E8S;
  const frac = (e8s % ICP_E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}
function parseICPToE8s(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^(?:\d+|\d+\.\d{0,8}|\.\d{1,8})$/.test(trimmed)) return null;
  const normalized = trimmed.startsWith(".") ? `0${trimmed}` : trimmed;
  const [wholePart, fracPart = ""] = normalized.split(".");
  const whole = BigInt(wholePart || "0");
  const frac = BigInt(`${fracPart}00000000`.slice(0, 8));
  const e8s = whole * ICP_E8S + frac;
  if (e8s <= 0n || e8s > MAX_ICP_E8S) {
    return null;
  }
  return e8s;
}
function parseICP(val) {
  return parseICPToE8s(val);
}
function truncatePrincipal(p) {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}…${p.slice(-6)}`;
}
function nftKey(collectionId, tokenId) {
  return `${collectionId.toString()}:${tokenId}`;
}
const DEFAULT_ICP_LEDGER_FEE_E8S = 10000n;
const DEFAULT_MINTLAB_FEE_BPS = 200n;
const BPS_DENOMINATOR = 10000n;
function marketplaceFee(amount, feeBps) {
  return amount * feeBps / BPS_DENOMINATOR;
}
function useCountdown(endTimeNs) {
  const [remaining, setRemaining] = reactExports.useState(() => {
    const endMs = Number(endTimeNs / 1000000n);
    return Math.max(0, endMs - Date.now());
  });
  reactExports.useEffect(() => {
    const endMs = Number(endTimeNs / 1000000n);
    const tick = () => setRemaining(Math.max(0, endMs - Date.now()));
    const id = setInterval(tick, 1e3);
    tick();
    return () => clearInterval(id);
  }, [endTimeNs]);
  return remaining;
}
function formatRemaining(ms) {
  if (ms <= 0) return "Ended";
  const totalSec = Math.floor(ms / 1e3);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor(totalSec % 86400 / 3600);
  const m = Math.floor(totalSec % 3600 / 60);
  const s = totalSec % 60;
  if (d > 0) return `${d}d ${h}h remaining`;
  if (h > 0) return `${h}h ${m}m remaining`;
  return `${m}m ${s}s remaining`;
}
function NFTImagePlaceholder({ name }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-8 h-8 text-muted-foreground/40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60 text-center px-2 truncate max-w-full", children: name })
  ] });
}
function FixedListingCard({
  listing,
  nft,
  collection,
  dividendE8s = 0n,
  index,
  currentPrincipal,
  onBuy,
  onCancel,
  onDetails,
  isBuying,
  isCancelling
}) {
  const name = (nft == null ? void 0 : nft.metadata.name) ?? `NFT #${(nft == null ? void 0 : nft.tokenId) ?? "?"}`;
  const sellerText = listing.seller.toString();
  const isOwner = currentPrincipal === sellerText;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      className: "nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:nft-card-glow-hover hover:border-accent/40 transition-smooth cursor-pointer",
      onClick: onDetails,
      "data-ocid": `marketplace.fixed.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square overflow-hidden bg-muted relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaImage,
            {
              src: nft == null ? void 0 : nft.metadata.imageUrl,
              alt: name,
              assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
              tokenId: nft == null ? void 0 : nft.tokenId,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(NFTImagePlaceholder, { name })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-mono uppercase", children: "Fixed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono truncate mt-0.5", children: truncatePrincipal(sellerText) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1 font-mono", children: [
              "Token #",
              (nft == null ? void 0 : nft.tokenId) ?? "?"
            ] })
          ] }),
          collection && /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionBadge, { collection, size: "sm" }),
          dividendE8s > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "w-fit bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px]", children: [
            formatICPAmount(dividendE8s),
            " ICP dividends"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-2 border-t border-border/60 flex items-end justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { e8s: listing.price, size: "sm", label: "Price" }),
            isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "text-destructive border-destructive/40 hover:bg-destructive/10 transition-smooth shrink-0",
                onClick: (event) => {
                  event.stopPropagation();
                  onCancel(listing.id);
                },
                disabled: isCancelling,
                "data-ocid": `marketplace.fixed.cancel_button.${index + 1}`,
                children: isCancelling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 mr-1" }),
                  "Cancel"
                ] })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth shrink-0 font-semibold",
                onClick: (event) => {
                  event.stopPropagation();
                  onBuy(listing.id);
                },
                disabled: isBuying,
                "data-ocid": `marketplace.fixed.buy_button.${index + 1}`,
                children: isBuying ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "Buy Now"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ListingDetailModal({
  detail,
  currentPrincipal,
  onClose,
  onBuy,
  onCancel,
  onBid
}) {
  if (!detail) return null;
  const { listing, nft, collection, dividendE8s } = detail;
  const name = nft.metadata.name ?? `NFT #${nft.tokenId}`;
  const canisterId = collection == null ? void 0 : collection.canisterId.toString();
  const fixed = listing.__kind__ === "Fixed" ? listing.Fixed : null;
  const auction = listing.__kind__ === "Auction" ? listing.Auction : null;
  const seller = (fixed == null ? void 0 : fixed.seller) ?? (auction == null ? void 0 : auction.seller);
  const isOwner = seller != null && currentPrincipal === seller.toString();
  const auctionRemaining = auction ? formatRemaining(
    Math.max(0, Number(auction.endTime / 1000000n) - Date.now())
  ) : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!detail, onOpenChange: (value) => !value && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogContent,
    {
      className: "bg-card border-border max-w-3xl p-0 overflow-hidden max-h-[88vh]",
      "data-ocid": "marketplace.nft_detail.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted min-h-[260px] md:min-h-0 md:h-full flex items-center justify-center p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          MediaImage,
          {
            src: nft.metadata.imageUrl,
            alt: name,
            assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
            tokenId: nft.tokenId,
            className: "max-h-[72vh] w-full h-full object-contain rounded-lg",
            fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(NFTImagePlaceholder, { name })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4 overflow-y-auto max-h-[88vh]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-2 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: fixed ? "bg-primary/10 text-primary border border-primary/20" : "bg-accent/10 text-accent border border-accent/20",
                  children: fixed ? "Fixed Price" : "Auction"
                }
              ),
              collection && /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionBadge, { collection, size: "sm" }),
              dividendE8s > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-3 h-3 mr-1" }),
                formatICPAmount(dividendE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl text-foreground", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-mono", children: [
              "Token #",
              nft.tokenId
            ] })
          ] }),
          nft.metadata.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: nft.metadata.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-muted/35 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Seller" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground truncate mt-0.5", children: (seller == null ? void 0 : seller.toString()) ?? "Unknown" })
            ] }),
            canisterId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-muted/35 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Collection Canister" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground truncate mt-0.5", children: canisterId })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-muted/25 p-3 flex items-center justify-between gap-3", children: [
            fixed ? /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { e8s: fixed.price, label: "Price" }) : auction ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              PriceDisplay,
              {
                e8s: auction.highestBid > 0n ? auction.highestBid : auction.startingBid,
                label: auction.highestBid > 0n ? "Top bid" : "Starting bid"
              }
            ) : null,
            auction && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: auctionRemaining })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2 pt-2", children: [
            fixed && (isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "text-destructive border-destructive/40 hover:bg-destructive/10",
                onClick: () => {
                  onCancel(fixed.id);
                  onClose();
                },
                children: "Cancel Listing"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "bg-accent text-accent-foreground hover:bg-accent/90",
                onClick: () => {
                  onBuy(fixed.id);
                  onClose();
                },
                children: "Buy Now"
              }
            )),
            auction && (isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "text-destructive border-destructive/40 hover:bg-destructive/10",
                onClick: () => {
                  onCancel(auction.id);
                  onClose();
                },
                children: "Cancel Auction"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "bg-accent text-accent-foreground hover:bg-accent/90",
                onClick: () => {
                  onBid(auction);
                  onClose();
                },
                disabled: Date.now() >= Number(auction.endTime / 1000000n),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-4 h-4 mr-2" }),
                  "Place Bid"
                ]
              }
            ))
          ] })
        ] })
      ] })
    }
  ) });
}
function AuctionListingCard({
  listing,
  nft,
  collection,
  dividendE8s = 0n,
  index,
  currentPrincipal,
  onBid,
  onSettle,
  onCancel,
  onDetails,
  isSettling,
  isCancelling
}) {
  const remaining = useCountdown(listing.endTime);
  const ended = remaining <= 0;
  const name = (nft == null ? void 0 : nft.metadata.name) ?? `NFT #${(nft == null ? void 0 : nft.tokenId) ?? "?"}`;
  const sellerText = listing.seller.toString();
  const isOwner = currentPrincipal === sellerText;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      className: "nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:nft-card-glow-hover hover:border-accent/40 transition-smooth cursor-pointer",
      onClick: onDetails,
      "data-ocid": `marketplace.auction.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square overflow-hidden bg-muted relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaImage,
            {
              src: nft == null ? void 0 : nft.metadata.imageUrl,
              alt: name,
              assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
              tokenId: nft == null ? void 0 : nft.tokenId,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(NFTImagePlaceholder, { name })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: `absolute top-2 left-2 text-xs font-mono uppercase ${ended ? "bg-muted text-muted-foreground" : "bg-accent/90 text-accent-foreground"}`,
              children: ended ? "Ended" : "Live"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono truncate mt-0.5", children: truncatePrincipal(sellerText) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1 font-mono", children: [
              "Token #",
              (nft == null ? void 0 : nft.tokenId) ?? "?"
            ] })
          ] }),
          collection && /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionBadge, { collection, size: "sm" }),
          dividendE8s > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "w-fit bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px]", children: [
            formatICPAmount(dividendE8s),
            " ICP dividends"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: ended ? "text-destructive/80" : "text-foreground/70",
                children: formatRemaining(remaining)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-2 border-t border-border/60 flex items-end justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PriceDisplay,
              {
                e8s: listing.highestBid > 0n ? listing.highestBid : listing.startingBid,
                size: "sm",
                label: listing.highestBid > 0n ? "Top bid" : "Starting bid"
              }
            ),
            isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 shrink-0", children: [
              ended && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth font-semibold",
                  onClick: (event) => {
                    event.stopPropagation();
                    onSettle(listing.id);
                  },
                  disabled: isSettling,
                  "data-ocid": `marketplace.auction.settle_button.${index + 1}`,
                  children: isSettling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "Settle"
                }
              ),
              !ended && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "text-destructive border-destructive/40 hover:bg-destructive/10 transition-smooth",
                  onClick: (event) => {
                    event.stopPropagation();
                    onCancel(listing.id);
                  },
                  disabled: isCancelling,
                  "data-ocid": `marketplace.auction.cancel_button.${index + 1}`,
                  children: isCancelling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 mr-1" }),
                    "Cancel"
                  ] })
                }
              )
            ] }) : !ended && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth shrink-0 font-semibold",
                onClick: (event) => {
                  event.stopPropagation();
                  onBid(listing);
                },
                "data-ocid": `marketplace.auction.bid_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-3 h-3 mr-1" }),
                  "Bid"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ListNFTModal({
  open,
  onClose,
  userNFTs,
  collections,
  onList,
  isListing
}) {
  const [selectedNFT, setSelectedNFT] = reactExports.useState(null);
  const [mode, setMode] = reactExports.useState("fixed");
  const [price, setPrice] = reactExports.useState("");
  const [startBid, setStartBid] = reactExports.useState("");
  const [endDays, setEndDays] = reactExports.useState("3");
  const reset = reactExports.useCallback(() => {
    setSelectedNFT(null);
    setMode("fixed");
    setPrice("");
    setStartBid("");
    setEndDays("3");
  }, []);
  reactExports.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);
  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedNFT) return;
    if (mode === "fixed") {
      const p = parseICP(price);
      if (!p) return ue.error("Enter a valid price");
      onList({ type: "fixed", nftId: selectedNFT, price: p });
    } else {
      const bid = parseICP(startBid);
      if (!bid) return ue.error("Enter a valid starting bid");
      const days = Number.parseInt(endDays, 10);
      if (Number.isNaN(days) || days < 1)
        return ue.error("Duration must be at least 1 day");
      const endTimeNs = BigInt(Date.now() + days * 864e5) * 1000000n;
      onList({
        type: "auction",
        nftId: selectedNFT,
        startingBid: bid,
        endTime: endTimeNs
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md max-h-[90vh] overflow-y-auto",
      "data-ocid": "marketplace.list_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: "List Your NFT" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 mb-3 rounded-lg border border-accent/30 bg-accent/5 p-3 flex gap-2.5 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full bg-accent/30 flex items-center justify-center mt-0.5 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent text-[10px] font-bold", children: "!" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Your NFT will be held securely by the app until the sale completes. You'll receive the ICP proceeds automatically, less the 2% Mintlab marketplace fee." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Select NFT" }),
            userNFTs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg", children: "No vaulted or minted NFTs available to list yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1", children: userNFTs.map((nft) => {
              const nftName = nft.metadata.name ?? `#${nft.tokenId}`;
              const collection = collections.find(
                (item) => item.id === nft.collectionId
              );
              const selected = selectedNFT === nft.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedNFT(nft.id),
                  className: `rounded-lg border overflow-hidden transition-smooth text-left ${selected ? "border-accent ring-1 ring-accent/50" : "border-border hover:border-accent/40"}`,
                  "data-ocid": "marketplace.list_nft_select",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MediaImage,
                      {
                        src: nft.metadata.imageUrl,
                        alt: nftName,
                        assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
                        tokenId: nft.tokenId,
                        className: "w-full h-full object-cover",
                        fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-5 h-5 text-muted-foreground/40" }) })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-1.5 py-1 text-[10px] font-mono text-foreground/80 truncate", children: nftName })
                  ]
                },
                nft.id.toString()
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Listing Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setMode("fixed"),
                  className: `flex-1 py-2 rounded-lg border text-sm font-medium transition-smooth ${mode === "fixed" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`,
                  "data-ocid": "marketplace.list_type_fixed",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3.5 h-3.5 inline mr-1.5" }),
                    "Fixed Price"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setMode("auction"),
                  className: `flex-1 py-2 rounded-lg border text-sm font-medium transition-smooth ${mode === "auction" ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-border/80"}`,
                  "data-ocid": "marketplace.list_type_auction",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-3.5 h-3.5 inline mr-1.5" }),
                    "Auction"
                  ]
                }
              )
            ] })
          ] }),
          mode === "fixed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "list-price",
                className: "text-xs text-muted-foreground uppercase tracking-wider",
                children: "Price (ICP)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "list-price",
                type: "text",
                inputMode: "decimal",
                placeholder: "e.g. 15.5",
                value: price,
                onChange: (e) => setPrice(e.target.value),
                className: "bg-background border-input font-mono",
                "data-ocid": "marketplace.list_price_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use any positive ICP amount with up to 8 decimals." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "list-startbid",
                  className: "text-xs text-muted-foreground uppercase tracking-wider",
                  children: "Starting Bid (ICP)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "list-startbid",
                  type: "text",
                  inputMode: "decimal",
                  placeholder: "e.g. 5.0",
                  value: startBid,
                  onChange: (e) => setStartBid(e.target.value),
                  className: "bg-background border-input font-mono",
                  "data-ocid": "marketplace.list_startbid_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use any positive ICP amount with up to 8 decimals." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "list-duration",
                  className: "text-xs text-muted-foreground uppercase tracking-wider",
                  children: "Duration (days)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "list-duration",
                  type: "number",
                  min: "1",
                  max: "30",
                  step: "1",
                  placeholder: "e.g. 3",
                  value: endDays,
                  onChange: (e) => setEndDays(e.target.value),
                  className: "bg-background border-input font-mono",
                  "data-ocid": "marketplace.list_duration_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1 border-border",
                onClick: onClose,
                "data-ocid": "marketplace.list_cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: isListing || !selectedNFT,
                className: "flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold",
                "data-ocid": "marketplace.list_submit_button",
                children: isListing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "List NFT"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function PlaceBidModal({
  listing,
  nft,
  ledgerFeeE8s,
  auctionBidFeeReserveE8s,
  mintlabFeeBps,
  onClose,
  onBid,
  isBidding
}) {
  const [bidAmount, setBidAmount] = reactExports.useState("");
  const [pendingBidAmount, setPendingBidAmount] = reactExports.useState(null);
  const [confirmBidOpen, setConfirmBidOpen] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (listing) {
      setBidAmount("");
      setPendingBidAmount(null);
      setConfirmBidOpen(false);
      setTimeout(() => {
        var _a;
        return (_a = inputRef.current) == null ? void 0 : _a.focus();
      }, 100);
    }
  }, [listing]);
  if (!listing) return null;
  const minBid = listing.highestBid > 0n ? listing.highestBid + 1n : listing.startingBid;
  const minBidICP = formatICPAmount(minBid);
  const name = (nft == null ? void 0 : nft.metadata.name) ?? `NFT #${(nft == null ? void 0 : nft.tokenId) ?? "?"}`;
  const pendingAmount = pendingBidAmount ?? 0n;
  const pendingMintlabFee = marketplaceFee(pendingAmount, mintlabFeeBps);
  const escrowDeposit = pendingAmount + auctionBidFeeReserveE8s;
  const maximumDebit = escrowDeposit + ledgerFeeE8s;
  function handleSubmit(e) {
    e.preventDefault();
    if (!listing) return;
    const amount = parseICP(bidAmount);
    if (!amount) return ue.error("Enter a valid bid amount");
    if (amount < minBid) {
      return ue.error(`Bid must be at least ${minBidICP} ICP`);
    }
    setPendingBidAmount(amount);
    setConfirmBidOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!listing, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-sm",
        "data-ocid": "marketplace.bid_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: "Place a Bid" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground -mt-1", children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border border-border p-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: listing.highestBid > 0n ? "Current top bid" : "Starting bid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                PriceDisplay,
                {
                  e8s: listing.highestBid > 0n ? listing.highestBid : listing.startingBid,
                  size: "sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "bid-amount",
                  className: "text-xs text-muted-foreground uppercase tracking-wider",
                  children: [
                    "Your Bid (ICP) — min ",
                    minBidICP
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "bid-amount",
                  ref: inputRef,
                  type: "text",
                  inputMode: "decimal",
                  placeholder: minBidICP,
                  value: bidAmount,
                  onChange: (e) => setBidAmount(e.target.value),
                  className: "bg-background border-input font-mono",
                  "data-ocid": "marketplace.bid_amount_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Enter any positive ICP amount with up to 8 decimals." })
            ] }),
            bidAmount.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground", children: [
              "If confirmed,",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-foreground", children: [
                bidAmount.trim(),
                " ICP"
              ] }),
              " ",
              "plus escrow fee reserves moves from your in-app account into auction escrow now."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "flex-1 border-border",
                  onClick: onClose,
                  "data-ocid": "marketplace.bid_cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: isBidding,
                  className: "flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold",
                  "data-ocid": "marketplace.bid_confirm_button",
                  children: isBidding ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "Review Bid"
                }
              )
            ] })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentConfirmationDialog,
      {
        open: confirmBidOpen,
        onOpenChange: setConfirmBidOpen,
        title: "Fund Auction Escrow",
        description: "Your bid is held in escrow until you are outbid or the auction settles. Outbid refunds return the bid and unused reserve, but ledger transfers into escrow and back still cost a small amount of ICP.",
        lines: [
          {
            label: "Bid amount",
            value: `${formatICPAmount(pendingAmount)} ICP`
          },
          {
            label: "Mintlab fee if won",
            value: `${formatICPAmount(pendingMintlabFee)} ICP`,
            helper: "Deducted from seller proceeds."
          },
          {
            label: "Escrow fee reserve",
            value: `${formatICPAmount(auctionBidFeeReserveE8s)} ICP`,
            helper: "Reserved to settle the sale or refund you if outbid."
          },
          {
            label: "Transfer to escrow fee",
            value: `${formatICPAmount(ledgerFeeE8s)} ICP`
          },
          {
            label: "Total debit now",
            value: `${formatICPAmount(maximumDebit)} ICP`
          }
        ],
        confirmLabel: "Fund Escrow",
        isPending: isBidding,
        onConfirm: () => {
          if (pendingBidAmount == null) return;
          onBid(listing.id, pendingBidAmount);
        },
        ocid: "marketplace.bid.payment_dialog"
      }
    )
  ] });
}
function MarketplacePage() {
  var _a;
  const { actor, isFetching: actorLoading } = useBackend();
  const { isAuthenticated, principal, login } = useAuth();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = reactExports.useState("fixed");
  const [buyTarget, setBuyTarget] = reactExports.useState(null);
  const [cancelTarget, setCancelTarget] = reactExports.useState(null);
  const [bidTarget, setBidTarget] = reactExports.useState(null);
  const [listModalOpen, setListModalOpen] = reactExports.useState(false);
  const [detailTarget, setDetailTarget] = reactExports.useState(null);
  const { data: listingDetails = [], isLoading: listingsLoading } = useQuery({
    queryKey: ["activeListingDetails"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveListingDetails();
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 3e4
  });
  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor && !actorLoading
  });
  const { data: marketplaceFeeConfig } = useQuery({
    queryKey: ["marketplaceFeeConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarketplaceFeeConfig();
    },
    enabled: !!actor && !actorLoading,
    staleTime: 6e4
  });
  const { data: userNFTs = [] } = useQuery({
    queryKey: ["userNFTs", principal == null ? void 0 : principal.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getUserNFTs(principal);
    },
    enabled: !!actor && !actorLoading && isAuthenticated && !!principal
  });
  const collectionMap = new Map(
    collections.map((collection) => [collection.id, collection])
  );
  const { data: listingDividendBalances = [] } = useQuery({
    queryKey: [
      "marketplaceDividendBalances",
      listingDetails.map((detail) => detail.nft.collectionId.toString()).join(","),
      collections.map((collection) => collection.id.toString()).join(",")
    ],
    queryFn: async () => {
      var _a2;
      if (!actor) return [];
      const entries = [];
      const collectionIds = Array.from(
        new Set(listingDetails.map((detail) => detail.nft.collectionId))
      );
      for (const collectionId of collectionIds) {
        const collection = collectionMap.get(collectionId);
        if (!((_a2 = collection == null ? void 0 : collection.dividendConfig) == null ? void 0 : _a2.enabled)) continue;
        const balances = await actor.refreshCollectionDividendBalances(collectionId);
        for (const [tokenId, balance] of balances) {
          entries.push([`${collectionId.toString()}:${tokenId}`, balance]);
        }
      }
      return entries;
    },
    enabled: !!actor && !actorLoading && listingDetails.length > 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 3e4
  });
  const listingDividendMap = new Map(listingDividendBalances);
  const ledgerFeeE8s = (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.ledgerFeeE8s) ?? DEFAULT_ICP_LEDGER_FEE_E8S;
  const auctionBidFeeReserveE8s = (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.auctionBidFeeReserveE8s) ?? ledgerFeeE8s * 2n;
  const mintlabFeeBps = (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.mintlabFeeBasisPoints) ?? DEFAULT_MINTLAB_FEE_BPS;
  const fixedListings = listingDetails.flatMap(
    (detail) => detail.listing.__kind__ === "Fixed" ? [
      {
        listing: detail.listing.Fixed,
        nft: detail.nft,
        collection: collectionMap.get(detail.nft.collectionId)
      }
    ] : []
  );
  const buyListingDetail = buyTarget == null ? null : fixedListings.find(({ listing }) => listing.id === buyTarget) ?? null;
  const auctionListings = listingDetails.flatMap(
    (detail) => detail.listing.__kind__ === "Auction" ? [
      {
        listing: detail.listing.Auction,
        nft: detail.nft,
        collection: collectionMap.get(detail.nft.collectionId)
      }
    ] : []
  );
  const listedNFTKeys = new Set(
    listingDetails.filter((detail) => {
      const seller = detail.listing.__kind__ === "Fixed" ? detail.listing.Fixed.seller : detail.listing.Auction.seller;
      return principal ? seller.toString() === principal.toString() : false;
    }).map(
      (detail) => `${detail.nft.collectionId.toString()}:${detail.nft.tokenId}`
    )
  );
  const listableUserNFTs = userNFTs.filter(
    (nft) => (nft.location === "Minted" || nft.location === "Vaulted") && !listedNFTKeys.has(`${nft.collectionId.toString()}:${nft.tokenId}`)
  );
  const refreshMarketplace = () => {
    void qc.invalidateQueries({ queryKey: ["activeListingDetails"] });
    void qc.invalidateQueries({ queryKey: ["activeListings"] });
    void qc.invalidateQueries({ queryKey: ["userNFTs"] });
    void qc.invalidateQueries({ queryKey: ["userStats"] });
    void qc.invalidateQueries({ queryKey: ["icp-balance"] });
  };
  const { mutate: buyListing, isPending: isBuying } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.buyFixedListing(id);
    },
    onSuccess: () => {
      ue.success("NFT purchased successfully!");
      setBuyTarget(null);
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Purchase failed: ${e.message}`)
  });
  const { mutate: cancelListing, isPending: isCancelling } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelListing(id);
    },
    onSuccess: () => {
      ue.success("Listing cancelled.");
      setCancelTarget(null);
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Cancel failed: ${e.message}`)
  });
  const { mutate: placeBid, isPending: isBidding } = useMutation({
    mutationFn: async ({ id, amount }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeBid(id, amount);
    },
    onSuccess: () => {
      ue.success("Bid placed and escrow funded!");
      setBidTarget(null);
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Bid failed: ${e.message}`)
  });
  const { mutate: settleAuction, isPending: isSettling } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.settleAuction(id);
    },
    onSuccess: () => {
      ue.success("Auction settled!");
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Settle failed: ${e.message}`)
  });
  const { mutate: createFixed, isPending: isCreatingFixed } = useMutation({
    mutationFn: async ({ nftId, price }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFixedListing(nftId, price);
    },
    onSuccess: () => {
      ue.success("Fixed listing created!");
      setListModalOpen(false);
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Listing failed: ${e.message}`)
  });
  const { mutate: createAuction, isPending: isCreatingAuction } = useMutation({
    mutationFn: async ({
      nftId,
      startingBid,
      endTime
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createAuctionListing(nftId, startingBid, endTime);
    },
    onSuccess: () => {
      ue.success("Auction listing created!");
      setListModalOpen(false);
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Listing failed: ${e.message}`)
  });
  const isListing = isCreatingFixed || isCreatingAuction;
  function handleList(params) {
    if (params.type === "fixed") {
      createFixed({ nftId: params.nftId, price: params.price });
    } else {
      createAuction({
        nftId: params.nftId,
        startingBid: params.startingBid,
        endTime: params.endTime
      });
    }
  }
  const principalStr = (principal == null ? void 0 : principal.toString()) ?? null;
  const buyPrice = (buyListingDetail == null ? void 0 : buyListingDetail.listing.price) ?? 0n;
  const buyMintlabFee = marketplaceFee(buyPrice, mintlabFeeBps);
  const buySellerProceeds = buyPrice - buyMintlabFee;
  const buyLedgerFees = ledgerFeeE8s * (buyMintlabFee > 0n ? 2n : 1n);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "marketplace.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest font-mono mb-0.5", children: "Marketplace" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground leading-tight", children: "Discover Digital Collectibles" })
      ] }),
      isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold shrink-0",
          onClick: () => setListModalOpen(true),
          "data-ocid": "marketplace.list_nft_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-4 h-4 mr-2" }),
            "List Your NFT"
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "border-accent/40 text-accent hover:bg-accent/10 transition-smooth shrink-0",
          onClick: login,
          "data-ocid": "marketplace.login_button",
          children: "Connect Wallet to List"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: activeTab,
        onValueChange: (v) => setActiveTab(v),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              className: "bg-muted/60 border border-border mb-6",
              "data-ocid": "marketplace.tabs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "fixed",
                    className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium",
                    "data-ocid": "marketplace.tab.fixed",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4 mr-2" }),
                      "Fixed Price",
                      fixedListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 bg-primary/20 text-primary text-[10px] px-1.5 py-0 font-mono border-0", children: fixedListings.length })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "auctions",
                    className: "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-medium",
                    "data-ocid": "marketplace.tab.auctions",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-4 h-4 mr-2" }),
                      "Auctions",
                      auctionListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 bg-accent/20 text-accent text-[10px] px-1.5 py-0 font-mono border-0", children: auctionListings.length })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "fixed", className: "mt-0", children: listingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center min-h-[40vh]",
              "data-ocid": "marketplace.fixed.loading_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading listings…" })
            }
          ) : fixedListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: ShoppingBag,
              title: "No fixed-price listings",
              description: "Be the first to list an NFT for a fixed price. Connect your wallet and click 'List Your NFT' above.",
              action: isAuthenticated ? {
                label: "List Your NFT",
                onClick: () => setListModalOpen(true),
                "data-ocid": "marketplace.fixed.list_cta"
              } : void 0,
              "data-ocid": "marketplace.fixed.empty_state"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: fixedListings.map(({ listing, nft, collection }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            FixedListingCard,
            {
              listing,
              nft,
              collection,
              dividendE8s: listingDividendMap.get(
                nftKey(nft.collectionId, nft.tokenId)
              ) ?? 0n,
              index: i,
              currentPrincipal: principalStr,
              onBuy: (id) => setBuyTarget(id),
              onCancel: (id) => setCancelTarget(id),
              onDetails: () => setDetailTarget({
                listing: { __kind__: "Fixed", Fixed: listing },
                nft,
                collection,
                dividendE8s: listingDividendMap.get(
                  nftKey(nft.collectionId, nft.tokenId)
                ) ?? 0n
              }),
              isBuying: isBuying && buyTarget === listing.id,
              isCancelling: isCancelling && cancelTarget === listing.id
            },
            listing.id.toString()
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "auctions", className: "mt-0", children: listingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center min-h-[40vh]",
              "data-ocid": "marketplace.auction.loading_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading auctions…" })
            }
          ) : auctionListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Gavel,
              title: "No active auctions",
              description: "No NFTs are currently up for auction. List yours to start the bidding!",
              action: isAuthenticated ? {
                label: "Start an Auction",
                onClick: () => setListModalOpen(true),
                "data-ocid": "marketplace.auction.list_cta"
              } : void 0,
              "data-ocid": "marketplace.auction.empty_state"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: auctionListings.map(({ listing, nft, collection }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            AuctionListingCard,
            {
              listing,
              nft,
              collection,
              dividendE8s: listingDividendMap.get(
                nftKey(nft.collectionId, nft.tokenId)
              ) ?? 0n,
              index: i,
              currentPrincipal: principalStr,
              onBid: (l) => setBidTarget(l),
              onSettle: (id) => settleAuction(id),
              onCancel: (id) => setCancelTarget(id),
              onDetails: () => setDetailTarget({
                listing: { __kind__: "Auction", Auction: listing },
                nft,
                collection,
                dividendE8s: listingDividendMap.get(
                  nftKey(nft.collectionId, nft.tokenId)
                ) ?? 0n
              }),
              isSettling,
              isCancelling: isCancelling && cancelTarget === listing.id
            },
            listing.id.toString()
          )) }) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ListingDetailModal,
      {
        detail: detailTarget,
        currentPrincipal: principalStr,
        onClose: () => setDetailTarget(null),
        onBuy: (id) => setBuyTarget(id),
        onCancel: (id) => setCancelTarget(id),
        onBid: (listing) => setBidTarget(listing)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: buyTarget !== null,
        onOpenChange: (v) => !v && setBuyTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            className: "bg-card border-border",
            "data-ocid": "marketplace.buy_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Confirm Purchase" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Confirm the ICP payment from your in-app account before this NFT is purchased and sent to you." })
              ] }),
              buyListingDetail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Listed price" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(buyListingDetail.listing.price),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    "Mintlab fee",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] leading-snug", children: "Deducted from seller proceeds" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(buyMintlabFee),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Seller receives" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(buySellerProceeds),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Ledger fees" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(buyLedgerFees),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 border-t border-border pt-2 font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total debit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(buyPrice + buyLedgerFees),
                    " ICP"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    className: "border-border",
                    "data-ocid": "marketplace.buy_cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    className: "bg-accent text-accent-foreground hover:bg-accent/90",
                    onClick: () => buyTarget !== null && buyListing(buyTarget),
                    "data-ocid": "marketplace.buy_confirm_button",
                    children: isBuying ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "Confirm Purchase"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: cancelTarget !== null,
        onOpenChange: (v) => !v && setCancelTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            className: "bg-card border-border",
            "data-ocid": "marketplace.cancel_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Cancel Listing" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to cancel this listing? Your NFT will be returned to your wallet." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    className: "border-border",
                    "data-ocid": "marketplace.cancel_keep_button",
                    children: "Keep Listing"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    onClick: () => cancelTarget !== null && cancelListing(cancelTarget),
                    "data-ocid": "marketplace.cancel_confirm_button",
                    children: isCancelling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "Cancel Listing"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlaceBidModal,
      {
        listing: bidTarget,
        nft: bidTarget ? (_a = auctionListings.find(({ listing }) => listing.id === bidTarget.id)) == null ? void 0 : _a.nft : void 0,
        ledgerFeeE8s,
        auctionBidFeeReserveE8s,
        mintlabFeeBps,
        onClose: () => setBidTarget(null),
        onBid: (id, amount) => placeBid({ id, amount }),
        isBidding
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ListNFTModal,
      {
        open: listModalOpen,
        onClose: () => setListModalOpen(false),
        userNFTs: listableUserNFTs,
        collections,
        onList: handleList,
        isListing
      }
    )
  ] });
}
export {
  MarketplacePage as default
};
