import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./button-CCQEfgNs.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BiHV7YXM.mjs";
import { A as CirclePlay, B as BookOpen, C as FlaskConical, D as Clock, F as ChevronDown, H as ArrowUpRight, N as ChevronRight, P as ChevronLeft, S as Leaf, a as TreePine, b as MapPin, c as Sprout, f as Search, l as ShoppingCart, n as X, t as Zap, v as Menu, y as Map } from "../_libs/lucide-react.mjs";
import { t as SUB_SYSTEM_URLS } from "./constants-DjbFY7Le.mjs";
import { t as StorefrontWidget } from "./StorefrontWidget-BN9vX65f.mjs";
import { a as List, c as Viewport, i as Link, n as Indicator, o as Root2, r as Item, s as Trigger, t as Content } from "../_libs/@radix-ui/react-navigation-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CF_4004N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NavigationMenu = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, {
	ref,
	className: cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationMenuViewport, {})]
}));
NavigationMenu.displayName = Root2.displayName;
var NavigationMenuList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("group flex flex-1 list-none items-center justify-center space-x-1", className),
	...props
}));
NavigationMenuList.displayName = List.displayName;
var NavigationMenuItem = Item;
var navigationMenuTriggerStyle = cva("group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent");
var NavigationMenuTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger, {
	ref,
	className: cn(navigationMenuTriggerStyle(), "group", className),
	...props,
	children: [
		children,
		" ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
			className: "relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180",
			"aria-hidden": "true"
		})
	]
}));
NavigationMenuTrigger.displayName = Trigger.displayName;
var NavigationMenuContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ", className),
	...props
}));
NavigationMenuContent.displayName = Content.displayName;
var NavigationMenuLink = Link;
var NavigationMenuViewport = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("absolute left-0 top-full flex justify-center"),
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
		className: cn("origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]", className),
		ref,
		...props
	})
}));
NavigationMenuViewport.displayName = Viewport.displayName;
var NavigationMenuIndicator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
	ref,
	className: cn("top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" })
}));
NavigationMenuIndicator.displayName = Indicator.displayName;
var FALLBACK_MODEL_URL = "https://huggingface.co/BossLampang/site-map-3d-MU-Lampang/resolve/main/site-map-3d.glb";
function Map3DViewer({ modelUrl }) {
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [isLoaded, setIsLoaded] = (0, import_react.useState)(false);
	const [hasError, setHasError] = (0, import_react.useState)(false);
	const [shouldLoad, setShouldLoad] = (0, import_react.useState)(false);
	const [viewerReady, setViewerReady] = (0, import_react.useState)(false);
	const containerRef = (0, import_react.useRef)(null);
	const viewerRef = (0, import_react.useRef)(null);
	const activeModelUrl = modelUrl?.trim() || FALLBACK_MODEL_URL;
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				setShouldLoad(true);
				observer.disconnect();
			}
		}, { rootMargin: "100px" });
		if (containerRef.current) observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!shouldLoad) return;
		let isActive = true;
		import("../_libs/@google/model-viewer+[...].mjs").then((n) => n.t).then(() => {
			if (isActive) setViewerReady(true);
		}).catch(() => {
			if (isActive) setHasError(true);
		});
		return () => {
			isActive = false;
		};
	}, [shouldLoad]);
	(0, import_react.useEffect)(() => {
		if (!shouldLoad || !viewerReady) return;
		const viewer = viewerRef.current;
		if (!viewer) return;
		const handleProgress = (event) => {
			const totalProgress = event.detail?.totalProgress;
			if (typeof totalProgress !== "number") return;
			const nextProgress = Math.round(totalProgress * 100);
			setProgress((currentProgress) => currentProgress === nextProgress ? currentProgress : nextProgress);
		};
		const handleLoad = () => {
			setProgress(100);
			setIsLoaded(true);
		};
		const handleError = () => setHasError(true);
		viewer.addEventListener("progress", handleProgress);
		viewer.addEventListener("load", handleLoad);
		viewer.addEventListener("error", handleError);
		viewer.setAttribute("src", activeModelUrl);
		return () => {
			viewer.removeEventListener("progress", handleProgress);
			viewer.removeEventListener("load", handleLoad);
			viewer.removeEventListener("error", handleError);
			viewer.removeAttribute("src");
		};
	}, [
		activeModelUrl,
		shouldLoad,
		viewerReady
	]);
	const retryLoading = () => {
		setProgress(0);
		setIsLoaded(false);
		setHasError(false);
		setViewerReady(false);
		setShouldLoad(false);
		requestAnimationFrame(() => setShouldLoad(true));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: "w-full h-[450px] md:h-[550px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative",
		children: shouldLoad ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("model-viewer", {
			ref: viewerRef,
			alt: "ผังบริเวณศูนย์การเรียนรู้ มหิดล ลำปาง",
			loading: "eager",
			"auto-rotate": true,
			"camera-controls": true,
			"shadow-intensity": "1.5",
			exposure: "1.2",
			"camera-orbit": "45deg 55deg 100m",
			"field-of-view": "30deg",
			className: "w-full h-full",
			children: (!isLoaded || hasError) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				slot: "poster",
				className: "absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-white p-6 z-10",
				children: hasError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-center text-lg font-medium text-slate-100",
					children: "ไม่สามารถโหลดผังบริเวณ 3D ได้"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: retryLoading,
					className: "mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
					children: "ลองโหลดอีกครั้ง"
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-4 border-slate-600 border-t-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-medium text-slate-100",
							children: "กำลังโหลดผังบริเวณ 3D..."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "progressbar",
						"aria-label": "ความคืบหน้าการโหลดโมเดล 3D",
						"aria-valuemin": 0,
						"aria-valuemax": 100,
						"aria-valuenow": progress,
						className: "h-3 w-full max-w-md overflow-hidden rounded-full border border-slate-700 bg-slate-800 p-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-[width] duration-200 ease-out",
							style: { width: `${progress}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-2 font-mono text-sm font-semibold text-amber-400",
						children: [progress, "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-center text-xs text-slate-400",
						children: "โมเดลมีความละเอียดสูง (241 MB) อาจใช้เวลาดาวน์โหลดครู่หนึ่ง"
					})
				] })
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col items-center justify-center h-full text-slate-400",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "เลื่อนลงมาเพื่อโหลดผังบริเวณ 3D"
			})
		})
	});
}
var ACTIVE_MODEL_URL = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_MODEL_URL": "https://huggingface.co/BossLampang/site-map-3d-MU-Lampang/resolve/main/site-map-3d.glb"
}["VITE_MODEL_URL"]?.trim() || "https://huggingface.co/BossLampang/site-map-3d-MU-Lampang/resolve/main/site-map-3d.glb";
var GOOGLE_MAP_URL = "https://www.google.com/maps?q=ศูนย์การเรียนรู้ วิจัย และบริการวิชาการ มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง&output=embed";
function SiteLayout3D() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "site-layout-section",
		className: "border-b border-slate-200 bg-slate-50 py-12 sm:py-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-5xl mx-auto px-4 md:px-8 space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#002D62]",
						children: "Explore Our Site"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold leading-tight text-[#002D62] md:text-3xl",
						children: "ผังบริเวณและพื้นที่การเรียนรู้ มหิดล ลำปาง"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto max-w-2xl text-xs font-normal leading-relaxed text-slate-600 sm:text-sm",
						children: "รับชมวิดีโอแนะนำศูนย์ฯ ดูตำแหน่งที่ตั้ง และสำรวจผังบริเวณ 3D"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "video",
				className: "flex w-full flex-col items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "mb-6 grid h-auto w-full max-w-2xl grid-cols-1 gap-1 rounded-xl bg-slate-200/60 p-1 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "video",
								className: "flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900] focus-visible:ring-offset-2 data-[state=active]:bg-white data-[state=active]:text-[#002D62] data-[state=active]:shadow-sm sm:text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "w-4 h-4 text-[#F2A900]" }), "วิดีโอแนะนำศูนย์"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "google-map",
								className: "flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900] focus-visible:ring-offset-2 data-[state=active]:bg-white data-[state=active]:text-[#002D62] data-[state=active]:shadow-sm sm:text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "w-4 h-4 text-[#F2A900]" }), "Google Maps"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "map",
								className: "flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900] focus-visible:ring-offset-2 data-[state=active]:bg-white data-[state=active]:text-[#002D62] data-[state=active]:shadow-sm sm:text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-4 h-4 text-[#F2A900]" }), "แผนที่ผังบริเวณ (3D)"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "video",
						className: "w-full mt-0 focus-visible:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative aspect-video min-h-[240px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-xl sm:min-h-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("video", {
								controls: true,
								preload: "metadata",
								className: "w-full h-full object-cover",
								poster: "/banner1.jpg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
									src: "/intro-enlp.mp4",
									type: "video/mp4"
								}), "เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ"]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "google-map",
						className: "w-full mt-0 focus-visible:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative aspect-video min-h-[300px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:min-h-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
								src: GOOGLE_MAP_URL,
								title: "ตำแหน่งศูนย์การเรียนรู้ วิจัย และบริการวิชาการ มหาวิทยาลัยมหิดล ลำปาง",
								loading: "lazy",
								referrerPolicy: "no-referrer-when-downgrade",
								className: "w-full h-full border-0"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "map",
						className: "w-full mt-0 focus-visible:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative aspect-video min-h-[360px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl sm:min-h-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map3DViewer, { modelUrl: ACTIVE_MODEL_URL })
						})
					})
				]
			})]
		})
	});
}
var SLIDES = [
	{
		id: 1,
		image: "/banner1.jpg",
		title: "Mahidol University Lampang Hub",
		subtitle: "ศูนย์รวมองค์ความรู้ งานวิจัยนวัตกรรม และพลังงานสะอาดเพื่อชุมชน",
		buttonText: "สำรวจคลังความรู้",
		buttonLink: "#knowledge-hub"
	},
	{
		id: 2,
		image: "/banner2.jpg",
		title: "Sustainable Future Starts Here",
		subtitle: "ยกระดับการบริการวิชาการ มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง",
		buttonText: "ฐานการเรียนรู้",
		buttonLink: "#bases"
	},
	{
		id: 3,
		image: "/banner3.jpg",
		title: "Smart Learning & Innovation",
		subtitle: "เชื่อมโยงระบบสารสนเทศ งานวิจัยครั่ง พลังงานโซลาร์เซลล์ และเกษตรกรรมอัจฉริยะ",
		buttonText: "ผังบริเวณศูนย์ฯ",
		buttonLink: "#site-layout-section"
	}
];
var KNOWLEDGE_ARTICLES = [
	{
		id: 1,
		category: "ครั่ง",
		badgeClass: "bg-rose-50 text-[#9F1239] border-rose-200",
		title: "การแปรรูปครั่งสู่ผลิตภัณฑ์ชีวภาพมูลค่าสูง",
		snippet: "นวัตกรรมการสกัดสารจากครั่งธรรมชาติ เพื่อนำไปใช้ในอุตสาหกรรมทางการแพทย์ อาหาร และการเกษตรเชิงพาณิชย์...",
		readTime: "3 นาที",
		author: "งานวิจัยครั่ง",
		link: SUB_SYSTEM_URLS.RAC
	},
	{
		id: 2,
		category: "พลังงาน",
		badgeClass: "bg-amber-50 text-[#D97706] border-amber-200",
		title: "ติดตาม Real-time Solar Data อาคารสำนักงาน",
		snippet: "ระบบ Smart Meter ตรวจวัดกำลังการผลิตไฟฟ้าจากแผงโซลาร์เซลล์และสถิติการลดก๊าซเรือนกระจกรายวัน...",
		readTime: "2 นาที",
		author: "ศูนย์พลังงาน",
		link: SUB_SYSTEM_URLS.CLEAN_ENERGY
	},
	{
		id: 3,
		category: "เกษตร",
		badgeClass: "bg-emerald-50 text-[#059669] border-emerald-200",
		title: "การบริหารจัดการระบบ Smart Farm ในพื้นที่แห้งแล้ง",
		snippet: "การปรับใช้ไอโอที (IoT) และเซนเซอร์วัดความชื้นดินเพื่อการรดน้ำแปลงสาธิตเกษตรกรรมแม่นยำสูง...",
		readTime: "4 นาที",
		author: "เกษตรอัจฉริยะ",
		link: SUB_SYSTEM_URLS.SMART_FARM
	}
];
function MahidolLampangHub() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, import_react.useState)(false);
	const [currentSlide, setCurrentSlide] = (0, import_react.useState)(0);
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("ทั้งหมด");
	(0, import_react.useEffect)(() => {
		const slideInterval = setInterval(() => {
			setCurrentSlide((prev) => prev === SLIDES.length - 1 ? 0 : prev + 1);
		}, 5e3);
		return () => clearInterval(slideInterval);
	}, []);
	const prevSlide = () => setCurrentSlide((prev) => prev === 0 ? SLIDES.length - 1 : prev - 1);
	const nextSlide = () => setCurrentSlide((prev) => prev === SLIDES.length - 1 ? 0 : prev + 1);
	const filteredArticles = activeCategory === "ทั้งหมด" ? KNOWLEDGE_ARTICLES : KNOWLEDGE_ARTICLES.filter((item) => item.category === activeCategory);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "font-['Prompt'] bg-[#F8FAFC] min-h-screen text-slate-800 selection:bg-[#002D62] selection:text-white scroll-smooth antialiased",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-50 bg-[#002D62] text-white shadow-md border-b border-blue-900/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex justify-between items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 md:gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/envi-logo.jpg",
									alt: "Envi Mahidol Logo",
									className: "h-9 md:h-11 object-contain bg-white rounded p-0.5"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/mahidol-logo.png",
									alt: "Mahidol Logo",
									className: "h-9 md:h-11 object-contain bg-white rounded p-0.5"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/social-engagement-logo.png",
									alt: "Social Engagement Logo",
									className: "h-9 md:h-11 object-contain bg-white rounded p-0.5"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-[1px] bg-blue-800/80 hidden sm:block mx-1" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden xl:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-xs md:text-sm tracking-tight block leading-tight text-white",
										children: "งานพันธกิจเพื่อสังคม สำนักงานวิจัยและวิทยบริการ"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#F2A900] font-normal block leading-tight",
										children: "คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล จังหวัดลำปาง"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden lg:flex items-center gap-5 text-xs font-medium text-slate-100",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#hero",
									className: "hover:text-[#F2A900] transition",
									children: "หน้าแรก"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#knowledge-hub",
									className: "hover:text-[#F2A900] transition",
									children: "คลังความรู้"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#bases",
									className: "hover:text-[#F2A900] transition",
									children: "ฐานการเรียนรู้"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#site-layout-section",
									className: "hover:text-[#F2A900] transition",
									children: "ผังบริเวณ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#stats",
									className: "hover:text-[#F2A900] transition",
									children: "สถิติ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#testimonials",
									className: "hover:text-[#F2A900] transition",
									children: "เสียงสะท้อน"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#partners",
									className: "hover:text-[#F2A900] transition",
									children: "พันธมิตร"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#news",
									className: "hover:text-[#F2A900] transition",
									children: "ข่าวสาร"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationMenu, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationMenuList, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavigationMenuItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationMenuTrigger, {
									className: "bg-transparent hover:bg-transparent hover:text-[#F2A900] focus:bg-transparent data-[state=open]:bg-transparent text-xs font-medium text-slate-100 px-0 py-0 h-auto",
									children: "ระบบศูนย์ย่อย"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationMenuContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "grid w-[280px] gap-1 p-2 bg-white rounded-lg shadow-xl border border-slate-200",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationMenuLink, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: "/smart-farm",
												className: "block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-green-50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center text-xs font-semibold text-slate-800 mb-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "w-4 h-4 mr-2 text-green-600" }), " ระบบ Smart Farm IoT"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-slate-500 leading-snug",
													children: "ระบบติดตามและจัดการฟาร์มอัจฉริยะแบบเรียลไทม์"
												})]
											})
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationMenuLink, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: "/clean-energy",
												className: "block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-blue-50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center text-xs font-semibold text-slate-800 mb-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 mr-2 text-blue-600" }), " ศูนย์พลังงานสะอาด"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-slate-500 leading-snug",
													children: "ระบบมอนิเตอร์พลังงานแสงอาทิตย์และพลังงานทดแทน"
												})]
											})
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationMenuLink, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: "/rac",
												className: "block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-orange-50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center text-xs font-semibold text-slate-800 mb-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "w-4 h-4 mr-2 text-orange-600" }), " ศูนย์วิจัย RAC"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-slate-500 leading-snug",
													children: "ระบบฐานข้อมูลงานวิจัยและทดลอง"
												})]
											})
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationMenuLink, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: "#storefront",
												className: "block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors hover:bg-[#F2A900]/10",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center text-xs font-semibold text-slate-800 mb-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "w-4 h-4 mr-2 text-[#F2A900]" }), " ร้านค้าผลผลิตเกษตร"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-slate-500 leading-snug",
													children: "ระบบสั่งซื้อผลผลิต งานวิจัย และผลิตภัณฑ์จากศูนย์ฯ"
												})]
											})
										}) })
									]
								}) })] }) }) })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "p-2 hover:bg-blue-900 rounded-full transition",
								"aria-label": "Search",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-200" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
								className: "lg:hidden p-2 hover:bg-blue-900 rounded-full transition text-slate-200",
								"aria-label": "Toggle Menu",
								children: isMobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
							})]
						})
					]
				}), isMobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:hidden bg-[#001f44] border-t border-blue-900 px-4 py-3 space-y-2 text-xs font-medium",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#hero",
							onClick: () => setIsMobileMenuOpen(false),
							className: "block py-1.5 hover:text-[#F2A900]",
							children: "หน้าแรก"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#knowledge-hub",
							onClick: () => setIsMobileMenuOpen(false),
							className: "block py-1.5 hover:text-[#F2A900]",
							children: "คลังความรู้"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#bases",
							onClick: () => setIsMobileMenuOpen(false),
							className: "block py-1.5 hover:text-[#F2A900]",
							children: "ฐานการเรียนรู้"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#site-layout-section",
							onClick: () => setIsMobileMenuOpen(false),
							className: "block py-1.5 hover:text-[#F2A900]",
							children: "ผังบริเวณ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#stats",
							onClick: () => setIsMobileMenuOpen(false),
							className: "block py-1.5 hover:text-[#F2A900]",
							children: "สถิติ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#testimonials",
							onClick: () => setIsMobileMenuOpen(false),
							className: "block py-1.5 hover:text-[#F2A900]",
							children: "เสียงสะท้อน"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#partners",
							onClick: () => setIsMobileMenuOpen(false),
							className: "block py-1.5 hover:text-[#F2A900]",
							children: "พันธมิตร"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#news",
							onClick: () => setIsMobileMenuOpen(false),
							className: "block py-1.5 hover:text-[#F2A900]",
							children: "ข่าวสาร"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-blue-800/50 pt-2 mt-1 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-blue-400 uppercase tracking-wider font-semibold pb-1",
									children: "ระบบศูนย์ย่อย"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "/smart-farm",
									className: "flex items-center gap-2 py-1.5 hover:text-[#F2A900]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "w-3.5 h-3.5" }), " Smart Farm IoT"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "/clean-energy",
									className: "flex items-center gap-2 py-1.5 hover:text-[#F2A900]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5" }), " พลังงานสะอาด"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "/rac",
									className: "flex items-center gap-2 py-1.5 hover:text-[#F2A900]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "w-3.5 h-3.5" }), " ศูนย์วิจัย RAC"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#storefront",
									onClick: () => setIsMobileMenuOpen(false),
									className: "flex items-center gap-2 py-1.5 hover:text-[#F2A900]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "w-3.5 h-3.5" }), " ร้านค้าผลผลิต"]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "hero",
				className: "relative w-full h-[450px] md:h-[520px] overflow-hidden bg-slate-900",
				children: [
					SLIDES.map((slide, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 bg-cover bg-center",
							style: { backgroundImage: `url('${slide.image}')` },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[#002D62]/40 bg-gradient-to-t from-[#002D62] via-slate-900/40 to-black/30" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-20 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col justify-center items-center text-center text-white space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-[#F2A900] text-[#002D62] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md",
									children: "Mahidol Learning Hub"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl md:text-5xl font-extrabold tracking-tight drop-shadow-md max-w-4xl leading-tight",
									children: slide.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm md:text-base text-slate-200 max-w-2xl drop-shadow font-normal leading-relaxed",
									children: slide.subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: slide.buttonLink,
										className: "bg-[#002D62] border border-blue-400/30 hover:bg-blue-900 text-white font-semibold text-xs md:text-sm px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2",
										children: [
											slide.buttonText,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-[#F2A900]" })
										]
									})
								})
							]
						})]
					}, slide.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: prevSlide,
						className: "absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: nextSlide,
						className: "absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2",
						children: SLIDES.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCurrentSlide(idx),
							className: `h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-8 bg-[#F2A900]" : "w-2.5 bg-white/50 hover:bg-white"}`
						}, idx))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "knowledge-hub",
				className: "max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-semibold text-[#F2A900] bg-blue-50 px-3 py-1 rounded-md w-fit border border-blue-100 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-3.5 h-3.5 text-[#002D62]" }), " KNOWLEDGE REPOSITORY"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl md:text-3xl font-bold text-[#002D62]",
							children: "คลังความรู้และงานวิจัย"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 mt-1 font-normal",
							children: "ย่อยองค์ความรู้ นวัตกรรม และผลการดำเนินงานเพื่อการเรียนรู้ของชุมชน"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							"ทั้งหมด",
							"ครั่ง",
							"พลังงาน",
							"เกษตร"
						].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveCategory(cat),
							className: `text-xs font-medium px-4 py-2 rounded-xl transition-all border ${activeCategory === cat ? "bg-[#002D62] text-white border-[#002D62] shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`,
							children: cat === "ทั้งหมด" ? "ทั้งหมด" : `ฐาน${cat}`
						}, cat))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
					children: filteredArticles.map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-video overflow-hidden bg-slate-100 flex items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/banner1.jpg",
								alt: article.title,
								className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `absolute top-3 left-3 text-[10px] font-semibold px-3 py-1 rounded-full border shadow-sm ${article.badgeClass}`,
								children: ["ฐาน", article.category]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-[11px] text-slate-400 mb-2 font-normal",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }),
												" ",
												article.readTime
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: article.author })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold text-[#002D62] line-clamp-2 hover:text-[#F2A900] transition-colors cursor-pointer leading-snug",
									children: article.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-600 line-clamp-3 mt-2 font-normal leading-relaxed",
									children: article.snippet
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: article.link,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#002D62] hover:bg-blue-50/50 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "อ่านเนื้อหาฉบับเต็ม" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4 text-[#F2A900] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" })]
						})]
					}, article.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "bases",
				className: "bg-white py-14 border-y border-slate-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 md:px-8 space-y-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl md:text-3xl font-bold text-[#002D62]",
							children: "ฐานการเรียนรู้และระบบปฏิบัติการ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 font-normal",
							children: "เข้าใช้งานระบบสารสนเทศเจาะลึกเฉพาะทางของแต่ละฐานเรียนรู้"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: SUB_SYSTEM_URLS.RAC,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "group bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-12 h-12 rounded-xl bg-rose-50 text-[#9F1239] border border-rose-100 flex items-center justify-center font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreePine, { className: "w-6 h-6" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-[#9F1239] uppercase tracking-wider",
											children: "ฐานที่ 1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-lg font-semibold text-[#002D62] group-hover:text-[#9F1239] transition",
											children: "ฐานเรียนรู้ครั่ง"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-600 mt-2 leading-relaxed font-normal",
											children: "รวบรวมองค์ความรู้การเลี้ยงครั่ง งานวิจัยการแปรรูป ตลาดครั่ง และระบบสนับสนุนเศรษฐกิจชุมชน"
										})
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-[#9F1239]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "เข้าสู่ระบบ `mahidol-shellac`" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: SUB_SYSTEM_URLS.CLEAN_ENERGY,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "group bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-12 h-12 rounded-xl bg-amber-50 text-[#D97706] border border-amber-100 flex items-center justify-center font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-6 h-6" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-[#D97706] uppercase tracking-wider",
											children: "ฐานที่ 2"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-lg font-semibold text-[#002D62] group-hover:text-[#D97706] transition",
											children: "ฐานพลังงานสะอาด"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-600 mt-2 leading-relaxed font-normal",
											children: "ติดตาม Solar Data (อาคารสำนักงาน & โรงจอดรถ), ระบบจอง EV Charger และคลังความรู้โซลาร์เซลล์"
										})
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-[#D97706]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "เข้าสู่ระบบ `mahidol-clean-energy`" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: SUB_SYSTEM_URLS.SMART_FARM,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "group bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-12 h-12 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-100 flex items-center justify-center font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprout, { className: "w-6 h-6" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-[#059669] uppercase tracking-wider",
											children: "ฐานที่ 3"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-lg font-semibold text-[#002D62] group-hover:text-[#059669] transition",
											children: "ฐานเกษตรอัจฉริยะ"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-600 mt-2 leading-relaxed font-normal",
											children: "ระบบบริหารจัดการ Smart Farm แปลงสาธิตเกษตรกรรม และระบบตรวจวัดสภาพแวดล้อม"
										})
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-[#059669]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "เข้าสู่ระบบ `mahidol-smart-farm`" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" })]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "storefront",
				className: "bg-[#F8FAFC] border-y border-slate-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorefrontWidget, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout3D, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "stats",
				className: "max-w-7xl mx-auto px-4 md:px-8 py-14 text-center space-y-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold text-[#002D62]",
					children: "ศักยภาพและสถิติภาพรวมศูนย์"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-slate-500 uppercase",
									children: "กำลังการผลิตไฟฟ้ารวม"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-4xl md:text-5xl font-extrabold text-[#002D62]",
									children: "18.00+"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#F2A900] font-semibold",
									children: "kWp (โซลาร์เซลล์)"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-slate-500 uppercase",
									children: "ฐานเรียนรู้และวิจัย"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-4xl md:text-5xl font-extrabold text-[#002D62]",
									children: "3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400 font-normal",
									children: "ฐานการเรียนรู้หลัก"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-slate-500 uppercase",
									children: "พื้นที่บริการวิชาการ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-4xl md:text-5xl font-extrabold text-[#002D62]",
									children: "สบปราบ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400 font-normal",
									children: "จ.ลำปาง"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "testimonials",
				className: "bg-white py-14 border-y border-slate-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 md:px-8 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-4 border-[#F2A900] pl-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold text-[#002D62]",
							children: "Testimonials"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 font-normal",
							children: "เสียงสะท้อนจากผู้ใช้บริการและเกษตรกรในพื้นที่"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
						children: [
							{
								name: "นายสมชาย ใจดี",
								role: "เกษตรกรผู้เลี้ยงครั่ง อ.สบปราบ",
								text: "ได้ความรู้เรื่องการดูแลครั่งและเทคนิคใหม่ๆ จากศูนย์ นำไปปรับใช้ได้จริงเพิ่มผลผลิตได้มาก"
							},
							{
								name: "ดร.วิภาดา เรียนงาม",
								role: "นักวิจัยด้านพลังงาน",
								text: "ระบบแสดงข้อมูล Solar Data ชัดเจน เข้าถึงง่าย เหมาะสำหรับการศึกษาวิจัยต่อยอด"
							},
							{
								name: "นายอนันต์ ยอดเพชร",
								role: "ผู้ใช้บริการสถานีชาร์จ EV",
								text: "จองคิวชาร์จไฟผ่านเว็บสะดวกมาก สถานีสะอาดและปลอดภัย ถือเป็นจุดพักรถที่ดีเยี่ยม"
							},
							{
								name: "นางสาวณิชา พรหมสุข",
								role: "นักศึกษาลงพื้นที่ศึกษาดูงาน",
								text: "ฐานเรียนรู้จัดหมวดหมู่อย่างเป็นระบบ เว็บไซต์ใช้งานง่าย ได้ข้อมูลครบถ้วน"
							}
						].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-full bg-[#002D62] text-white mx-auto flex items-center justify-center font-bold text-xs",
								children: "MU"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-xs text-[#002D62]",
										children: item.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-amber-600 font-medium",
										children: item.role
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-slate-200 font-normal",
										children: [
											"\"",
											item.text,
											"\""
										]
									})
								]
							})]
						}, idx))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "partners",
				className: "bg-[#F8FAFC] py-14 border-b border-slate-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 md:px-8 text-center space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-semibold text-[#002D62] bg-blue-50 px-3 py-1 rounded-md border border-blue-100 uppercase tracking-wider",
							children: "Network & Collaboration"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl md:text-2xl font-bold text-[#002D62] pt-2",
							children: "พันธมิตรและความร่วมมือ"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2 group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-20 w-20 md:h-24 md:w-24 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/partner-creasia.png",
										alt: "Creasia Group",
										className: "max-h-full max-w-full object-contain"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-slate-700 group-hover:text-[#002D62] transition",
									children: "Creasia Group"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2 group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-20 w-20 md:h-24 md:w-24 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/partner-pao-lampang.png",
										alt: "องค์การบริหารส่วนจังหวัดลำปาง",
										className: "max-h-full max-w-full object-contain"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-slate-700 group-hover:text-[#002D62] transition",
									children: "อบจ. ลำปาง"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2 group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-20 w-20 md:h-24 md:w-24 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/partner-maekua.jpg",
										alt: "อบต. แม่กัวะ อ.สบปราบ จ.ลำปาง",
										className: "max-h-full max-w-full object-contain"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-slate-700 group-hover:text-[#002D62] transition",
									children: "อบต. แม่กัวะ"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2 group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-20 w-20 md:h-24 md:w-24 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/partner-DOAE.png",
										alt: "กรมส่งเสริมการเกษตร",
										className: "max-h-full max-w-full object-contain"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-slate-700 group-hover:text-[#002D62] transition",
									children: "กรมส่งเสริมการเกษตร"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "news",
				className: "max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-l-4 border-[#002D62] pl-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-[#002D62]",
						children: "News & Activities"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 font-normal",
						children: "ข่าวสารและกิจกรรมล่าสุดจากศูนย์มหิดล ลำปาง"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
					children: [
						{
							title: "อบรมเทคนิคการเลี้ยงครั่งยั่งยืนประจำปี 2026",
							date: "15 สิงหาคม 2026",
							desc: "ขอเชิญเกษตรกรเข้าร่วมอบรมเชิงปฏิบัติการพัฒนาคุณภาพผลผลิตครั่ง..."
						},
						{
							title: "เปิดให้บริการจุดชาร์จ EV Charger Solar Carport",
							date: "1 สิงหาคม 2026",
							desc: "เปิดทดสอบระบบสถานีชาร์จพลังงานสะอาดสำหรับรถยนต์ไฟฟ้า..."
						},
						{
							title: "ต้อนรับคณะศึกษาดูงานด้านพลังงานและเกษตรกรรม",
							date: "25 กรกฎาคม 2026",
							desc: "ศูนย์มหิดลลำปางต้อนรับคณะผู้บริหารและนักเรียนในการเข้าชมฐานเรียนรู้..."
						},
						{
							title: "สรุปผลการลดการปล่อยก๊าซคาร์บอนประจำไตรมาส",
							date: "10 กรกฎาคม 2026",
							desc: "เปิดเผยสถิติการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ช่วยลดคาร์บอน..."
						}
					].map((news, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition space-y-3 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-video bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-medium text-xs",
							children: "News Image"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-[#002D62] font-semibold",
									children: news.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-xs text-slate-900 line-clamp-2",
									children: news.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal",
									children: news.desc
								})
							]
						})]
					}, idx))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "bg-[#002D62] text-slate-300 text-xs py-8 border-t border-blue-900 relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 md:px-8 text-center space-y-2 font-normal",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2026 Mahidol University Lampang Center. All rights reserved." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-[#F2A900]",
							children: "ศูนย์การเรียนรู้ วิจัย และบริการวิชาการ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/admin",
								className: "text-[10px] text-slate-400 hover:text-white transition-colors border border-slate-600/50 hover:border-slate-400 px-3 py-1 rounded-full flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "12",
									height: "12",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											width: "18",
											height: "18",
											x: "3",
											y: "3",
											rx: "2"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15 3v18" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m8 9 3 3-3 3" })
									]
								}), "จัดการระบบ (Admin)"]
							})
						})
					]
				})
			})
		]
	});
}
var SplitComponent = MahidolLampangHub;
//#endregion
export { SplitComponent as component };
