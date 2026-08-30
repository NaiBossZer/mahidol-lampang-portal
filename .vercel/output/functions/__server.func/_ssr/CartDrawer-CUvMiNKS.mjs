import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { A as Circle, N as CircleCheckBig, O as CloudUpload, a as Trash2, d as ShoppingBag, g as Plus, n as X, v as Minus, x as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as DialogHeader, c as Label, d as createOrder, h as getProducts, n as DialogContent$1, o as DialogTitle$1, r as DialogDescription$1, s as Input, t as Dialog$1 } from "./api-BXZgsq1G.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "../_libs/@radix-ui/react-radio-group+[...].mjs";
import { i as ZodIssueCode, n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CartDrawer-CUvMiNKS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CartContext = (0, import_react.createContext)(void 0);
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
function useCart() {
	const context = (0, import_react.useContext)(CartContext);
	if (!context) throw new Error("useCart must be used within a CartProvider");
	return context;
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
//#endregion
export { CartProvider as n, useCart as r, CartDrawer as t };
