import { Q as QueryObserver, n as infiniteQueryBehavior, o as hasPreviousPage, p as hasNextPage, q as useBaseQuery, c as createLucideIcon, r as reactExports, g as useComposedRefs, j as jsxRuntimeExports, a as cn, b as useBackend, u as useAuth, k as useAdmin, d as useQueryClient, e as useQuery, s as AnimatePresence, m as motion, B as Button, f as ue, C as CircleDollarSign, X, G as Grid3x3, P as Principal, h as LoadingSpinner } from "./index-C71bI6gW.js";
import { i as isLowCyclesError, A as AppCanisterTopUpDialog } from "./AppCanisterTopUpDialog-YQix8Ufz.js";
import { E as EmptyState, M as MediaImage } from "./MediaImage-DBL69kJb.js";
import { T as Tag, P as PaymentConfirmationDialog } from "./PaymentConfirmationDialog-DrHIa_et.js";
import { P as Primitive, f as Presence, b as createContextScope, c as composeEventHandlers, e as useCallbackRef, h as useLayoutEffect2, u as useMutation, B as Badge, I as Input, L as Label } from "./badge-Chchxgvx.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent, R as RefreshCw } from "./card-IDTguvk9.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BIIqjVvo.js";
import { u as useDirection } from "./index-Vk_nqGrH.js";
import { f as clamp, L as Layers, E as ExternalLink, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Textarea, C as Check, I as Info } from "./textarea-BPWjsvS8.js";
import { S as Skeleton, C as Copy } from "./skeleton-5N31WYcW.js";
import { S as Switch, T as Trash2 } from "./switch-ec_z04-i.js";
import { r as resolveImageUrl, I as ImageOff } from "./media-BUtul1vm.js";
import { S as Sparkles } from "./sparkles-DyJbPcsS.js";
import { L as LoaderCircle, P as Plus } from "./plus-DfwTHhHr.js";
var InfiniteQueryObserver = class extends QueryObserver {
  constructor(client, options) {
    super(client, options);
  }
  bindMethods() {
    super.bindMethods();
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
  }
  setOptions(options) {
    super.setOptions({
      ...options,
      behavior: infiniteQueryBehavior()
    });
  }
  getOptimisticResult(options) {
    options.behavior = infiniteQueryBehavior();
    return super.getOptimisticResult(options);
  }
  fetchNextPage(options) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: { direction: "forward" }
      }
    });
  }
  fetchPreviousPage(options) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: { direction: "backward" }
      }
    });
  }
  createResult(query, options) {
    var _a, _b;
    const { state } = query;
    const parentResult = super.createResult(query, options);
    const { isFetching, isRefetching, isError, isRefetchError } = parentResult;
    const fetchDirection = (_b = (_a = state.fetchMeta) == null ? void 0 : _a.fetchMore) == null ? void 0 : _b.direction;
    const isFetchNextPageError = isError && fetchDirection === "forward";
    const isFetchingNextPage = isFetching && fetchDirection === "forward";
    const isFetchPreviousPageError = isError && fetchDirection === "backward";
    const isFetchingPreviousPage = isFetching && fetchDirection === "backward";
    const result = {
      ...parentResult,
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: hasNextPage(options, state.data),
      hasPreviousPage: hasPreviousPage(options, state.data),
      isFetchNextPageError,
      isFetchingNextPage,
      isFetchPreviousPageError,
      isFetchingPreviousPage,
      isRefetchError: isRefetchError && !isFetchNextPageError && !isFetchPreviousPageError,
      isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage
    };
    return result;
  }
};
function useInfiniteQuery(options, queryClient) {
  return useBaseQuery(
    options,
    InfiniteQueryObserver
  );
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var SCROLL_AREA_NAME = "ScrollArea";
var [createScrollAreaContext] = createContextScope(SCROLL_AREA_NAME);
var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
var ScrollArea$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeScrollArea,
      type = "hover",
      dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const [content, setContent] = reactExports.useState(null);
    const [scrollbarX, setScrollbarX] = reactExports.useState(null);
    const [scrollbarY, setScrollbarY] = reactExports.useState(null);
    const [cornerWidth, setCornerWidth] = reactExports.useState(0);
    const [cornerHeight, setCornerHeight] = reactExports.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = reactExports.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = reactExports.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
    const direction = useDirection(dir);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaProvider,
      {
        scope: __scopeScrollArea,
        type,
        dir: direction,
        scrollHideDelay,
        scrollArea,
        viewport,
        onViewportChange: setViewport,
        content,
        onContentChange: setContent,
        scrollbarX,
        onScrollbarXChange: setScrollbarX,
        scrollbarXEnabled,
        onScrollbarXEnabledChange: setScrollbarXEnabled,
        scrollbarY,
        onScrollbarYChange: setScrollbarY,
        scrollbarYEnabled,
        onScrollbarYEnabledChange: setScrollbarYEnabled,
        onCornerWidthChange: setCornerWidth,
        onCornerHeightChange: setCornerHeight,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            ...scrollAreaProps,
            ref: composedRefs,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
              ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
              ...props.style
            }
          }
        )
      }
    );
  }
);
ScrollArea$1.displayName = SCROLL_AREA_NAME;
var VIEWPORT_NAME = "ScrollAreaViewport";
var ScrollAreaViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
    const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-scroll-area-viewport": "",
          ...viewportProps,
          ref: composedRefs,
          style: {
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
            ...props.style
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
        }
      )
    ] });
  }
);
ScrollAreaViewport.displayName = VIEWPORT_NAME;
var SCROLLBAR_NAME = "ScrollAreaScrollbar";
var ScrollAreaScrollbar = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
    const isHorizontal = props.orientation === "horizontal";
    reactExports.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === "hover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
  }
);
ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
var ScrollAreaScrollbarHover = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
      };
      scrollArea.addEventListener("pointerenter", handlePointerEnter);
      scrollArea.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener("pointerenter", handlePointerEnter);
        scrollArea.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarAuto,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarScroll = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const isHorizontal = props.orientation === "horizontal";
  const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
  const [state, send] = useStateMachine("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  reactExports.useEffect(() => {
    if (state === "idle") {
      const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
      return () => window.clearTimeout(hideTimer);
    }
  }, [state, context.scrollHideDelay, send]);
  reactExports.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || state !== "hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": state === "hidden" ? "hidden" : "visible",
      ...scrollbarProps,
      ref: forwardedRef,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
    }
  ) });
});
var ScrollAreaScrollbarAuto = reactExports.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = reactExports.useState(false);
  const isHorizontal = props.orientation === "horizontal";
  const handleResize = useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);
  useResizeObserver(context.viewport, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarVisible = reactExports.forwardRef((props, forwardedRef) => {
  const { orientation = "vertical", ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = reactExports.useRef(null);
  const pointerOffsetRef = reactExports.useRef(0);
  const [sizes, setSizes] = reactExports.useState({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  });
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
  const commonProps = {
    ...scrollbarProps,
    sizes,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => thumbRef.current = thumb,
    onThumbPointerUp: () => pointerOffsetRef.current = 0,
    onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
  };
  function getScrollPosition(pointerPos, dir) {
    return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
  }
  if (orientation === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarX,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollLeft;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
            thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
          }
        }
      }
    );
  }
  if (orientation === "vertical") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarY,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollTop;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes);
            thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
        }
      }
    );
  }
  return null;
});
var ScrollAreaScrollbarX = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "horizontal",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        bottom: 0,
        left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
        right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
        ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollWidth,
            viewport: context.viewport.offsetWidth,
            scrollbar: {
              size: ref.current.clientWidth,
              paddingStart: toInt(computedStyle.paddingLeft),
              paddingEnd: toInt(computedStyle.paddingRight)
            }
          });
        }
      }
    }
  );
});
var ScrollAreaScrollbarY = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "vertical",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        top: 0,
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: "var(--radix-scroll-area-corner-height)",
        ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollHeight,
            viewport: context.viewport.offsetHeight,
            scrollbar: {
              size: ref.current.clientHeight,
              paddingStart: toInt(computedStyle.paddingTop),
              paddingEnd: toInt(computedStyle.paddingBottom)
            }
          });
        }
      }
    }
  );
});
var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
var ScrollAreaScrollbarImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeScrollArea,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = reactExports.useState(null);
  const composeRefs = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = reactExports.useRef(null);
  const prevWebkitUserSelectRef = reactExports.useRef("");
  const viewport = context.viewport;
  const maxScrollPos = sizes.content - sizes.viewport;
  const handleWheelScroll = useCallbackRef(onWheelScroll);
  const handleThumbPositionChange = useCallbackRef(onThumbPositionChange);
  const handleResize = useDebounceCallback(onResize, 10);
  function handleDragScroll(event) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }
  reactExports.useEffect(() => {
    const handleWheel = (event) => {
      const element = event.target;
      const isScrollbarWheel = scrollbar == null ? void 0 : scrollbar.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel, { passive: false });
  }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
  reactExports.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
  useResizeObserver(scrollbar, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollbarProvider,
    {
      scope: __scopeScrollArea,
      scrollbar,
      hasThumb,
      onThumbChange: useCallbackRef(onThumbChange),
      onThumbPointerUp: useCallbackRef(onThumbPointerUp),
      onThumbPositionChange: handleThumbPositionChange,
      onThumbPointerDown: useCallbackRef(onThumbPointerDown),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          ...scrollbarProps,
          ref: composeRefs,
          style: { position: "absolute", ...scrollbarProps.style },
          onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
            const mainPointer = 0;
            if (event.button === mainPointer) {
              const element = event.target;
              element.setPointerCapture(event.pointerId);
              rectRef.current = scrollbar.getBoundingClientRect();
              prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
              document.body.style.webkitUserSelect = "none";
              if (context.viewport) context.viewport.style.scrollBehavior = "auto";
              handleDragScroll(event);
            }
          }),
          onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
          onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
            const element = event.target;
            if (element.hasPointerCapture(event.pointerId)) {
              element.releasePointerCapture(event.pointerId);
            }
            document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
            if (context.viewport) context.viewport.style.scrollBehavior = "";
            rectRef.current = null;
          })
        }
      )
    }
  );
});
var THUMB_NAME = "ScrollAreaThumb";
var ScrollAreaThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...thumbProps } = props;
    const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || scrollbarContext.hasThumb, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
  }
);
var ScrollAreaThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, style, ...thumbProps } = props;
    const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = useComposedRefs(
      forwardedRef,
      (node) => scrollbarContext.onThumbChange(node)
    );
    const removeUnlinkedScrollListenerRef = reactExports.useRef(void 0);
    const debounceScrollEnd = useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = void 0;
      }
    }, 100);
    reactExports.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        ...thumbProps,
        ref: composedRef,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...style
        },
        onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
          const thumb = event.target;
          const thumbRect = thumb.getBoundingClientRect();
          const x = event.clientX - thumbRect.left;
          const y = event.clientY - thumbRect.top;
          scrollbarContext.onThumbPointerDown({ x, y });
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
      }
    );
  }
);
ScrollAreaThumb.displayName = THUMB_NAME;
var CORNER_NAME = "ScrollAreaCorner";
var ScrollAreaCorner = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
  }
);
ScrollAreaCorner.displayName = CORNER_NAME;
var ScrollAreaCornerImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
  const [width, setWidth] = reactExports.useState(0);
  const [height, setHeight] = reactExports.useState(0);
  const hasSize = Boolean(width && height);
  useResizeObserver(context.scrollbarX, () => {
    var _a;
    const height2 = ((_a = context.scrollbarX) == null ? void 0 : _a.offsetHeight) || 0;
    context.onCornerHeightChange(height2);
    setHeight(height2);
  });
  useResizeObserver(context.scrollbarY, () => {
    var _a;
    const width2 = ((_a = context.scrollbarY) == null ? void 0 : _a.offsetWidth) || 0;
    context.onCornerWidthChange(width2);
    setWidth(width2);
  });
  return hasSize ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      ...cornerProps,
      ref: forwardedRef,
      style: {
        width,
        height,
        position: "absolute",
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: 0,
        ...props.style
      }
    }
  ) : null;
});
function toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
var addUnlinkedScrollListener = (node, handler = () => {
}) => {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function useDebounceCallback(callback, delay) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return reactExports.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}
function useResizeObserver(element, onResize) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
var Root = ScrollArea$1;
var Viewport = ScrollAreaViewport;
var Corner = ScrollAreaCorner;
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
function standardLabel(standard) {
  if (standard.__kind__ === "EXT") return "EXT";
  if (standard.__kind__ === "DIP721") return "DIP721";
  if (standard.__kind__ === "ICRC7") return "ICRC-7";
  return standard.Other ?? "Other";
}
function nftKey(collectionId, tokenId) {
  return `${collectionId.toString()}:${tokenId}`;
}
const E8S = 100000000n;
const MAX_ON_CHAIN_IMAGE_CHARS = 15e5;
function formatICP(e8s) {
  const whole = e8s / E8S;
  const fraction = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
function formatCycles(cycles) {
  const trillion = 1000000000000n;
  if (cycles < trillion) return cycles.toString();
  const hundredths = cycles * 100n / trillion;
  const whole = hundredths / 100n;
  const fraction = (hundredths % 100n).toString().padStart(2, "0");
  return `${whole}.${fraction}T`;
}
function accountIdToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function makeStandard(value) {
  if (value === "EXT") return { __kind__: "EXT", EXT: null };
  if (value === "DIP721") return { __kind__: "DIP721", DIP721: null };
  return { __kind__: "ICRC7", ICRC7: null };
}
function parseOptionalNat(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) {
    throw new Error("Enter whole numbers only for browse settings");
  }
  return BigInt(trimmed);
}
function parseCyclesInput(value) {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  return BigInt(trimmed);
}
function buildBrowseInfo(standard, totalSupply, tokenIndexOffset) {
  if (standard === "ICRC7") return null;
  const parsedTotalSupply = parseOptionalNat(totalSupply);
  const parsedTokenIndexOffset = parseOptionalNat(tokenIndexOffset);
  if (parsedTotalSupply == null && parsedTokenIndexOffset == null) {
    return null;
  }
  return {
    totalSupply: parsedTotalSupply,
    tokenIndexOffset: parsedTokenIndexOffset
  };
}
function browseCoverageLabel(stats) {
  if (stats.coverage === "Full") {
    return `${stats.totalCount.toString()} NFT${stats.totalCount === 1n ? "" : "s"}`;
  }
  return `${stats.visibleCount.toString()} indexed`;
}
function isValidPrincipal(value) {
  try {
    Principal.fromText(value);
    return true;
  } catch {
    return false;
  }
}
function extractError(err) {
  if (err instanceof Error) return err.message || "Something went wrong";
  if (typeof err === "string") return err;
  return "Something went wrong";
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read image file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}
async function readImageFileAsDataUrl(file) {
  if (file.type && !file.type.startsWith("image/")) {
    throw new Error("Choose an image file");
  }
  const dataUrl = await readFileAsDataUrl(file);
  if (dataUrl.length > MAX_ON_CHAIN_IMAGE_CHARS) {
    throw new Error("Uploaded image is too large for on-chain storage");
  }
  return dataUrl;
}
function CopyField({ label, value, ocid }) {
  const [copied, setCopied] = reactExports.useState(false);
  function handleCopy() {
    void navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    ue.success(`${label} copied`);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/40 border border-border rounded-lg px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground truncate flex-1 min-w-0", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          variant: "ghost",
          className: "shrink-0 h-7 w-7 text-muted-foreground hover:text-foreground",
          onClick: handleCopy,
          "aria-label": `Copy ${label}`,
          "data-ocid": ocid,
          children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
        }
      )
    ] })
  ] });
}
const defaultImportValues = {
  name: "",
  symbol: "",
  description: "",
  canisterId: "",
  standard: "EXT",
  imageUrl: "",
  totalSupply: "",
  tokenIndexOffset: ""
};
function ImportCollectionCard({
  onImported
}) {
  const { actor } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [values, setValues] = reactExports.useState(defaultImportValues);
  const [imageDataUrl, setImageDataUrl] = reactExports.useState("");
  const [imageFileName, setImageFileName] = reactExports.useState("");
  const [imageFileInputKey, setImageFileInputKey] = reactExports.useState(0);
  const importMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!isAuthenticated) throw new Error("Sign in to import a collection");
      if (!values.name.trim()) throw new Error("Collection name is required");
      if (!values.symbol.trim())
        throw new Error("Collection symbol is required");
      if (!values.description.trim())
        throw new Error("Collection description is required");
      if (!isValidPrincipal(values.canisterId.trim())) {
        throw new Error("Enter a valid collection canister ID");
      }
      const collectionImage = (imageDataUrl || values.imageUrl).trim();
      if (!collectionImage) {
        throw new Error("Upload a collection image or add an image URL");
      }
      if (collectionImage.length > MAX_ON_CHAIN_IMAGE_CHARS) {
        throw new Error("Collection image is too large for on-chain storage");
      }
      return actor.addCollection(
        values.name.trim(),
        values.description.trim(),
        Principal.fromText(values.canisterId.trim()),
        makeStandard(values.standard),
        collectionImage,
        values.symbol.trim().toUpperCase(),
        buildBrowseInfo(
          values.standard,
          values.totalSupply,
          values.tokenIndexOffset
        )
      );
    },
    onSuccess: (collection) => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      ue.success(
        `${collection.name} is now available to everyone in Mintlab`
      );
      setValues(defaultImportValues);
      setImageDataUrl("");
      setImageFileName("");
      setImageFileInputKey((current) => current + 1);
      onImported(collection);
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  function updateField(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }
  function updateImageUrl(value) {
    if (imageDataUrl) {
      setImageFileInputKey((current) => current + 1);
    }
    setImageDataUrl("");
    setImageFileName("");
    updateField("imageUrl", value);
  }
  async function handleImportImageFile(file) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      setImageFileName(file.name);
      updateField("imageUrl", "");
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  const selectedImage = imageDataUrl || values.imageUrl;
  const imagePreviewUrl = resolveImageUrl(selectedImage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 text-accent" }),
        "Import an ICP NFT Collection"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-sm", children: "Add a supported collection from another ICP app or website. Once it is added, the collection appears in Mintlab for every user." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "What you need" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1", children: "Paste the collection canister ID, choose the NFT standard, and add the display details you want Mintlab to show. EXT, DIP721, and ICRC-7 collections are supported. Add the collection size for EXT and DIP721 imports so everyone can browse the full collection." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-name", children: "Collection name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-name",
              value: values.name,
              onChange: (event) => updateField("name", event.target.value),
              placeholder: "e.g. Motoko Mugs",
              "data-ocid": "collections.import.name_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-symbol", children: "Symbol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-symbol",
              value: values.symbol,
              onChange: (event) => updateField("symbol", event.target.value.toUpperCase()),
              placeholder: "e.g. MUG",
              "data-ocid": "collections.import.symbol_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-description", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "import-description",
            rows: 3,
            value: values.description,
            onChange: (event) => updateField("description", event.target.value),
            placeholder: "Tell collectors what this collection is about…",
            "data-ocid": "collections.import.description_textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-canister", children: "Collection canister ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-canister",
              className: "font-mono text-sm",
              value: values.canisterId,
              onChange: (event) => updateField("canisterId", event.target.value),
              placeholder: "ryjl3-tyaaa-aaaaa-aaaba-cai",
              "data-ocid": "collections.import.canister_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-standard", children: "NFT standard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: values.standard,
              onValueChange: (value) => updateField("standard", value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    id: "import-standard",
                    "data-ocid": "collections.import.standard_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "EXT", children: "EXT" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "DIP721", children: "DIP721" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ICRC7", children: "ICRC-7" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      values.standard !== "ICRC7" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-supply", children: "Collection size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-supply",
              inputMode: "numeric",
              value: values.totalSupply,
              onChange: (event) => updateField("totalSupply", event.target.value),
              placeholder: "e.g. 1000",
              "data-ocid": "collections.import.total_supply_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Recommended for full browsing of imported ",
            values.standard,
            " ",
            "NFTs."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-offset", children: "First token index" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-offset",
              inputMode: "numeric",
              value: values.tokenIndexOffset,
              onChange: (event) => updateField("tokenIndexOffset", event.target.value),
              placeholder: "Default: 0",
              "data-ocid": "collections.import.token_offset_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use `1` if the collection starts token IDs at 1 instead of 0." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "import-image-file", children: "Collection image" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "import-image-file",
                type: "file",
                accept: "image/*",
                onChange: (event) => {
                  var _a;
                  return void handleImportImageFile(((_a = event.target.files) == null ? void 0 : _a[0]) ?? null);
                },
                "data-ocid": "collections.import.image_file_input"
              },
              imageFileInputKey
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: imageFileName || "Choose an image from this device" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "import-image",
                className: "text-xs text-muted-foreground",
                children: "Or image URL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "import-image",
                value: values.imageUrl,
                onChange: (event) => updateImageUrl(event.target.value),
                placeholder: "https://… or ipfs://…",
                "data-ocid": "collections.import.image_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0", children: imagePreviewUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imagePreviewUrl,
              alt: "Collection preview",
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-5 h-5 text-muted-foreground" }) })
        ] })
      ] }),
      !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "Sign in with Internet Identity to import a collection into the shared Mintlab directory." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => importMutation.mutate(),
          disabled: importMutation.isPending || !isAuthenticated,
          className: "gap-2",
          "data-ocid": "collections.import.submit_button",
          children: importMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
            "Importing…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Add Collection"
          ] })
        }
      ) })
    ] })
  ] });
}
function CreateCollectionCard({
  mintConfig,
  moderationConfig,
  onCreated
}) {
  const { actor } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [symbol, setSymbol] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [imageDataUrl, setImageDataUrl] = reactExports.useState("");
  const [imageFileName, setImageFileName] = reactExports.useState("");
  const [dividendsEnabled, setDividendsEnabled] = reactExports.useState(false);
  const [confirmCreateOpen, setConfirmCreateOpen] = reactExports.useState(false);
  const [cycleTopUpReason, setCycleTopUpReason] = reactExports.useState(null);
  const { data: creationQuote } = useQuery({
    queryKey: [
      "collectionCreationQuote",
      (mintConfig == null ? void 0 : mintConfig.collectionCanisterCycles.toString()) ?? "none",
      (mintConfig == null ? void 0 : mintConfig.collectionCreationPriceE8s.toString()) ?? "none"
    ],
    queryFn: async () => {
      if (!actor || !mintConfig) return null;
      return actor.quoteCollectionCreationCost(
        mintConfig.collectionCanisterCycles,
        mintConfig.collectionCreationPriceE8s
      );
    },
    enabled: !!actor && !!mintConfig,
    staleTime: 6e4
  });
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!isAuthenticated) throw new Error("Sign in to create a collection");
      if (!(mintConfig == null ? void 0 : mintConfig.collectionCreationEnabled)) {
        throw new Error("Collection creation is currently disabled");
      }
      if (!mintConfig.collectionCanisterWasmUploaded) {
        throw new Error("Collection canister creation is not ready yet");
      }
      if (!name.trim()) throw new Error("Collection name is required");
      if (!symbol.trim()) throw new Error("Collection symbol is required");
      if (!description.trim())
        throw new Error("Collection description is required");
      if (!imageDataUrl) throw new Error("Upload a collection image");
      const result = await actor.createUserCollection(
        name.trim(),
        description.trim(),
        symbol.trim().toUpperCase(),
        imageDataUrl,
        dividendsEnabled
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (receipt) => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["myCreatedCollections"]
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      ue.success(
        `${receipt.collection.name} created at ICP block ${receipt.paymentBlock.toString()}`
      );
      setName("");
      setSymbol("");
      setDescription("");
      setImageDataUrl("");
      setImageFileName("");
      setDividendsEnabled(false);
      onCreated(receipt.collection);
    },
    onError: (err) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleTopUpReason(message);
        return;
      }
      ue.error(message);
    }
  });
  async function handleImageFile(file) {
    if (!file) {
      setImageDataUrl("");
      setImageFileName("");
      return;
    }
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      setImageFileName(file.name);
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  function openCreateConfirmation() {
    try {
      if (!actor) throw new Error("Backend not connected");
      if (!isAuthenticated) throw new Error("Sign in to create a collection");
      if (!(mintConfig == null ? void 0 : mintConfig.collectionCreationEnabled)) {
        throw new Error("Collection creation is currently disabled");
      }
      if (!mintConfig.collectionCanisterWasmUploaded) {
        throw new Error("Collection canister creation is not ready yet");
      }
      if (!creationQuote) {
        throw new Error("Collection creation quote is still loading");
      }
      if (!name.trim()) throw new Error("Collection name is required");
      if (!symbol.trim()) throw new Error("Collection symbol is required");
      if (!description.trim())
        throw new Error("Collection description is required");
      if (!imageDataUrl) throw new Error("Upload a collection image");
      setConfirmCreateOpen(true);
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-accent" }),
          "Create Your Mintlab Collection"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-sm", children: "Pay the admin-set collection fee from your in-app ICP balance, launch your own collection, then mint, list, and transfer NFTs however you want." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        !mintConfig ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "The admin has not configured collection creation yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground", children: [
          "Creation fee:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
            formatICP(mintConfig.collectionCreationPriceE8s),
            " ICP"
          ] }),
          ".",
          " ",
          creationQuote ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            formatICP(creationQuote.cycleCostE8s),
            " ICP is converted into",
            " ",
            formatCycles(creationQuote.totalCyclesToConvert),
            " cycles, the new canister receives",
            " ",
            formatCycles(creationQuote.collectionCanisterCycles),
            ", and",
            " ",
            formatICP(creationQuote.adminPayoutE8s),
            " ICP goes to the admin payout account. Ledger fees bring the total debit to",
            " ",
            formatICP(creationQuote.totalUserDebitE8s),
            " ICP."
          ] }) : "Part of the fee is converted into cycles for the new collection canister and the remainder goes to the admin payout account."
        ] }),
        (moderationConfig == null ? void 0 : moderationConfig.enabled) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground", children: moderationConfig.userMessage }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "create-name", children: "Collection name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "create-name",
              value: name,
              onChange: (event) => setName(event.target.value),
              placeholder: "e.g. Studio Zero",
              "data-ocid": "collections.create.name_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "create-symbol", children: "Symbol" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "create-symbol",
                value: symbol,
                onChange: (event) => setSymbol(event.target.value.toUpperCase()),
                placeholder: "e.g. ST0",
                "data-ocid": "collections.create.symbol_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "create-image", children: "Collection image" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "create-image",
                type: "file",
                accept: "image/*",
                onChange: (event) => {
                  var _a;
                  return void handleImageFile(((_a = event.target.files) == null ? void 0 : _a[0]) ?? null);
                },
                "data-ocid": "collections.create.image_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: imageFileName || "Choose an image from this device" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "create-description", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "create-description",
              rows: 3,
              value: description,
              onChange: (event) => setDescription(event.target.value),
              placeholder: "Describe your collection for everyone browsing Mintlab…",
              "data-ocid": "collections.create.description_textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "Your collection gets its own ICRC-7 canister controlled by you and Mintlab. You can copy the canister ID from the collection card and wallet views." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/20 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "create-dividends",
                className: "flex items-center gap-2 text-sm font-medium text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "w-4 h-4 text-accent" }),
                  "Enable collection dividends"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Creates a dedicated ICP address for this collection so deposits can be split evenly across its NFTs." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "create-dividends",
              checked: dividendsEnabled,
              onCheckedChange: setDividendsEnabled,
              "data-ocid": "collections.create.dividends_switch"
            }
          )
        ] }),
        !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "Sign in with Internet Identity to create a collection." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: openCreateConfirmation,
            disabled: createMutation.isPending || !isAuthenticated || !(mintConfig == null ? void 0 : mintConfig.collectionCreationEnabled) || !(mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded) || !creationQuote,
            className: "gap-2",
            "data-ocid": "collections.create.submit_button",
            children: createMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
              "Creating…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
              "Create Collection"
            ] })
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentConfirmationDialog,
      {
        open: confirmCreateOpen,
        onOpenChange: setConfirmCreateOpen,
        title: "Confirm Collection Payment",
        description: (moderationConfig == null ? void 0 : moderationConfig.enabled) ? "Mintlab checks the upload against the current moderation policy before any ICP is transferred." : "Confirm the ICP payment from your in-app account before Mintlab creates your collection canister.",
        lines: [
          {
            label: "Collection fee",
            value: `${formatICP((mintConfig == null ? void 0 : mintConfig.collectionCreationPriceE8s) ?? 0n)} ICP`
          },
          {
            label: "Converted to cycles",
            value: creationQuote ? `${formatICP(creationQuote.cycleCostE8s)} ICP` : "Loading"
          },
          {
            label: "New canister cycles",
            value: creationQuote ? formatCycles(creationQuote.collectionCanisterCycles) : "Loading"
          },
          {
            label: "Ledger fees",
            value: creationQuote ? `${formatICP(
              creationQuote.cycleTransferFeeE8s + creationQuote.adminPayoutFeeE8s
            )} ICP` : "Loading"
          },
          {
            label: "Total debit",
            value: creationQuote ? `${formatICP(creationQuote.totalUserDebitE8s)} ICP` : "Loading"
          }
        ],
        confirmLabel: "Create Collection",
        isPending: createMutation.isPending,
        onConfirm: () => {
          setConfirmCreateOpen(false);
          createMutation.mutate();
        },
        ocid: "collections.create.payment_dialog"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppCanisterTopUpDialog,
      {
        open: cycleTopUpReason != null,
        reason: cycleTopUpReason,
        onOpenChange: (open) => {
          if (!open) setCycleTopUpReason(null);
        },
        onSuccess: () => createMutation.mutate()
      }
    )
  ] });
}
function CollectionCard({
  collection,
  browseStats,
  cycleStatus,
  index,
  isCreatorCollection,
  canManageCollection,
  isMainAppCollection,
  onClick,
  onTopUp,
  onUpgrade,
  onRetryInstall,
  onManageControllers,
  isUpgrading = false,
  isRetryingInstall = false
}) {
  var _a;
  const coverage = (browseStats == null ? void 0 : browseStats.coverage) ?? "Partial";
  const countLabel = browseStats ? browseCoverageLabel(browseStats) : "Loading…";
  const dividendsEnabled = ((_a = collection.dividendConfig) == null ? void 0 : _a.enabled) === true;
  const moduleMissing = (cycleStatus == null ? void 0 : cycleStatus.moduleInstalled) === false;
  const wasmActionPending = moduleMissing ? isRetryingInstall : isUpgrading;
  const imageUrl = resolveImageUrl(collection.imageUrl);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      whileHover: { y: -4, scale: 1.01 },
      className: "group nft-card-glow cursor-pointer rounded-2xl border border-border bg-card overflow-hidden hover:border-accent/40 transition-smooth",
      onClick,
      "data-ocid": `collections.collection.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video overflow-hidden bg-muted relative", children: [
          imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imageUrl,
              alt: collection.name,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-10 h-10 text-muted-foreground/30" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-2 right-2 bg-card/80 backdrop-blur-sm border border-border/60 text-foreground font-mono text-xs", children: standardLabel(collection.standard) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground truncate", children: collection.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: collection.symbol }),
                isCreatorCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border border-accent/20 text-[10px]", children: "Created by You" }),
                !isCreatorCollection && canManageCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border border-accent/20 text-[10px]", children: "Admin Managed" }),
                dividendsEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px]", children: "Dividends" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "shrink-0 bg-accent/10 text-accent border border-accent/20 text-xs font-semibold",
                children: countLabel
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: collection.description }),
          coverage === "Partial" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Showing indexed NFTs until full browse details are available." }),
          canManageCollection && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-muted/20 p-2 text-[11px] text-muted-foreground space-y-1", children: isMainAppCollection ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Wasm module" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: "App canister" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "OISY import" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: "Included" })
            ] })
          ] }) : cycleStatus ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cycle balance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: formatCycles(cycleStatus.cycles) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Wasm module" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: cycleStatus.moduleInstalled ? "Installed" : "Missing" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Controllers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: cycleStatus.controllers.length })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cycle status loading…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "w-full gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/60 text-xs",
                onClick: (e) => {
                  e.stopPropagation();
                  onClick();
                },
                "data-ocid": `collections.browse_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "w-3.5 h-3.5" }),
                  "Browse Collection"
                ]
              }
            ),
            canManageCollection && !isMainAppCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "secondary",
                  className: "gap-1.5 text-xs",
                  onClick: (e) => {
                    e.stopPropagation();
                    onTopUp == null ? void 0 : onTopUp(collection);
                  },
                  "data-ocid": `collections.top_up_button.${index + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    "Top Up"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "gap-1.5 text-xs",
                  disabled: wasmActionPending,
                  onClick: (e) => {
                    e.stopPropagation();
                    if (moduleMissing) {
                      onRetryInstall == null ? void 0 : onRetryInstall(collection);
                    } else {
                      onUpgrade == null ? void 0 : onUpgrade(collection);
                    }
                  },
                  "data-ocid": `collections.upgrade_button.${index + 1}`,
                  children: [
                    wasmActionPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                    moduleMissing ? "Install Wasm" : "Update Wasm"
                  ]
                }
              )
            ] }),
            canManageCollection && !isMainAppCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "mt-2 w-full gap-1.5 text-xs",
                onClick: (e) => {
                  e.stopPropagation();
                  onManageControllers == null ? void 0 : onManageControllers(collection);
                },
                "data-ocid": `collections.controllers_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
                  "Controllers"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function CollectionTopUpDialog({
  collection,
  open,
  onClose
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [cyclesText, setCyclesText] = reactExports.useState("1000000000000");
  const cyclesToTopUp = reactExports.useMemo(
    () => parseCyclesInput(cyclesText),
    [cyclesText]
  );
  const { data: quote, isFetching: quoteLoading } = useQuery({
    queryKey: ["collectionCycleTopUpQuote", cyclesToTopUp == null ? void 0 : cyclesToTopUp.toString()],
    queryFn: async () => {
      if (!actor || cyclesToTopUp == null) return null;
      return actor.quoteCollectionCycleTopUp(cyclesToTopUp);
    },
    enabled: !!actor && open && cyclesToTopUp != null,
    staleTime: 6e4
  });
  const topUpMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!collection) throw new Error("Select a collection first");
      if (cyclesToTopUp == null) throw new Error("Enter a valid cycles amount");
      const result = await actor.topUpCollectionCanisterCycles(
        collection.id,
        cyclesToTopUp
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      ue.success(
        `Added ${formatCycles(receipt.cyclesMinted)} cycles to ${(collection == null ? void 0 : collection.name) ?? "the collection"}`
      );
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      onClose();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (value) => !value && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "collections.top_up.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Top Up Collection Cycles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Confirm the ICP payment from your in-app account before cycles are minted directly into this collection canister." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Collection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-right", children: (collection == null ? void 0 : collection.name) ?? "Collection" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Canister" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-right break-all", children: (collection == null ? void 0 : collection.canisterId.toString()) ?? "" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "collection-top-up-cycles", children: "Cycles to add" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "collection-top-up-cycles",
                value: cyclesText,
                onChange: (event) => setCyclesText(event.target.value),
                inputMode: "numeric",
                className: "font-mono",
                "data-ocid": "collections.top_up.cycles_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Minimum top-up is 100B cycles. The app will normalize very small amounts to that minimum." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm", children: cyclesToTopUp == null ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Enter a whole-number cycles amount." }) : quoteLoading || !quote ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Fetching quote…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Cycles requested" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: formatCycles(quote.cyclesToTopUp) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "ICP converted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                formatICP(quote.cycleCostE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Ledger fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                formatICP(quote.ledgerFeeE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 border-t border-border pt-2 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total debit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                formatICP(quote.totalUserDebitE8s),
                " ICP"
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "gap-2",
              disabled: topUpMutation.isPending || !collection || cyclesToTopUp == null || !quote,
              onClick: () => topUpMutation.mutate(),
              "data-ocid": "collections.top_up.confirm_button",
              children: [
                topUpMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Confirm Top Up"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function NFTDetailModal({
  nft,
  collection,
  isListed = false,
  dividendE8s = 0n,
  open,
  onClose
}) {
  const { isAuthenticated, principal } = useAuth();
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const { data: inWallet, isLoading: walletCheckLoading } = useQuery({
    queryKey: [
      "isNFTInUserWallet",
      collection.id.toString(),
      nft.tokenId,
      principal == null ? void 0 : principal.toString()
    ],
    queryFn: async () => {
      if (!actor || !principal) return false;
      return actor.isNFTInUserWallet(collection.id, nft.tokenId, principal);
    },
    enabled: !!actor && isAuthenticated && !!principal && open
  });
  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const metadata = {
        name: nft.metadata.name,
        description: nft.metadata.description,
        imageUrl: nft.metadata.imageUrl,
        attributes: nft.metadata.attributes
      };
      return actor.registerNFT(collection.id, nft.tokenId, metadata);
    },
    onSuccess: () => {
      ue.success("NFT registered to your wallet!");
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({
        queryKey: ["isNFTInUserWallet", collection.id.toString(), nft.tokenId]
      });
      onClose();
    },
    onError: (err) => {
      ue.error(err.message || "Failed to register NFT");
    }
  });
  const nftName = nft.metadata.name ?? `#${nft.tokenId}`;
  const imageUrl = resolveImageUrl(nft.metadata.imageUrl, {
    canisterId: collection.canisterId.toString(),
    tokenId: nft.tokenId
  });
  const collectionImageUrl = resolveImageUrl(collection.imageUrl);
  const canisterId = collection.canisterId.toString();
  const canisterUrl = `https://dashboard.internetcomputer.org/canister/${canisterId}`;
  const ownsPreview = principal != null && nft.owner.toString() === principal.toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogContent,
    {
      className: "bg-card border-border w-[calc(100vw-2rem)] max-w-3xl max-h-[calc(100dvh-2rem)] p-0 overflow-hidden",
      "data-ocid": "collections.nft_detail.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-h-[calc(100dvh-2rem)] min-h-0 flex-col md:grid md:grid-cols-[minmax(0,0.95fr)_minmax(320px,1fr)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[min(42vh,360px)] md:h-auto md:min-h-0 w-full overflow-hidden bg-muted relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaImage,
            {
              src: nft.metadata.imageUrl,
              alt: nftName,
              assetCanisterId: collection.canisterId.toString(),
              tokenId: nft.tokenId,
              className: "w-full h-full object-contain",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-14 h-14 text-muted-foreground/30" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth",
              "aria-label": "Close",
              "data-ocid": "collections.nft_detail.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "min-h-0 flex-1 md:h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl text-foreground break-words", children: nftName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "font-mono text-xs bg-muted/60 text-muted-foreground border border-border/40",
                  children: [
                    "#",
                    nft.tokenId
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "text-xs bg-accent/10 text-accent border border-accent/20",
                  children: standardLabel(collection.standard)
                }
              ),
              isListed && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-amber-500/10 text-amber-700 border border-amber-500/20", children: "Listed on Market" }),
              dividendE8s > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs bg-emerald-500/10 text-emerald-700 border border-emerald-500/20", children: [
                formatICP(dividendE8s),
                " ICP dividends"
              ] })
            ] })
          ] }),
          nft.metadata.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed break-words", children: nft.metadata.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 border border-border/40", children: [
            collectionImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: collectionImageUrl,
                alt: collection.name,
                className: "w-6 h-6 rounded-full border border-border/50 object-cover shrink-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-medium truncate", children: collection.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground ml-auto shrink-0", children: collection.symbol })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Token ID",
                value: nft.tokenId,
                ocid: "collections.nft_detail.copy_token_id"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Collection Canister",
                value: canisterId,
                ocid: "collections.nft_detail.copy_canister_id"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Current Owner",
                value: nft.owner.toString(),
                ocid: "collections.nft_detail.copy_owner"
              }
            ),
            imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "NFT Media URL",
                value: imageUrl,
                ocid: "collections.nft_detail.copy_media_url"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "outline",
              size: "sm",
              className: "gap-2",
              "data-ocid": "collections.nft_detail.view_canister_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: canisterUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                    "View Canister"
                  ]
                }
              )
            }
          ) }),
          nft.metadata.attributes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3 h-3" }),
              " Attributes"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: nft.metadata.attributes.map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide truncate", children: key }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mt-0.5 truncate", children: value })
                ]
              },
              `attr-detail-${key}-${value}`
            )) })
          ] }),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "pt-2 border-t border-border/60",
              "data-ocid": "collections.nft_detail.register_section",
              children: walletCheckLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) }) : inWallet ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5",
                  "data-ocid": "collections.nft_detail.in_wallet_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-accent shrink-0" }),
                    "Already in your wallet"
                  ]
                }
              ) : !ownsPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground", children: "Sign in with the owner principal shown above to register this NFT into your Mintlab wallet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2",
                  onClick: () => registerMutation.mutate(),
                  disabled: registerMutation.isPending,
                  "data-ocid": "collections.nft_detail.register_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
                    registerMutation.isPending ? "Registering…" : "Register to Wallet"
                  ]
                }
              )
            }
          )
        ] }) })
      ] })
    }
  ) });
}
function CollectionControllersDialog({
  collection,
  initialStatus,
  open,
  onClose
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [controllerInput, setControllerInput] = reactExports.useState("");
  const queryKey = [
    "collectionCanisterControllers",
    (collection == null ? void 0 : collection.id.toString()) ?? "none"
  ];
  const initialInfo = reactExports.useMemo(() => {
    if (!collection || !initialStatus) return null;
    return {
      collectionId: collection.id,
      canisterId: collection.canisterId,
      appCanisterId: initialStatus.appCanisterId,
      controllers: initialStatus.controllers
    };
  }, [collection, initialStatus]);
  const {
    data: fetchedInfo,
    isFetching,
    error
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!actor || !collection) return null;
      const result = await actor.getCollectionCanisterControllers(
        collection.id
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    enabled: !!actor && !!collection && open,
    retry: false
  });
  const info = fetchedInfo ?? initialInfo;
  const appCanisterText = (info == null ? void 0 : info.appCanisterId.toString()) ?? "";
  const appControllerPresent = !!info && info.controllers.some(
    (controller) => controller.toString() === appCanisterText
  );
  const addMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      if (!collection) throw new Error("Select a collection first");
      const trimmed = controllerInput.trim();
      if (!isValidPrincipal(trimmed)) {
        throw new Error("Enter a valid controller principal");
      }
      const result = await actor.addCollectionCanisterController(
        collection.id,
        Principal.fromText(trimmed)
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      queryClient.setQueryData(queryKey, receipt);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      setControllerInput("");
      ue.success("Controller added");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const removeMutation = useMutation({
    mutationFn: async (controller) => {
      if (!actor) throw new Error("Backend not connected");
      if (!collection) throw new Error("Select a collection first");
      const result = await actor.removeCollectionCanisterController(
        collection.id,
        controller
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      queryClient.setQueryData(queryKey, receipt);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      ue.success("Controller removed");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  function copyPrincipal(value) {
    void navigator.clipboard.writeText(value);
    ue.success("Controller principal copied");
  }
  function removeController(controller) {
    if (!info) return;
    const controllerText = controller.toString();
    const isAppController = controllerText === appCanisterText;
    if (isAppController && !window.confirm(
      "Remove the Mintlab app controller? Mintlab may no longer be able to upgrade, top up, or read this collection canister after this change."
    )) {
      return;
    }
    removeMutation.mutate(controller);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (value) => !value && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-2xl",
      "data-ocid": "collections.controllers.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Collection Controllers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            (collection == null ? void 0 : collection.name) ?? "Collection",
            " canister",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: (collection == null ? void 0 : collection.canisterId.toString()) ?? "" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          appControllerPresent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900", children: "Add your replacement controller before removing the Mintlab app controller. Once removed, controller management through Mintlab can stop working for this canister." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "collection-controller-principal", children: "Add controller principal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "collection-controller-principal",
                  value: controllerInput,
                  onChange: (event) => setControllerInput(event.target.value),
                  className: "font-mono text-sm",
                  placeholder: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                  "data-ocid": "collections.controllers.add_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "gap-2 sm:w-auto",
                  disabled: addMutation.isPending,
                  onClick: () => addMutation.mutate(),
                  "data-ocid": "collections.controllers.add_button",
                  children: [
                    addMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    "Add"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Current controllers" }),
              isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Refreshing…" })
            ] }),
            !info && isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "Loading controllers…" }),
            !info && error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive", children: extractError(error) }),
            info && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: info.controllers.map((controller, index) => {
              var _a;
              const controllerText = controller.toString();
              const isAppController = controllerText === appCanisterText;
              const removeDisabled = removeMutation.isPending || info.controllers.length <= 1;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3 sm:flex-row sm:items-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex flex-wrap items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-muted-foreground", children: [
                          "Controller ",
                          index + 1
                        ] }),
                        isAppController && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border border-accent/20 bg-accent/10 text-accent", children: "Mintlab app" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "break-all font-mono text-sm text-foreground", children: controllerText })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "outline",
                          onClick: () => copyPrincipal(controllerText),
                          "aria-label": "Copy controller principal",
                          "data-ocid": `collections.controllers.copy.${index + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "outline",
                          disabled: removeDisabled,
                          onClick: () => removeController(controller),
                          "aria-label": "Remove controller",
                          "data-ocid": `collections.controllers.remove.${index + 1}`,
                          children: removeMutation.isPending && ((_a = removeMutation.variables) == null ? void 0 : _a.toString()) === controllerText ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                        }
                      )
                    ] })
                  ]
                },
                controllerText
              );
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Close" }) })
      ]
    }
  ) });
}
function NFTBrowser({
  collection,
  isCreatorCollection,
  onBack
}) {
  var _a;
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [attrFilter, setAttrFilter] = reactExports.useState(null);
  const [selectedNFT, setSelectedNFT] = reactExports.useState(null);
  const canisterId = collection.canisterId.toString();
  const canisterUrl = `https://dashboard.internetcomputer.org/canister/${canisterId}`;
  const dividendsEnabled = ((_a = collection.dividendConfig) == null ? void 0 : _a.enabled) === true;
  const {
    data: browsePages,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage2,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ["collectionNFTPage", collection.id.toString()],
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      if (!actor) {
        return {
          nfts: [],
          totalCount: 0n,
          coverage: "Partial",
          note: "Mintlab is preparing this collection browser."
        };
      }
      return actor.getCollectionNFTPage(collection.id, pageParam, 24n);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? void 0,
    enabled: !!actor && !isFetching
  });
  const { data: activeListingDetails = [] } = useQuery({
    queryKey: ["activeListingDetails"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveListingDetails();
    },
    enabled: !!actor && !isFetching
  });
  const { data: dividendInfo } = useQuery({
    queryKey: ["collectionDividendInfo", collection.id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCollectionDividendInfo(collection.id);
    },
    enabled: !!actor && !isFetching && dividendsEnabled,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 3e4
  });
  const { data: dividendBalances = [] } = useQuery({
    queryKey: ["collectionDividendBalances", collection.id.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.refreshCollectionDividendBalances(collection.id);
    },
    enabled: !!actor && !isFetching && dividendsEnabled,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 3e4
  });
  const syncDividendsMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.syncCollectionDividends(collection.id);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (receipt) => {
      ue.success(
        receipt.distributedE8s > 0n ? `Distributed ${formatICP(receipt.distributedE8s)} ICP` : "No new dividends to distribute"
      );
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo", collection.id.toString()]
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances", collection.id.toString()]
      });
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"]
      });
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const loadedNFTs = reactExports.useMemo(() => {
    if (!browsePages) return [];
    return browsePages.pages.flatMap((page) => page.nfts);
  }, [browsePages]);
  const firstPage = browsePages == null ? void 0 : browsePages.pages[0];
  const totalCount = (firstPage == null ? void 0 : firstPage.totalCount) ?? BigInt(loadedNFTs.length);
  const coverage = (firstPage == null ? void 0 : firstPage.coverage) ?? "Partial";
  const browseNote = (firstPage == null ? void 0 : firstPage.note) ?? "Mintlab is showing the NFTs it has already loaded for this collection.";
  const listedNFTKeys = new Set(
    activeListingDetails.filter((detail) => detail.nft.collectionId === collection.id).map((detail) => nftKey(detail.nft.collectionId, detail.nft.tokenId))
  );
  const dividendBalanceMap = reactExports.useMemo(
    () => new Map(dividendBalances),
    [dividendBalances]
  );
  const allAttributePairs = reactExports.useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    const pairs = [];
    for (const nft of loadedNFTs) {
      for (const [key, value] of nft.metadata.attributes) {
        const k = `${key}::${value}`;
        if (!seen.has(k)) {
          seen.add(k);
          pairs.push({ key, value });
        }
      }
    }
    return pairs.sort((a, b) => a.key.localeCompare(b.key));
  }, [loadedNFTs]);
  const filteredNFTs = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return loadedNFTs.filter((nft) => {
      if (q) {
        const nameMatch = (nft.metadata.name ?? "").toLowerCase().includes(q);
        const idMatch = nft.tokenId.toLowerCase().includes(q);
        if (!nameMatch && !idMatch) return false;
      }
      if (attrFilter) {
        const hasAttr = nft.metadata.attributes.some(
          ([k, v]) => k === attrFilter.key && v === attrFilter.value
        );
        if (!hasAttr) return false;
      }
      return true;
    });
  }, [loadedNFTs, search, attrFilter]);
  const clearFilters = reactExports.useCallback(() => {
    setSearch("");
    setAttrFilter(null);
  }, []);
  const hasActiveFilter = search.trim() !== "" || attrFilter !== null;
  const loadedCount = loadedNFTs.length;
  const fullyLoaded = BigInt(loadedCount) >= totalCount;
  const collectionImageUrl = resolveImageUrl(collection.imageUrl);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "collections.nft_browser", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: onBack,
            className: "gap-1.5 text-muted-foreground hover:text-foreground -ml-2",
            "data-ocid": "collections.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
              "All Collections"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          collectionImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: collectionImageUrl,
              alt: collection.name,
              className: "w-6 h-6 rounded-full border border-border/50 object-cover shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground truncate", children: collection.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "font-mono text-xs bg-muted/60 text-muted-foreground border border-border/40 shrink-0",
              children: standardLabel(collection.standard)
            }
          ),
          isCreatorCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border border-accent/20 shrink-0", children: "Your Mintlab Collection" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "gap-1.5",
            onClick: () => {
              void navigator.clipboard.writeText(canisterId);
              ue.success("Collection canister copied");
            },
            "data-ocid": "collections.copy_canister_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" }),
              "Copy Canister ID"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            size: "sm",
            variant: "outline",
            className: "gap-1.5",
            "data-ocid": "collections.view_canister_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: canisterUrl, target: "_blank", rel: "noopener noreferrer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
              "View Canister"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground", children: [
      browseNote,
      coverage === "Full" && !fullyLoaded && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block mt-1", children: "Load more to keep browsing the rest of the collection." })
    ] }),
    dividendsEnabled && dividendInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3",
        "data-ocid": "collections.dividends.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-emerald-700 font-mono", children: "Collection Dividends" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Send ICP to this address, then check for deposits to split the new balance evenly across minted NFTs in this collection." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-2 bg-emerald-600 text-white hover:bg-emerald-700",
                onClick: () => syncDividendsMutation.mutate(),
                disabled: syncDividendsMutation.isPending,
                "data-ocid": "collections.dividends.sync_button",
                children: [
                  syncDividendsMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "w-4 h-4" }),
                  "Check Deposits"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Dividend ICP Address",
                value: accountIdToHex(dividendInfo.accountId),
                ocid: "collections.dividends.copy_account"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-card/60 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground uppercase tracking-wide", children: "Pool" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-semibold text-foreground mt-0.5", children: [
                  formatICP(dividendInfo.balanceE8s),
                  " ICP"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-card/60 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground uppercase tracking-wide", children: "Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-semibold text-foreground mt-0.5", children: [
                  formatICP(dividendInfo.pendingE8s),
                  " ICP"
                ] })
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col sm:flex-row gap-3",
        "data-ocid": "collections.filters_bar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search by name or token ID…",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "pl-9 bg-card border-border focus:border-accent",
                "data-ocid": "collections.search_input"
              }
            ),
            search && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth",
                onClick: () => setSearch(""),
                "aria-label": "Clear search",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
              }
            )
          ] }),
          allAttributePairs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: attrFilter ? `${attrFilter.key}::${attrFilter.value}` : "all",
              onValueChange: (val) => {
                if (val === "all") {
                  setAttrFilter(null);
                } else {
                  const [key, value] = val.split("::");
                  setAttrFilter({ key, value });
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  SelectTrigger,
                  {
                    className: "w-full sm:w-56 bg-card border-border focus:border-accent",
                    "data-ocid": "collections.attribute_filter.select",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3.5 h-3.5 text-muted-foreground mr-1.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by attribute" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All attributes" }),
                  allAttributePairs.map(({ key, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: `${key}::${value}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                      key,
                      ":"
                    ] }),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: value })
                  ] }, `${key}::${value}`))
                ] })
              ]
            }
          ),
          hasActiveFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: clearFilters,
              className: "gap-1.5 text-muted-foreground hover:text-foreground whitespace-nowrap",
              "data-ocid": "collections.clear_filters_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
                "Clear"
              ]
            }
          )
        ]
      }
    ),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Loaded ",
        loadedCount,
        " of ",
        totalCount.toString(),
        " NFT",
        totalCount === 1n ? "" : "s"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "secondary",
          className: coverage === "Full" ? "bg-accent/10 text-accent border border-accent/20 text-xs" : "bg-muted/60 text-muted-foreground border border-border/40 text-xs",
          children: coverage === "Full" ? "Full Browse" : "Indexed View"
        }
      ),
      hasActiveFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "secondary",
          className: "bg-accent/10 text-accent border border-accent/20 text-xs",
          children: "Filtered"
        }
      )
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3",
        "data-ocid": "collections.nft_browser.loading_state",
        children: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "aspect-square rounded-xl"
          },
          `nft-skel-${k}`
        ))
      }
    ),
    !isLoading && filteredNFTs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: hasActiveFilter ? Search : Layers,
        title: hasActiveFilter ? "No matches found" : "No NFTs available to browse",
        description: hasActiveFilter ? "Try adjusting your search or clearing the attribute filter." : coverage === "Full" ? "Mintlab could not find any NFTs to show from this collection yet." : "Mintlab can only show the NFTs it has already indexed for this collection right now.",
        action: hasActiveFilter ? {
          label: "Clear filters",
          onClick: clearFilters,
          "data-ocid": "collections.empty.clear_button"
        } : void 0,
        "data-ocid": "collections.nft_browser.empty_state"
      }
    ),
    !isLoading && filteredNFTs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3",
        "data-ocid": "collections.nft_grid",
        children: filteredNFTs.map((nft, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          BrowseNFTCard,
          {
            nft,
            collection,
            isListed: listedNFTKeys.has(
              nftKey(nft.collectionId, nft.tokenId)
            ),
            dividendE8s: dividendBalanceMap.get(nft.tokenId) ?? 0n,
            index: i,
            onClick: () => setSelectedNFT(nft)
          },
          nft.id.toString()
        ))
      }
    ),
    hasNextPage2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "outline",
        className: "gap-2",
        onClick: () => fetchNextPage(),
        disabled: isFetchingNextPage,
        "data-ocid": "collections.load_more_button",
        children: isFetchingNextPage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          "Loading more…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "w-4 h-4" }),
          "Load More NFTs"
        ] })
      }
    ) }),
    selectedNFT && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NFTDetailModal,
      {
        nft: selectedNFT,
        collection,
        isListed: listedNFTKeys.has(
          nftKey(selectedNFT.collectionId, selectedNFT.tokenId)
        ),
        dividendE8s: dividendBalanceMap.get(selectedNFT.tokenId) ?? 0n,
        open: !!selectedNFT,
        onClose: () => setSelectedNFT(null)
      }
    )
  ] });
}
function BrowseNFTCard({
  nft,
  collection,
  isListed = false,
  dividendE8s = 0n,
  index,
  onClick
}) {
  const name = nft.metadata.name ?? `#${nft.tokenId}`;
  const topAttrs = nft.metadata.attributes.slice(0, 2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.04 },
      whileHover: { y: -3, scale: 1.01 },
      className: "nft-card-glow group cursor-pointer rounded-xl border border-border bg-card overflow-hidden hover:border-accent/40 transition-smooth",
      onClick,
      "data-ocid": `collections.nft.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square overflow-hidden bg-muted relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaImage,
            {
              src: nft.metadata.imageUrl,
              alt: name,
              assetCanisterId: collection.canisterId.toString(),
              tokenId: nft.tokenId,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-8 h-8 text-muted-foreground/30" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-foreground font-medium bg-card/80 backdrop-blur-sm rounded-full px-2.5 py-1 border border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
            " Details"
          ] }) }),
          isListed && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-2 left-2 bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px]", children: "Listed" }),
          dividendE8s > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute bottom-2 left-2 bg-emerald-500/90 text-white border-0 text-[10px] font-mono", children: [
            formatICP(dividendE8s),
            " ICP"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-xs text-foreground truncate", children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
            "#",
            nft.tokenId
          ] }),
          topAttrs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: topAttrs.map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-xs bg-muted/60 text-muted-foreground border border-border/40 px-1.5 py-0 font-normal",
              children: [
                key,
                ":",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium ml-0.5", children: value })
              ]
            },
            `card-attr-${key}-${value}`
          )) })
        ] })
      ]
    }
  );
}
function CollectionsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principalText } = useAuth();
  const { isAdmin } = useAdmin();
  const queryClient = useQueryClient();
  const [selectedCollection, setSelectedCollection] = reactExports.useState(null);
  const [topUpCollection, setTopUpCollection] = reactExports.useState(
    null
  );
  const [controllersCollection, setControllersCollection] = reactExports.useState(null);
  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor && !isFetching
  });
  const { data: mintConfig } = useQuery({
    queryKey: ["mintConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMintConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: moderationConfig } = useQuery({
    queryKey: ["moderationConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModerationConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: myCreatedCollections = [] } = useQuery({
    queryKey: ["myCreatedCollections", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCreatedCollections();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: myCollectionCanisterStatuses = [] } = useQuery({
    queryKey: ["myCollectionCanisterStatuses", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCollectionCanisterStatuses();
    },
    enabled: !!actor && !isFetching && isAuthenticated && myCreatedCollections.length > 0,
    refetchInterval: 6e4
  });
  const upgradeMutation = useMutation({
    mutationFn: async (collection) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.upgradeCollectionCanister(collection.id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (collection) => {
      ue.success(`${collection.name} canister updated.`);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const retryInstallMutation = useMutation({
    mutationFn: async (collection) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.retryInstallCollectionCanister(collection.id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (collection) => {
      ue.success(`${collection.name} Wasm installed.`);
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionBrowseStats"]
      });
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const browseStatsQuery = useQuery({
    queryKey: [
      "allCollectionBrowseStats",
      (collections == null ? void 0 : collections.map((c) => c.id.toString()).join(",")) ?? ""
    ],
    queryFn: async () => {
      if (!actor || !collections) return /* @__PURE__ */ new Map();
      const stats = /* @__PURE__ */ new Map();
      await Promise.all(
        collections.map(async (c) => {
          const result = await actor.getCollectionBrowseStats(c.id);
          stats.set(c.id.toString(), result);
        })
      );
      return stats;
    },
    enabled: !!actor && !isFetching && !!collections && collections.length > 0
  });
  const browseStats = browseStatsQuery.data ?? /* @__PURE__ */ new Map();
  const myCreatedCollectionIds = new Set(
    myCreatedCollections.map((collection) => collection.id.toString())
  );
  const canisterStatusMap = new Map(
    myCollectionCanisterStatuses.map((status) => [
      status.collectionId.toString(),
      status
    ])
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-4 md:px-8 py-8 max-w-7xl mx-auto",
      "data-ocid": "collections.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: selectedCollection ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            transition: { duration: 0.25 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              NFTBrowser,
              {
                collection: selectedCollection,
                isCreatorCollection: myCreatedCollectionIds.has(
                  selectedCollection.id.toString()
                ),
                onBack: () => setSelectedCollection(null)
              }
            )
          },
          "browser"
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 20 },
            transition: { duration: 0.25 },
            className: "space-y-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl md:text-3xl text-foreground", children: "Collections" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Discover community collections, import supported ICP NFT collections from elsewhere, and launch your own Mintlab collection after paying the admin-set setup fee." })
              ] }),
              !isLoading && !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-muted-foreground", children: "Sign in to preview your NFTs, import collections into the shared directory, and create your own Mintlab collection." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ImportCollectionCard,
                  {
                    onImported: (collection) => setSelectedCollection(collection)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CreateCollectionCard,
                  {
                    mintConfig: mintConfig ?? null,
                    moderationConfig: moderationConfig ?? null,
                    onCreated: (collection) => setSelectedCollection(collection)
                  }
                )
              ] }),
              isAuthenticated && myCreatedCollections.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-muted/20 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Your Mintlab collections" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: myCreatedCollections.map((collection, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "gap-2",
                    onClick: () => setSelectedCollection(collection),
                    "data-ocid": `collections.my_collection.${index + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
                      collection.name
                    ]
                  },
                  collection.id.toString()
                )) })
              ] }),
              isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
                  "data-ocid": "collections.loading_state",
                  children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "rounded-2xl border border-border bg-card overflow-hidden",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-video w-full" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full mt-2" })
                        ] })
                      ]
                    },
                    `coll-skel-${k}`
                  ))
                }
              ),
              !isLoading && (collections ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                EmptyState,
                {
                  icon: Layers,
                  title: "No collections yet",
                  description: "Import the first supported ICP NFT collection or create your own Mintlab collection to get the shared directory started.",
                  "data-ocid": "collections.empty_state"
                }
              ),
              !isLoading && (collections ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
                  "data-ocid": "collections.grid",
                  children: (collections ?? []).map((collection, index) => {
                    var _a, _b, _c;
                    const isCreatorCollection = myCreatedCollectionIds.has(
                      collection.id.toString()
                    );
                    const isMainAppCollection = ((_a = mintConfig == null ? void 0 : mintConfig.collectionId) == null ? void 0 : _a.toString()) === collection.id.toString();
                    const canManageCollection = isCreatorCollection || isAdmin && collection.kind === "Minted";
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CollectionCard,
                      {
                        collection,
                        browseStats: browseStats.get(collection.id.toString()),
                        cycleStatus: canisterStatusMap.get(
                          collection.id.toString()
                        ),
                        index,
                        isCreatorCollection,
                        canManageCollection,
                        isMainAppCollection,
                        onClick: () => setSelectedCollection(collection),
                        onTopUp: setTopUpCollection,
                        onUpgrade: (target) => upgradeMutation.mutate(target),
                        onRetryInstall: (target) => retryInstallMutation.mutate(target),
                        onManageControllers: setControllersCollection,
                        isUpgrading: upgradeMutation.isPending && ((_b = upgradeMutation.variables) == null ? void 0 : _b.id) === collection.id,
                        isRetryingInstall: retryInstallMutation.isPending && ((_c = retryInstallMutation.variables) == null ? void 0 : _c.id) === collection.id
                      },
                      collection.id.toString()
                    );
                  })
                }
              )
            ]
          },
          "grid"
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CollectionTopUpDialog,
          {
            collection: topUpCollection,
            open: topUpCollection != null,
            onClose: () => setTopUpCollection(null)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CollectionControllersDialog,
          {
            collection: controllersCollection,
            initialStatus: controllersCollection ? canisterStatusMap.get(controllersCollection.id.toString()) : void 0,
            open: controllersCollection != null,
            onClose: () => setControllersCollection(null)
          }
        )
      ]
    }
  );
}
export {
  CollectionsPage as default
};
