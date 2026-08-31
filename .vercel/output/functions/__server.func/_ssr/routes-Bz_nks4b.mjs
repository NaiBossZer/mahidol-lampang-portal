import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as Droplets, M as CircleCheck, P as ChevronRight, S as Leaf, U as ArrowUpRight, V as BookOpen, k as CloudSun, l as Sprout, n as X, o as Thermometer, p as Search, s as Sun, t as Zap, u as ShoppingCart, w as FileText, y as Menu } from "../_libs/lucide-react.mjs";
import { l as MOCK_PRODUCTS } from "./api-BXZgsq1G.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as CartProvider, r as useCart, t as CartDrawer } from "./CartDrawer-CUvMiNKS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bz_nks4b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var modules = [
	{
		label: "PORTAL",
		title: "ภาพรวมศูนย์",
		description: "ข่าวสาร กิจกรรม และบริการวิชาการ",
		href: "#overview",
		icon: Sprout,
		tone: "bg-[#002D62]"
	},
	{
		label: "ห้องคลัง",
		title: "คลังความรู้",
		description: "งานวิจัย คู่มือ และข้อมูลเปิด",
		href: "#knowledge",
		icon: BookOpen,
		tone: "bg-[#173f72]"
	},
	{
		label: "SMART FARM",
		title: "เกษตรอัจฉริยะ",
		description: "ติดตามแปลงเพาะปลูกแบบเรียลไทม์",
		href: "/smart-farm",
		icon: Leaf,
		tone: "bg-[#2E7D32]"
	},
	{
		label: "CLEAN ENERGY",
		title: "พลังงานสะอาด",
		description: "วิเคราะห์การผลิตและคาร์บอนที่ลดได้",
		href: "/clean-energy",
		icon: Zap,
		tone: "bg-[#9b6a00]"
	},
	{
		label: "SHOPPING VEG",
		title: "ตลาดผักมหิดล",
		description: "ผลผลิตปลอดภัยจากแปลงวิจัย",
		href: "#market",
		icon: ShoppingCart,
		tone: "bg-[#496b1d]"
	}
];
var knowledge = [
	{
		type: "RESEARCH",
		title: "การบริหารจัดการระบบ Smart Farm ในพื้นที่แห้งแล้ง",
		meta: "เกษตรอัจฉริยะ · 4 นาที",
		color: "text-[#2E7D32]"
	},
	{
		type: "GUIDE",
		title: "คู่มือการใช้งานและดูแลแปลงผักปลอดภัย",
		meta: "คู่มือเกษตร · ดาวน์โหลด PDF",
		color: "text-[#002D62]"
	},
	{
		type: "ENERGY",
		title: "รายงานผลการผลิตไฟฟ้าจาก Solar Rooftop",
		meta: "พลังงานสะอาด · 2 นาที",
		color: "text-[#9b6a00]"
	}
];
function CartButton() {
	const { totalItems, setIsCartOpen } = useCart();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => setIsCartOpen(true),
		className: "relative rounded-xl border border-white/20 p-2.5 transition hover:bg-white/10",
		"aria-label": "เปิดรถเข็น",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { size: 19 }), totalItems > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F2A900] px-1 text-[10px] font-bold text-[#002D62]",
			children: totalItems
		})]
	});
}
function Telemetry({ icon: Icon, label, value, unit, status, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `rounded-lg p-2 ${color}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#2E7D32]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 13 }), status]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-slate-500",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-2xl font-bold text-[#002D62]",
				children: [value, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-1 text-xs font-medium text-slate-400",
					children: unit
				})]
			})
		]
	});
}
function MarketCard({ product }) {
	const { addItem } = useCart();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-40 overflow-hidden bg-slate-100",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: product.image,
				alt: product.name,
				className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#2E7D32] backdrop-blur-md",
				children: "GAP CERTIFIED"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold leading-snug text-[#002D62]",
						children: product.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "whitespace-nowrap text-base font-bold text-[#002D62]",
						children: [
							"฿",
							product.price,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
								className: "text-[10px] font-normal text-slate-400",
								children: ["/", product.unit]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 flex items-center gap-1 text-[11px] text-[#2E7D32]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSun, { size: 13 }),
						" IoT Monitored · แปลง ",
						product.plotId
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => addItem(product),
					className: "mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#002D62] py-2.5 text-xs font-bold text-white transition hover:bg-[#17497f]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { size: 14 }), " เพิ่มลงตะกร้า"]
				})
			]
		})]
	});
}
function MahidolLampangHub() {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const products = MOCK_PRODUCTS.slice(0, 3);
	const filteredKnowledge = (0, import_react.useMemo)(() => knowledge.filter((item) => `${item.title} ${item.type}`.toLowerCase().includes(query.toLowerCase())), [query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-zinc-50 text-slate-800",
		id: "overview",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-50 bg-[#002D62] text-white shadow-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center gap-5 px-4 py-3 lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#overview",
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/mahidol-logo.png",
								alt: "Mahidol University",
								className: "h-10 w-10 rounded-lg bg-white object-contain p-1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden min-w-0 sm:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-bold",
									children: "Mahidol University"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[10px] text-blue-200",
									children: "Lampang Hub Portal"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "ml-auto hidden items-center gap-6 text-xs font-medium text-blue-100 lg:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#modules",
									className: "hover:text-[#F2A900]",
									children: "ระบบทั้งหมด"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#farm",
									className: "hover:text-[#F2A900]",
									children: "สถานะฟาร์ม"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#market",
									className: "hover:text-[#F2A900]",
									children: "ตลาดผัก"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#knowledge",
									className: "hover:text-[#F2A900]",
									children: "ห้องคลัง"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2 lg:ml-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 md:flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										size: 15,
										className: "text-blue-200"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: "ค้นหาในพอร์ทัล",
										className: "w-32 bg-transparent text-xs outline-none placeholder:text-blue-200"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartButton, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "rounded-xl p-2 lg:hidden",
									onClick: () => setMenuOpen(!menuOpen),
									children: menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 20 })
								})
							]
						})
					]
				}), menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-white/10 px-4 pb-4 pt-2 lg:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "block py-2 text-sm",
							href: "#modules",
							onClick: () => setMenuOpen(false),
							children: "ระบบทั้งหมด"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "block py-2 text-sm",
							href: "#market",
							onClick: () => setMenuOpen(false),
							children: "ตลาดผัก"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "block py-2 text-sm",
							href: "#knowledge",
							onClick: () => setMenuOpen(false),
							children: "ห้องคลัง"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative overflow-hidden bg-[#002D62] pb-20 pt-12 text-white lg:pb-28 lg:pt-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 opacity-20",
						style: {
							backgroundImage: "url('/banner2.jpg')",
							backgroundSize: "cover",
							backgroundPosition: "center"
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-[1.15fr_.85fr] lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2 rounded-full border border-[#F2A900]/50 bg-[#F2A900]/15 px-3 py-1.5 text-[10px] font-bold tracking-[.18em] text-[#F2A900]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[#F2A900]" }), " CONNECTED ECOSYSTEM"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-5 max-w-2xl text-4xl font-bold leading-tight md:text-6xl",
								children: [
									"งานพันธกิจเพื่อสังคม",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#F2A900]",
										children: "คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาลัยมหิดล"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-xl text-sm leading-7 text-blue-100 md:text-base",
								children: "เชื่อมต่อองค์ความรู้ งานวิจัย นวัตกรรม และชุมชน เพื่ออนาคตที่ยั่งยืนของลำปาง"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-7 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#modules",
									className: "inline-flex items-center gap-2 rounded-xl bg-[#F2A900] px-5 py-3 text-xs font-bold text-[#002D62] transition hover:-translate-y-0.5",
									children: ["สำรวจระบบทั้งหมด ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 15 })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#market",
									className: "inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/10",
									children: ["เลือกซื้อผลผลิต ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { size: 15 })]
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-widest text-blue-200",
											children: "Live systems"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-4xl font-bold text-[#F2A900]",
											children: "05"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-blue-100",
											children: "ระบบที่เชื่อมต่ออยู่"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-widest text-blue-200",
											children: "Solar today"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-3 text-4xl font-bold",
											children: ["42.8", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm text-blue-200",
												children: " kWh"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-[#7bd67f]",
											children: "↑ 12.4% จากเมื่อวาน"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 rounded-2xl border border-[#F2A900]/30 bg-[#F2A900]/10 p-5 backdrop-blur-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] uppercase tracking-widest text-[#F2A900]",
												children: "Portal status"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-sm font-semibold",
												children: "ทุกระบบทำงานเป็นปกติ"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "text-[#7bd67f]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-blue-200",
												children: "อัปเดตล่าสุด 10:42 น."
											})
										]
									})
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "modules",
					className: "relative z-10 mx-auto -mt-10 max-w-7xl px-4 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
						children: modules.map(({ icon: Icon, ...module }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: module.href,
							className: `group rounded-2xl ${module.tone} p-4 text-white shadow-xl transition hover:-translate-y-1`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 21 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
										size: 16,
										className: "opacity-60 transition group-hover:opacity-100"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 text-[9px] font-bold tracking-[.18em] text-white/60",
									children: module.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 text-sm font-bold",
									children: module.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] leading-5 text-white/75",
									children: module.description
								})
							]
						}, module.title))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "farm",
					className: "mx-auto max-w-7xl px-4 py-16 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between gap-4 md:flex-row md:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold tracking-[.2em] text-[#2E7D32]",
								children: "SMART FARM / LIVE TELEMETRY"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-2xl font-bold text-[#002D62] md:text-3xl",
								children: "สถานะแปลงสาธิตวันนี้"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-slate-500",
								children: "ข้อมูลจากเซนเซอร์แปลงเกษตรอัจฉริยะ อัปเดตทุก 5 นาที"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/smart-farm",
							className: "flex items-center gap-1 text-xs font-bold text-[#002D62]",
							children: ["ดูแดชบอร์ดเต็ม ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Telemetry, {
								icon: Droplets,
								label: "ความชื้นในดิน",
								value: "61",
								unit: "%",
								status: "Ready",
								color: "bg-green-50 text-[#2E7D32]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Telemetry, {
								icon: Thermometer,
								label: "อุณหภูมิ",
								value: "25.8",
								unit: "°C",
								status: "Normal",
								color: "bg-amber-50 text-[#9b6a00]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Telemetry, {
								icon: CloudSun,
								label: "ความชื้นสัมพัทธ์",
								value: "68",
								unit: "%",
								status: "Normal",
								color: "bg-blue-50 text-[#002D62]"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-y border-slate-200 bg-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[1.2fr_.8fr] lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold tracking-[.2em] text-[#9b6a00]",
								children: "CLEAN ENERGY ANALYTICS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-2xl font-bold text-[#002D62]",
								children: "พลังงานสะอาดที่สร้างผลลัพธ์"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-lg text-sm leading-6 text-slate-500",
								children: "ติดตามพลังงานจากแสงอาทิตย์และผลกระทบเชิงบวกต่อสิ่งแวดล้อมแบบโปร่งใส"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/clean-energy",
								className: "mt-5 inline-flex items-center gap-2 rounded-xl bg-[#002D62] px-4 py-2.5 text-xs font-bold text-white",
								children: ["เปิด Energy dashboard ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-amber-50 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
										className: "text-[#F2A900]",
										size: 20
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 text-xs text-slate-500",
										children: "ผลิตไฟฟ้าวันนี้"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-2xl font-bold text-[#002D62]",
										children: ["42.8 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											className: "text-xs",
											children: "kWh"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-green-50 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, {
										className: "text-[#2E7D32]",
										size: 20
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 text-xs text-slate-500",
										children: "ลด CO₂ สะสม"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-2xl font-bold text-[#2E7D32]",
										children: ["1.24 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											className: "text-xs",
											children: "tCO₂e"
										})]
									})
								]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "market",
					className: "mx-auto max-w-7xl px-4 py-16 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between gap-4 md:flex-row md:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold tracking-[.2em] text-[#2E7D32]",
								children: "SHOPPING VEG MARKETPLACE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-2xl font-bold text-[#002D62] md:text-3xl",
								children: "ผลผลิตจากแปลงวิจัย"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-slate-500",
								children: "สด ปลอดภัย ตรวจสอบย้อนกลับได้ด้วย IoT"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => toast.info("กำลังเปิดดูผลผลิตทั้งหมด"),
							className: "flex items-center gap-1 text-xs font-bold text-[#002D62]",
							children: ["ดูสินค้าทั้งหมด ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-7 grid gap-5 md:grid-cols-3",
						children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketCard, { product }, product.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "knowledge",
					className: "bg-[#f4f6f9] py-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-7xl px-4 lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col justify-between gap-4 md:flex-row md:items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold tracking-[.2em] text-[#002D62]",
									children: "KNOWLEDGE REPOSITORY"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 text-2xl font-bold text-[#002D62] md:text-3xl",
									children: "ห้องคลังความรู้"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-slate-500",
									children: "ข้อมูลสำหรับการเรียนรู้ วิจัย และต่อยอดชุมชน"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									size: 15,
									className: "text-slate-400"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "ค้นหาเอกสาร...",
									className: "w-40 bg-transparent text-xs outline-none"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-7 grid gap-4 lg:grid-cols-3",
							children: filteredKnowledge.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[10px] font-bold tracking-widest ${item.color}`,
											children: item.type
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
											size: 18,
											className: "text-slate-300"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-8 text-sm font-bold leading-6 text-[#002D62]",
										children: item.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-[11px] text-slate-500",
										children: item.meta
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => toast.success("เปิดเอกสารในห้องคลังแล้ว"),
										className: "mt-5 flex items-center gap-1 text-xs font-bold text-[#002D62]",
										children: ["อ่านเพิ่มเติม ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
									})
								]
							}, item.title))
						})]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "bg-[#002D62] text-blue-100",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/mahidol-logo.png",
								alt: "Mahidol University",
								className: "h-9 w-9 rounded bg-white p-1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-white",
								children: "Mahidol Lampang Hub"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-sm text-xs leading-6 text-blue-200",
							children: "ศูนย์การเรียนรู้ วิจัย และบริการวิชาการ มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#F2A900]",
								children: "QUICK LINKS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#knowledge",
								className: "mt-4 block text-xs hover:text-white",
								children: "ห้องคลังความรู้"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#market",
								className: "mt-3 block text-xs hover:text-white",
								children: "ตลาดผักมหิดล"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/smart-farm",
								className: "mt-3 block text-xs hover:text-white",
								children: "Smart Farm IoT"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-[#F2A900]",
								children: "SYSTEM STATUS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 flex items-center gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#7bd67f]" }), " All systems operational"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-blue-300",
								children: "© 2026 Mahidol University"
							})
						] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		]
	}) });
}
var SplitComponent = MahidolLampangHub;
//#endregion
export { SplitComponent as component };
