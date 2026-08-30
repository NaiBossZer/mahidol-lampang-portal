import { createFileRoute } from "@tanstack/react-router";
import { and, gt, lt, ne } from "drizzle-orm";
import { getDb } from "../../db";
import { evBookings } from "../../db/schema";

type EvBookingInput = {
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  startAt: string;
  endAt: string;
};

const DEFAULT_CHARGER_COUNT = 2;

export const Route = createFileRoute("/api/ev-bookings")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body: unknown = await request.json().catch(() => null);
          if (!isBookingInput(body)) {
            return Response.json(
              { success: false, error: "ข้อมูลการจองไม่ถูกต้อง" },
              { status: 400 },
            );
          }
          const startAt = new Date(body.startAt);
          const endAt = new Date(body.endAt);
          const duration = endAt.getTime() - startAt.getTime();
          if (
            !Number.isFinite(startAt.getTime()) ||
            !Number.isFinite(endAt.getTime()) ||
            startAt.getTime() < Date.now() + 10 * 60 * 1000 ||
            duration < 30 * 60 * 1000 ||
            duration > 4 * 60 * 60 * 1000
          ) {
            return Response.json(
              { success: false, error: "ช่วงเวลาจองไม่ถูกต้อง" },
              { status: 400 },
            );
          }

          const chargerCount = readChargerCount();
          const booking = await getDb().transaction(async (tx) => {
            const conflicts = await tx
              .select({ id: evBookings.id })
              .from(evBookings)
              .where(
                and(
                  ne(evBookings.status, "cancelled"),
                  lt(evBookings.startAt, endAt),
                  gt(evBookings.endAt, startAt),
                ),
              );
            if (conflicts.length >= chargerCount) throw new Error("EV_SLOT_FULL");
            const [created] = await tx
              .insert(evBookings)
              .values({
                customerName: body.customerName.trim(),
                customerPhone: body.customerPhone.trim(),
                vehiclePlate: body.vehiclePlate.trim().toUpperCase(),
                chargerId: `EV-${(conflicts.length % chargerCount) + 1}`,
                startAt,
                endAt,
                status: "pending",
              })
              .returning();
            if (!created) throw new Error("EV_BOOKING_FAILED");
            return created;
          });
          return Response.json({ success: true, data: booking }, { status: 201 });
        } catch (error: unknown) {
          if (error instanceof Error && error.message === "EV_SLOT_FULL")
            return Response.json(
              { success: false, error: "ช่วงเวลานี้มีผู้จองเต็มแล้ว" },
              { status: 409 },
            );
          console.error("EV booking error:", error);
          return Response.json(
            { success: false, error: "ไม่สามารถบันทึกการจองได้" },
            { status: 500 },
          );
        }
      },
    },
  },
});

function isBookingInput(value: unknown): value is EvBookingInput {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record["customerName"] === "string" &&
    record["customerName"].trim().length >= 2 &&
    record["customerName"].length <= 255 &&
    typeof record["customerPhone"] === "string" &&
    /^[0-9+ ()-]{8,20}$/.test(record["customerPhone"]) &&
    typeof record["vehiclePlate"] === "string" &&
    record["vehiclePlate"].trim().length >= 2 &&
    record["vehiclePlate"].length <= 30 &&
    typeof record["startAt"] === "string" &&
    typeof record["endAt"] === "string"
  );
}

function readChargerCount(): number {
  const configured = Number.parseInt(process.env["EV_CHARGER_COUNT"] ?? "", 10);
  return Number.isInteger(configured) && configured > 0 && configured <= 20
    ? configured
    : DEFAULT_CHARGER_COUNT;
}
