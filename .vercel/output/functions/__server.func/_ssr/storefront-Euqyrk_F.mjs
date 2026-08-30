import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { U as ArrowLeft, u as ShoppingBag } from "../_libs/lucide-react.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as StorefrontWidget } from "./StorefrontWidget-BN9vX65f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storefront-Euqyrk_F.js
var import_jsx_runtime = require_jsx_runtime();
function StorefrontRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-slate-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-[#002D62] bg-[#002D62] px-4 py-4 text-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2 text-sm hover:text-[#F2A900]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " กลับหน้าหลัก"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-5 w-5 text-[#F2A900]" }), " Mahidol Farm Fresh Market"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorefrontWidget, {})]
	});
}
//#endregion
export { StorefrontRoute as component };
