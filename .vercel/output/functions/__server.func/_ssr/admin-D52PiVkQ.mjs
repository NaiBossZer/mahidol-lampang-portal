import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BiHV7YXM.mjs";
import { R as Calendar, g as Package, h as Plus, j as CircleCheck, k as CircleX, l as ShoppingCart, o as Trash2, s as SquarePen, w as Eye } from "../_libs/lucide-react.mjs";
import { u as format } from "../_libs/date-fns.mjs";
import { C as updateOrderStatus, S as getProducts, a as CardDescription, b as deleteProduct, c as CardTitle, d as DialogDescription, f as DialogFooter, g as Label, h as Input, i as CardContent, l as Dialog, m as DialogTitle, n as Calendar$1, p as DialogHeader, r as Card, s as CardHeader, t as Badge, u as DialogContent, w as updateProduct, x as getAdminOrders, y as createProduct } from "./api-Ci-ZTcpM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-D52PiVkQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
var MOCK_PRODUCTS = [
	{
		id: "p1",
		name: "ผักสลัดกรีนโอ๊ค",
		price: 50,
		stock: 15,
		unit: "กก.",
		plot: "P-01 (รอบที่ 3)",
		harvestDate: "2026-08-31",
		shelfLife: "7 วัน",
		image: "https://images.unsplash.com/photo-1640958904159-51ae08bc3412?w=150"
	},
	{
		id: "p2",
		name: "มะเขือเทศราชินี",
		price: 80,
		stock: 0,
		unit: "กก.",
		plot: "T-02 (อินทรีย์)",
		harvestDate: "2026-09-05",
		shelfLife: "14 วัน",
		image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150"
	},
	{
		id: "p3",
		name: "เมล่อนสายพันธุ์ใหม่",
		price: 150,
		stock: 5,
		unit: "ลูก",
		plot: "M-01 (วิจัย)",
		harvestDate: "2026-09-10",
		shelfLife: "10 วัน",
		image: "https://images.unsplash.com/photo-1595475207225-428b62bda831?w=150"
	}
];
var MOCK_ORDERS = [
	{
		id: "ORD-001",
		customerName: "สมชาย ใจดี",
		date: "2026-08-30T10:30:00",
		total: 250,
		status: "pending_payment",
		slipImage: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=300",
		items: [{
			name: "ผักสลัดกรีนโอ๊ค",
			qty: 2
		}, {
			name: "เมล่อนสายพันธุ์ใหม่",
			qty: 1
		}]
	},
	{
		id: "ORD-002",
		customerName: "สมหญิง งามตา",
		date: "2026-08-30T09:15:00",
		total: 80,
		status: "preparing",
		items: [{
			name: "มะเขือเทศราชินี",
			qty: 1
		}]
	},
	{
		id: "ORD-003",
		customerName: "วิชัย มั่นคง",
		date: "2026-08-29T15:40:00",
		total: 150,
		status: "ready",
		items: [{
			name: "ผักสลัดกรีนโอ๊ค",
			qty: 3
		}]
	}
];
var getStatusBadge = (status) => {
	switch (status) {
		case "pending_payment": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "outline",
			className: "bg-yellow-50 text-yellow-700 border-yellow-200",
			children: "รอตรวจสอบชำระเงิน"
		});
		case "preparing": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "outline",
			className: "bg-blue-50 text-blue-700 border-blue-200",
			children: "กำลังเตรียมสินค้า"
		});
		case "ready": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "outline",
			className: "bg-purple-50 text-purple-700 border-purple-200",
			children: "พร้อมรับ/จัดส่ง"
		});
		case "completed": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "outline",
			className: "bg-green-50 text-green-700 border-green-200",
			children: "สำเร็จ"
		});
		case "cancelled": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "outline",
			className: "bg-red-50 text-red-700 border-red-200",
			children: "ยกเลิก"
		});
	}
};
var AdminDashboard = () => {
	const [products, setProducts] = (0, import_react.useState)(MOCK_PRODUCTS);
	const [orders, setOrders] = (0, import_react.useState)(MOCK_ORDERS);
	const [isProductModalOpen, setIsProductModalOpen] = (0, import_react.useState)(false);
	const [editingProduct, setEditingProduct] = (0, import_react.useState)(null);
	const [isSlipModalOpen, setIsSlipModalOpen] = (0, import_react.useState)(false);
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const [date, setDate] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		Promise.all([getProducts(), getAdminOrders()]).then(([liveProducts, liveOrders]) => {
			if (liveProducts.length > 0) setProducts(liveProducts.map((product) => ({
				id: product.id,
				name: product.name,
				price: product.price,
				stock: product.stock,
				unit: product.unit,
				plot: product.plotId,
				harvestDate: product.harvestDate ?? product.harvestPrediction.estimatedDate,
				shelfLife: "-",
				image: product.image
			})));
			if (liveOrders.length > 0) setOrders(liveOrders.map((order) => ({
				id: order.id,
				customerName: order.customerName,
				date: order.createdAt,
				total: Number(order.totalAmount),
				status: order.status === "pending" ? "pending_payment" : order.status === "paid" ? "preparing" : order.status === "fulfilled" ? "completed" : "cancelled",
				items: [],
				...order.slipUrl ? { slipImage: order.slipUrl } : {}
			})));
		});
	}, []);
	const handleSaveProduct = async (e) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const input = {
			name: String(form.get("name") ?? "").trim(),
			image: String(form.get("image") ?? "").trim(),
			price: Number(form.get("price")),
			stock: Number(form.get("stock")),
			unit: String(form.get("unit") ?? "กก.").trim(),
			plotId: String(form.get("plot") ?? "").trim(),
			harvestDate: String(form.get("harvestDate") ?? ""),
			...editingProduct ? { id: editingProduct.id } : {}
		};
		if (!input.name || !Number.isFinite(input.price) || input.price < 0 || !Number.isInteger(input.stock) || input.stock < 0 || !input.unit) {
			toast.error("กรุณาตรวจสอบข้อมูลสินค้า");
			return;
		}
		try {
			if (editingProduct) await updateProduct({
				...input,
				id: editingProduct.id
			});
			else await createProduct(input);
			toast.success("บันทึกสินค้าเข้าระบบแล้ว");
		} catch {
			toast.warning("API ยังไม่พร้อม จึงบันทึกเฉพาะในหน้าจอนี้");
		}
		const localProduct = {
			id: editingProduct?.id ?? crypto.randomUUID(),
			name: input.name,
			image: input.image ?? "/mahidol-logo.png",
			price: input.price,
			stock: input.stock,
			unit: input.unit,
			plot: input.plotId ?? "-",
			harvestDate: input.harvestDate ?? "",
			shelfLife: String(form.get("shelfLife") ?? "-")
		};
		setProducts((previous) => editingProduct ? previous.map((product) => product.id === editingProduct.id ? localProduct : product) : [...previous, localProduct]);
		setIsProductModalOpen(false);
		setEditingProduct(null);
	};
	const handleApproveSlip = async () => {
		if (selectedOrder) {
			try {
				await updateOrderStatus(selectedOrder.id, "paid");
				toast.success("อนุมัติการชำระเงินแล้ว");
			} catch {
				toast.warning("อัปเดต API ไม่สำเร็จ แต่ปรับสถานะในหน้าจอแล้ว");
			}
			setOrders((previous) => previous.map((o) => o.id === selectedOrder.id ? {
				...o,
				status: "preparing"
			} : o));
			setIsSlipModalOpen(false);
		}
	};
	const handleRejectSlip = async () => {
		if (selectedOrder) {
			try {
				await updateOrderStatus(selectedOrder.id, "cancelled");
				toast.success("ปฏิเสธสลิปแล้ว");
			} catch {
				toast.warning("อัปเดต API ไม่สำเร็จ แต่ปรับสถานะในหน้าจอแล้ว");
			}
			setOrders((previous) => previous.map((o) => o.id === selectedOrder.id ? {
				...o,
				status: "cancelled"
			} : o));
			setIsSlipModalOpen(false);
		}
	};
	const handleDeleteProduct = async (product) => {
		try {
			await deleteProduct(product.id);
			toast.success("ลบสินค้าแล้ว");
		} catch {
			toast.warning("API ยังไม่พร้อม จึงลบเฉพาะในหน้าจอนี้");
		}
		setProducts((previous) => previous.filter((item) => item.id !== product.id));
	};
	const harvestsOnDate = products.filter((p) => p.harvestDate === (date ? format(date, "yyyy-MM-dd") : ""));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-bold text-[#002D62]",
					children: "ระบบหลังบ้าน (Admin Dashboard)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-gray-500",
					children: "จัดการสินค้า คำสั่งซื้อ และคาดการณ์ผลผลิตของศูนย์วิจัย"
				}),
				products.filter((product) => product.stock < 10).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					role: "status",
					className: "mt-2 text-sm font-semibold text-red-600",
					children: [
						"แจ้งเตือน: มีสินค้า stock ต่ำกว่า 10 จำนวน",
						" ",
						products.filter((product) => product.stock < 10).length,
						" รายการ"
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "inventory",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "grid w-full md:w-[600px] grid-cols-3 mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "inventory",
								className: "data-[state=active]:bg-[#002D62] data-[state=active]:text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-4 h-4 mr-2" }), "สินค้าและผลผลิต"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "orders",
								className: "data-[state=active]:bg-[#002D62] data-[state=active]:text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "w-4 h-4 mr-2" }), "คำสั่งซื้อ"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "forecast",
								className: "data-[state=active]:bg-[#002D62] data-[state=active]:text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 mr-2" }), "ตารางเก็บเกี่ยว"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "inventory",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "จัดการสินค้าและรอบเก็บเกี่ยว" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "เพิ่ม ลบ แก้ไข ข้อมูลผลผลิตและสต็อก" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "bg-[#2E7D32] hover:bg-[#2E7D32]/90",
								onClick: () => {
									setEditingProduct(null);
									setIsProductModalOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), " เพิ่มผลผลิต"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "สินค้า" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "แปลง/รอบวิจัย" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "สต็อกคงเหลือ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "วันเก็บเกี่ยว" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "ราคา" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "จัดการ"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: product.image,
										alt: product.name,
										className: "w-10 h-10 rounded-md object-cover",
										onError: (event) => {
											event.currentTarget.src = "/mahidol-logo.png";
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: product.name
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: product.plot }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: product.stock > 0 ? "secondary" : "destructive",
									children: [
										product.stock,
										" ",
										product.unit
									]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: product.harvestDate }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
									"฿",
									product.price,
									"/",
									product.unit
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "text-right space-x-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "icon",
										onClick: () => {
											setEditingProduct(product);
											setIsProductModalOpen(true);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-4 h-4 text-blue-600" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "icon",
										onClick: () => void handleDeleteProduct(product),
										"aria-label": `ลบ ${product.name}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-red-600" })
									})]
								})
							] }, product.id)) })] })
						}) })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "orders",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "รายการคำสั่งซื้อล่าสุด" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "จัดการสถานะการสั่งซื้อและตรวจสอบสลิปโอนเงิน" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "รหัสสั่งซื้อ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "ลูกค้า" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "รายการสินค้า" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "ยอดรวม" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "สถานะ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "ตรวจสอบสลิป"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-medium",
									children: order.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: order.customerName }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm",
									children: order.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										item.name,
										" x",
										item.qty
									] }, i))
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "font-bold text-[#002D62]",
									children: ["฿", order.total]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: getStatusBadge(order.status) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right",
									children: order.status === "pending_payment" && order.slipImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "bg-[#F2A900] hover:bg-[#F2A900]/90 text-[#002D62]",
										onClick: () => {
											setSelectedOrder(order);
											setIsSlipModalOpen(true);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4 mr-1" }), " ดูสลิป"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										disabled: true,
										children: "ไม่มีสลิป"
									})
								})
							] }, order.id)) })] })
						}) })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "forecast",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "คาดการณ์ผลผลิต (Yield Forecast)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "ตรวจสอบรอบการเก็บเกี่ยวเพื่อเปิดระบบ Pre-Order" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex flex-col md:flex-row gap-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border rounded-md p-4 bg-white inline-block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, {
									mode: "single",
									selected: date,
									onSelect: setDate,
									className: "rounded-md border-0"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-semibold text-lg text-[#002D62]",
									children: ["ผลผลิตที่คาดว่าจะเก็บเกี่ยววันที่: ", date ? format(date, "dd MMM yyyy") : "-"]
								}), harvestsOnDate.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: harvestsOnDate.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4 p-4 border rounded-lg bg-green-50/50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: p.image,
												alt: p.name,
												className: "w-16 h-16 rounded-md object-cover"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
														className: "font-bold text-[#2E7D32]",
														children: p.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-sm text-gray-600",
														children: ["แปลงปลูก: ", p.plot]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-sm text-gray-600",
														children: [
															"ปริมาณคาดการณ์: ",
															p.stock,
															" ",
															p.unit
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												className: "border-[#002D62] text-[#002D62]",
												children: "เปิด Pre-Order"
											})
										]
									}, p.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center py-12 text-gray-400 border-2 border-dashed rounded-lg",
									children: "ไม่มีกำหนดเก็บเกี่ยวในวันนี้"
								})]
							})]
						})] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isProductModalOpen,
				onOpenChange: setIsProductModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[600px] max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingProduct ? "แก้ไขข้อมูลผลผลิต" : "เพิ่มผลผลิตใหม่" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "กรอกข้อมูลผลผลิต ข้อมูลงานวิจัย และวันที่เก็บเกี่ยว" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveProduct,
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ชื่อผลผลิต" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "name",
											defaultValue: editingProduct?.name,
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "URL รูปภาพ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "image",
											defaultValue: editingProduct?.image,
											placeholder: "https://...",
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ราคา (บาท)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "price",
											type: "number",
											min: "0",
											step: "0.01",
											defaultValue: editingProduct?.price,
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ปริมาณ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												name: "stock",
												type: "number",
												min: "0",
												defaultValue: editingProduct?.stock,
												required: true
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "หน่วย" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												name: "unit",
												defaultValue: editingProduct?.unit || "กก.",
												required: true
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-gray-50 p-4 rounded-lg space-y-4 border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-semibold text-sm text-[#002D62] flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4" }), " ฟิลด์พิเศษสำหรับงานวิจัย"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "แปลงปลูก / รอบการวิจัยที่" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "plot",
											defaultValue: editingProduct?.plot,
											placeholder: "เช่น P-01 (รอบที่ 3)",
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "วันที่เก็บเกี่ยว (Harvest Date)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												name: "harvestDate",
												type: "date",
												defaultValue: editingProduct?.harvestDate,
												required: true
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "อายุการเก็บรักษา (Shelf Life)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												name: "shelfLife",
												defaultValue: editingProduct?.shelfLife,
												placeholder: "เช่น 7 วัน",
												required: true
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsProductModalOpen(false),
									children: "ยกเลิก"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "bg-[#002D62] hover:bg-[#002D62]/90",
									children: "บันทึกข้อมูล"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isSlipModalOpen,
				onOpenChange: setIsSlipModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[450px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "ตรวจสอบการชำระเงิน" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["คำสั่งซื้อ: ", selectedOrder?.id] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center space-y-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-80 bg-gray-100 rounded-md border flex items-center justify-center overflow-hidden",
							children: selectedOrder?.slipImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: selectedOrder.slipImage,
								alt: "Slip",
								className: "object-contain w-full h-full"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gray-400",
								children: "ไม่พบรูปภาพสลิป"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full flex justify-between gap-4 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "w-full text-red-600 border-red-200 hover:bg-red-50",
								onClick: handleRejectSlip,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-4 h-4 mr-2" }), " ปฏิเสธ (ข้อมูลไม่ถูกต้อง)"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "w-full bg-[#2E7D32] hover:bg-[#2E7D32]/90",
								onClick: handleApproveSlip,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 mr-2" }), " อนุมัติ (รับยอดแล้ว)"]
							})]
						})]
					})]
				})
			})
		]
	});
};
function AdminPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-50 flex flex-col font-['Prompt']",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {})
	});
}
//#endregion
export { AdminPage as component };
