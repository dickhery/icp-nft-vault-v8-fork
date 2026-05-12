import { c as createLucideIcon, j as jsxRuntimeExports, h as LoadingSpinner } from "./index-DngK8SgJ.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./index-CYvSbtd2.js";
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
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode);
function PaymentConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  lines,
  confirmLabel = "Confirm Payment",
  isPending = false,
  onConfirm,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-border", "data-ocid": ocid, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm", children: lines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start justify-between gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            line.label,
            line.helper && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] leading-snug text-muted-foreground/80", children: line.helper })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground text-right", children: line.value })
        ]
      },
      line.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "border-border", disabled: isPending, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertDialogAction,
        {
          className: "bg-accent text-accent-foreground hover:bg-accent/90",
          disabled: isPending,
          onClick: onConfirm,
          children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : confirmLabel
        }
      )
    ] })
  ] }) });
}
export {
  PaymentConfirmationDialog as P,
  Tag as T
};
