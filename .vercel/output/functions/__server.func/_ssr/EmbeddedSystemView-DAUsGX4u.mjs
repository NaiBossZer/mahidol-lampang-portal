import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { T as ExternalLink, r as WifiOff, x as LoaderCircle } from "../_libs/lucide-react.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmbeddedSystemView-DAUsGX4u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmbeddedSystemView({ url, title, systemLabel }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [timedOut, setTimedOut] = (0, import_react.useState)(false);
	const [retryKey, setRetryKey] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setLoading(true);
		setTimedOut(false);
		const timer = window.setTimeout(() => setTimedOut(true), 8e3);
		return () => window.clearTimeout(timer);
	}, [retryKey]);
	const failed = timedOut && loading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen w-full flex-col bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-slate-200 bg-[#002D62] px-4 py-2 text-white",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-[#F2A900] hover:underline",
						children: "หน้าหลัก"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: systemLabel })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: url,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "inline-flex items-center gap-1 text-xs text-[#F2A900] hover:underline",
				children: ["เปิดแท็บใหม่ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative min-h-0 flex-1",
			children: [
				loading && !failed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 z-10 flex items-center justify-center bg-white",
					role: "status",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin text-[#F2A900]" }),
						"กำลังเชื่อมต่อ ",
						systemLabel,
						"…"
					]
				}),
				failed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50 p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "mb-3 h-8 w-8 text-[#002D62]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-lg font-semibold text-[#002D62]",
							children: "เชื่อมต่อระบบไม่สำเร็จ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-slate-500",
							children: "ระบบอาจปิดปรับปรุงหรือเครือข่ายตอบสนองช้า"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: () => setRetryKey((current) => current + 1),
								className: "bg-[#002D62] text-white",
								children: "ลองอีกครั้ง"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: url,
								target: "_blank",
								rel: "noopener noreferrer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									className: "border-[#002D62] text-[#002D62]",
									children: "เปิดแท็บใหม่"
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					src: url,
					className: "h-full w-full border-0",
					title,
					onLoad: () => setLoading(false),
					sandbox: "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation",
					allow: "fullscreen; clipboard-write; geolocation; microphone; camera"
				}, retryKey)
			]
		})]
	});
}
//#endregion
export { EmbeddedSystemView as t };
