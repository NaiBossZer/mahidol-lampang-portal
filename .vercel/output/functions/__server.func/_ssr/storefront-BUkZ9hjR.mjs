import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { B as CalendarDays, C as FlaskConical, G as Activity, H as Award, L as ChartColumn, M as CircleCheck, R as CarFront, S as Leaf, W as ArrowLeft, b as Map, d as ShoppingBag, f as ShieldCheck, h as Radio, i as TriangleAlert, l as Sprout, m as RefreshCw, t as Zap, u as ShoppingCart, x as LoaderCircle } from "../_libs/lucide-react.mjs";
import { A as startOfDay, t as th, u as format } from "../_libs/date-fns.mjs";
import { i as CardContent, n as Calendar$1, o as CardFooter, r as Card, t as Badge } from "./calendar-vkKSiYyy.mjs";
import { a as DialogHeader, c as Label, h as getProducts, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Input, t as Dialog, u as createEvBooking } from "./api-BXZgsq1G.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
import { n as CartProvider, r as useCart, t as CartDrawer } from "./CartDrawer-CUvMiNKS.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { a as ResponsiveContainer, i as Line, n as YAxis, o as Tooltip, r as XAxis, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storefront-BUkZ9hjR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
var ProductCard = ({ product, onViewPlot }) => {
	const { addItem } = useCart();
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const isOutOfStock = product.stock === 0 && !product.isPreOrder;
	const stockPercentage = Math.min(100, Math.max(0, product.stock / 50 * 100));
	const getStandardIcon = (std) => {
		switch (std) {
			case "Organic 100%": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "w-3 h-3 mr-1" });
			case "งานวิจัย": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "w-3 h-3 mr-1" });
			case "GAP": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3 mr-1" });
			default: return null;
		}
	};
	const getStandardColor = (std) => {
		switch (std) {
			case "Organic 100%": return "bg-[#2E7D32] text-white hover:bg-[#2E7D32]/80";
			case "งานวิจัย": return "bg-[#002D62] text-white hover:bg-[#002D62]/80";
			case "GAP": return "bg-[#F2A900] text-white hover:bg-[#F2A900]/80";
			default: return "bg-gray-500 text-white";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[4/3] overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: product.name,
						className: "object-cover w-full h-full transition-transform duration-300 hover:scale-105",
						onError: (event) => {
							event.currentTarget.src = "/mahidol-logo.png";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "absolute bottom-2 left-2 bg-[#002D62] text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "mr-1 h-3 w-3" }), " IoT Monitored"]
					}),
					product.isPreOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-2 right-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "bg-white/90 text-[#002D62] font-semibold backdrop-blur-sm border-[#002D62]",
							children: [
								"Pre-Order (เก็บเกี่ยว ",
								product.harvestDate,
								")"
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4 flex-1 flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-lg line-clamp-2 text-gray-900",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1 mb-2",
						children: product.standards.map((std) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: `${getStandardColor(std)} text-xs border-none`,
							children: [getStandardIcon(std), std]
						}, std))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setExpanded((value) => !value),
						className: "flex items-center gap-1 self-start text-xs font-medium text-[#002D62] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900]",
						"aria-expanded": expanded,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-3 w-3" }),
							" ",
							expanded ? "ซ่อนข้อมูล IoT" : "ดูข้อมูล IoT"
						]
					}),
					expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid grid-cols-2 gap-2 rounded-md bg-slate-50 p-2 text-xs",
						"aria-label": "ข้อมูลเซนเซอร์ล่าสุด",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-slate-500",
								children: "อุณหภูมิ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-semibold",
								children: [product.sensorData.temperatureC, "°C"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-slate-500",
								children: "ดิน"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-semibold",
								children: [product.sensorData.soilMoisturePercent, "%"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-slate-500",
								children: "คาดการณ์"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-semibold",
								children: [product.harvestPrediction.confidencePercent, "% มั่นใจ"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-slate-500",
								children: "แปลง"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-semibold",
								children: product.plotId
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-2xl font-bold text-[#002D62]",
								children: ["฿", product.price]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-gray-500 mb-1",
								children: ["/", product.unit]
							})]
						}), !product.isPreOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-xs text-gray-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "คงเหลือ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: product.stock < 10 ? "text-red-500 font-medium" : "",
									children: [
										product.stock,
										" ",
										product.unit
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: stockPercentage,
								className: "h-1.5"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
				className: "p-4 pt-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "px-3 text-[#002D62]",
						onClick: () => onViewPlot?.(product),
						"aria-label": `ดูวิเคราะห์แปลง ${product.plotId}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "flex-1 bg-[#2E7D32] text-white hover:bg-[#2E7D32]/90",
						disabled: isOutOfStock,
						onClick: () => addItem(product),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mr-2 h-4 w-4" }), product.isPreOrder ? "สั่งจองล่วงหน้า" : "เพิ่มลงตะกร้า"]
					})]
				})
			})
		]
	});
};
var statusCopy = {
	ready: {
		label: "พร้อมเก็บเกี่ยว",
		className: "bg-[#2E7D32] text-white",
		icon: CircleCheck
	},
	normal: {
		label: "ติดตามปกติ",
		className: "bg-[#F2A900] text-[#002D62]",
		icon: Activity
	},
	attention: {
		label: "ต้องตรวจสอบ",
		className: "bg-red-600 text-white",
		icon: TriangleAlert
	}
};
function SmartPlotsWidget({ products, onSelectPlot, onRefresh }) {
	const [lastRefresh, setLastRefresh] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const refresh = (0, import_react.useCallback)(async () => {
		setRefreshing(true);
		try {
			await onRefresh?.();
			setLastRefresh(/* @__PURE__ */ new Date());
		} finally {
			setRefreshing(false);
		}
	}, [onRefresh]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "smart-plots-title",
		className: "rounded-xl border border-[#002D62]/15 bg-white p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-widest text-[#002D62]",
					children: "// LIVE_IOT_TELEMETRY"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					id: "smart-plots-title",
					className: "mt-1 flex items-center gap-2 text-xl font-bold text-[#002D62]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprout, { className: "h-5 w-5 text-[#2E7D32]" }), " แปลงอัจฉริยะ"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-slate-500",
					"aria-live": "polite",
					children: ["อัปเดตล่าสุด ", lastRefresh.toLocaleTimeString("th-TH")]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => void refresh(),
				disabled: refreshing,
				className: "border-[#002D62] text-[#002D62]",
				"aria-label": "รีเฟรชข้อมูลเซนเซอร์",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}` }),
					" ",
					refreshing ? "กำลังโหลด" : "รีเฟรช"
				]
			})]
		}), products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-lg border border-dashed p-6 text-center text-sm text-slate-500",
			children: "ยังไม่มีข้อมูลแปลงปลูก"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: products.map((product) => {
				const status = statusCopy[product.plotStatus];
				const Icon = status.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onSelectPlot?.(product),
					className: "rounded-lg border border-slate-200 p-3 text-left transition hover:-translate-y-0.5 hover:border-[#002D62] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A900]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-bold text-[#002D62]",
								children: product.plotId
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: status.className,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mr-1 h-3 w-3" }), status.label]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold text-slate-800",
							children: product.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "อุณหภูมิ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-mono font-semibold text-slate-800",
									children: [product.sensorData.temperatureC, "°C"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "ความชื้น" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-mono font-semibold text-slate-800",
									children: [product.sensorData.humidityPercent, "%"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "ดิน" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-mono font-semibold text-slate-800",
									children: [product.sensorData.soilMoisturePercent, "%"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "แสง" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-mono font-semibold text-slate-800",
									children: [Math.round(product.sensorData.lightLux / 1e3), "k lux"]
								})] })
							]
						})
					]
				}, product.plotId);
			})
		})]
	});
}
function PlotDetailView({ product, relatedProducts, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: product !== null,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-3xl",
			children: product && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 text-[#002D62]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "h-5 w-5" }),
						" วิเคราะห์แปลง ",
						product.plotId
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					product.name,
					" • อัปเดต",
					" ",
					new Date(product.sensorData.recordedAt).toLocaleString("th-TH")
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border bg-slate-50 p-4",
						"aria-labelledby": "trend-title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							id: "trend-title",
							className: "mb-3 flex items-center gap-2 text-sm font-semibold text-[#002D62]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" }), " แนวโน้มเซนเซอร์ 6 ชั่วโมง"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: product.sensorTrend,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "label",
											tick: { fontSize: 10 }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											width: 30,
											tick: { fontSize: 10 }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "soilMoisturePercent",
											name: "ความชื้นดิน %",
											stroke: "#2E7D32",
											strokeWidth: 2,
											dot: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "humidityPercent",
											name: "ความชื้นอากาศ %",
											stroke: "#002D62",
											strokeWidth: 2,
											dot: false
										})
									]
								})
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border bg-slate-50 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "mb-3 flex items-center gap-2 text-sm font-semibold text-[#002D62]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-[#F2A900]" }), " การคาดการณ์และคุณภาพ"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-slate-500",
											children: "คาดการณ์เก็บเกี่ยว"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-semibold",
											children: (/* @__PURE__ */ new Date(`${product.harvestPrediction.estimatedDate}T00:00:00`)).toLocaleDateString("th-TH")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-slate-500",
											children: "ความมั่นใจ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "font-semibold text-[#2E7D32]",
											children: [product.harvestPrediction.confidencePercent, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-slate-500",
											children: "คะแนนคุณภาพ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "font-semibold text-[#F2A900]",
											children: [product.harvestPrediction.qualityScore.toFixed(1), " / 5"]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: product.qualityCertificates.map((certificate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "border-[#2E7D32] text-[#2E7D32]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1 h-3 w-3" }), certificate]
								}, certificate))
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "overflow-hidden rounded-lg border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-36 items-center justify-center bg-[#002D62] text-center text-white",
						children: product.plotMapUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.plotMapUrl,
							alt: `แผนที่แปลง ${product.plotId}`,
							className: "h-full w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "mx-auto mb-2 h-8 w-8 text-[#F2A900]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm",
								children: ["Spatial plot viewport: ", product.plotId]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-300",
								children: "ยังไม่มีไฟล์ผังแปลงจาก IoT gateway"
							})
						] })
					})
				}),
				relatedProducts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 text-sm font-semibold text-[#002D62]",
					children: "ผลผลิตจากแปลงใกล้เคียง"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: relatedProducts.map((related) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: related.name
					}, related.id))
				})] })
			] })
		})
	});
}
var bookingSchema = objectType({
	customerName: stringType().trim().min(2, "กรุณาระบุชื่อผู้จอง").max(255),
	customerPhone: stringType().trim().regex(/^[0-9+ ()-]{8,20}$/, "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"),
	vehiclePlate: stringType().trim().min(2, "กรุณาระบุทะเบียนรถ").max(30),
	startTime: stringType().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "เวลาไม่ถูกต้อง")
});
function ProductionEvCalendar({ products }) {
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(startOfDay(/* @__PURE__ */ new Date()));
	const [bookingTab, setBookingTab] = (0, import_react.useState)("harvest");
	const [values, setValues] = (0, import_react.useState)({
		customerName: "",
		customerPhone: "",
		vehiclePlate: "",
		startTime: "09:00"
	});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
	const harvests = (0, import_react.useMemo)(() => products.filter((product) => (product.harvestDate ?? product.harvestPrediction.estimatedDate).slice(0, 10) === selectedDateKey), [products, selectedDateKey]);
	const update = (key, value) => setValues((current) => ({
		...current,
		[key]: value
	}));
	const submitBooking = async (event) => {
		event.preventDefault();
		const parsed = bookingSchema.safeParse(values);
		if (!parsed.success) {
			const next = {};
			parsed.error.issues.forEach((issue) => {
				const key = String(issue.path[0] ?? "form");
				if (!next[key]) next[key] = issue.message;
			});
			setErrors(next);
			return;
		}
		setErrors({});
		setSubmitting(true);
		const startAt = /* @__PURE__ */ new Date(`${selectedDateKey}T${values.startTime}:00`);
		const endAt = new Date(startAt.getTime() + 36e5);
		const input = {
			...values,
			startAt: startAt.toISOString(),
			endAt: endAt.toISOString()
		};
		try {
			const result = await createEvBooking(input);
			toast.success(result.persisted === "local" ? "บันทึกการจองไว้ในเครื่องแล้ว รอเชื่อมต่อระบบ" : "ส่งคำขอจอง EV แล้ว เจ้าหน้าที่จะยืนยันอีกครั้ง");
			setValues({
				customerName: "",
				customerPhone: "",
				vehiclePlate: "",
				startTime: "09:00"
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "ไม่สามารถจอง EV ได้");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
		"aria-labelledby": "production-ev-calendar-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-wider text-[#2E7D32]",
					children: "Connected Calendar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "production-ev-calendar-title",
					className: "mt-1 text-xl font-bold text-[#002D62]",
					children: "ปฏิทินผลผลิตและการจอง EV"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-slate-500",
					children: "เลือกวันที่เพื่อดูรอบเก็บเกี่ยว หรือจองหัวชาร์จ EV ในวันเดียวกัน"
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex rounded-lg border border-slate-200 p-1",
				role: "tablist",
				"aria-label": "ประเภทปฏิทิน",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": bookingTab === "harvest",
					onClick: () => setBookingTab("harvest"),
					className: `rounded-md px-3 py-2 text-sm ${bookingTab === "harvest" ? "bg-[#2E7D32] text-white" : "text-slate-600"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "mr-1 inline h-4 w-4" }), "ผลผลิต"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": bookingTab === "ev",
					onClick: () => setBookingTab("ev"),
					className: `rounded-md px-3 py-2 text-sm ${bookingTab === "ev" ? "bg-[#002D62] text-white" : "text-slate-600"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "mr-1 inline h-4 w-4" }), "จอง EV"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-5 lg:grid-cols-[auto_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-slate-200 bg-slate-50 p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, {
					mode: "single",
					selected: selectedDate,
					onSelect: (date) => date && setSelectedDate(date),
					disabled: { before: startOfDay(/* @__PURE__ */ new Date()) },
					locale: th
				})
			}), bookingTab === "harvest" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-emerald-100 bg-emerald-50/50 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-[#2E7D32]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-semibold",
						children: ["เก็บเกี่ยววันที่ ", format(selectedDate, "d MMMM yyyy", { locale: th })]
					})]
				}), harvests.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: harvests.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-emerald-100 bg-white p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-[#002D62]",
								children: product.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-slate-500",
								children: [
									"แปลง ",
									product.plotId,
									" • ความมั่นใจ",
									" ",
									product.harvestPrediction.confidencePercent,
									"%"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-2 text-xs font-semibold text-[#2E7D32] underline",
								onClick: () => setBookingTab("ev"),
								children: "จอง EV ในวันนี้"
							})
						]
					}, product.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-slate-500",
					children: "ยังไม่มีรายการเก็บเกี่ยวในวันนี้"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submitBooking,
				className: "space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[#002D62]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarFront, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "จองหัวชาร์จ 1 ชั่วโมง"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-slate-500",
						children: ["วันที่เลือก: ", format(selectedDate, "d MMMM yyyy", { locale: th })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							[
								"customerName",
								"ชื่อผู้จอง",
								"ชื่อ-นามสกุล"
							],
							[
								"customerPhone",
								"เบอร์โทรศัพท์",
								"08x-xxx-xxxx"
							],
							[
								"vehiclePlate",
								"ทะเบียนรถ",
								"กข 1234"
							],
							[
								"startTime",
								"เวลาเริ่มชาร์จ",
								"09:00"
							]
						].map(([key, label, placeholder]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: `ev-${key}`,
									children: label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: `ev-${key}`,
									type: key === "startTime" ? "time" : "text",
									value: values[key],
									placeholder,
									onChange: (event) => update(key, event.target.value)
								}),
								errors[key] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-red-600",
									role: "alert",
									children: errors[key]
								})
							]
						}, key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: submitting,
						className: "bg-[#002D62] text-white hover:bg-[#002D62]/90",
						children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "ส่งคำขอจอง EV"]
					})
				]
			})]
		})]
	});
}
var FloatingCart = () => {
	const { totalItems, setIsCartOpen } = useCart();
	if (totalItems === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-6 right-6 z-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: () => setIsCartOpen(true),
			className: "rounded-full w-14 h-14 shadow-xl bg-[#002D62] hover:bg-[#002D62]/90 flex items-center justify-center relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "w-6 h-6 text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white",
				children: totalItems
			})]
		})
	});
};
var StorefrontWidget = () => {
	const [products, setProducts] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [standard, setStandard] = (0, import_react.useState)("ทั้งหมด");
	const [selectedPlot, setSelectedPlot] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		getProducts().then(setProducts).finally(() => setLoading(false));
	}, []);
	const refreshProducts = async () => {
		setProducts(await getProducts());
	};
	const filteredProducts = (0, import_react.useMemo)(() => products.filter((product) => {
		const matchesQuery = product.name.toLowerCase().includes(query.trim().toLowerCase()) || product.plotId.toLowerCase().includes(query.trim().toLowerCase());
		const matchesStandard = standard === "ทั้งหมด" || product.standards.includes(standard);
		return matchesQuery && matchesStandard;
	}), [
		products,
		query,
		standard
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-between items-end mb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-bold text-[#002D62] mb-2",
					children: "ผลผลิตสดใหม่วันนี้จากศูนย์วิจัย"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-gray-600",
					children: "สนับสนุนผลผลิตทางการเกษตรปลอดภัย มาตรฐาน GAP และออร์แกนิก จากแปลงวิจัยมหาวิทยาลัยมหิดล วิทยาเขตอำนาจเจริญ (ศูนย์ลำปาง)"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartPlotsWidget, {
				products,
				onSelectPlot: setSelectedPlot,
				onRefresh: refreshProducts
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductionEvCalendar, { products }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-6 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "ค้นหาผลผลิตหรือรหัสแปลง...",
					"aria-label": "ค้นหาผลผลิต"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: standard,
					onChange: (event) => setStandard(event.target.value),
					className: "rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700",
					"aria-label": "กรองมาตรฐานสินค้า",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ทั้งหมด" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "GAP" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Organic 100%" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "งานวิจัย" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
				children: loading ? Array.from({ length: 4 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-80 animate-pulse rounded-xl bg-slate-100",
					"aria-label": "กำลังโหลดสินค้า"
				}, index)) : filteredProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "col-span-full rounded-lg border border-dashed p-8 text-center text-sm text-slate-500",
					children: "ไม่พบผลผลิตตามเงื่อนไข"
				}) : filteredProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
					product,
					onViewPlot: setSelectedPlot
				}, product.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingCart, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotDetailView, {
				product: selectedPlot,
				relatedProducts: products.filter((product) => product.plotId !== selectedPlot?.plotId).slice(0, 3),
				onClose: () => setSelectedPlot(null)
			})
		]
	}) });
};
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
