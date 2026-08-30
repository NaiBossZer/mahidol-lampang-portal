import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "../_libs/@radix-ui/react-radio-group+[...].mjs";
import { C as FlaskConical, E as CloudUpload, I as ChartColumn, L as CarFront, M as CircleCheckBig, O as Circle, S as Leaf, V as Award, W as Activity, _ as Minus, c as Sprout, d as ShieldCheck, h as Plus, i as TriangleAlert, j as CircleCheck, l as ShoppingCart, m as Radio, n as X, o as Trash2, p as RefreshCw, t as Zap, u as ShoppingBag, x as LoaderCircle, y as Map$1, z as CalendarDays } from "../_libs/lucide-react.mjs";
import { A as startOfDay, t as th, u as format } from "../_libs/date-fns.mjs";
import { S as getProducts, _ as createEvBooking, d as DialogDescription$1, g as Label, h as Input, i as CardContent, l as Dialog$1, m as DialogTitle$1, n as Calendar$1, o as CardFooter, p as DialogHeader, r as Card, t as Badge, u as DialogContent$1, v as createOrder } from "./api-Ci-ZTcpM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { i as ZodIssueCode, n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
import { a as ResponsiveContainer, i as Line, n as YAxis, o as Tooltip, r as XAxis, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StorefrontWidget-BN9vX65f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CartContext = (0, import_react.createContext)(void 0);
function useCart() {
	const context = (0, import_react.useContext)(CartContext);
	if (!context) throw new Error("useCart must be used within a CartProvider");
	return context;
}
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
var STORAGE_KEY = "mahidol-lampang-cart-v1";
function readStoredItems() {
	try {
		const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
		if (!Array.isArray(stored)) return [];
		return stored.filter((item) => typeof item === "object" && item !== null && "id" in item && "quantity" in item && Number.isInteger(item.quantity) && item.quantity > 0);
	} catch {
		return [];
	}
}
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [isHydrated, setIsHydrated] = (0, import_react.useState)(false);
	const [isRevalidating, setIsRevalidating] = (0, import_react.useState)(false);
	const [isCartOpen, setIsCartOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setItems(readStoredItems());
		setIsHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (isHydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}, [items, isHydrated]);
	(0, import_react.useEffect)(() => {
		if (!isHydrated || items.length === 0) return;
		let active = true;
		setIsRevalidating(true);
		getProducts().then((products) => {
			if (!active) return;
			const byId = new Map(products.map((product) => [product.id, product]));
			const next = items.flatMap((item) => {
				const current = byId.get(item.id);
				if (!current || !current.isPreOrder && current.stock < 1) return [];
				return [{
					...item,
					...current,
					quantity: current.isPreOrder ? item.quantity : Math.min(item.quantity, current.stock)
				}];
			});
			if (next.length !== items.length || next.some((item, index) => item.quantity !== items[index]?.quantity)) toast.info("ปรับจำนวนสินค้าในตะกร้าตาม stock ล่าสุดแล้ว");
			if (next.length !== items.length || next.some((item, index) => item.id !== items[index]?.id || item.quantity !== items[index]?.quantity)) setItems(next);
		}).finally(() => {
			if (active) setIsRevalidating(false);
		});
		return () => {
			active = false;
		};
	}, [isHydrated, items]);
	const addItem = (product, requested = 1) => {
		const quantity = Math.max(1, Math.floor(requested));
		if (!product.isPreOrder && product.stock < 1) {
			toast.error("สินค้านี้หมด stock แล้ว");
			return;
		}
		setItems((previous) => {
			const existing = previous.find((item) => item.id === product.id);
			const nextQuantity = (existing?.quantity ?? 0) + quantity;
			const safeQuantity = product.isPreOrder ? nextQuantity : Math.min(nextQuantity, product.stock);
			if (existing) return previous.map((item) => item.id === product.id ? {
				...item,
				...product,
				quantity: safeQuantity
			} : item);
			return [...previous, {
				...product,
				quantity: safeQuantity
			}];
		});
		setIsCartOpen(true);
		toast.success(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`);
	};
	const removeItem = (productId) => setItems((previous) => previous.filter((item) => item.id !== productId));
	const updateQuantity = (productId, quantity) => {
		if (quantity <= 0) return removeItem(productId);
		setItems((previous) => {
			return previous.flatMap((item) => {
				if (item.id !== productId) return [item];
				const safeQuantity = item.isPreOrder ? Math.floor(quantity) : Math.min(Math.floor(quantity), item.stock);
				return safeQuantity > 0 ? [{
					...item,
					quantity: safeQuantity
				}] : [];
			});
		});
	};
	const clearCart = () => setItems([]);
	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value: {
			items,
			addItem,
			removeItem,
			updateQuantity,
			clearCart,
			totalItems,
			totalPrice,
			isCartOpen,
			setIsCartOpen,
			isRevalidating
		},
		children
	});
}
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroup$1.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem$1, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupIndicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3.5 w-3.5 fill-primary" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var checkoutSchema = objectType({
	customerName: stringType().trim().min(2, "กรุณาระบุชื่อ-นามสกุล").max(255),
	customerPhone: stringType().trim().regex(/^[0-9+ ()-]{8,20}$/, "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"),
	deliveryType: enumType(["pickup", "delivery"]),
	address: stringType().trim().max(500).optional()
}).superRefine((value, context) => {
	if (value.deliveryType === "delivery" && (!value.address || value.address.length < 10)) context.addIssue({
		code: ZodIssueCode.custom,
		path: ["address"],
		message: "กรุณาระบุที่อยู่จัดส่งอย่างน้อย 10 ตัวอักษร"
	});
});
function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(/* @__PURE__ */ new Error("อ่านไฟล์ไม่สำเร็จ"));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("อ่านไฟล์ไม่สำเร็จ"));
		reader.readAsDataURL(file);
	});
}
function CheckoutModal({ isOpen, onClose }) {
	const { items, totalPrice, clearCart } = useCart();
	const [deliveryType, setDeliveryType] = (0, import_react.useState)("pickup");
	const [step, setStep] = (0, import_react.useState)(1);
	const [values, setValues] = (0, import_react.useState)({
		customerName: "",
		customerPhone: "",
		deliveryType: "pickup",
		address: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [slip, setSlip] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const deliveryFee = deliveryType === "delivery" ? 50 : 0;
	const tax = 0;
	const finalTotal = totalPrice + deliveryFee + tax;
	const qrUrl = (0, import_react.useMemo)(() => `https://promptpay.io/0812345678/${finalTotal.toFixed(2)}.png`, [finalTotal]);
	const update = (key, value) => setValues((current) => ({
		...current,
		[key]: value,
		...key === "deliveryType" ? { deliveryType: value } : {}
	}));
	const validate = () => {
		const result = checkoutSchema.safeParse({
			...values,
			deliveryType
		});
		if (result.success) {
			setErrors({});
			return true;
		}
		const next = {};
		result.error.issues.forEach((issue) => {
			const key = String(issue.path[0] ?? "form");
			if (!next[key]) next[key] = issue.message;
		});
		setErrors(next);
		return false;
	};
	const handleNext = (event) => {
		event.preventDefault();
		if (validate()) setStep(2);
	};
	const handleSlip = (file) => {
		if (!file) return;
		if (![
			"image/jpeg",
			"image/png",
			"image/webp"
		].includes(file.type) || file.size > 2e6) {
			toast.error("สลิปต้องเป็น JPG, PNG หรือ WebP และไม่เกิน 2 MB");
			return;
		}
		setSlip(file);
	};
	const handleSubmitOrder = async () => {
		if (!slip) {
			toast.error("กรุณาแนบสลิปการโอนเงิน");
			return;
		}
		setSubmitting(true);
		try {
			await createOrder({
				customerName: values.customerName,
				customerPhone: values.customerPhone,
				deliveryType,
				address: values.address ?? "",
				slipUrl: await fileToDataUrl(slip),
				items: items.map((item) => ({
					productId: item.id,
					quantity: item.quantity
				}))
			});
			toast.success("ส่งคำสั่งซื้อและสลิปให้เจ้าหน้าที่ตรวจสอบแล้ว");
			setStep(3);
			clearCart();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "ไม่สามารถส่งคำสั่งซื้อได้");
		} finally {
			setSubmitting(false);
		}
	};
	const close = () => {
		onClose();
		setStep(1);
		setSlip(null);
		setErrors({});
	};
	if (items.length === 0 && step === 1) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open: isOpen,
		onOpenChange: (open) => !open && close(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "sm:max-w-[500px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
					className: "text-xl text-[#002D62]",
					children: step === 1 ? "ข้อมูลจัดส่ง" : step === 2 ? "ชำระเงิน" : "ส่งคำสั่งซื้อสำเร็จ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, { children: step === 1 ? "กรุณากรอกข้อมูลสำหรับการรับสินค้า" : step === 2 ? "สแกน QR Code และแนบสลิปเพื่อส่งตรวจสอบ" : "เจ้าหน้าที่จะตรวจสอบยอดชำระและยืนยันการจัดส่ง" })] }),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleNext,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ตัวเลือกการรับสินค้า" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
								value: deliveryType,
								onValueChange: (value) => {
									const next = value;
									setDeliveryType(next);
									update("deliveryType", next);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center space-x-2 rounded-lg border p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
										value: "pickup",
										id: "pickup"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pickup",
										children: "รับด้วยตนเองที่ศูนย์วิจัยลำปาง (ฟรี)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center space-x-2 rounded-lg border p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
										value: "delivery",
										id: "delivery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "delivery",
										children: "จัดส่งในพื้นที่ (+฿50)"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "ชื่อ-นามสกุล"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										value: values["customerName"],
										onChange: (event) => update("customerName", event.target.value),
										autoComplete: "name"
									}),
									errors["customerName"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-red-600",
										children: errors["customerName"]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "phone",
										children: "เบอร์โทรศัพท์"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "phone",
										value: values["customerPhone"],
										onChange: (event) => update("customerPhone", event.target.value),
										autoComplete: "tel"
									}),
									errors["customerPhone"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-red-600",
										children: errors["customerPhone"]
									})
								]
							})]
						}),
						deliveryType === "delivery" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "address",
									children: "ที่อยู่จัดส่ง"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "address",
									value: values["address"],
									onChange: (event) => update("address", event.target.value)
								}),
								errors["address"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-red-600",
									children: errors["address"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Summary, {
							subtotal: totalPrice,
							shipping: deliveryFee,
							tax,
							total: finalTotal
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: close,
								children: "ยกเลิก"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "bg-[#002D62] text-white hover:bg-[#002D62]/90",
								children: "ดำเนินการชำระเงิน"
							})]
						})
					]
				}),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center space-y-5 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-3xl font-bold text-[#2E7D32]",
							children: ["฿", finalTotal.toFixed(2)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: qrUrl,
							alt: "PromptPay QR สำหรับยอดชำระ",
							className: "h-48 w-48 rounded-lg border object-contain",
							onError: (event) => {
								event.currentTarget.style.display = "none";
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-xs text-slate-500",
							children: "PromptPay: 081-234-5678 • กรุณาตรวจสอบชื่อบัญชีก่อนโอน"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: "slip",
							className: "flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-6 w-6 text-slate-400" }),
								slip ? `แนบไฟล์แล้ว: ${slip.name}` : "เลือกไฟล์สลิป (สูงสุด 2 MB)",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "slip",
									type: "file",
									accept: "image/jpeg,image/png,image/webp",
									className: "hidden",
									onChange: (event) => handleSlip(event.target.files?.[0])
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setStep(1),
								children: "ย้อนกลับ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => void handleSubmitOrder(),
								disabled: submitting,
								className: "bg-[#2E7D32] text-white hover:bg-[#2E7D32]/90",
								children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "ส่งตรวจสอบสลิป"]
							})]
						})
					]
				}),
				step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center space-y-4 py-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-16 w-16 text-[#2E7D32]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-semibold text-[#002D62]",
							children: "สั่งซื้อสำเร็จ!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-slate-500",
							children: [
								"ได้รับคำสั่งซื้อและสลิปแล้ว",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยัน"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: close,
							className: "bg-[#002D62] text-white",
							children: "ปิด"
						})
					]
				})
			]
		})
	});
}
function Summary({ subtotal, shipping, tax, total }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 border-t pt-4 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ค่าสินค้า" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["฿", subtotal.toFixed(2)] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ค่าจัดส่ง" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["฿", shipping.toFixed(2)] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ภาษี" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["฿", tax.toFixed(2)] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between text-lg font-bold text-[#2E7D32]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ยอดสุทธิ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["฿", total.toFixed(2)] })]
			})
		]
	});
}
var CartDrawer = () => {
	const { items, updateQuantity, removeItem, totalPrice, isCartOpen, setIsCartOpen, isRevalidating } = useCart();
	const [isCheckoutOpen, setIsCheckoutOpen] = (0, import_react.useState)(false);
	const handleCheckout = () => {
		setIsCartOpen(false);
		setIsCheckoutOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: isCartOpen,
		onOpenChange: setIsCartOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "flex flex-col w-full sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
					className: "text-xl flex items-center gap-2 text-[#002D62]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "w-5 h-5" }), "ตะกร้าสินค้า"]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto py-6",
					children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center h-full text-gray-500 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "w-12 h-12 opacity-20" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ตะกร้าสินค้าว่างเปล่า" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setIsCartOpen(false),
								children: "เลือกซื้อสินค้าต่อ"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4 p-3 bg-gray-50 rounded-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.image,
								alt: item.name,
								className: "w-20 h-20 object-cover rounded-md",
								onError: (event) => {
									event.currentTarget.src = "/mahidol-logo.png";
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-medium text-sm line-clamp-2",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-gray-500",
									children: [
										"฿",
										item.price,
										"/",
										item.unit
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center bg-white border rounded-md",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "p-1 hover:bg-gray-100 rounded-l-md",
												"aria-label": `ลดจำนวน ${item.name}`,
												onClick: () => updateQuantity(item.id, item.quantity - 1),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "w-4 h-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-8 text-center text-sm",
												children: item.quantity
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "p-1 hover:bg-gray-100 rounded-r-md",
												"aria-label": `เพิ่มจำนวน ${item.name}`,
												onClick: () => updateQuantity(item.id, item.quantity + 1),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeItem(item.id),
										className: "text-red-500 p-1 hover:bg-red-50 rounded-md transition-colors",
										"aria-label": `ลบ ${item.name} ออกจากตะกร้า`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})]
								})]
							})]
						}, item.id))
					})
				}),
				items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t pt-4 mt-auto",
					children: [
						isRevalidating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "status",
							className: "mb-2 text-xs text-slate-500",
							children: "กำลังตรวจสอบ stock ล่าสุด…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center mb-4 text-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "ยอดรวม"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-[#2E7D32]",
								children: ["฿", totalPrice]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full bg-[#F2A900] hover:bg-[#F2A900]/90 text-[#002D62] font-semibold text-lg py-6",
							onClick: handleCheckout,
							children: "ดำเนินการชำระเงิน"
						})
					]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutModal, {
		isOpen: isCheckoutOpen,
		onClose: () => setIsCheckoutOpen(false)
	})] });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open: product !== null,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent$1, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-3xl",
			children: product && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle$1, {
					className: "flex items-center gap-2 text-[#002D62]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map$1, { className: "h-5 w-5" }),
						" วิเคราะห์แปลง ",
						product.plotId
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription$1, { children: [
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map$1, { className: "mx-auto mb-2 h-8 w-8 text-[#F2A900]" }),
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
//#endregion
export { StorefrontWidget as t };
