import { useMemo, useState, type FormEvent } from "react";
import { format, startOfDay } from "date-fns";
import { th } from "date-fns/locale";
import { z } from "zod";
import { CalendarDays, CarFront, Leaf, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createEvBooking, type EvBookingInput } from "@/services/api";
import type { Product } from "./mockData";

const bookingSchema = z.object({
  customerName: z.string().trim().min(2, "กรุณาระบุชื่อผู้จอง").max(255),
  customerPhone: z
    .string()
    .trim()
    .regex(/^[0-9+ ()-]{8,20}$/, "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"),
  vehiclePlate: z.string().trim().min(2, "กรุณาระบุทะเบียนรถ").max(30),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "เวลาไม่ถูกต้อง"),
});

type ProductionEvCalendarProps = { products: Product[] };
type BookingValues = {
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  startTime: string;
};

export function ProductionEvCalendar({ products }: ProductionEvCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [bookingTab, setBookingTab] = useState<"harvest" | "ev">("harvest");
  const [values, setValues] = useState<BookingValues>({
    customerName: "",
    customerPhone: "",
    vehiclePlate: "",
    startTime: "09:00",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const harvests = useMemo(
    () =>
      products.filter(
        (product) =>
          (product.harvestDate ?? product.harvestPrediction.estimatedDate).slice(0, 10) ===
          selectedDateKey,
      ),
    [products, selectedDateKey],
  );

  const update = (key: keyof BookingValues, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));
  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const startAt = new Date(`${selectedDateKey}T${values.startTime}:00`);
    const endAt = new Date(startAt.getTime() + 60 * 60 * 1000);
    const input: EvBookingInput = {
      ...values,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    };
    try {
      const result = await createEvBooking(input);
      toast.success(
        result.persisted === "local"
          ? "บันทึกการจองไว้ในเครื่องแล้ว รอเชื่อมต่อระบบ"
          : "ส่งคำขอจอง EV แล้ว เจ้าหน้าที่จะยืนยันอีกครั้ง",
      );
      setValues({ customerName: "", customerPhone: "", vehiclePlate: "", startTime: "09:00" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ไม่สามารถจอง EV ได้");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-labelledby="production-ev-calendar-title"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2E7D32]">
            Connected Calendar
          </p>
          <h2 id="production-ev-calendar-title" className="mt-1 text-xl font-bold text-[#002D62]">
            ปฏิทินผลผลิตและการจอง EV
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            เลือกวันที่เพื่อดูรอบเก็บเกี่ยว หรือจองหัวชาร์จ EV ในวันเดียวกัน
          </p>
        </div>
        <div
          className="flex rounded-lg border border-slate-200 p-1"
          role="tablist"
          aria-label="ประเภทปฏิทิน"
        >
          <button
            type="button"
            role="tab"
            aria-selected={bookingTab === "harvest"}
            onClick={() => setBookingTab("harvest")}
            className={`rounded-md px-3 py-2 text-sm ${bookingTab === "harvest" ? "bg-[#2E7D32] text-white" : "text-slate-600"}`}
          >
            <Leaf className="mr-1 inline h-4 w-4" />
            ผลผลิต
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={bookingTab === "ev"}
            onClick={() => setBookingTab("ev")}
            className={`rounded-md px-3 py-2 text-sm ${bookingTab === "ev" ? "bg-[#002D62] text-white" : "text-slate-600"}`}
          >
            <Zap className="mr-1 inline h-4 w-4" />
            จอง EV
          </button>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[auto_1fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            disabled={{ before: startOfDay(new Date()) }}
            locale={th}
          />
        </div>
        {bookingTab === "harvest" ? (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
            <div className="flex items-center gap-2 text-[#2E7D32]">
              <CalendarDays className="h-5 w-5" />
              <h3 className="font-semibold">
                เก็บเกี่ยววันที่ {format(selectedDate, "d MMMM yyyy", { locale: th })}
              </h3>
            </div>
            {harvests.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {harvests.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-lg border border-emerald-100 bg-white p-3"
                  >
                    <p className="font-semibold text-[#002D62]">{product.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      แปลง {product.plotId} • ความมั่นใจ{" "}
                      {product.harvestPrediction.confidencePercent}%
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold text-[#2E7D32] underline"
                      onClick={() => setBookingTab("ev")}
                    >
                      จอง EV ในวันนี้
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">ยังไม่มีรายการเก็บเกี่ยวในวันนี้</p>
            )}
          </div>
        ) : (
          <form
            onSubmit={submitBooking}
            className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-5"
          >
            <div className="flex items-center gap-2 text-[#002D62]">
              <CarFront className="h-5 w-5" />
              <h3 className="font-semibold">จองหัวชาร์จ 1 ชั่วโมง</h3>
            </div>
            <p className="text-sm text-slate-500">
              วันที่เลือก: {format(selectedDate, "d MMMM yyyy", { locale: th })}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["customerName", "ชื่อผู้จอง", "ชื่อ-นามสกุล"],
                  ["customerPhone", "เบอร์โทรศัพท์", "08x-xxx-xxxx"],
                  ["vehiclePlate", "ทะเบียนรถ", "กข 1234"],
                  ["startTime", "เวลาเริ่มชาร์จ", "09:00"],
                ] as const
              ).map(([key, label, placeholder]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={`ev-${key}`}>{label}</Label>
                  <Input
                    id={`ev-${key}`}
                    type={key === "startTime" ? "time" : "text"}
                    value={values[key]}
                    placeholder={placeholder}
                    onChange={(event) => update(key, event.target.value)}
                  />
                  {errors[key] && (
                    <p className="text-xs text-red-600" role="alert">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#002D62] text-white hover:bg-[#002D62]/90"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}ส่งคำขอจอง EV
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
