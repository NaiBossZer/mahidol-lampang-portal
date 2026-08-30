import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as buttonVariants, r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { F as ChevronDown, N as ChevronRight, P as ChevronLeft, n as X } from "../_libs/lucide-react.mjs";
import { n as getDefaultClassNames, t as DayPicker } from "../_libs/react-day-picker.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-Ci-ZTcpM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function Calendar$1({ className, classNames, showOutsideDays = true, captionLayout = "label", buttonVariant = "ghost", formatters, components, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, {
		showOutsideDays,
		className: cn("bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className),
		captionLayout,
		formatters: {
			formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
			...formatters
		},
		classNames: {
			root: cn("w-fit", defaultClassNames.root),
			months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
			month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
			nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
			button_previous: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_previous),
			button_next: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_next),
			month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
			dropdowns: cn("flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
			dropdown_root: cn("has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border", defaultClassNames.dropdown_root),
			dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
			caption_label: cn("select-none font-medium", captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5", defaultClassNames.caption_label),
			table: "w-full border-collapse",
			weekdays: cn("flex", defaultClassNames.weekdays),
			weekday: cn("text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal", defaultClassNames.weekday),
			week: cn("mt-2 flex w-full", defaultClassNames.week),
			week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
			week_number: cn("text-muted-foreground select-none text-[0.8rem]", defaultClassNames.week_number),
			day: cn("group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md", defaultClassNames.day),
			range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
			range_middle: cn("rounded-none", defaultClassNames.range_middle),
			range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
			today: cn("bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none", defaultClassNames.today),
			outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
			disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
			hidden: cn("invisible", defaultClassNames.hidden),
			...classNames
		},
		components: {
			Root: ({ className, rootRef, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-slot": "calendar",
					ref: rootRef,
					className: cn(className),
					...props
				});
			},
			Chevron: ({ className, orientation, ...props }) => {
				if (orientation === "left") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: cn("size-4", className),
					...props
				});
				if (orientation === "right") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: cn("size-4", className),
					...props
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: cn("size-4", className),
					...props
				});
			},
			DayButton: CalendarDayButton,
			WeekNumber: ({ children, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					...props,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-(--cell-size) items-center justify-center text-center",
						children
					})
				});
			},
			...components
		},
		...props
	});
}
function CalendarDayButton({ className, day, modifiers, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (modifiers["focused"]) ref.current?.focus();
	}, [modifiers]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		ref,
		variant: "ghost",
		size: "icon",
		"data-day": day.date.toLocaleDateString(),
		"data-selected-single": modifiers["selected"] && !modifiers["range_start"] && !modifiers["range_end"] && !modifiers["range_middle"],
		"data-range-start": modifiers["range_start"],
		"data-range-end": modifiers["range_end"],
		"data-range-middle": modifiers["range_middle"],
		className: cn("data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className),
		...props
	});
}
var createTrend = (sensor) => Array.from({ length: 6 }, (_, index) => ({
	...sensor,
	temperatureC: Number((sensor.temperatureC - (5 - index) * .2).toFixed(1)),
	humidityPercent: Math.max(0, sensor.humidityPercent - (5 - index) * 1.2),
	soilMoisturePercent: Math.max(0, sensor.soilMoisturePercent - (5 - index) * 1.5),
	lightLux: Math.max(0, sensor.lightLux - (5 - index) * 110),
	label: `${index + 1} ชม.ก่อน`
}));
var monitored = (sensor, prediction, plotStatus) => ({
	plotId: "",
	sensorData: sensor,
	harvestPrediction: prediction,
	plotStatus,
	sensorTrend: createTrend(sensor),
	qualityCertificates: ["GAP", "ตรวจสารตกค้างแล้ว"]
});
var MOCK_PRODUCTS = [
	{
		id: "p1",
		name: "ผักสลัดกรีนโอ๊ค (Green Oak)",
		image: "https://images.unsplash.com/photo-1640958904159-51ae08bc3412?auto=format&fit=crop&q=80&w=400&h=300",
		standards: ["GAP", "งานวิจัย"],
		price: 50,
		unit: "กก.",
		stock: 15,
		isPreOrder: false,
		...monitored({
			temperatureC: 25.8,
			humidityPercent: 68,
			soilMoisturePercent: 61,
			lightLux: 18400,
			recordedAt: "2026-08-30T09:45:00+07:00"
		}, {
			estimatedDate: "2026-09-02",
			confidencePercent: 94,
			qualityScore: 4.7
		}, "ready"),
		plotId: "P-01"
	},
	{
		id: "p2",
		name: "มะเขือเทศราชินี",
		image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400&h=300",
		standards: ["Organic 100%"],
		price: 80,
		unit: "กก.",
		stock: 0,
		isPreOrder: true,
		harvestDate: "2026-09-05",
		...monitored({
			temperatureC: 26.4,
			humidityPercent: 72,
			soilMoisturePercent: 66,
			lightLux: 16200,
			recordedAt: "2026-08-30T09:43:00+07:00"
		}, {
			estimatedDate: "2026-09-05",
			confidencePercent: 88,
			qualityScore: 4.5
		}, "normal"),
		plotId: "T-02"
	},
	{
		id: "p3",
		name: "เมล่อนสายพันธุ์ใหม่ (วิจัย)",
		image: "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&q=80&w=400&h=300",
		standards: ["GAP", "งานวิจัย"],
		price: 150,
		unit: "ลูก",
		stock: 5,
		isPreOrder: false,
		...monitored({
			temperatureC: 29.1,
			humidityPercent: 55,
			soilMoisturePercent: 31,
			lightLux: 24100,
			recordedAt: "2026-08-30T09:41:00+07:00"
		}, {
			estimatedDate: "2026-09-10",
			confidencePercent: 81,
			qualityScore: 4.2
		}, "attention"),
		plotId: "M-01"
	},
	{
		id: "p4",
		name: "ฟักทองบัตเตอร์นัท",
		image: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&q=80&w=400&h=300",
		standards: ["Organic 100%"],
		price: 60,
		unit: "กก.",
		stock: 20,
		isPreOrder: false,
		...monitored({
			temperatureC: 27.1,
			humidityPercent: 64,
			soilMoisturePercent: 58,
			lightLux: 20500,
			recordedAt: "2026-08-30T09:40:00+07:00"
		}, {
			estimatedDate: "2026-09-04",
			confidencePercent: 91,
			qualityScore: 4.6
		}, "normal"),
		plotId: "B-03"
	},
	{
		id: "p5",
		name: "ผักกาดขาวปลอดสารพิษ",
		image: "https://images.unsplash.com/photo-1580738204555-8686f3a2db43?auto=format&fit=crop&q=80&w=400&h=300",
		standards: ["GAP", "Organic 100%"],
		price: 45,
		unit: "กก.",
		stock: 25,
		isPreOrder: false,
		...monitored({
			temperatureC: 26.2,
			humidityPercent: 70,
			soilMoisturePercent: 63,
			lightLux: 17600,
			recordedAt: "2026-08-30T09:38:00+07:00"
		}, {
			estimatedDate: "2026-09-06",
			confidencePercent: 92,
			qualityScore: 4.8
		}, "ready"),
		plotId: "C-01"
	},
	{
		id: "p6",
		name: "แครอทสีม่วง (วิจัย)",
		image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400&h=300",
		standards: ["งานวิจัย", "GAP"],
		price: 70,
		unit: "กก.",
		stock: 8,
		isPreOrder: false,
		...monitored({
			temperatureC: 25.4,
			humidityPercent: 67,
			soilMoisturePercent: 59,
			lightLux: 19300,
			recordedAt: "2026-08-30T09:36:00+07:00"
		}, {
			estimatedDate: "2026-09-08",
			confidencePercent: 86,
			qualityScore: 4.4
		}, "normal"),
		plotId: "C-02"
	},
	{
		id: "p7",
		name: "ผักโขมเย็นจากแปลงเกษตรอัจฉริยะ",
		image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400&h=300",
		standards: ["GAP", "งานวิจัย"],
		price: 55,
		unit: "กก.",
		stock: 12,
		isPreOrder: false,
		...monitored({
			temperatureC: 26.9,
			humidityPercent: 61,
			soilMoisturePercent: 48,
			lightLux: 22100,
			recordedAt: "2026-08-30T09:34:00+07:00"
		}, {
			estimatedDate: "2026-09-09",
			confidencePercent: 84,
			qualityScore: 4.3
		}, "normal"),
		plotId: "S-01"
	},
	{
		id: "p8",
		name: "สตรอว์เบอร์รีแปลงวิจัย",
		image: "https://images.unsplash.com/photo-1464965911861-746a04b4b9ae?auto=format&fit=crop&q=80&w=400&h=300",
		standards: ["งานวิจัย", "GAP"],
		price: 200,
		unit: "กก.",
		stock: 0,
		isPreOrder: true,
		harvestDate: "2026-09-10",
		...monitored({
			temperatureC: 27.8,
			humidityPercent: 74,
			soilMoisturePercent: 69,
			lightLux: 15800,
			recordedAt: "2026-08-30T09:32:00+07:00"
		}, {
			estimatedDate: "2026-09-10",
			confidencePercent: 89,
			qualityScore: 4.6
		}, "normal"),
		plotId: "F-02"
	}
];
var ApiError = class extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
};
async function request(url, init) {
	let response;
	try {
		response = await fetch(url, {
			...init,
			headers: {
				"Content-Type": "application/json",
				...init?.headers
			}
		});
	} catch {
		throw new ApiError("ไม่สามารถเชื่อมต่อบริการได้", 0);
	}
	const payload = await response.json().catch(() => null);
	if (!response.ok) throw new ApiError(isRecord(payload) && typeof payload["error"] === "string" ? payload["error"] : "คำขอไม่สำเร็จ", response.status);
	if (!isRecord(payload) || payload["data"] === void 0) return payload;
	return payload["data"];
}
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
function mapApiProduct(product) {
	const fallback = MOCK_PRODUCTS.find((item) => item.id === product.id) ?? MOCK_PRODUCTS[0];
	if (!fallback) throw new ApiError("ไม่พบข้อมูลสินค้าเริ่มต้น", 500);
	const mapped = {
		...fallback,
		id: product.id,
		name: product.name,
		price: Number(product.price),
		unit: product.unit,
		stock: product.stockQuantity,
		image: product.imageUrl ?? fallback.image,
		isPreOrder: product.isPreorder
	};
	if (product.harvestDate) mapped.harvestDate = product.harvestDate;
	return mapped;
}
async function getProducts() {
	try {
		const data = await request("/api/products");
		if (!Array.isArray(data)) throw new ApiError("รูปแบบข้อมูลสินค้าไม่ถูกต้อง", 500);
		return data.filter(isApiProduct).map(mapApiProduct);
	} catch {
		return MOCK_PRODUCTS;
	}
}
function isApiProduct(value) {
	if (!isRecord(value)) return false;
	return typeof value["id"] === "string" && typeof value["name"] === "string" && (typeof value["price"] === "number" || typeof value["price"] === "string") && typeof value["unit"] === "string" && typeof value["stockQuantity"] === "number" && typeof value["isPreorder"] === "boolean";
}
async function createOrder(input) {
	return request("/api/orders", {
		method: "POST",
		body: JSON.stringify(input)
	});
}
async function updateOrderStatus(orderId, status) {
	return request(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
		method: "PATCH",
		body: JSON.stringify({ status })
	});
}
async function getAdminOrders() {
	try {
		const data = await request("/api/admin/orders");
		return Array.isArray(data) ? data.filter(isAdminOrder) : [];
	} catch {
		return [];
	}
}
function isAdminOrder(value) {
	if (!isRecord(value)) return false;
	return typeof value["id"] === "string" && typeof value["customerName"] === "string" && typeof value["createdAt"] === "string" && (typeof value["totalAmount"] === "string" || typeof value["totalAmount"] === "number") && [
		"pending",
		"paid",
		"fulfilled",
		"cancelled"
	].includes(String(value["status"]));
}
async function createProduct(product) {
	return request("/api/products", {
		method: "POST",
		body: JSON.stringify({
			...product,
			stockQuantity: product.stock,
			imageUrl: product.image,
			isPreorder: product.isPreOrder,
			researchTag: product.plotId
		})
	});
}
async function updateProduct(product) {
	return request(`/api/products/${encodeURIComponent(product.id)}`, {
		method: "PUT",
		body: JSON.stringify({
			...product,
			stockQuantity: product.stock,
			imageUrl: product.image,
			isPreorder: product.isPreOrder,
			researchTag: product.plotId
		})
	});
}
async function deleteProduct(productId) {
	await request(`/api/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
}
async function createEvBooking(input) {
	try {
		const data = await request("/api/ev-bookings", {
			method: "POST",
			body: JSON.stringify(input)
		});
		if (!data.id) throw new ApiError("ข้อมูลการจองจากระบบไม่ถูกต้อง", 500);
		return {
			id: data.id,
			persisted: "api"
		};
	} catch (error) {
		if (!(error instanceof ApiError) || error.status !== 0 && error.status !== 404 && error.status < 500) throw error;
		const id = crypto.randomUUID();
		const pending = JSON.parse(localStorage.getItem("mahidol-lampang-ev-bookings-v1") ?? "[]");
		const bookings = Array.isArray(pending) ? pending : [];
		localStorage.setItem("mahidol-lampang-ev-bookings-v1", JSON.stringify([...bookings, {
			...input,
			id,
			status: "pending"
		}]));
		return {
			id,
			persisted: "local"
		};
	}
}
//#endregion
export { updateOrderStatus as C, getProducts as S, createEvBooking as _, CardDescription as a, deleteProduct as b, CardTitle as c, DialogDescription as d, DialogFooter as f, Label as g, Input as h, CardContent as i, Dialog as l, DialogTitle as m, Calendar$1 as n, CardFooter as o, DialogHeader as p, Card as r, CardHeader as s, Badge as t, DialogContent as u, createOrder as v, updateProduct as w, getAdminOrders as x, createProduct as y };
