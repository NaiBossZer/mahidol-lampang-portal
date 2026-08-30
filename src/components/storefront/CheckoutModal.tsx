import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useCart } from "./useCart";
import { createOrder } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";

const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(2, "กรุณาระบุชื่อ-นามสกุล").max(255),
    customerPhone: z
      .string()
      .trim()
      .regex(/^[0-9+ ()-]{8,20}$/, "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"),
    deliveryType: z.enum(["pickup", "delivery"]),
    address: z.string().trim().max(500).optional(),
  })
  .superRefine((value, context) => {
    if (value.deliveryType === "delivery" && (!value.address || value.address.length < 10))
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "กรุณาระบุที่อยู่จัดส่งอย่างน้อย 10 ตัวอักษร",
      });
  });

type CheckoutModalProps = { isOpen: boolean; onClose: () => void };
type FormValues = z.infer<typeof checkoutSchema>;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
    reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
    reader.readAsDataURL(file);
  });
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = useState<FormValues["deliveryType"]>("pickup");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [values, setValues] = useState<FormValues>({
    customerName: "",
    customerPhone: "",
    deliveryType: "pickup",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slip, setSlip] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const deliveryFee = deliveryType === "delivery" ? 50 : 0;
  const tax = 0;
  const finalTotal = totalPrice + deliveryFee + tax;
  const qrUrl = useMemo(
    () => `https://promptpay.io/0812345678/${finalTotal.toFixed(2)}.png`,
    [finalTotal],
  );

  const update = (key: keyof FormValues, value: string) =>
    setValues((current) => ({
      ...current,
      [key]: value,
      ...(key === "deliveryType" ? { deliveryType: value as FormValues["deliveryType"] } : {}),
    }));
  const validate = () => {
    const result = checkoutSchema.safeParse({ ...values, deliveryType });
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const key = String(issue.path[0] ?? "form");
      if (!next[key]) next[key] = issue.message;
    });
    setErrors(next);
    return false;
  };

  const handleNext = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) setStep(2);
  };
  const handleSlip = (file: File | undefined) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2_000_000) {
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
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#002D62]">
            {step === 1 ? "ข้อมูลจัดส่ง" : step === 2 ? "ชำระเงิน" : "ส่งคำสั่งซื้อสำเร็จ"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "กรุณากรอกข้อมูลสำหรับการรับสินค้า"
              : step === 2
                ? "สแกน QR Code และแนบสลิปเพื่อส่งตรวจสอบ"
                : "เจ้าหน้าที่จะตรวจสอบยอดชำระและยืนยันการจัดส่ง"}
          </DialogDescription>
        </DialogHeader>
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="space-y-2">
              <Label>ตัวเลือกการรับสินค้า</Label>
              <RadioGroup
                value={deliveryType}
                onValueChange={(value) => {
                  const next = value as FormValues["deliveryType"];
                  setDeliveryType(next);
                  update("deliveryType", next);
                }}
              >
                <div className="flex items-center space-x-2 rounded-lg border p-3">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">รับด้วยตนเองที่ศูนย์วิจัยลำปาง (ฟรี)</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-3">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">จัดส่งในพื้นที่ (+฿50)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input
                  id="name"
                  value={values["customerName"]}
                  onChange={(event) => update("customerName", event.target.value)}
                  autoComplete="name"
                />
                {errors["customerName"] && (
                  <p className="text-xs text-red-600">{errors["customerName"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  value={values["customerPhone"]}
                  onChange={(event) => update("customerPhone", event.target.value)}
                  autoComplete="tel"
                />
                {errors["customerPhone"] && (
                  <p className="text-xs text-red-600">{errors["customerPhone"]}</p>
                )}
              </div>
            </div>
            {deliveryType === "delivery" && (
              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่จัดส่ง</Label>
                <Textarea
                  id="address"
                  value={values["address"]}
                  onChange={(event) => update("address", event.target.value)}
                />
                {errors["address"] && <p className="text-xs text-red-600">{errors["address"]}</p>}
              </div>
            )}
            <Summary subtotal={totalPrice} shipping={deliveryFee} tax={tax} total={finalTotal} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={close}>
                ยกเลิก
              </Button>
              <Button type="submit" className="bg-[#002D62] text-white hover:bg-[#002D62]/90">
                ดำเนินการชำระเงิน
              </Button>
            </div>
          </form>
        )}
        {step === 2 && (
          <div className="flex flex-col items-center space-y-5 py-3">
            <p className="text-3xl font-bold text-[#2E7D32]">฿{finalTotal.toFixed(2)}</p>
            <img
              src={qrUrl}
              alt="PromptPay QR สำหรับยอดชำระ"
              className="h-48 w-48 rounded-lg border object-contain"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <p className="text-center text-xs text-slate-500">
              PromptPay: 081-234-5678 • กรุณาตรวจสอบชื่อบัญชีก่อนโอน
            </p>
            <Label
              htmlFor="slip"
              className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-5 text-sm"
            >
              <UploadCloud className="h-6 w-6 text-slate-400" />
              {slip ? `แนบไฟล์แล้ว: ${slip.name}` : "เลือกไฟล์สลิป (สูงสุด 2 MB)"}
              <Input
                id="slip"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => handleSlip(event.target.files?.[0])}
              />
            </Label>
            <div className="flex w-full justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                ย้อนกลับ
              </Button>
              <Button
                onClick={() => void handleSubmitOrder()}
                disabled={submitting}
                className="bg-[#2E7D32] text-white hover:bg-[#2E7D32]/90"
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}ส่งตรวจสอบสลิป
              </Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center space-y-4 py-10">
            <CheckCircle className="h-16 w-16 text-[#2E7D32]" />
            <h3 className="text-xl font-semibold text-[#002D62]">สั่งซื้อสำเร็จ!</h3>
            <p className="text-center text-slate-500">
              ได้รับคำสั่งซื้อและสลิปแล้ว
              <br />
              เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยัน
            </p>
            <Button onClick={close} className="bg-[#002D62] text-white">
              ปิด
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Summary({
  subtotal,
  shipping,
  tax,
  total,
}: {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  return (
    <div className="space-y-2 border-t pt-4 text-sm">
      <div className="flex justify-between">
        <span>ค่าสินค้า</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>ค่าจัดส่ง</span>
        <span>฿{shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>ภาษี</span>
        <span>฿{tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-lg font-bold text-[#2E7D32]">
        <span>ยอดสุทธิ</span>
        <span>฿{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
