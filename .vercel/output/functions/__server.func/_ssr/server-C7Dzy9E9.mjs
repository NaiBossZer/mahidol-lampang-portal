import { i as __toESM } from "../_runtime.mjs";
import { n as toResponse, t as H3Event } from "../_libs/h3-v2+rou3+srvx.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { A as rootRouteId, C as getStylesheetHref, D as isRedirect, E as executeRewriteInput, N as invariant, O as isResolvedRedirect, S as getScriptPreloadAttrs, T as resolveManifestCssLink, _ as useRouter, a as replaceSsrResponse, c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useNavigate, h as Link, i as normalizeSsrResponse, j as isNotFound, k as redirect, l as RouterProvider, m as createRootRouteWithContext, n as defineHandlerCallback, o as stripSsrResponseBody, p as createFileRoute, r as isSsrResponse, s as Scripts, t as renderRouterToStream, u as createRouter, w as resolveManifestAssetLink } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createMemoryHistory } from "../_libs/tanstack__history.mjs";
import { a as defaultSerovalPlugins, c as makeSerovalPlugin, d as toCrossJSONStream, i as getOrigin, l as fromJSON, n as attachRouterServerSsrUtils, o as createRawStreamRPCPlugin, r as getNormalizedURL, s as createSerializationAdapter, t as mergeHeaders, u as toCrossJSONAsync } from "../_libs/@tanstack/router-core+[...].mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { _ as integer, a as eq, b as pgEnum, c as lt, d as pgTable, f as varchar, g as decimal, h as text, i as and, l as ne, m as timestamp, n as relations, o as gt, p as uuid, r as desc, s as gte, t as drizzle, u as or, v as boolean, x as unique, y as sql } from "../_libs/drizzle-orm.mjs";
import { t as cs } from "../_libs/neondatabase__serverless.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region node_modules/.nitro/vite/services/ssr/assets/router-qAQJcB_T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-DYozXxlG.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var RuntimeErrorBoundary = class extends import_react.Component {
	state = { error: null };
	static getDerivedStateFromError(error) {
		return { error: error instanceof Error ? error : new Error(String(error)) };
	}
	componentDidCatch(error, info) {
		console.error("[Mahidol Portal] Client render error", error, info.componentStack);
	}
	render() {
		if (this.state.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm",
				role: "alert",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-[#F2A900]",
						children: "MAHIDOL UNIVERSITY"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-xl font-bold text-[#002D62]",
						children: "หน้าเว็บขัดข้องชั่วคราว"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-slate-600",
						children: "กรุณารีเฟรชหน้าเว็บ หรือลองกลับไปที่หน้าหลัก"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => window.location.reload(),
							className: "rounded-lg bg-[#002D62] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002D62]/90",
							children: "รีเฟรชหน้าเว็บ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/",
							className: "rounded-lg border border-[#002D62] px-4 py-2 text-sm font-semibold text-[#002D62] hover:bg-blue-50",
							children: "หน้าหลัก"
						})]
					})
				]
			})
		});
		return this.props.children;
	}
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$18 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Mahidol Insight Hub" },
			{
				name: "description",
				content: "Mahidol Insight Hub Survey & Analytics"
			},
			{
				property: "og:title",
				content: "Mahidol Insight Hub"
			},
			{
				property: "og:description",
				content: "Mahidol Insight Hub Survey & Analytics"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "th",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$18.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuntimeErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-right",
			richColors: true,
			closeButton: true
		})]
	});
}
var $$splitComponentImporter$5 = () => import("./routes-Bz_nks4b.mjs");
var Route$17 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin-DDj7eJ02.mjs");
var Route$16 = createFileRoute("/admin")({
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			if (!(sessionStorage.getItem("dashboard_auth") === "true")) throw redirect({
				to: "/login",
				search: { redirect: "/admin" }
			});
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./clean-energy-Bjx8jx17.mjs");
var Route$15 = createFileRoute("/clean-energy")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var Route$14 = createFileRoute("/dashboard")({
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			if (!(sessionStorage.getItem("dashboard_auth") === "true")) throw redirect({
				to: "/login",
				search: { redirect: "/dashboard" }
			});
		}
	},
	component: DashboardPage
});
var GOOGLE_SCRIPT_URL$1 = "https://script.google.com/macros/s/AKfycbxIXYFkonDlYf8sb1VqTDoJXlsZ58Pd53qYSP-rxeLc-9_hiHA4kKIUVAUEM-IdcrLIkQ/exec";
var QUESTION_MAP = {
	p2_location: {
		title: "ความเหมาะสมของสถานที่",
		category: "การจัดงาน"
	},
	p2_schedule: {
		title: "ความเหมาะสมของระยะเวลา",
		category: "การจัดงาน"
	},
	p2_readiness: {
		title: "ความพร้อมของอุปกรณ์/สื่อ",
		category: "การจัดงาน"
	},
	p2_reception: {
		title: "การต้อนรับและการอำนวยความสะดวก",
		category: "การจัดงาน"
	},
	p2_overall: {
		title: "ภาพรวมการจัดกิจกรรม",
		category: "การจัดงาน"
	},
	p3_interest: {
		title: "ความน่าสนใจของเนื้อหา",
		category: "เนื้อหา/การเรียนรู้"
	},
	p3_content: {
		title: "ความสมบูรณ์ครบถ้วนของเนื้อหา",
		category: "เนื้อหา/การเรียนรู้"
	},
	p3_clarity: {
		title: "ความชัดเจนในการถ่ายทอด",
		category: "เนื้อหา/การเรียนรู้"
	},
	p3_benefit: {
		title: "ประโยชน์ที่ได้รับ",
		category: "เนื้อหา/การเรียนรู้"
	},
	p3_application: {
		title: "การนำไปประยุกต์ใช้",
		category: "เนื้อหา/การเรียนรู้"
	},
	p4_knowledge: {
		title: "ความรู้ความเข้าใจที่เพิ่มขึ้น",
		category: "ผลกระทบ"
	},
	p4_inspiration: {
		title: "แรงบันดาลใจในการต่อยอด",
		category: "ผลกระทบ"
	},
	p4_communityResource: {
		title: "การเป็นแหล่งเรียนรู้ของชุมชน",
		category: "ผลกระทบ"
	},
	p4_futureReturn: {
		title: "ความสนใจเข้าร่วมอีกในอนาคต",
		category: "ผลกระทบ"
	},
	timestamp: {
		title: "",
		category: ""
	},
	ageGroup: {
		title: "",
		category: ""
	},
	affiliation: {
		title: "",
		category: ""
	},
	everJoined: {
		title: "",
		category: ""
	},
	channels: {
		title: "",
		category: ""
	},
	feedback: {
		title: "",
		category: ""
	}
};
function isRecord$3(value) {
	return typeof value === "object" && value !== null;
}
function isSurveyResponse(value) {
	return isRecord$3(value);
}
var COLOR_PALETTE = [
	"#0284c7",
	"#6366f1",
	"#a855f7",
	"#ec4899",
	"#f97316",
	"#10b981",
	"#f59e0b"
];
var MONTH_NAMES = [
	"มกราคม",
	"กุมภาพันธ์",
	"มีนาคม",
	"เมษายน",
	"พฤษภาคม",
	"มิถุนายน",
	"กรกฎาคม",
	"สิงหาคม",
	"กันยายน",
	"ตุลาคม",
	"พฤศจิกายน",
	"ธันวาคม"
];
function DashboardPage() {
	const navigate = useNavigate();
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [lastUpdated, setLastUpdated] = (0, import_react.useState)("");
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const [selectedYear, setSelectedYear] = (0, import_react.useState)("ALL");
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)("ALL");
	const [selectedAge, setSelectedAge] = (0, import_react.useState)("ALL");
	const [selectedAffiliation, setSelectedAffiliation] = (0, import_react.useState)("ALL");
	(0, import_react.useEffect)(() => {
		if (!(sessionStorage.getItem("dashboard_auth") === "true")) {
			navigate({
				to: "/login",
				search: { redirect: "/dashboard" }
			});
			return;
		}
		fetchData();
	}, [navigate]);
	const handleLogout = () => {
		sessionStorage.clear();
		fetch("/api/auth/logout", { method: "POST" });
		navigate({
			to: "/login",
			search: { redirect: "/dashboard" },
			replace: true
		});
	};
	const handleResetFilter = () => {
		setSelectedYear("ALL");
		setSelectedMonth("ALL");
		setSelectedAge("ALL");
		setSelectedAffiliation("ALL");
	};
	const fetchData = async () => {
		setLoading(true);
		setErrorMsg("");
		try {
			const res = await fetch(GOOGLE_SCRIPT_URL$1, {
				method: "GET",
				redirect: "follow"
			});
			if (!res.ok) throw new Error("ไม่สามารถเชื่อมต่อกับ Google Apps Script ได้");
			const json = await res.json();
			if (Array.isArray(json)) {
				const validData = json.filter(isSurveyResponse).filter((item) => {
					if (!item || typeof item !== "object") return false;
					return Object.values(item).some((val) => val !== null && val !== void 0 && String(val).trim() !== "");
				});
				setData(validData);
			} else setData([]);
			const now = /* @__PURE__ */ new Date();
			setLastUpdated(`${now.getDate()} ส.ค. ${now.getFullYear() + 543} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
		} catch (err) {
			console.error("Error fetching dashboard data:", err);
			setErrorMsg("ไม่สามารถดึงข้อมูลได้ในขณะนี้ กรุณากด Refresh อีกครั้ง");
			setData([]);
		} finally {
			setLoading(false);
		}
	};
	const parseNum = (val) => {
		const n = Number(val);
		return isNaN(n) ? 0 : n;
	};
	const availableYears = (0, import_react.useMemo)(() => {
		const yearSet = /* @__PURE__ */ new Set();
		data.forEach((item) => {
			if (item.timestamp) {
				const d = new Date(item.timestamp);
				if (!isNaN(d.getTime())) yearSet.add(d.getFullYear().toString());
			}
		});
		return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
	}, [data]);
	const availableMonths = (0, import_react.useMemo)(() => {
		const monthSet = /* @__PURE__ */ new Set();
		data.forEach((item) => {
			if (item.timestamp) {
				const d = new Date(item.timestamp);
				if (!isNaN(d.getTime())) {
					if (selectedYear === "ALL" || d.getFullYear().toString() === selectedYear) monthSet.add(d.getMonth());
				}
			}
		});
		return Array.from(monthSet).sort((a, b) => a - b);
	}, [data, selectedYear]);
	const ageGroupList = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		data.forEach((item) => {
			if (item.ageGroup?.trim()) set.add(item.ageGroup.trim());
		});
		return Array.from(set);
	}, [data]);
	const affiliationsList = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		data.forEach((item) => set.add(item.affiliation?.trim() || "ไม่ระบุ"));
		return Array.from(set);
	}, [data]);
	const filteredData = (0, import_react.useMemo)(() => {
		return data.filter((item) => {
			if (item.timestamp) {
				const itemDate = new Date(item.timestamp);
				if (!isNaN(itemDate.getTime())) {
					if (selectedYear !== "ALL" && itemDate.getFullYear().toString() !== selectedYear) return false;
					if (selectedMonth !== "ALL" && itemDate.getMonth().toString() !== selectedMonth) return false;
				}
			}
			if (selectedAge !== "ALL") {
				if ((item.ageGroup?.trim() || "") !== selectedAge) return false;
			}
			if (selectedAffiliation !== "ALL") {
				if ((item.affiliation?.trim() || "ไม่ระบุ") !== selectedAffiliation) return false;
			}
			return true;
		});
	}, [
		data,
		selectedYear,
		selectedMonth,
		selectedAge,
		selectedAffiliation
	]);
	const itemScores = (0, import_react.useMemo)(() => {
		return Object.keys(QUESTION_MAP).filter((k) => QUESTION_MAP[k].title !== "").map((key) => {
			let sum = 0;
			let count = 0;
			filteredData.forEach((item) => {
				const val = parseNum(item[key]);
				if (val > 0) {
					sum += val;
					count++;
				}
			});
			const avg = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
			return {
				key,
				title: QUESTION_MAP[key].title,
				category: QUESTION_MAP[key].category,
				avg
			};
		});
	}, [filteredData]);
	const categoryGroupedScores = (0, import_react.useMemo)(() => {
		const groups = {};
		itemScores.forEach((item) => {
			if (!groups[item.category]) groups[item.category] = {
				category: item.category,
				avg: 0,
				items: []
			};
			groups[item.category]?.items.push(item);
		});
		return Object.values(groups).map((group) => {
			const total = group.items.reduce((sum, i) => sum + i.avg, 0);
			const avg = group.items.length > 0 ? parseFloat((total / group.items.length).toFixed(2)) : 0;
			const sortedItems = [...group.items].sort((a, b) => b.avg - a.avg);
			return {
				...group,
				avg,
				items: sortedItems
			};
		}).sort((a, b) => b.avg - a.avg);
	}, [itemScores]);
	const cardMetrics = (0, import_react.useMemo)(() => {
		if (itemScores.length === 0 || filteredData.length === 0) return null;
		const sorted = [...itemScores].sort((a, b) => b.avg - a.avg);
		const highest = sorted[0];
		const lowest = sorted[sorted.length - 1];
		if (!highest || !lowest) return null;
		const rawGrandAvg = itemScores.reduce((acc, curr) => acc + curr.avg, 0) / itemScores.length;
		return {
			highest,
			lowest,
			grandAvgPercent: Math.round(rawGrandAvg / 5 * 100),
			totalQuestions: itemScores.length
		};
	}, [itemScores, filteredData]);
	const affiliationBreakdown = (0, import_react.useMemo)(() => {
		const counts = {};
		filteredData.forEach((item) => {
			const key = item.affiliation?.trim() || "ไม่ระบุ";
			counts[key] = (counts[key] || 0) + 1;
		});
		const total = filteredData.length || 1;
		return Object.entries(counts).map(([name, count], idx) => ({
			name,
			count,
			percent: parseFloat((count / total * 100).toFixed(1)),
			color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
		}));
	}, [filteredData]);
	const feedbackAnalysis = (0, import_react.useMemo)(() => {
		const rawFeedbacks = filteredData.filter((d) => d.feedback && d.feedback.trim() !== "").map((d) => ({
			text: d.feedback.trim(),
			affiliation: d.affiliation || "ไม่ระบุ",
			timestamp: d.timestamp || "N/A"
		}));
		let positiveCount = 0;
		let followUpCount = 0;
		let urgentCount = 0;
		let generalCount = 0;
		const topicCounts = {
			"การให้บริการ": 0,
			"กิจกรรม/การเรียนรู้": 0,
			"สิ่งแวดล้อม/สถานที่": 0,
			"อุปกรณ์/สื่อ": 0
		};
		const incrementTopic = (topic) => {
			topicCounts[topic] = (topicCounts[topic] ?? 0) + 1;
		};
		const parsedList = rawFeedbacks.map((item) => {
			const t = item.text.toLowerCase();
			let status = "positive";
			let tag = "ทั่วไป";
			if (t.includes("ด่วน") || t.includes("ปรับปรุง") || t.includes("แย่") || t.includes("เสีย") || t.includes("ช้า")) {
				status = "urgent";
				urgentCount++;
			} else if (t.includes("ควร") || t.includes("อยากให้") || t.includes("ติดตาม") || t.includes("เพิ่ม")) {
				status = "followup";
				followUpCount++;
			} else if (t.includes("ดี") || t.includes("ประทับใจ") || t.includes("ชอบ") || t.includes("เยี่ยม") || t.includes("ขอบคุณ")) {
				status = "positive";
				positiveCount++;
			} else {
				status = "general";
				generalCount++;
			}
			if (t.includes("บริการ") || t.includes("พนักงาน") || t.includes("ต้อนรับ") || t.includes("เจ้าหน้าที่")) {
				tag = "การให้บริการ";
				incrementTopic(tag);
			} else if (t.includes("จอดรถ") || t.includes("สถานที่") || t.includes("ห้อง") || t.includes("แอร์") || t.includes("สะอาด")) {
				tag = "สิ่งแวดล้อม/สถานที่";
				incrementTopic(tag);
			} else if (t.includes("อุปกรณ์") || t.includes("สื่อ") || t.includes("ไมค์") || t.includes("สไลด์")) {
				tag = "อุปกรณ์/สื่อ";
				incrementTopic(tag);
			} else {
				tag = "กิจกรรม/การเรียนรู้";
				incrementTopic(tag);
			}
			return {
				...item,
				status,
				tag
			};
		});
		const maxTopicCount = Math.max(...Object.values(topicCounts), 1);
		return {
			total: rawFeedbacks.length,
			positiveCount,
			followUpCount,
			urgentCount,
			generalCount,
			topicCounts,
			maxTopicCount,
			latestList: parsedList.slice(0, 5)
		};
	}, [filteredData]);
	const getScoreBadge = (score) => {
		if (score >= 4.5) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-200",
			children: "🟢 ดีมากที่สุด"
		});
		if (score >= 3.5) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-bold border border-blue-200",
			children: "🔵 ดีมาก"
		});
		if (score >= 2.5) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold border border-amber-200",
			children: "🟡 ปานกลาง"
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold border border-red-200",
			children: "🔴 ควรปรับปรุง"
		});
	};
	const renderPieChart = () => {
		if (affiliationBreakdown.length === 0) return null;
		let accumulatedPercent = 0;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-44 h-44 mx-auto flex items-center justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 36 36",
				className: "w-full h-full transform -rotate-90",
				children: affiliationBreakdown.map((item, idx) => {
					const strokeDasharray = `${item.percent} ${100 - item.percent}`;
					const strokeDashoffset = -accumulatedPercent;
					accumulatedPercent += item.percent;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "18",
						cy: "18",
						r: "15.91549430918954",
						fill: "transparent",
						stroke: item.color,
						strokeWidth: "4.5",
						strokeDasharray,
						strokeDashoffset,
						className: "transition-all duration-300 hover:opacity-80 cursor-pointer"
					}, idx);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute text-center pointer-events-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xl font-black text-amber-600 font-mono",
					children: filteredData.length
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-slate-500 uppercase tracking-wider font-bold",
					children: "คนทั้งหมด"
				})]
			})]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 font-sans selection:bg-amber-100 selection:text-amber-900",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center text-xs text-slate-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-amber-600 transition-colors flex items-center gap-1 font-semibold",
						children: "← Back to home"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-amber-700 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 shadow-sm",
						children: "Viewing Fixed Google Sheets"
					})]
				}),
				errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs text-center font-medium shadow-sm",
					children: ["⚠️ ", errorMsg]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 rounded-full bg-amber-50/50 border border-amber-200 flex items-center justify-center p-1.5 shadow-sm shrink-0 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/Mahidol_U.jpg",
								alt: "Mahidol Logo",
								className: "w-full h-full object-contain rounded-full"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-amber-600 tracking-wider uppercase",
								children: "Mahidol University"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5",
								children: "พิธีเปิดห้องการเรียนรู้ครั่งครบวงจร"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 tracking-wider mt-0.5 font-medium",
								children: "EXECUTIVE ANALYTICS & SATISFACTION INSIGHT"
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t border-slate-100 lg:border-t-0 pt-3 lg:pt-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 justify-end",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${loading ? "bg-amber-500 animate-ping" : "bg-emerald-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-bold ${loading ? "text-amber-600" : "text-emerald-600"}`,
										children: loading ? "CONNECTING..." : "LIVE / CONNECTED"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-400 mt-0.5",
									children: ["Last Updated: ", lastUpdated || "กำลังโหลด..."]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: fetchData,
								disabled: loading,
								className: "px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm active:scale-95",
								children: "🔄 Refresh"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleLogout,
								className: "px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95",
								children: "🚪 Logout"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center border-b border-slate-100 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "p-1 rounded bg-indigo-50 text-indigo-600 text-sm",
									children: "🎛️"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-800 text-sm",
									children: "ปรับเลือกข้อมูลที่ต้องการดู"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400 hidden sm:inline",
									children: "— เลือกตัวกรองได้หลายเงื่อนไขพร้อมกัน"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleResetFilter,
							className: "text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 text-xs transition-colors cursor-pointer bg-slate-50 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-red-200",
							children: "✕ ล้างตัวกรอง"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2.5 sm:gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-amber-700 font-bold",
										children: "📅 ปี:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: selectedYear,
										onChange: (e) => {
											setSelectedYear(e.target.value);
											setSelectedMonth("ALL");
										},
										className: "bg-transparent text-slate-800 outline-none cursor-pointer font-semibold text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ALL",
											children: "ทุกปี"
										}), availableYears.map((year) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: year,
											children: [
												"พ.ศ. ",
												Number(year) + 543,
												" (",
												year,
												")"
											]
										}, year))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-amber-700 font-bold",
										children: "🗓️ เดือน:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: selectedMonth,
										onChange: (e) => setSelectedMonth(e.target.value),
										className: "bg-transparent text-slate-800 outline-none cursor-pointer font-semibold text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ALL",
											children: "ทุกเดือน"
										}), availableMonths.map((mIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: mIdx.toString(),
											children: MONTH_NAMES[mIdx]
										}, mIdx))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-amber-700 font-bold",
										children: "🎂 อายุ:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: selectedAge,
										onChange: (e) => setSelectedAge(e.target.value),
										className: "bg-transparent text-slate-800 outline-none cursor-pointer font-semibold text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ALL",
											children: "ทุกช่วงอายุ"
										}), ageGroupList.map((age) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: age,
											children: age
										}, age))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-amber-500 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-amber-700 font-bold",
										children: "📌 สังกัด:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: selectedAffiliation,
										onChange: (e) => setSelectedAffiliation(e.target.value),
										className: "bg-transparent text-slate-800 outline-none cursor-pointer font-semibold text-xs max-w-[150px] truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ALL",
											children: "ทั้งหมด"
										}), affiliationsList.map((aff) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: aff,
											children: aff
										}, aff))]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 self-start md:self-auto font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500",
									children: "แสดงผล:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber-600 font-bold font-mono text-sm",
									children: filteredData.length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-400",
									children: [
										"/ ",
										data.length,
										" รายการ"
									]
								})
							]
						})]
					})]
				}),
				cardMetrics && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm mb-2 font-bold",
								children: "📋"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 font-semibold",
									children: "จำนวนคนประเมิน"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-1 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-black text-slate-800 font-mono",
										children: filteredData.length
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-slate-400 font-medium",
										children: "คน"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-400 mt-1 truncate",
									children: [
										"จากทั้งหมด ",
										data.length,
										" รายการ"
									]
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm mb-2 font-bold",
								children: "⭐"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 font-semibold",
									children: "คะแนนเฉลี่ยรวม"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-baseline gap-1 mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-2xl font-black text-amber-600 font-mono",
										children: [cardMetrics.grandAvgPercent, "%"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-400 mt-1 truncate",
									children: [
										"คำนวณจาก ",
										cardMetrics.totalQuestions,
										" หัวข้อประเมิน"
									]
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm mb-2 font-bold",
								children: "🏅"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 font-semibold",
									children: "หมวดคะแนนสูงสุด"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-800 line-clamp-1 mt-1",
									children: cardMetrics.highest.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-1 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-black text-purple-600 font-mono",
										children: cardMetrics.highest.avg.toFixed(2)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-slate-400",
										children: "/ 5"
									})]
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm mb-2 font-bold",
								children: "🛠️"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 font-semibold",
									children: "หมวดที่ควรปรับปรุง"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-800 line-clamp-1 mt-1",
									children: cardMetrics.lowest.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-1 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-black text-rose-600 font-mono",
										children: cardMetrics.lowest.avg.toFixed(2)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-slate-400",
										children: "/ 5"
									})]
								})
							] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-xs font-bold text-amber-700 tracking-wider uppercase border-b border-slate-100 pb-2.5 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📊" }), " คะแนนความพึงพอใจแยกตามหมวดหมู่ (เรียงตามคะแนนสูงสุด-ต่ำสุด)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-5 max-h-[420px] overflow-y-auto pr-2",
							children: categoryGroupedScores.map((catGroup, groupIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center border-b border-slate-200/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-slate-800 text-xs sm:text-sm",
											children: ["ด้าน", catGroup.category]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 font-medium",
											children: "เฉลี่ยหมวด:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-black text-amber-600 text-xs sm:text-sm",
											children: catGroup.avg.toFixed(2)
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3 pl-1",
									children: catGroup.items.map((item, itemIdx) => {
										const globalIdx = groupIdx * 3 + itemIdx;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between items-center text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-700 truncate max-w-[65%] font-medium",
													children: item.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-bold text-slate-800",
														children: item.avg.toFixed(2)
													}), getScoreBadge(item.avg)]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-full bg-slate-200/70 h-2.5 rounded-full overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full rounded-full transition-all duration-500 shadow-sm",
													style: {
														width: `${item.avg / 5 * 100}%`,
														backgroundColor: COLOR_PALETTE[globalIdx % COLOR_PALETTE.length]
													}
												})
											})]
										}, item.key);
									})
								})]
							}, catGroup.category))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-bold text-amber-700 tracking-wider uppercase border-b border-slate-100 pb-2.5",
								children: "🍕 สัดส่วนผู้ตอบจำแนกตามหน่วยงาน"
							}),
							renderPieChart(),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 pt-2 border-t border-slate-100 max-h-[180px] overflow-y-auto pr-1",
								children: affiliationBreakdown.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 truncate max-w-[70%]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-2.5 h-2.5 rounded-full shrink-0 shadow-sm",
											style: { backgroundColor: item.color }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-700 truncate font-medium",
											children: item.name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-500 font-mono shrink-0",
										children: [
											item.count,
											" คน (",
											item.percent,
											"%)"
										]
									})]
								}, item.name))
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start sm:items-center border-b border-slate-100 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💬" }), " FEEDBACK & SUGGESTIONS"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 mt-0.5",
								children: "ภาพรวมความคิดเห็นและข้อเสนอแนะ"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer hover:underline",
								children: "ดูทั้งหมด →"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-black text-blue-700 font-mono",
											children: feedbackAnalysis.total
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-blue-900 mt-0.5",
											children: "🔵 ความคิดเห็น"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-blue-600/80 mt-0.5",
											children: "รวมทุกหมวด"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-black text-emerald-700 font-mono",
											children: feedbackAnalysis.positiveCount
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-emerald-900 mt-0.5",
											children: "🟢 เชิงบวก / ปกติ"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-emerald-600/80 mt-0.5",
											children: "ชื่นชมกิจกรรม"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-black text-amber-700 font-mono",
											children: feedbackAnalysis.followUpCount
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-amber-900 mt-0.5",
											children: "🟡 ควรติดตาม"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-amber-600/80 mt-0.5",
											children: "ข้อเสนอแนะพัฒนา"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-rose-50/60 border border-rose-200/80 rounded-xl p-3.5 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-black text-rose-700 font-mono",
											children: feedbackAnalysis.urgentCount
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-rose-900 mt-0.5",
											children: "🔴 เร่งด่วน"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-600/80 mt-0.5",
											children: "ควรปรับปรุงทันที"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🔎" }), " ประเด็นสำคัญจำแนกตามเรื่อง"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3 pt-1",
									children: Object.entries(feedbackAnalysis.topicCounts).map(([topic, count]) => {
										const percent = Math.round(count / feedbackAnalysis.maxTopicCount * 100);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between items-center text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-slate-700",
													children: topic
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-bold text-slate-900",
													children: [count, " เรื่อง"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-full bg-slate-200 h-2.5 rounded-full overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full bg-amber-500 rounded-full transition-all duration-500",
													style: { width: `${percent}%` }
												})
											})]
										}, topic);
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🕐" }), " ข้อเสนอแนะล่าสุด"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2.5 max-h-[220px] overflow-y-auto pr-1",
									children: feedbackAnalysis.latestList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 py-6 text-center",
										children: "ไม่มีข้อเสนอแนะเพิ่มเติม"
									}) : feedbackAnalysis.latestList.map((item, idx) => {
										const statusStyle = {
											positive: {
												bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
												text: "🟢 ปกติ/เชิงบวก"
											},
											followup: {
												bg: "bg-amber-100 text-amber-800 border-amber-200",
												text: "🟡 ควรติดตาม"
											},
											urgent: {
												bg: "bg-rose-100 text-rose-800 border-rose-200",
												text: "🔴 เร่งด่วน"
											},
											general: {
												bg: "bg-blue-100 text-blue-800 border-blue-200",
												text: "🔵 ข้อมูลทั่วไป"
											}
										}[item.status];
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-white border border-slate-200 rounded-lg p-2.5 text-xs space-y-1.5 shadow-2xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-slate-800 font-medium leading-relaxed",
												children: [
													"\"",
													item.text,
													"\""
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-1.5 pt-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-medium",
														children: [
															"[",
															item.tag,
															"]"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyle.bg}`,
														children: statusStyle.text
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-slate-400 ml-auto font-mono",
														children: item.affiliation
													})
												]
											})]
										}, idx);
									})
								})]
							})]
						})
					]
				})
			]
		})
	});
}
var Route$13 = createFileRoute("/login")({
	validateSearch: (search) => {
		return { redirect: search["redirect"] === "/admin" ? "/admin" : "/dashboard" };
	},
	component: LoginPage
});
function LoginPage() {
	const navigate = useNavigate();
	const { redirect } = Route$13.useSearch();
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password })
			});
			if (response.ok) {
				sessionStorage.setItem("dashboard_auth", "true");
				await navigate({ to: redirect });
			} else {
				const body = await response.json().catch(() => ({}));
				setError(body.error ?? "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
			}
		} catch {
			setError("ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl max-w-sm w-full space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black text-slate-800 tracking-tight",
						children: "เข้าสู่ระบบ Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 font-medium",
						children: "กรุณากรอกรหัสผ่านเพื่อเข้าชมสรุปผลแบบประเมิน"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleLogin,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-slate-700 block",
								children: "รหัสผ่าน"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								placeholder: "กรอกรหัสผ่านที่นี่...",
								value: password,
								onChange: (e) => {
									setPassword(e.target.value);
									setError("");
								},
								className: "w-full px-3.5 py-2.5 rounded-xl border border-emerald-500 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 transition-all placeholder:text-slate-400",
								autoFocus: true
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "text-xs font-semibold text-red-500 text-center animate-shake",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer",
							children: loading ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-2 text-center border-t border-slate-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-semibold transition-colors py-1 px-2 rounded-lg hover:bg-slate-50",
						children: "← กลับสู่หน้าหลัก"
					})
				})
			]
		})
	});
}
var $$splitComponentImporter$2 = () => import("./rac-CwPwvRng.mjs");
var Route$12 = createFileRoute("/rac")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./smart-farm-N9rZQuYU.mjs");
var Route$11 = createFileRoute("/smart-farm")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./storefront-BUkZ9hjR.mjs");
var Route$10 = createFileRoute("/storefront")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$9 = createFileRoute("/survey")({ component: SurveyPage });
var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx6MoINngMyK4Jf4JgCTQHY_B_iydnYqtqSKcT2-UbslV23ZBX__k-ez7gbeixDXq8rPQ/exec";
var AGE_GROUPS = [
	"0 - 10 ปี",
	"11 - 20 ปี",
	"21 - 30 ปี",
	"31 - 40 ปี",
	"41 - 50 ปี",
	"51 - 60 ปี",
	"มากกว่า 60 ปี"
];
var AFFILIATIONS = [
	"หน่วยงานภาครัฐ (เช่น อบต./เทศบาล/อำเภอ)",
	"ภาคประชาชน/ชุมชน/ผู้นำชุมชน",
	"ภาคการศึกษา/สถานศึกษา",
	"อื่นๆ"
];
var CHANNEL_OPTIONS = [
	"FACEBOOK",
	"LINE",
	"WEBSITE ของคณะสิ่งแวดล้อมและทรัพยากรศาสตร์ ม.มหิดล",
	"อื่นๆ"
];
function SurveyPage() {
	const [step, setStep] = (0, import_react.useState)("pdpa");
	const [agreed, setAgreed] = (0, import_react.useState)(false);
	const [ageGroup, setAgeGroup] = (0, import_react.useState)("");
	const [affiliation, setAffiliation] = (0, import_react.useState)("");
	const [affiliationOther, setAffiliationOther] = (0, import_react.useState)("");
	const [everJoined, setEverJoined] = (0, import_react.useState)("");
	const [channels, setChannels] = (0, import_react.useState)([]);
	const [channelOther, setChannelOther] = (0, import_react.useState)("");
	const [p2_location, setP2_location] = (0, import_react.useState)(null);
	const [p2_schedule, setP2_schedule] = (0, import_react.useState)(null);
	const [p2_readiness, setP2_readiness] = (0, import_react.useState)(null);
	const [p2_reception, setP2_reception] = (0, import_react.useState)(null);
	const [p2_overall, setP2_overall] = (0, import_react.useState)(null);
	const [p3_interest, setP3_interest] = (0, import_react.useState)(null);
	const [p3_content, setP3_content] = (0, import_react.useState)(null);
	const [p3_clarity, setP3_clarity] = (0, import_react.useState)(null);
	const [p3_benefit, setP3_benefit] = (0, import_react.useState)(null);
	const [p3_application, setP3_application] = (0, import_react.useState)(null);
	const [p4_knowledge, setP4_knowledge] = (0, import_react.useState)(null);
	const [p4_inspiration, setP4_inspiration] = (0, import_react.useState)(null);
	const [p4_communityResource, setP4_communityResource] = (0, import_react.useState)(null);
	const [p4_futureReturn, setP4_futureReturn] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)("");
	const handleChannelChange = (val) => {
		setChannels((prev) => prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (channels.length === 0) {
			alert("กรุณาเลือกช่องทางที่ท่านทราบข่าวสารอย่างน้อย 1 ช่องทาง");
			return;
		}
		if ([
			p2_location,
			p2_schedule,
			p2_readiness,
			p2_reception,
			p2_overall,
			p3_interest,
			p3_content,
			p3_clarity,
			p3_benefit,
			p3_application,
			p4_knowledge,
			p4_inspiration,
			p4_communityResource,
			p4_futureReturn
		].some((r) => r === null)) {
			alert("กรุณาตอบแบบประเมินความพึงพอใจ (ให้คะแนน 1-5) ให้ครบทุกข้อครับ");
			return;
		}
		setStep("submitting");
		try {
			const finalAffiliation = affiliation === "อื่นๆ" ? affiliationOther : affiliation;
			const finalChannels = channels.map((c) => c === "อื่นๆ" ? channelOther : c).join(", ");
			const params = new URLSearchParams({
				ageGroup,
				affiliation: finalAffiliation,
				everJoined,
				channels: finalChannels,
				p2_location: p2_location?.toString() || "",
				p2_schedule: p2_schedule?.toString() || "",
				p2_readiness: p2_readiness?.toString() || "",
				p2_reception: p2_reception?.toString() || "",
				p2_overall: p2_overall?.toString() || "",
				p3_interest: p3_interest?.toString() || "",
				p3_content: p3_content?.toString() || "",
				p3_clarity: p3_clarity?.toString() || "",
				p3_benefit: p3_benefit?.toString() || "",
				p3_application: p3_application?.toString() || "",
				p4_knowledge: p4_knowledge?.toString() || "",
				p4_inspiration: p4_inspiration?.toString() || "",
				p4_communityResource: p4_communityResource?.toString() || "",
				p4_futureReturn: p4_futureReturn?.toString() || "",
				feedback
			});
			await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
				method: "GET",
				mode: "no-cors"
			});
			setStep("submitted");
		} catch (err) {
			console.error("Error sending data:", err);
			alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
			setStep("survey");
		}
	};
	const renderLikert = (nameGroup, value, onChange, leftLabel = "มากที่สุด", rightLabel = "น้อยที่สุด") => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-slate-500 w-20 text-left select-none",
					children: leftLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 sm:gap-6",
					children: [
						5,
						4,
						3,
						2,
						1
					].map((score) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col items-center gap-1 cursor-pointer select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: nameGroup,
							checked: value === score,
							onChange: () => onChange(score),
							className: "w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-600 dark:text-slate-400 font-medium",
							children: score
						})]
					}, score))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-slate-500 w-20 text-right select-none",
					children: rightLabel
				})
			]
		})
	});
	if (step === "submitted") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat",
		style: { backgroundImage: "url('/Backdrop_Shellac_2569.png')" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-w-md w-full text-center bg-white/95 dark:bg-slate-800/95 p-8 rounded-2xl shadow-2xl border border-white/40 dark:border-slate-700 backdrop-blur-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold",
					children: "✓"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold text-emerald-800 dark:text-emerald-400 mb-2",
					children: "ขอบคุณสำหรับข้อมูล!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-600 dark:text-slate-300",
					children: "ระบบได้รับผลการตอบแบบประเมินกิจกรรมพิธีเปิดห้องการเรียนรู้ครั่งครบวงจรเรียบร้อยแล้ว"
				})
			]
		})]
	});
	if (step === "pdpa") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen relative py-12 px-4 flex items-center justify-center bg-cover bg-center bg-no-repeat",
		style: { backgroundImage: "url('/Backdrop_Shellac_2569.png')" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-w-2xl w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/50 dark:border-slate-700",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-emerald-100 dark:border-slate-700 pb-4 mb-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800",
							children: "พิธีเปิด"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3",
							children: "ห้องการเรียนรู้ครั่งครบวงจร"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1",
							children: "วันที่ 21 สิงหาคม พ.ศ.2569 ณ คณะสิ่งแวดล้อมฯ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2",
					children: "ข้อตกลงความเป็นส่วนตัว (PDPA)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-emerald-50/80 dark:bg-slate-900/60 rounded-xl text-sm text-slate-700 dark:text-slate-300 mb-6 leading-relaxed border border-emerald-100/80 dark:border-slate-700",
					children: [
						"ข้อมูลที่ท่านกรอกในแบบประเมินนี้จะนำไปใช้เพื่อการวิเคราะห์และปรับปรุงการจัดกิจกรรมเท่านั้น",
						" ",
						"โดยจะได้รับการคุ้มครองตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)",
						" ",
						"และไม่มีการเปิดเผยข้อมูลระบุตัวตนสู่สาธารณะ"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-3 mb-6 cursor-pointer group select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: agreed,
						onChange: (e) => setAgreed(e.target.checked),
						className: "w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-slate-700 dark:text-slate-300 font-medium group-hover:text-emerald-700 transition-colors",
						children: "ข้าพเจ้าได้อ่านและยอมรับเงื่อนไขข้อตกลงความเป็นส่วนตัว"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							window.location.href = "/";
						},
						className: "w-1/2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer",
						children: "ไม่ยอมรับ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !agreed,
						onClick: () => setStep("survey"),
						className: "w-1/2 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer",
						children: "ยอมรับ"
					})]
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-emerald-50/30 dark:bg-slate-900 py-8 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 sm:p-8 border-t-8 border-t-emerald-600 border-x border-b border-emerald-100 dark:border-slate-700",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white",
					children: "แบบเก็บข้อมูลความพึงพอใจพิธีเปิดห้องการเรียนรู้ครั่งครบวงจร"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-emerald-700 dark:text-emerald-400 mt-2 font-medium",
					children: "วันศุกร์ที่ 21 สิงหาคม พ.ศ. 2569 ณ คณะสิ่งแวดล้อมฯ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-emerald-800 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-700 pb-2",
								children: "ตอนที่ 1 ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2",
								children: ["ช่วงอายุ (ปี) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
								children: AGE_GROUPS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-emerald-50/50 dark:hover:bg-slate-700/50 cursor-pointer text-sm text-slate-700 dark:text-slate-300 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "ageGroup",
										required: true,
										value: item,
										onChange: (e) => setAgeGroup(e.target.value),
										className: "text-emerald-600 focus:ring-emerald-500 cursor-pointer"
									}), item]
								}, item))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2",
								children: ["หน่วยงานที่สังกัดอยู่ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [AFFILIATIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "affiliation",
										required: true,
										value: item,
										onChange: (e) => setAffiliation(e.target.value),
										className: "text-emerald-600 focus:ring-emerald-500 cursor-pointer"
									}), item]
								}, item)), affiliation === "อื่นๆ" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "ระบุหน่วยงานของคุณ...",
									value: affiliationOther,
									onChange: (e) => setAffiliationOther(e.target.value),
									className: "mt-2 w-full p-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2",
								children: ["ท่านเคยเข้าร่วมกิจกรรมของโครงการนี้มาก่อนหรือไม่ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-6",
								children: ["เคย", "ไม่เคย"].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "everJoined",
										required: true,
										value: item,
										onChange: (e) => setEverJoined(e.target.value),
										className: "text-emerald-600 focus:ring-emerald-500 cursor-pointer"
									}), item]
								}, item))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2",
								children: ["ท่านทราบข่าวสารการจัดงานจากช่องทางใด (เลือกได้มากกว่า 1 ข้อ) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [CHANNEL_OPTIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										value: item,
										checked: channels.includes(item),
										onChange: () => handleChannelChange(item),
										className: "rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
									}), item]
								}, item)), channels.includes("อื่นๆ") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "ระบุช่องทางอื่น...",
									value: channelOther,
									onChange: (e) => setChannelOther(e.target.value),
									className: "mt-2 w-full p-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
								})]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-emerald-800 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-700 pb-2",
								children: "ตอนที่ 2 ความพึงพอใจต่อการจัดพิธีเปิด"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["1. ความเหมาะสมของสถานที่จัดงาน ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p2_location", p2_location, setP2_location)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["2. ความเหมาะสมของกำหนดการและระยะเวลาการจัดงาน ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p2_schedule", p2_schedule, setP2_schedule)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["3. ความพร้อมและความเป็นระเบียบของสถานที่ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p2_readiness", p2_readiness, setP2_readiness)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["4. การต้อนรับและการอำนวยความสะดวกของเจ้าหน้าที่ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p2_reception", p2_reception, setP2_reception)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["5. ความพึงพอใจต่อการจัดพิธีเปิดโดยรวม ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p2_overall", p2_overall, setP2_overall)] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-emerald-800 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-700 pb-2",
								children: "ตอนที่ 3 ความพึงพอใจต่อห้องการเรียนรู้ครั่งครบวงจร"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["1. ความน่าสนใจของห้องการเรียนรู้และนิทรรศการ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p3_interest", p3_interest, setP3_interest)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["2. ความเหมาะสมและความครบถ้วนของเนื้อหา ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p3_content", p3_content, setP3_content)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["3. ความชัดเจนและเข้าใจง่ายของสื่อการเรียนรู้ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p3_clarity", p3_clarity, setP3_clarity)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["4. ประโยชน์ขององค์ความรู้ที่ได้รับ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p3_benefit", p3_benefit, setP3_benefit)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["5. ความสามารถในการนำความรู้ไปใช้หรือต่อยอด ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p3_application", p3_application, setP3_application)] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-emerald-800 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-700 pb-2",
								children: "ตอนที่ 4 ผลที่ได้รับและข้อเสนอแนะ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["1. ท่านได้รับความรู้และความเข้าใจเกี่ยวกับครั่งเพิ่มขึ้น ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p4_knowledge", p4_knowledge, setP4_knowledge)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["2. กิจกรรมสามารถสร้างแรงบันดาลใจในการอนุรักษ์และพัฒนาครั่ง ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p4_inspiration", p4_inspiration, setP4_inspiration)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["3. ห้องการเรียนรู้สามารถใช้เป็นแหล่งเรียนรู้สำหรับชุมชนและผู้สนใจได้ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p4_communityResource", p4_communityResource, setP4_communityResource)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300",
								children: ["4. ท่านมีความสนใจเข้าร่วมกิจกรรมหรือกลับมาใช้ห้องการเรียนรู้อีกในอนาคต ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), renderLikert("p4_futureReturn", p4_futureReturn, setP4_futureReturn)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2",
								children: "5. ข้อเสนอแนะ/ความคิดเห็นเพิ่มเติม"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: feedback,
								onChange: (e) => setFeedback(e.target.value),
								className: "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none",
								placeholder: "ข้อเสนอแนะเพิ่มเติม..."
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: step === "submitting",
						className: "w-full rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white hover:bg-emerald-700 shadow-lg transition-all disabled:opacity-50 cursor-pointer",
						children: step === "submitting" ? "กำลังบันทึกข้อมูล..." : "ส่งแบบประเมิน"
					})
				]
			})]
		})
	});
}
var schema_exports = /* @__PURE__ */ __exportAll({
	evBookingStatusEnum: () => evBookingStatusEnum,
	evBookings: () => evBookings,
	orderItems: () => orderItems,
	orderItemsRelations: () => orderItemsRelations,
	orderStatusEnum: () => orderStatusEnum,
	orders: () => orders,
	ordersRelations: () => ordersRelations,
	plotStatusEnum: () => plotStatusEnum,
	plots: () => plots,
	plotsRelations: () => plotsRelations,
	products: () => products,
	sensorLogs: () => sensorLogs,
	sensorLogsRelations: () => sensorLogsRelations
});
var orderStatusEnum = pgEnum("order_status", [
	"pending",
	"paid",
	"fulfilled",
	"cancelled"
]);
var plotStatusEnum = pgEnum("plot_status", [
	"ready",
	"normal",
	"attention"
]);
var evBookingStatusEnum = pgEnum("ev_booking_status", [
	"pending",
	"confirmed",
	"cancelled"
]);
var plots = pgTable("plots", {
	id: uuid("id").defaultRandom().primaryKey(),
	plotCode: varchar("plot_code", { length: 50 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	mapUrl: text("map_url"),
	status: plotStatusEnum("status").default("normal").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({ plotCodeUnique: unique("plots_plot_code_unique").on(table.plotCode) }));
var sensorLogs = pgTable("sensor_logs", {
	id: uuid("id").defaultRandom().primaryKey(),
	plotId: uuid("plot_id").notNull().references(() => plots.id, { onDelete: "cascade" }),
	recordedAt: timestamp("recorded_at").defaultNow().notNull(),
	temperatureC: decimal("temperature_c", {
		precision: 5,
		scale: 2
	}).notNull(),
	humidityPercent: decimal("humidity_percent", {
		precision: 5,
		scale: 2
	}).notNull(),
	soilMoisturePercent: decimal("soil_moisture_percent", {
		precision: 5,
		scale: 2
	}).notNull(),
	lightLux: integer("light_lux").notNull()
});
var evBookings = pgTable("ev_bookings", {
	id: uuid("id").defaultRandom().primaryKey(),
	customerName: varchar("customer_name", { length: 255 }).notNull(),
	customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
	vehiclePlate: varchar("vehicle_plate", { length: 30 }).notNull(),
	chargerId: varchar("charger_id", { length: 50 }).notNull(),
	startAt: timestamp("start_at").notNull(),
	endAt: timestamp("end_at").notNull(),
	status: evBookingStatusEnum("status").default("pending").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var products = pgTable("products", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	category: varchar("category", { length: 100 }),
	price: decimal("price", {
		precision: 10,
		scale: 2
	}).notNull(),
	unit: varchar("unit", { length: 50 }).notNull(),
	stockQuantity: integer("stock_quantity").notNull().default(0),
	imageUrl: text("image_url"),
	harvestDate: timestamp("harvest_date"),
	isPreorder: boolean("is_preorder").default(false).notNull(),
	researchTag: varchar("research_tag", { length: 100 }),
	plotId: uuid("plot_id").references(() => plots.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var orders = pgTable("orders", {
	id: uuid("id").defaultRandom().primaryKey(),
	customerName: varchar("customer_name", { length: 255 }).notNull(),
	customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
	deliveryType: varchar("delivery_type", { length: 50 }).notNull(),
	address: text("address"),
	totalAmount: decimal("total_amount", {
		precision: 10,
		scale: 2
	}).notNull(),
	slipUrl: text("slip_url"),
	status: orderStatusEnum("status").default("pending").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var orderItems = pgTable("order_items", {
	id: uuid("id").defaultRandom().primaryKey(),
	orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
	productId: uuid("product_id").notNull().references(() => products.id),
	quantity: integer("quantity").notNull(),
	pricePerUnit: decimal("price_per_unit", {
		precision: 10,
		scale: 2
	}).notNull()
});
var ordersRelations = relations(orders, ({ many }) => ({ items: many(orderItems) }));
var plotsRelations = relations(plots, ({ many }) => ({ sensorLogs: many(sensorLogs) }));
var sensorLogsRelations = relations(sensorLogs, ({ one }) => ({ plot: one(plots, {
	fields: [sensorLogs.plotId],
	references: [plots.id]
}) }));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	})
}));
function getDb() {
	const databaseUrl = process.env["DATABASE_URL"];
	if (!databaseUrl) throw new Error("DATABASE_URL is required");
	return drizzle(cs(databaseUrl), { schema: schema_exports });
}
var DEFAULT_CHARGER_COUNT = 2;
var Route$8 = createFileRoute("/api/ev-bookings")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json().catch(() => null);
		if (!isBookingInput(body)) return Response.json({
			success: false,
			error: "ข้อมูลการจองไม่ถูกต้อง"
		}, { status: 400 });
		const startAt = new Date(body.startAt);
		const endAt = new Date(body.endAt);
		const duration = endAt.getTime() - startAt.getTime();
		if (!Number.isFinite(startAt.getTime()) || !Number.isFinite(endAt.getTime()) || startAt.getTime() < Date.now() + 6e5 || duration < 18e5 || duration > 144e5) return Response.json({
			success: false,
			error: "ช่วงเวลาจองไม่ถูกต้อง"
		}, { status: 400 });
		const chargerCount = readChargerCount();
		const booking = await getDb().transaction(async (tx) => {
			const conflicts = await tx.select({ id: evBookings.id }).from(evBookings).where(and(ne(evBookings.status, "cancelled"), lt(evBookings.startAt, endAt), gt(evBookings.endAt, startAt)));
			if (conflicts.length >= chargerCount) throw new Error("EV_SLOT_FULL");
			const [created] = await tx.insert(evBookings).values({
				customerName: body.customerName.trim(),
				customerPhone: body.customerPhone.trim(),
				vehiclePlate: body.vehiclePlate.trim().toUpperCase(),
				chargerId: `EV-${conflicts.length % chargerCount + 1}`,
				startAt,
				endAt,
				status: "pending"
			}).returning();
			if (!created) throw new Error("EV_BOOKING_FAILED");
			return created;
		});
		return Response.json({
			success: true,
			data: booking
		}, { status: 201 });
	} catch (error) {
		if (error instanceof Error && error.message === "EV_SLOT_FULL") return Response.json({
			success: false,
			error: "ช่วงเวลานี้มีผู้จองเต็มแล้ว"
		}, { status: 409 });
		console.error("EV booking error:", error);
		return Response.json({
			success: false,
			error: "ไม่สามารถบันทึกการจองได้"
		}, { status: 500 });
	}
} } } });
function isBookingInput(value) {
	if (typeof value !== "object" || value === null) return false;
	const record = value;
	return typeof record["customerName"] === "string" && record["customerName"].trim().length >= 2 && record["customerName"].length <= 255 && typeof record["customerPhone"] === "string" && /^[0-9+ ()-]{8,20}$/.test(record["customerPhone"]) && typeof record["vehiclePlate"] === "string" && record["vehiclePlate"].trim().length >= 2 && record["vehiclePlate"].length <= 30 && typeof record["startAt"] === "string" && typeof record["endAt"] === "string";
}
function readChargerCount() {
	const configured = Number.parseInt(process.env["EV_CHARGER_COUNT"] ?? "", 10);
	return Number.isInteger(configured) && configured > 0 && configured <= 20 ? configured : DEFAULT_CHARGER_COUNT;
}
var Route$7 = createFileRoute("/api/orders")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json().catch(() => null);
		if (!isRecord$2(body)) return Response.json({
			success: false,
			error: "ข้อมูลคำสั่งซื้อไม่ถูกต้อง"
		}, { status: 400 });
		const { customerName, customerPhone, deliveryType, address, slipUrl, items } = body;
		if (typeof customerName !== "string" || customerName.trim().length < 2 || customerName.length > 255 || typeof customerPhone !== "string" || !/^[0-9+ ()-]{8,20}$/.test(customerPhone) || !isDeliveryType(deliveryType) || deliveryType === "delivery" && (typeof address !== "string" || address.trim().length < 10) || !isValidSlipUrl(slipUrl) || !Array.isArray(items) || items.length === 0 || items.length > 50) return Response.json({
			success: false,
			error: "ข้อมูลคำสั่งซื้อไม่ถูกต้อง"
		}, { status: 400 });
		const safeCustomerName = customerName.trim();
		const safeCustomerPhone = customerPhone.trim();
		const safeAddress = typeof address === "string" ? address.trim() : void 0;
		const safeSlipUrl = typeof slipUrl === "string" ? slipUrl : void 0;
		const newOrder = await getDb().transaction(async (tx) => {
			let calculatedTotal = 0;
			const normalizedItems = [];
			const requested = /* @__PURE__ */ new Map();
			for (const item of items) {
				if (typeof item.productId !== "string" || !/^[0-9a-f-]{36}$/i.test(item.productId) || !Number.isInteger(item.quantity) || Number(item.quantity) < 1 || Number(item.quantity) > 100) throw new Error("Invalid order item");
				requested.set(item.productId, (requested.get(item.productId) ?? 0) + Number(item.quantity));
			}
			for (const [productId, quantity] of requested) {
				if (quantity > 100) throw new Error("Invalid order item");
				const [product] = await tx.select().from(products).where(eq(products.id, productId));
				if (!product) throw new Error("Product not found");
				if (!product.isPreorder && product.stockQuantity < quantity) throw new Error(`Insufficient stock for product: ${product.name}`);
				calculatedTotal += Number(product.price) * quantity;
				normalizedItems.push({
					productId,
					quantity,
					pricePerUnit: product.price,
					isPreorder: product.isPreorder
				});
			}
			const [insertedOrder] = await tx.insert(orders).values({
				customerName: safeCustomerName,
				customerPhone: safeCustomerPhone,
				deliveryType,
				address: safeAddress,
				totalAmount: calculatedTotal.toFixed(2),
				slipUrl: safeSlipUrl,
				status: "pending"
			}).returning();
			if (!insertedOrder) throw new Error("Order could not be created");
			for (const item of normalizedItems) {
				await tx.insert(orderItems).values({
					orderId: insertedOrder.id,
					productId: item.productId,
					quantity: item.quantity,
					pricePerUnit: item.pricePerUnit
				});
				if (!item.isPreorder) {
					if ((await tx.update(products).set({ stockQuantity: sql`${products.stockQuantity} - ${item.quantity}` }).where(and(eq(products.id, item.productId), gte(products.stockQuantity, item.quantity))).returning({ id: products.id })).length === 0) throw new Error("Insufficient stock");
				}
			}
			return insertedOrder;
		});
		return new Response(JSON.stringify({
			success: true,
			data: newOrder
		}), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Transaction Error:", error);
		const message = error instanceof Error ? error.message : "Transaction failed";
		const clientMessage = /Invalid|not found|Insufficient/.test(message) ? message : "ไม่สามารถสร้างคำสั่งซื้อได้";
		return Response.json({
			success: false,
			error: clientMessage
		}, { status: /Invalid|not found|Insufficient/.test(message) ? 400 : 500 });
	}
} } } });
function isRecord$2(value) {
	return typeof value === "object" && value !== null;
}
function isDeliveryType(value) {
	return value === "pickup" || value === "delivery";
}
function isValidSlipUrl(value) {
	return typeof value === "undefined" || typeof value === "string" && value.length <= 28e5 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
}
var COOKIE_NAME = "mahidol_admin";
var MAX_AGE_SECONDS = 28800;
function secret() {
	const value = process.env["ADMIN_PASSWORD"];
	if (!value || value.length < 12) throw new Error("ADMIN_PASSWORD must be configured with at least 12 characters");
	return value;
}
async function signature(value) {
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["sign"]);
	const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
	return btoa(String.fromCharCode(...new Uint8Array(digest))).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
async function digest(value) {
	return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}
async function matchesSecret(candidate, expected) {
	const [candidateDigest, expectedDigest] = await Promise.all([digest(candidate), digest(expected)]);
	if (candidateDigest.length !== expectedDigest.length) return false;
	let difference = 0;
	for (let index = 0; index < candidateDigest.length; index += 1) difference |= (candidateDigest[index] ?? 0) ^ (expectedDigest[index] ?? 0);
	return difference === 0;
}
async function createAdminCookie(request) {
	const payload = `${Date.now()}`;
	const secure = request && new URL(request.url).protocol === "https:" ? "; Secure" : "";
	return `${COOKIE_NAME}=${payload}.${await signature(payload)}; Max-Age=${MAX_AGE_SECONDS}; Path=/; HttpOnly; SameSite=Lax${secure}`;
}
async function isAdminRequest(request) {
	const token = (request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`)))?.slice(14);
	if (!token) return false;
	const [payload, provided] = token.split(".");
	if (!payload || !provided) return false;
	const issuedAt = Number(payload);
	if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > MAX_AGE_SECONDS * 1e3 || issuedAt > Date.now()) return false;
	try {
		return await matchesSecret(provided, await signature(payload));
	} catch {
		return false;
	}
}
function clearAdminCookie(request) {
	return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${request && new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
function record(value) {
	return typeof value === "object" && value !== null;
}
function productInput(value) {
	if (!record(value)) return false;
	return typeof value["name"] === "string" && value["name"].trim().length >= 2 && value["name"].length <= 255 && typeof value["unit"] === "string" && value["unit"].length <= 50 && typeof value["price"] === "number" && Number.isFinite(value["price"]) && value["price"] >= 0 && typeof value["stockQuantity"] === "number" && Number.isInteger(value["stockQuantity"]) && value["stockQuantity"] >= 0;
}
var Route$6 = createFileRoute("/api/products")({ server: { handlers: {
	GET: async ({ request }) => {
		try {
			const availableProducts = await getDb().select().from(products).where(or(gt(products.stockQuantity, 0), eq(products.isPreorder, true)));
			return new Response(JSON.stringify({
				success: true,
				data: availableProducts
			}), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			console.error("Error fetching products:", error);
			return new Response(JSON.stringify({
				success: false,
				error: "Failed to fetch products"
			}), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	POST: async ({ request }) => {
		if (!await isAdminRequest(request)) return Response.json({
			success: false,
			error: "Unauthorized"
		}, { status: 401 });
		const body = await request.json().catch(() => null);
		if (!productInput(body)) return Response.json({
			success: false,
			error: "ข้อมูลสินค้าไม่ถูกต้อง"
		}, { status: 400 });
		const [created] = await getDb().insert(products).values({
			name: body.name.trim(),
			unit: body.unit.trim(),
			price: body.price.toFixed(2),
			stockQuantity: body.stockQuantity,
			imageUrl: body.imageUrl ?? null,
			isPreorder: body.isPreorder === true,
			harvestDate: body.harvestDate ? new Date(body.harvestDate) : null,
			researchTag: body.researchTag ?? null
		}).returning();
		return Response.json({
			success: true,
			data: created
		}, { status: 201 });
	}
} } });
var Route$5 = createFileRoute("/api/admin/orders")({ server: { handlers: { GET: async ({ request }) => {
	if (!await isAdminRequest(request)) return Response.json({
		success: false,
		error: "Unauthorized"
	}, { status: 401 });
	const rows = await getDb().select({
		id: orders.id,
		customerName: orders.customerName,
		createdAt: orders.createdAt,
		totalAmount: orders.totalAmount,
		status: orders.status,
		slipUrl: orders.slipUrl
	}).from(orders).orderBy(desc(orders.createdAt)).limit(100);
	return Response.json({
		success: true,
		data: rows
	});
} } } });
var Route$4 = createFileRoute("/api/auth/login")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json();
		const password = isRecord$1(body) && typeof body["password"] === "string" ? body["password"] : "";
		const configured = process.env["ADMIN_PASSWORD"];
		if (!configured || configured.length < 12) return Response.json({
			success: false,
			error: "ระบบยังไม่ได้ตั้งค่าความปลอดภัย"
		}, { status: 503 });
		if (password.length > 128 || password !== configured) return Response.json({
			success: false,
			error: "รหัสผ่านไม่ถูกต้อง"
		}, { status: 401 });
		return Response.json({ success: true }, { headers: { "Set-Cookie": await createAdminCookie(request) } });
	} catch {
		return Response.json({
			success: false,
			error: "คำขอไม่ถูกต้อง"
		}, { status: 400 });
	}
} } } });
function isRecord$1(value) {
	return typeof value === "object" && value !== null;
}
var Route$3 = createFileRoute("/api/auth/logout")({ server: { handlers: { POST: async ({ request }) => Response.json({ success: true }, { headers: { "Set-Cookie": clearAdminCookie(request) } }) } } });
var Route$2 = createFileRoute("/api/inventory/$id")({ server: { handlers: { PATCH: async ({ request, params }) => {
	if (!await isAdminRequest(request)) return Response.json({
		success: false,
		error: "Unauthorized"
	}, { status: 401 });
	const body = await request.json().catch(() => null);
	const stock = typeof body === "object" && body !== null && "stock" in body ? body.stock : void 0;
	if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0 || stock > 1e6) return Response.json({
		success: false,
		error: "จำนวน stock ไม่ถูกต้อง"
	}, { status: 400 });
	const [updated] = await getDb().update(products).set({ stockQuantity: stock }).where(eq(products.id, params.id)).returning();
	return updated ? Response.json({
		success: true,
		data: updated
	}) : Response.json({
		success: false,
		error: "ไม่พบสินค้า"
	}, { status: 404 });
} } } });
function validInput(value) {
	if (typeof value !== "object" || value === null) return false;
	const item = value;
	return typeof item["name"] === "string" && item["name"].trim().length >= 2 && item["name"].length <= 255 && typeof item["unit"] === "string" && item["unit"].length <= 50 && typeof item["price"] === "number" && Number.isFinite(item["price"]) && item["price"] >= 0 && typeof item["stockQuantity"] === "number" && Number.isInteger(item["stockQuantity"]) && item["stockQuantity"] >= 0;
}
var Route$1 = createFileRoute("/api/products/$id")({ server: { handlers: {
	PUT: async ({ request, params }) => {
		if (!await isAdminRequest(request)) return Response.json({
			success: false,
			error: "Unauthorized"
		}, { status: 401 });
		const body = await request.json().catch(() => null);
		if (!validInput(body)) return Response.json({
			success: false,
			error: "ข้อมูลสินค้าไม่ถูกต้อง"
		}, { status: 400 });
		const [updated] = await getDb().update(products).set({
			name: body.name.trim(),
			unit: body.unit.trim(),
			price: body.price.toFixed(2),
			stockQuantity: body.stockQuantity,
			imageUrl: body.imageUrl ?? null,
			isPreorder: body.isPreorder === true,
			harvestDate: body.harvestDate ? new Date(body.harvestDate) : null,
			researchTag: body.researchTag ?? null
		}).where(eq(products.id, params.id)).returning();
		return updated ? Response.json({
			success: true,
			data: updated
		}) : Response.json({
			success: false,
			error: "ไม่พบสินค้า"
		}, { status: 404 });
	},
	DELETE: async ({ request, params }) => {
		if (!await isAdminRequest(request)) return Response.json({
			success: false,
			error: "Unauthorized"
		}, { status: 401 });
		const [deleted] = await getDb().delete(products).where(eq(products.id, params.id)).returning({ id: products.id });
		return deleted ? Response.json({
			success: true,
			data: deleted
		}) : Response.json({
			success: false,
			error: "ไม่พบสินค้า"
		}, { status: 404 });
	}
} } });
var Route = createFileRoute("/api/admin/orders/$id/status")({ server: { handlers: { PATCH: async ({ request, params }) => {
	try {
		if (!await isAdminRequest(request)) return Response.json({
			success: false,
			error: "Unauthorized"
		}, { status: 401 });
		const { id } = params;
		const body = await request.json().catch(() => null);
		const status = isRecord(body) ? body["status"] : void 0;
		if (!isOrderStatus(status)) return new Response(JSON.stringify({
			success: false,
			error: "Invalid status"
		}), { status: 400 });
		const [updatedOrder] = await getDb().update(orders).set({ status }).where(eq(orders.id, id)).returning();
		if (!updatedOrder) return new Response(JSON.stringify({
			success: false,
			error: "Order not found"
		}), { status: 404 });
		return new Response(JSON.stringify({
			success: true,
			data: updatedOrder
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Error updating order status:", error);
		return new Response(JSON.stringify({
			success: false,
			error: "Failed to update status"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
function isOrderStatus(value) {
	return value === "pending" || value === "paid" || value === "fulfilled" || value === "cancelled";
}
var IndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$18
});
var AdminRoute = Route$16.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$18
});
var CleanEnergyRoute = Route$15.update({
	id: "/clean-energy",
	path: "/clean-energy",
	getParentRoute: () => Route$18
});
var DashboardRoute = Route$14.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$18
});
var LoginRoute = Route$13.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$18
});
var RacRoute = Route$12.update({
	id: "/rac",
	path: "/rac",
	getParentRoute: () => Route$18
});
var SmartFarmRoute = Route$11.update({
	id: "/smart-farm",
	path: "/smart-farm",
	getParentRoute: () => Route$18
});
var StorefrontRoute = Route$10.update({
	id: "/storefront",
	path: "/storefront",
	getParentRoute: () => Route$18
});
var SurveyRoute = Route$9.update({
	id: "/survey",
	path: "/survey",
	getParentRoute: () => Route$18
});
var ApiEvBookingsRoute = Route$8.update({
	id: "/api/ev-bookings",
	path: "/api/ev-bookings",
	getParentRoute: () => Route$18
});
var ApiOrdersRoute = Route$7.update({
	id: "/api/orders",
	path: "/api/orders",
	getParentRoute: () => Route$18
});
var ApiProductsRoute = Route$6.update({
	id: "/api/products",
	path: "/api/products",
	getParentRoute: () => Route$18
});
var ApiAdminOrdersRoute = Route$5.update({
	id: "/api/admin/orders",
	path: "/api/admin/orders",
	getParentRoute: () => Route$18
});
var ApiAuthLoginRoute = Route$4.update({
	id: "/api/auth/login",
	path: "/api/auth/login",
	getParentRoute: () => Route$18
});
var ApiAuthLogoutRoute = Route$3.update({
	id: "/api/auth/logout",
	path: "/api/auth/logout",
	getParentRoute: () => Route$18
});
var ApiInventoryIdRoute = Route$2.update({
	id: "/api/inventory/$id",
	path: "/api/inventory/$id",
	getParentRoute: () => Route$18
});
var ApiProductsIdRoute = Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiProductsRoute
});
var ApiAdminOrdersIdStatusRoute = Route.update({
	id: "/$id/status",
	path: "/$id/status",
	getParentRoute: () => ApiAdminOrdersRoute
});
var ApiProductsRouteChildren = { ApiProductsIdRoute };
var ApiProductsRouteWithChildren = ApiProductsRoute._addFileChildren(ApiProductsRouteChildren);
var ApiAdminOrdersRouteChildren = { ApiAdminOrdersIdStatusRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	CleanEnergyRoute,
	DashboardRoute,
	LoginRoute,
	RacRoute,
	SmartFarmRoute,
	StorefrontRoute,
	SurveyRoute,
	ApiEvBookingsRoute,
	ApiOrdersRoute,
	ApiProductsRoute: ApiProductsRouteWithChildren,
	ApiAdminOrdersRoute: ApiAdminOrdersRoute._addFileChildren(ApiAdminOrdersRouteChildren),
	ApiAuthLoginRoute,
	ApiAuthLogoutRoute,
	ApiInventoryIdRoute
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/server-C7Dzy9E9.js
function StartServer(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
	request,
	router,
	responseHeaders,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartServer, { router })
}));
var GLOBAL_EVENT_STORAGE_KEY = Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
	return typeof value.then === "function";
}
function getSetCookieValues(headers) {
	const headersWithSetCookie = headers;
	if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
	const value = headers.get("set-cookie");
	return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
	if (response.ok) return;
	const eventSetCookies = getSetCookieValues(event.res.headers);
	if (eventSetCookies.length === 0) return;
	const responseSetCookies = getSetCookieValues(response.headers);
	response.headers.delete("set-cookie");
	for (const cookie of responseSetCookies) response.headers.append("set-cookie", cookie);
	for (const cookie of eventSetCookies) response.headers.append("set-cookie", cookie);
}
function attachResponseHeaders(value, event) {
	if (isPromiseLike(value)) return value.then((resolved) => {
		if (resolved instanceof Response) mergeEventResponseHeaders(resolved, event);
		return resolved;
	});
	if (value instanceof Response) mergeEventResponseHeaders(value, event);
	return value;
}
function requestHandler(handler) {
	return (request, requestOpts) => {
		let h3Event;
		try {
			h3Event = new H3Event(request);
		} catch (error) {
			if (error instanceof URIError) return new Response(null, {
				status: 400,
				statusText: "Bad Request"
			});
			throw error;
		}
		return toResponse(attachResponseHeaders(eventStorage.run({ h3Event }, () => handler(request, requestOpts)), h3Event), h3Event);
	};
}
function getH3Event() {
	const event = eventStorage.getStore();
	if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return event.h3Event;
}
function getResponse() {
	return getH3Event().res;
}
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
/**
* @description Returns the router manifest data that should be sent to the client.
* This includes only the assets and preloads for the current route and any
* special assets that are needed for the client. It does not include relationships
* between routes or any other data that is not needed for the client.
*
* @param matchedRoutes - In dev mode, the matched routes are used to build
* the dev styles URL for route-scoped CSS collection.
*/
async function getStartManifest(matchedRoutes) {
	const { tsrStartManifest } = await import("../_tanstack-start-manifest_v-B2hyKzxH.mjs");
	const startManifest = tsrStartManifest();
	let routes = startManifest.routes;
	routes[rootRouteId];
	const manifestRoutes = {};
	for (const k in routes) {
		const v = routes[k];
		const result = {};
		if (v.preloads && v.preloads.length > 0) result.preloads = v.preloads;
		if (v.scripts && v.scripts.length > 0) result.scripts = v.scripts;
		if (v.css?.length) result.css = v.css;
		if (result.preloads || result.scripts || result.css) manifestRoutes[k] = result;
	}
	return {
		...startManifest.scriptFormat ? { scriptFormat: startManifest.scriptFormat } : {},
		...startManifest.inlineCss ? { inlineCss: startManifest.inlineCss } : {},
		routes: manifestRoutes
	};
}
var manifest = {};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = Symbol.for("TSS_SERVER_FUNCTION");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
/** Content-Type for multiplexed framed responses (RawStream support) */
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
/**
* Frame types for binary multiplexing protocol.
*/
var FrameType = {
	/** Seroval JSON chunk (NDJSON line) */
	JSON: 0,
	/** Raw stream data chunk */
	CHUNK: 1,
	/** Raw stream end (EOF) */
	END: 2,
	/** Raw stream error */
	ERROR: 3
};
/** Full Content-Type header value with version parameter */
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
function isSafeKey(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
/**
* Merge target and source into a new null-proto object, filtering dangerous keys.
*/
function safeObjectMerge(target, source) {
	const result = Object.create(null);
	if (target) {
		for (const key of Object.keys(target)) if (isSafeKey(key)) result[key] = target[key];
	}
	if (source && typeof source === "object") {
		for (const key of Object.keys(source)) if (isSafeKey(key)) result[key] = source[key];
	}
	return result;
}
/**
* Create a null-prototype object, optionally copying from source.
*/
function createNullProtoObject(source) {
	if (!source) return Object.create(null);
	const obj = Object.create(null);
	for (const key of Object.keys(source)) if (isSafeKey(key)) obj[key] = source[key];
	return obj;
}
var GLOBAL_STORAGE_KEY = Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
	return startStorage.run(context, fn);
}
function getStartContext(opts) {
	const context = startStorage.getStore();
	if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return context;
}
var getStartOptions = () => getStartContext().startOptions;
function flattenMiddlewares(middlewares, maxDepth = 100) {
	const seen = /* @__PURE__ */ new Set();
	const flattened = [];
	const recurse = (middleware, depth) => {
		if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
		middleware.forEach((m) => {
			if (m.options.middleware) recurse(m.options.middleware, depth + 1);
			if (!seen.has(m)) {
				seen.add(m);
				flattened.push(m);
			}
		});
	};
	recurse(middlewares, 0);
	return flattened;
}
var createMiddleware = (options, __opts) => {
	const resolvedOptions = {
		type: "request",
		...__opts || options
	};
	const setValidator = (validator) => {
		return createMiddleware({}, Object.assign(resolvedOptions, {
			validator,
			inputValidator: validator
		}));
	};
	return {
		options: resolvedOptions,
		middleware: (middleware) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
		},
		validator: setValidator,
		inputValidator: setValidator,
		client: (client) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { client }));
		},
		server: (server) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { server }));
		}
	};
};
var innerCreateCsrfMiddleware = (opts = {}) => {
	return createMiddleware().server(async (ctx) => {
		const csrfCtx = ctx;
		if (opts.filter && !await opts.filter(csrfCtx)) return ctx.next();
		if (await isCsrfRequestAllowed(opts, csrfCtx)) return ctx.next();
		return getFailureResponse(opts, csrfCtx);
	});
};
var createCsrfMiddleware = innerCreateCsrfMiddleware;
async function isCsrfRequestAllowed(opts, ctx) {
	const result = await getCsrfRequestValidationResult(opts, ctx);
	return result === true || result === void 0 && opts.allowRequestsWithoutOriginCheck === true;
}
async function getCsrfRequestValidationResult(opts, ctx) {
	const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
	if (fetchSite !== null) return matchValue(opts.secFetchSite ?? "same-origin", fetchSite, ctx);
	const origin = ctx.request.headers.get("Origin");
	if (origin !== null) {
		if (opts.origin) return matchValue(opts.origin, origin, ctx);
		return origin === new URL(ctx.request.url).origin;
	}
	const referer = ctx.request.headers.get("Referer");
	if (referer === null || opts.referer === false) return;
	if (typeof opts.referer === "function") return opts.referer(referer, ctx);
	if (opts.origin) {
		const refererOrigin = getOriginFromUrl(referer);
		return refererOrigin !== void 0 && matchValue(opts.origin, refererOrigin, ctx);
	}
	return isRefererSameOrigin(referer, new URL(ctx.request.url).origin);
}
async function matchValue(matcher, value, ctx) {
	if (typeof matcher === "function") return matcher(value, ctx);
	if (Array.isArray(matcher)) return matcher.includes(value);
	return value === matcher;
}
function getOriginFromUrl(url) {
	try {
		return new URL(url).origin;
	} catch {
		return;
	}
}
function isRefererSameOrigin(referer, requestOrigin) {
	if (referer === requestOrigin) return true;
	if (!referer.startsWith(requestOrigin)) return false;
	if (referer.length === requestOrigin.length) return true;
	const code = referer.charCodeAt(requestOrigin.length);
	return code === 47 || code === 63 || code === 35;
}
async function getFailureResponse(opts, ctx) {
	if (typeof opts.failureResponse === "function") return opts.failureResponse(ctx);
	return opts.failureResponse?.clone() ?? new Response("Forbidden", { status: 403 });
}
function getDefaultSerovalPlugins() {
	return [...(getStartOptions()?.serializationAdapters)?.map(makeSerovalPlugin) ?? [], ...defaultSerovalPlugins];
}
/**
* Binary frame protocol for multiplexing JSON and raw streams over HTTP.
*
* Frame format: [type:1][streamId:4][length:4][payload:length]
* - type: 1 byte - frame type (JSON, CHUNK, END, ERROR)
* - streamId: 4 bytes big-endian uint32 - stream identifier
* - length: 4 bytes big-endian uint32 - payload length
* - payload: variable length bytes
*/
/** Cached TextEncoder for frame encoding */
var textEncoder = new TextEncoder();
/** Shared empty payload for END frames - avoids allocation per call */
var EMPTY_PAYLOAD = /* @__PURE__ */ new Uint8Array(0);
/**
* Encodes a single frame with header and payload.
*/
function encodeFrame(type, streamId, payload) {
	const frame = new Uint8Array(9 + payload.length);
	frame[0] = type;
	frame[1] = streamId >>> 24 & 255;
	frame[2] = streamId >>> 16 & 255;
	frame[3] = streamId >>> 8 & 255;
	frame[4] = streamId & 255;
	frame[5] = payload.length >>> 24 & 255;
	frame[6] = payload.length >>> 16 & 255;
	frame[7] = payload.length >>> 8 & 255;
	frame[8] = payload.length & 255;
	frame.set(payload, 9);
	return frame;
}
/**
* Encodes a JSON frame (type 0, streamId 0).
*/
function encodeJSONFrame(json) {
	return encodeFrame(FrameType.JSON, 0, textEncoder.encode(json));
}
/**
* Encodes a raw stream chunk frame.
*/
function encodeChunkFrame(streamId, chunk) {
	return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
/**
* Encodes a raw stream end frame.
*/
function encodeEndFrame(streamId) {
	return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
/**
* Encodes a raw stream error frame.
*/
function encodeErrorFrame(streamId, error) {
	const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
	return encodeFrame(FrameType.ERROR, streamId, textEncoder.encode(message));
}
/**
* Creates a multiplexed ReadableStream from JSON stream and raw streams.
*
* The JSON stream emits NDJSON lines (from seroval's toCrossJSONStream).
* Raw streams are pumped concurrently, interleaved with JSON frames.
*
* Supports late stream registration for RawStreams discovered after initial
* serialization (e.g., from resolved Promises).
*
* @param jsonStream Stream of JSON strings (each string is one NDJSON line)
* @param rawStreams Map of stream IDs to raw binary streams (known at start)
* @param lateStreamSource Optional stream of late registrations for streams discovered later
*/
function createMultiplexedStream(jsonStream, rawStreams, lateStreamSource) {
	let controller;
	let cancelled = false;
	const readers = [];
	const enqueue = (frame) => {
		if (cancelled) return false;
		try {
			controller.enqueue(frame);
			return true;
		} catch {
			return false;
		}
	};
	const errorOutput = (error) => {
		if (cancelled) return;
		cancelled = true;
		try {
			controller.error(error);
		} catch {}
		for (const reader of readers) reader.cancel().catch(() => {});
	};
	async function pumpRawStream(streamId, stream) {
		const reader = stream.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) {
					enqueue(encodeEndFrame(streamId));
					return;
				}
				if (!enqueue(encodeChunkFrame(streamId, value))) return;
			}
		} catch (error) {
			enqueue(encodeErrorFrame(streamId, error));
		} finally {
			reader.releaseLock();
		}
	}
	async function pumpJSON() {
		const reader = jsonStream.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) return;
				if (!enqueue(encodeJSONFrame(value))) return;
			}
		} catch (error) {
			errorOutput(error);
			throw error;
		} finally {
			reader.releaseLock();
		}
	}
	async function pumpLateStreams() {
		if (!lateStreamSource) return [];
		const lateStreamPumps = [];
		const reader = lateStreamSource.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) break;
				lateStreamPumps.push(pumpRawStream(value.id, value.stream));
			}
		} finally {
			reader.releaseLock();
		}
		return lateStreamPumps;
	}
	return new ReadableStream({
		async start(ctrl) {
			controller = ctrl;
			const pumps = [pumpJSON()];
			for (const [streamId, stream] of rawStreams) pumps.push(pumpRawStream(streamId, stream));
			if (lateStreamSource) pumps.push(pumpLateStreams());
			try {
				const latePumps = (await Promise.all(pumps)).find(Array.isArray);
				if (latePumps && latePumps.length > 0) await Promise.all(latePumps);
				if (!cancelled) try {
					controller.close();
				} catch {}
			} catch {}
		},
		cancel() {
			cancelled = true;
			for (const reader of readers) reader.cancel().catch(() => {});
			readers.length = 0;
		}
	});
}
var serovalPlugins = void 0;
var FORM_DATA_CONTENT_TYPES = ["multipart/form-data", "application/x-www-form-urlencoded"];
var MAX_PAYLOAD_SIZE = 1e6;
var handleServerAction = async ({ request, context, serverFnId }) => {
	const methodUpper = request.method.toUpperCase();
	const url = new URL(request.url);
	const action = await getServerFnById(serverFnId, { origin: "client" });
	if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
		status: 405,
		headers: { Allow: action.method }
	});
	const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
	if (!serovalPlugins) serovalPlugins = getDefaultSerovalPlugins();
	const contentType = request.headers.get("Content-Type");
	function parsePayload(payload) {
		return fromJSON(payload, { plugins: serovalPlugins });
	}
	return await (async () => {
		try {
			let res = await (async () => {
				if (FORM_DATA_CONTENT_TYPES.some((type) => contentType && contentType.includes(type))) {
					if (methodUpper === "GET") invariant();
					const formData = await request.formData();
					const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
					formData.delete(TSS_FORMDATA_CONTEXT);
					const params = {
						context,
						data: formData,
						method: methodUpper
					};
					if (typeof serializedContext === "string") try {
						const deserializedContext = fromJSON(JSON.parse(serializedContext), { plugins: serovalPlugins });
						if (typeof deserializedContext === "object" && deserializedContext) params.context = safeObjectMerge(deserializedContext, context);
					} catch (e) {}
					return await action(params);
				}
				if (methodUpper === "GET") {
					const payloadParam = url.searchParams.get("payload");
					if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
					const payload = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
					payload.context = safeObjectMerge(payload.context, context);
					payload.method = methodUpper;
					return await action(payload);
				}
				let jsonPayload;
				if (contentType?.includes("application/json")) jsonPayload = await request.json();
				const payload = jsonPayload ? parsePayload(jsonPayload) : {};
				payload.context = safeObjectMerge(payload.context, context);
				payload.method = methodUpper;
				return await action(payload);
			})();
			const unwrapped = res.result || res.error;
			if (isNotFound(res)) res = isNotFoundResponse(res);
			if (!isServerFn) return unwrapped;
			if (unwrapped instanceof Response) {
				if (isRedirect(unwrapped)) return unwrapped;
				unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
				return unwrapped;
			}
			return serializeResult(res);
			function serializeResult(res) {
				let nonStreamingBody = void 0;
				const alsResponse = getResponse();
				if (res !== void 0) {
					const rawStreams = /* @__PURE__ */ new Map();
					let initialPhase = true;
					let lateStreamWriter;
					let lateStreamReadable = void 0;
					const pendingLateStreams = [];
					const plugins = [createRawStreamRPCPlugin((id, stream) => {
						if (initialPhase) {
							rawStreams.set(id, stream);
							return;
						}
						if (lateStreamWriter) {
							lateStreamWriter.write({
								id,
								stream
							}).catch(() => {});
							return;
						}
						pendingLateStreams.push({
							id,
							stream
						});
					}), ...serovalPlugins || []];
					let done = false;
					const callbacks = {
						onParse: (value) => {
							nonStreamingBody = value;
						},
						onDone: () => {
							done = true;
						},
						onError: (error) => {
							throw error;
						}
					};
					toCrossJSONStream(res, {
						refs: /* @__PURE__ */ new Map(),
						plugins,
						onParse(value) {
							callbacks.onParse(value);
						},
						onDone() {
							callbacks.onDone();
						},
						onError: (error) => {
							callbacks.onError(error);
						}
					});
					initialPhase = false;
					if (done && rawStreams.size === 0) return new Response(nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0, {
						status: alsResponse.status,
						statusText: alsResponse.statusText,
						headers: {
							"Content-Type": "application/json",
							[X_TSS_SERIALIZED]: "true"
						}
					});
					const { readable, writable } = new TransformStream();
					lateStreamReadable = readable;
					lateStreamWriter = writable.getWriter();
					for (const registration of pendingLateStreams) lateStreamWriter.write(registration).catch(() => {});
					pendingLateStreams.length = 0;
					const multiplexedStream = createMultiplexedStream(new ReadableStream({
						start(controller) {
							callbacks.onParse = (value) => {
								controller.enqueue(JSON.stringify(value) + "\n");
							};
							callbacks.onDone = () => {
								try {
									controller.close();
								} catch {}
								lateStreamWriter?.close().catch(() => {}).finally(() => {
									lateStreamWriter = void 0;
								});
							};
							callbacks.onError = (error) => {
								controller.error(error);
								lateStreamWriter?.abort(error).catch(() => {}).finally(() => {
									lateStreamWriter = void 0;
								});
							};
							if (nonStreamingBody !== void 0) callbacks.onParse(nonStreamingBody);
							if (done) callbacks.onDone();
						},
						cancel() {
							lateStreamWriter?.abort().catch(() => {});
							lateStreamWriter = void 0;
						}
					}), rawStreams, lateStreamReadable);
					return new Response(multiplexedStream, {
						status: alsResponse.status,
						statusText: alsResponse.statusText,
						headers: {
							"Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
							[X_TSS_SERIALIZED]: "true"
						}
					});
				}
				return new Response(void 0, {
					status: alsResponse.status,
					statusText: alsResponse.statusText
				});
			}
		} catch (error) {
			if (error instanceof Response) return error;
			if (isNotFound(error)) return isNotFoundResponse(error);
			console.info();
			console.info("Server Fn Error!");
			console.info();
			console.error(error);
			console.info();
			const serializedError = JSON.stringify(await Promise.resolve(toCrossJSONAsync(error, {
				refs: /* @__PURE__ */ new Map(),
				plugins: serovalPlugins
			})));
			const response = getResponse();
			return new Response(serializedError, {
				status: response.status ?? 500,
				statusText: response.statusText,
				headers: {
					"Content-Type": "application/json",
					[X_TSS_SERIALIZED]: "true"
				}
			});
		}
	})();
};
function isNotFoundResponse(error) {
	const { headers, ...rest } = error;
	return new Response(JSON.stringify(rest), {
		status: 404,
		headers: {
			"Content-Type": "application/json",
			...headers || {}
		}
	});
}
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
	"fetch",
	"font",
	"image",
	"script",
	"style",
	"track"
]);
function buildLinkParam(name, value) {
	if (value === void 0) return name;
	if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
	return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
	const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
	if (hint.as) parts.push(buildLinkParam("as", hint.as));
	if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
	if (hint.type) parts.push(buildLinkParam("type", hint.type));
	if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
	if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
	if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
	return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
	const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
	return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
	const as = getStringAttr(attrs, "as");
	return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
	const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
	const type = getStringAttr(attrs, "type");
	const integrity = getStringAttr(attrs, "integrity");
	const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
	const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
	if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
	if (type) hint.type = type;
	if (integrity) hint.integrity = integrity;
	if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
	if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
	const href = getStringAttr(attrs, "href");
	const rel = getStringAttr(attrs, "rel");
	if (!href || !rel) return void 0;
	const relTokens = rel.split(/\s+/);
	let hintRel;
	let hintAs;
	if (relTokens.includes("modulepreload")) {
		hintRel = "modulepreload";
		hintAs = "script";
	} else if (relTokens.includes("stylesheet")) {
		hintRel = "preload";
		hintAs = "style";
	} else if (relTokens.includes("preload")) {
		hintAs = getPreloadAs(attrs);
		if (!hintAs) return void 0;
		hintRel = "preload";
	} else if (relTokens.includes("preconnect")) {
		hintRel = "preconnect";
		hintAs = void 0;
	} else if (relTokens.includes("dns-prefetch")) {
		hintRel = "dns-prefetch";
		hintAs = void 0;
	}
	if (!hintRel) return void 0;
	const hint = {
		href,
		rel: hintRel
	};
	if (hintAs) hint.as = hintAs;
	addEarlyHintFetchAttrs(hint, attrs);
	return hint;
}
function collectStaticHintsFromManifest(manifest, matchedRoutes) {
	const hints = [];
	for (const route of matchedRoutes) {
		const routeManifest = manifest.routes[route.id];
		if (!routeManifest) continue;
		for (const link of routeManifest.preloads ?? []) {
			const attrs = getScriptPreloadAttrs(manifest, link);
			const hint = {
				href: attrs.href,
				rel: attrs.rel,
				as: "script"
			};
			if (attrs.crossOrigin !== void 0) hint.crossOrigin = attrs.crossOrigin;
			hints.push(hint);
		}
		for (const link of routeManifest.css ?? []) {
			const stylesheetHref = getStylesheetHref(link);
			if (manifest.inlineCss?.styles[stylesheetHref] !== void 0) continue;
			const resolvedLink = resolveManifestCssLink(link);
			const hint = {
				href: stylesheetHref,
				rel: "preload",
				as: "style"
			};
			if (resolvedLink.crossOrigin !== void 0) hint.crossOrigin = resolvedLink.crossOrigin;
			hints.push(hint);
		}
	}
	return hints;
}
function collectDynamicHintsFromMatches(matches) {
	const hints = [];
	for (const match of matches) {
		const links = match.links;
		if (!Array.isArray(links)) continue;
		for (const link of links) {
			const hint = linkAttrsToEarlyHint(link);
			if (hint) hints.push(hint);
		}
	}
	return hints;
}
function createEarlyHintsEvent(opts) {
	const nextHints = [];
	const nextLinks = [];
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.sentHints.push(hint);
		nextHints.push(hint);
		nextLinks.push(link);
	}
	if (!nextHints.length && opts.phase !== "dynamic") return void 0;
	return {
		phase: opts.phase,
		hints: nextHints,
		links: nextLinks,
		allHints: opts.sentHints.slice(),
		allLinks: Array.from(opts.sentLinks)
	};
}
function createResponseLinkHeaderEntries(opts) {
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.entries.push({
			phase: opts.phase,
			hint,
			link
		});
	}
}
function getResponseLinkHeaderEntries(opts) {
	if (!opts.filter) return opts.entries.map((entry) => entry.link);
	try {
		const links = [];
		for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
		return links;
	} catch (err) {
		console.error("Error filtering response Link headers:", err);
		return [];
	}
}
function notifyEarlyHints(phase, event, onEarlyHints) {
	try {
		const result = onEarlyHints(event);
		if (result) Promise.resolve(result).catch((err) => {
			console.error(`Error sending ${phase} early hints:`, err);
		});
	} catch (err) {
		console.error(`Error sending ${phase} early hints:`, err);
	}
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
	if (typeof responseLinkHeader !== "object") return;
	return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
	for (const link of getResponseLinkHeaderEntries(opts)) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
	for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
		phase: opts.phase,
		hint: opts.event.hints[index],
		link: opts.event.links[index]
	});
}
function collectEarlyHintsPhase(opts) {
	const event = opts.onEarlyHints ? createEarlyHintsEvent({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		sentHints: opts.sentHints
	}) : void 0;
	if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
	if (!opts.responseLinkHeaderEntries) return;
	if (event) {
		collectResponseLinkHeaderEntries({
			phase: opts.phase,
			event,
			entries: opts.responseLinkHeaderEntries
		});
		return;
	}
	createResponseLinkHeaderEntries({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		entries: opts.responseLinkHeaderEntries
	});
}
function createEarlyHintsCollector(opts) {
	if (!opts?.onEarlyHints && !opts?.responseLinkHeader) return;
	const sentLinks = /* @__PURE__ */ new Set();
	const sentHints = opts.onEarlyHints ? new Array() : void 0;
	const responseLinkHeaderEntries = opts.responseLinkHeader ? new Array() : void 0;
	const responseLinkHeaderFilter = getResponseLinkHeaderFilter(opts.responseLinkHeader);
	return {
		collectStatic: ({ manifest, matchedRoutes }) => {
			if (!matchedRoutes?.length) return;
			collectEarlyHintsPhase({
				phase: "static",
				hints: collectStaticHintsFromManifest(manifest, matchedRoutes),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		collectDynamic: (matches) => {
			collectEarlyHintsPhase({
				phase: "dynamic",
				hints: collectDynamicHintsFromMatches(matches),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		appendResponseHeaders: (headers) => {
			if (!responseLinkHeaderEntries?.length) return;
			appendResponseLinkHeaders({
				responseHeaders: headers,
				entries: responseLinkHeaderEntries,
				filter: responseLinkHeaderFilter
			});
		}
	};
}
function normalizeTransformAssetResult(result) {
	if (typeof result === "string") return { href: result };
	return result;
}
function escapeCssString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\a ").replace(/\r/g, "\\d ").replace(/\f/g, "\\c ");
}
async function transformInlineCssTemplate(options) {
	const { strings, urls } = options.template;
	if (strings.length !== urls.length + 1) throw new Error(`TanStack Start inlineCss template for ${options.stylesheetHref} is invalid`);
	let css = strings[0];
	for (let index = 0; index < urls.length; index++) {
		const transformed = normalizeTransformAssetResult(await options.transformFn({
			kind: "css-url",
			url: urls[index],
			stylesheetHref: options.stylesheetHref
		}));
		css += escapeCssString(transformed.href) + strings[index + 1];
	}
	return css;
}
async function transformInlineCssStyles(inlineCss, transformFn) {
	const transformedStyles = {};
	const transformedEntries = await Promise.all(Object.entries(inlineCss.styles).map(async ([stylesheetHref, css]) => {
		const template = inlineCss.templates?.[stylesheetHref];
		return [stylesheetHref, template ? await transformInlineCssTemplate({
			stylesheetHref,
			template,
			transformFn
		}) : css];
	}));
	for (const [stylesheetHref, css] of transformedEntries) transformedStyles[stylesheetHref] = css;
	return {
		styles: transformedStyles,
		...inlineCss.templates ? { templates: inlineCss.templates } : {}
	};
}
function resolveTransformAssetsCrossOrigin(config, kind) {
	if (!config) return void 0;
	if (typeof config === "string") return config;
	return config[kind];
}
function isObjectShorthand(transform) {
	return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
	if (typeof transform === "string") {
		const prefix = transform;
		return {
			type: "transform",
			transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
			cache: true
		};
	}
	if (typeof transform === "function") return {
		type: "transform",
		transformFn: transform,
		cache: true
	};
	if (isObjectShorthand(transform)) {
		const { prefix, crossOrigin } = transform;
		return {
			type: "transform",
			transformFn: ({ url, kind }) => {
				const href = `${prefix}${url}`;
				if (kind === "css-url") return { href };
				const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
				return co ? {
					href,
					crossOrigin: co
				} : { href };
			},
			cache: true
		};
	}
	if ("createTransform" in transform && transform.createTransform) return {
		type: "createTransform",
		createTransform: transform.createTransform,
		cache: transform.cache !== false
	};
	return {
		type: "transform",
		transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
		cache: transform.cache !== false
	};
}
function assignManifestLink(link, next) {
	if (typeof link === "string") return next.crossOrigin ? next : next.href;
	const nextLink = {
		...link,
		href: next.href
	};
	if (next.crossOrigin) nextLink.crossOrigin = next.crossOrigin;
	else delete nextLink.crossOrigin;
	return nextLink;
}
async function transformManifestAssets(source, transformFn, _opts) {
	const manifest = structuredClone(source);
	const inlineCssEnabled = _opts?.inlineCss !== false;
	const scriptTransforms = /* @__PURE__ */ new Map();
	const transformScript = (url) => {
		const cached = scriptTransforms.get(url);
		if (cached) return cached;
		const transformed = Promise.resolve(transformFn({
			url,
			kind: "script"
		})).then(normalizeTransformAssetResult);
		scriptTransforms.set(url, transformed);
		return transformed;
	};
	if (!inlineCssEnabled) delete manifest.inlineCss;
	else if (manifest.inlineCss) manifest.inlineCss = await transformInlineCssStyles(manifest.inlineCss, transformFn);
	for (const route of Object.values(manifest.routes)) {
		if (route.preloads?.length) route.preloads = await Promise.all(route.preloads.map(async (link) => {
			const result = await transformScript(resolveManifestAssetLink(link).href);
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.css?.length && !manifest.inlineCss) route.css = await Promise.all(route.css.map(async (link) => {
			const result = normalizeTransformAssetResult(await transformFn({
				url: resolveManifestCssLink(link).href,
				kind: "stylesheet"
			}));
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.scripts?.length) for (const script of route.scripts) {
			const src = script.attrs?.src;
			if (typeof src !== "string") continue;
			const result = await transformScript(src);
			script.attrs = {
				...script.attrs,
				src: result.href
			};
			if (result.crossOrigin) script.attrs.crossOrigin = result.crossOrigin;
			else delete script.attrs.crossOrigin;
		}
	}
	return manifest;
}
/**
* Builds a final ServerManifest without URL transforms. Used when no
* transformAssets option is provided.
*
* Returns a new manifest object so the cached base manifest is never mutated.
*/
function buildManifest(source, opts) {
	return {
		...source.scriptFormat ? { scriptFormat: source.scriptFormat } : {},
		...opts?.inlineCss !== false && source.inlineCss ? { inlineCss: structuredClone(source.inlineCss) } : {},
		routes: { ...source.routes }
	};
}
function getStaticHandlerInlineCssDefault(handlerInlineCss) {
	if (typeof handlerInlineCss === "function") return;
	return handlerInlineCss ?? true;
}
async function resolveInlineCssForRequest(opts) {
	if (opts.requestInlineCss !== void 0) return opts.requestInlineCss;
	if (typeof opts.handlerInlineCss === "function") return await opts.handlerInlineCss({ request: opts.request });
	return opts.handlerInlineCss ?? true;
}
function createCachedBaseManifestLoader(loadBaseManifest) {
	let baseManifestPromise;
	return () => {
		if (!baseManifestPromise) baseManifestPromise = loadBaseManifest().catch((error) => {
			baseManifestPromise = void 0;
			throw error;
		});
		return baseManifestPromise;
	};
}
function createFinalManifestTransformResolver(transformAssets, opts) {
	const transformConfig = transformAssets !== void 0 ? resolveTransformAssetsConfig(transformAssets) : void 0;
	const cache = transformConfig ? transformConfig.cache : true;
	const warmup = !!transformAssets && typeof transformAssets === "object" && "warmup" in transformAssets && transformAssets.warmup === true;
	let cachedCreateTransformPromise;
	const clearCachedCreateTransform = () => {
		cachedCreateTransformPromise = void 0;
	};
	return {
		cache,
		warmup,
		clearCachedCreateTransform,
		getTransformFn: async (ctx) => {
			if (!transformConfig) return void 0;
			if (transformConfig.type !== "createTransform") return transformConfig.transformFn;
			if (!cache || !opts.cacheCreateTransform) return transformConfig.createTransform(ctx);
			if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(transformConfig.createTransform(ctx)).catch((error) => {
				clearCachedCreateTransform();
				throw error;
			});
			return cachedCreateTransformPromise;
		}
	};
}
function createFinalManifestResolver(opts) {
	const finalManifestCache = /* @__PURE__ */ new Map();
	const transformResolver = createFinalManifestTransformResolver(opts.transformAssets, { cacheCreateTransform: opts.cacheCreateTransform });
	const handlerDefaultInlineCss = getStaticHandlerInlineCssDefault(opts.inlineCss);
	const getRequestManifestOptions = async (requestOpts) => {
		const transformFn = await transformResolver.getTransformFn({
			warmup: false,
			request: requestOpts.request
		});
		const inlineCss = await resolveInlineCssForRequest({
			request: requestOpts.request,
			handlerInlineCss: opts.inlineCss,
			requestInlineCss: requestOpts.requestInlineCss
		});
		return {
			getBaseManifest: requestOpts.getBaseManifest,
			transformFn,
			cache: transformResolver.cache,
			inlineCss
		};
	};
	const resolveRequest = async (requestOpts, cache) => {
		return resolveFinalManifest({
			...await getRequestManifestOptions(requestOpts),
			finalManifestCache: cache
		});
	};
	return {
		warmup: ({ getBaseManifest }) => warmupFinalManifest({
			enabled: transformResolver.warmup,
			handlerDefaultInlineCss,
			cache: transformResolver.cache,
			finalManifestCache,
			getBaseManifest,
			getTransformFn: () => transformResolver.getTransformFn({ warmup: true }),
			onError: transformResolver.clearCachedCreateTransform
		}),
		resolveCached: (requestOpts) => resolveRequest(requestOpts, finalManifestCache),
		resolveUncached: (requestOpts) => resolveRequest(requestOpts, void 0)
	};
}
function getFinalManifestCacheKey(inlineCss) {
	return inlineCss ? "inline-css" : "linked-css";
}
function cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, promise) {
	const cachedFinalManifestPromise = promise.catch((error) => {
		if (cachedFinalManifestPromises.get(cacheKey) === cachedFinalManifestPromise) cachedFinalManifestPromises.delete(cacheKey);
		throw error;
	});
	cachedFinalManifestPromises.set(cacheKey, cachedFinalManifestPromise);
	return cachedFinalManifestPromise;
}
function getOrCreateCachedFinalManifestPromise(cachedFinalManifestPromises, cacheKey, computeFinalManifest) {
	const cachedFinalManifestPromise = cachedFinalManifestPromises.get(cacheKey);
	if (cachedFinalManifestPromise) return cachedFinalManifestPromise;
	return cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, Promise.resolve().then(computeFinalManifest));
}
async function buildFinalManifest(opts) {
	return opts.transformFn ? await transformManifestAssets(opts.base, opts.transformFn, { inlineCss: opts.inlineCss }) : buildManifest(opts.base, { inlineCss: opts.inlineCss });
}
async function resolveFinalManifest(opts) {
	const computeFinalManifest = async () => {
		return buildFinalManifest({
			base: await opts.getBaseManifest(),
			transformFn: opts.transformFn,
			inlineCss: opts.inlineCss
		});
	};
	if (opts.finalManifestCache && (!opts.transformFn || opts.cache)) return getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(opts.inlineCss), computeFinalManifest);
	return computeFinalManifest();
}
function warmupFinalManifest(opts) {
	if (!opts.enabled || opts.handlerDefaultInlineCss === void 0 || !opts.cache) return;
	const inlineCss = opts.handlerDefaultInlineCss;
	const warmupPromise = getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(inlineCss), async () => {
		const [base, transformFn] = await Promise.all([opts.getBaseManifest(), opts.getTransformFn()]);
		return buildFinalManifest({
			base,
			transformFn,
			inlineCss
		});
	});
	if (opts.onError) warmupPromise.catch(opts.onError);
	return warmupPromise;
}
var ServerFunctionSerializationAdapter = createSerializationAdapter({
	key: "$TSS/serverfn",
	test: (v) => {
		if (typeof v !== "function") return false;
		if (!(TSS_SERVER_FUNCTION in v)) return false;
		return !!v[TSS_SERVER_FUNCTION];
	},
	toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
	fromSerializable: ({ functionId }) => {
		const fn = async (opts, signal) => {
			return (await (await getServerFnById(functionId, { origin: "client" }))(opts ?? {}, signal)).result;
		};
		return fn;
	}
});
function getStartResponseHeaders(opts) {
	return mergeHeaders({ "Content-Type": "text/html; charset=utf-8" }, ...opts.router.stores.matches.get().map((match) => {
		return match.headers;
	}));
}
var entriesPromise;
var defaultCsrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var getCachedBaseManifest = createCachedBaseManifestLoader(() => getStartManifest());
var getProdBaseManifest = () => getCachedBaseManifest();
var getBaseManifest = getProdBaseManifest;
var createEarlyHintsForRequest = createEarlyHintsCollector;
async function loadEntries() {
	const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
		import("../_libs/_.mjs"),
		import("./start-Bf_e9lEH.mjs"),
		import("./empty-plugin-adapters-D9UWiqvJ.mjs")
	]);
	return {
		routerEntry,
		startEntry,
		pluginAdapters
	};
}
function getEntries() {
	if (!entriesPromise) entriesPromise = loadEntries();
	return entriesPromise;
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var IS_DEV = false;
var ERR_NO_RESPONSE = IS_DEV ? `It looks like you forgot to return a response from your server route handler. If you want to defer to the app router, make sure to have a component set in this route.` : "Internal Server Error";
var ERR_NO_DEFER = IS_DEV ? `You cannot defer to the app router if there is no component defined on this route.` : "Internal Server Error";
function throwRouteHandlerError() {
	throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
	throw new Error(ERR_NO_DEFER);
}
/**
* Check if a value is a special response (Response or Redirect)
*/
function isSpecialResponse(value) {
	return value instanceof Response || isRedirect(value);
}
/**
* Normalize middleware result to context shape
*/
function handleCtxResult(result) {
	if (isSsrResponse(result) || isSpecialResponse(result)) return { response: result };
	return result;
}
/**
* Execute a middleware chain
*/
async function executeMiddleware(middlewares, ctx) {
	let index = -1;
	let streamResponse;
	const setResponse = (response) => {
		if (isSsrResponse(response)) {
			if (response.serverSsrCleanup === "stream") streamResponse = response;
			ctx.response = response.response;
			return;
		}
		ctx.response = response;
	};
	const disposeStreamResponse = async (reason) => {
		const response = streamResponse;
		if (!response) return;
		streamResponse = void 0;
		const currentResponse = ctx.response;
		if (currentResponse === response.response || currentResponse instanceof Response && response.response.body !== null && currentResponse.body === response.response.body) ctx.response = void 0;
		await response.dispose(reason);
	};
	const getFinalResponse = async () => {
		const response = ctx.response;
		if (!response) throwRouteHandlerError();
		if (!streamResponse) return response;
		if (response === streamResponse.response) return streamResponse;
		if (streamResponse.response.body !== null && response.body === streamResponse.response.body) return {
			...streamResponse,
			response
		};
		await disposeStreamResponse("middleware response replaced");
		return response;
	};
	const next = async (nextCtx) => {
		if (nextCtx) {
			if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
			for (const key of Object.keys(nextCtx)) if (key === "response") setResponse(nextCtx.response);
			else if (key !== "context") ctx[key] = nextCtx[key];
		}
		index++;
		const middleware = middlewares[index];
		if (!middleware) return ctx;
		let result;
		try {
			result = await middleware({
				...ctx,
				next
			});
		} catch (err) {
			if (isSpecialResponse(err)) {
				setResponse(err);
				return ctx;
			}
			await disposeStreamResponse("middleware error");
			throw err;
		}
		const normalized = handleCtxResult(result);
		if (normalized) {
			if (normalized.response !== void 0) setResponse(normalized.response);
			if (normalized.context) ctx.context = safeObjectMerge(ctx.context, normalized.context);
		}
		return ctx;
	};
	await next();
	return {
		ctx,
		response: await getFinalResponse()
	};
}
/**
* Wrap a route handler as middleware
*/
function handlerToMiddleware(handler, mayDefer = false) {
	if (mayDefer) return handler;
	return async (ctx) => {
		const response = await handler({
			...ctx,
			next: throwIfMayNotDefer
		});
		if (!response) throwRouteHandlerError();
		return response;
	};
}
/**
* Creates the TanStack Start request handler.
*
* @example Backwards-compatible usage (handler callback only):
* ```ts
* export default createStartHandler(defaultStreamHandler)
* ```
*
* @example With CDN URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: 'https://cdn.example.com',
* })
* ```
*
* @example With per-request URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: {
*     transform: ({ url }) => {
*       const cdnBase = getRequest().headers.get('x-cdn-base') || ''
*       return { href: `${cdnBase}${url}` }
*     },
*     cache: false,
*   },
* })
* ```
*/
function createStartHandler(cbOrOptions) {
	const handlerOptions = typeof cbOrOptions === "function" ? {} : cbOrOptions;
	const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
	const finalManifestResolver = createFinalManifestResolver({
		...handlerOptions,
		cacheCreateTransform: true
	});
	const resolveManifestForRequest = finalManifestResolver.resolveCached;
	finalManifestResolver.warmup({ getBaseManifest: () => getBaseManifest(void 0) });
	const startRequestResolver = async (request, requestOpts) => {
		let router = null;
		let responseOwnsCleanup = false;
		try {
			const { url, handledProtocolRelativeURL } = getNormalizedURL(request.url);
			const href = url.pathname + url.search + url.hash;
			const origin = getOrigin(request);
			if (handledProtocolRelativeURL) return Response.redirect(url, 308);
			const entries = await getEntries();
			const hasStartInstance = !!entries.startEntry.startInstance;
			const startOptions = await entries.startEntry.startInstance?.getOptions() || {};
			const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
			const serializationAdapters = [
				...startOptions.serializationAdapters || [],
				...hasPluginAdapters ? pluginSerializationAdapters : [],
				ServerFunctionSerializationAdapter
			];
			const requestStartOptions = {
				...startOptions,
				requestMiddleware: hasStartInstance ? startOptions.requestMiddleware : [defaultCsrfMiddleware],
				serializationAdapters
			};
			const flattenedRequestMiddlewares = requestStartOptions.requestMiddleware ? flattenMiddlewares(requestStartOptions.requestMiddleware) : [];
			const executedRequestMiddlewares = new Set(flattenedRequestMiddlewares);
			const getRouter = async () => {
				if (router) return router;
				router = await entries.routerEntry.getRouter();
				let isShell = IS_SHELL_ENV;
				if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
				const history = createMemoryHistory({ initialEntries: [href] });
				router.update({
					history,
					isShell,
					isPrerendering: IS_PRERENDERING,
					origin: router.options.origin ?? origin,
					defaultSsr: requestStartOptions.defaultSsr,
					serializationAdapters: [...requestStartOptions.serializationAdapters, ...router.options.serializationAdapters || []],
					basepath: ROUTER_BASEPATH
				});
				return router;
			};
			if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
				const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
				if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
				const serverFnHandler = async ({ context }) => {
					return runWithStartContext({
						getRouter,
						startOptions: requestStartOptions,
						contextAfterGlobalMiddlewares: context,
						request,
						executedRequestMiddlewares,
						handlerType: "serverFn"
					}, () => handleServerAction({
						request,
						context: requestOpts?.context,
						serverFnId
					}));
				};
				const { response: middlewareResponse } = await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), serverFnHandler], {
					request,
					pathname: url.pathname,
					handlerType: "serverFn",
					context: createNullProtoObject(requestOpts?.context)
				});
				const result = await handleRedirectResponse(middlewareResponse, request, getRouter);
				responseOwnsCleanup = result.serverSsrCleanup === "stream";
				return result.response;
			}
			const executeRouter = async (serverContext, matchedRoutes) => {
				const acceptParts = (request.headers.get("Accept") || "*/*").split(",");
				if (!["*/*", "text/html"].some((mimeType) => acceptParts.some((part) => part.trim().startsWith(mimeType)))) return normalizeSsrResponse(Response.json({ error: "Only HTML requests are supported here" }, { status: 500 }));
				const manifest = await resolveManifestForRequest({
					request,
					requestInlineCss: requestOpts?.inlineCss,
					getBaseManifest: () => getBaseManifest(matchedRoutes)
				});
				const earlyHints = createEarlyHintsForRequest({
					onEarlyHints: requestOpts?.onEarlyHints,
					responseLinkHeader: requestOpts?.responseLinkHeader
				});
				earlyHints?.collectStatic({
					manifest,
					matchedRoutes
				});
				const routerInstance = await getRouter();
				attachRouterServerSsrUtils({
					router: routerInstance,
					manifest,
					getRequestAssets: () => getStartContext({ throwIfNotFound: false })?.requestAssets
				});
				routerInstance.options.additionalContext = { serverContext };
				await routerInstance.load();
				if (routerInstance.state.redirect) return normalizeSsrResponse(routerInstance.state.redirect);
				earlyHints?.collectDynamic(routerInstance.stores.matches.get());
				const ctx = getStartContext({ throwIfNotFound: false });
				await routerInstance.serverSsr.dehydrate({ requestAssets: ctx?.requestAssets });
				const responseHeaders = getStartResponseHeaders({ router: routerInstance });
				earlyHints?.appendResponseHeaders(responseHeaders);
				return normalizeSsrResponse(await cb({
					request,
					router: routerInstance,
					responseHeaders
				}));
			};
			const requestHandlerMiddleware = async ({ context }) => {
				return runWithStartContext({
					getRouter,
					startOptions: requestStartOptions,
					contextAfterGlobalMiddlewares: context,
					request,
					executedRequestMiddlewares,
					handlerType: "router"
				}, async () => {
					try {
						return await handleServerRoutes({
							getRouter,
							request,
							url,
							executeRouter,
							context,
							executedRequestMiddlewares
						});
					} catch (err) {
						if (err instanceof Response) return err;
						throw err;
					}
				});
			};
			const { response: middlewareResponse } = await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), requestHandlerMiddleware], {
				request,
				pathname: url.pathname,
				handlerType: "router",
				context: createNullProtoObject(requestOpts?.context)
			});
			const response = await handleRedirectResponse(middlewareResponse, request, getRouter);
			responseOwnsCleanup = response.serverSsrCleanup === "stream";
			return response.response;
		} finally {
			if (router?.serverSsr && !responseOwnsCleanup) router.serverSsr.cleanup();
			router = null;
		}
	};
	return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter) {
	const ssrResponse = normalizeSsrResponse(response);
	if (!isRedirect(ssrResponse.response)) return ssrResponse;
	if (isResolvedRedirect(ssrResponse.response)) {
		if (request.headers.get("x-tsr-serverFn") === "true") return replaceSsrResponse(ssrResponse, Response.json({
			...ssrResponse.response.options,
			isSerializedRedirect: true
		}, { headers: ssrResponse.response.headers }), "redirect response replaced");
		return ssrResponse;
	}
	const opts = ssrResponse.response.options;
	if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
	if ([
		"params",
		"search",
		"hash"
	].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
	const redirect = (await getRouter()).resolveRedirect(ssrResponse.response);
	if (request.headers.get("x-tsr-serverFn") === "true") return replaceSsrResponse(ssrResponse, Response.json({
		...ssrResponse.response.options,
		isSerializedRedirect: true
	}, { headers: ssrResponse.response.headers }), "redirect response replaced");
	return replaceSsrResponse(ssrResponse, redirect, "redirect response replaced");
}
async function handleServerRoutes({ getRouter, request, url, executeRouter, context, executedRequestMiddlewares }) {
	const router = await getRouter();
	const pathname = executeRewriteInput(router.rewrite, url).pathname;
	const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname);
	const isExactMatch = foundRoute && routeParams["**"] === void 0;
	const routeMiddlewares = [];
	for (const route of matchedRoutes) {
		const serverMiddleware = route.options.server?.middleware;
		if (serverMiddleware) {
			const flattened = flattenMiddlewares(serverMiddleware);
			for (const m of flattened) if (!executedRequestMiddlewares.has(m)) routeMiddlewares.push(m.options.server);
		}
	}
	const server = foundRoute?.options.server;
	let isHeadFallback = false;
	if (server?.handlers && isExactMatch) {
		const handlers = typeof server.handlers === "function" ? server.handlers({ createHandlers: (d) => d }) : server.handlers;
		const requestMethod = request.method.toUpperCase();
		const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
		isHeadFallback = requestMethod === "HEAD" && handler !== void 0 && !handlers["HEAD"];
		if (handler) {
			const mayDefer = !!foundRoute.options.component;
			if (typeof handler === "function") routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
			else {
				if (handler.middleware?.length) {
					const handlerMiddlewares = flattenMiddlewares(handler.middleware);
					for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
				}
				if (handler.handler) routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
			}
		}
	}
	routeMiddlewares.push(((ctx) => executeRouter(ctx.context, matchedRoutes)));
	const { ctx, response } = await executeMiddleware(routeMiddlewares, {
		request,
		context,
		params: routeParams,
		pathname,
		handlerType: "router"
	});
	if (isHeadFallback) {
		if (!ctx.response) throwRouteHandlerError();
		return stripSsrResponseBody(await handleRedirectResponse(response, request, getRouter), "HEAD body stripped");
	}
	return normalizeSsrResponse(response);
}
var server_exports = /* @__PURE__ */ __exportAll({
	createServerEntry: () => createServerEntry,
	default: () => server_default
});
var fetch$1 = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
	return { async fetch(...args) {
		return await entry.fetch(...args);
	} };
}
var server_default = createServerEntry({ fetch: fetch$1 });
//#endregion
export { getRouter as a, __exportAll as i, createCsrfMiddleware as n, createMiddleware as r, server_exports as t };
