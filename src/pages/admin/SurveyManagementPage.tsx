import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw, Save, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getAdminOccurrences, type ActivityOccurrence } from "@/services/admin-occurrences";
import {
  createAdminQuestion,
  createAdminSurvey,
  getAdminSurveys,
  updateAdminQuestion,
  updateAdminSurvey,
  type AdminSurvey,
  type SurveyQuestion,
} from "@/services/admin-surveys";
import {
  AdminButton,
  AdminCard,
  AdminEmptyState,
  AdminFilterBar,
  AdminLoadingState,
  AdminPageHeader,
  AdminSearchInput,
  AdminStatusBadge,
  AdminTable,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/ui/AdminPrimitives";

const emptyDraft: Partial<SurveyQuestion> = {
  question_type: "rating",
  required: true,
  section_key: "general",
  scale_min: 1,
  scale_max: 5,
  options: [],
};

export function SurveyManagementPage() {
  const [occurrences, setOccurrences] = useState<ActivityOccurrence[]>([]);
  const [surveys, setSurveys] = useState<AdminSurvey[]>([]);
  const [selected, setSelected] = useState<AdminSurvey | null>(null);
  const [draft, setDraft] = useState<Partial<SurveyQuestion>>(emptyDraft);
  const [search, setSearch] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [activityTitles, setActivityTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const body = await (
        await fetch("/api/admin/activities", {
          credentials: "include",
          headers: { Accept: "application/json" },
        })
      ).json();
      const activities = Array.isArray(body.data) ? body.data.slice(0, 50) : [];
      const titles: Record<string, string> = {};
      const all: ActivityOccurrence[] = [];
      for (const activity of activities) {
        const activityId = String(activity.id);
        titles[activityId] = String(activity.title ?? "");
        all.push(
          ...(await getAdminOccurrences(activityId)).filter(
            (x) => !["cancelled", "archived"].includes(x.status),
          ),
        );
      }
      setActivityTitles(titles);
      setOccurrences(all);

      const loaded = await getAdminSurveys();
      setSurveys(loaded);
      const requestedActivityId =
        new URLSearchParams(window.location.search).get("activity") ??
        new URLSearchParams(window.location.search).get("activityId") ??
        "";
      if (requestedActivityId) setActivityFilter(requestedActivityId);
      if (selected) {
        setSelected(loaded.find((x) => x.id === selected.id) ?? null);
      } else if (requestedActivityId) {
        const matched = loaded.find((survey) =>
          all.some(
            (occurrence) =>
              occurrence.id === survey.occurrence_id &&
              occurrence.activity_id === requestedActivityId,
          ),
        );
        setSelected(matched ?? null);
      } else {
        setSelected(null);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filteredSurveys = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return surveys.filter((survey) => {
      const occurrence = occurrences.find((item) => item.id === survey.occurrence_id);
      if (activityFilter && occurrence?.activity_id !== activityFilter) return false;
      const activityTitle = occurrence ? activityTitles[occurrence.activity_id] ?? "" : "";
      const searchText =
        `${activityTitle} ${survey.id} ${survey.anonymous ? "anonymous" : "identified"} ${survey.questions.length}`
          .toLowerCase();
      return !needle || searchText.includes(needle);
    });
  }, [activityFilter, activityTitles, occurrences, search, surveys]);

  function resetDraft() {
    setDraft({ ...emptyDraft });
  }

  function selectSurvey(survey: AdminSurvey) {
    setSelected(survey);
    resetDraft();
  }

  async function createSurvey() {
    if (!activityFilter) {
      toast.error("กรุณาเลือกกิจกรรม");
      return;
    }

    const occurrence = occurrences
      .filter(
        (item) =>
          item.activity_id === activityFilter &&
          !["cancelled", "archived"].includes(item.status),
      )
      .sort((a, b) => a.occurrence_no - b.occurrence_no)[0];

    if (!occurrence) {
      toast.error("กิจกรรมนี้ยังไม่มีข้อมูลสำหรับสร้างแบบประเมิน");
      return;
    }

    try {
      const created = await createAdminSurvey({
        occurrenceId: occurrence.id,
        enabled: true,
        anonymous: false,
        openAt: null,
        closeAt: null,
        welcomeText: "ขอความร่วมมือประเมินกิจกรรม",
      });
      setSurveys((items) => [created, ...items]);
      setSelected(created);
      resetDraft();
      toast.success("สร้างแบบประเมินแล้ว");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "สร้างแบบประเมินไม่สำเร็จ");
    }
  }

  async function saveQuestion() {
    if (!selected || !String(draft.question_text ?? "").trim()) {
      toast.error("กรุณาระบุคำถาม");
      return;
    }

    const question: SurveyQuestion = {
      id: String(draft.id ?? ""),
      survey_id: selected.id,
      section_key: String(draft.section_key ?? "general"),
      question_text: String(draft.question_text).trim(),
      question_type: (draft.question_type ?? "rating") as SurveyQuestion["question_type"],
      required: draft.required !== false,
      order_index: Number(draft.order_index ?? selected.questions.length),
      options: Array.isArray(draft.options) ? draft.options : [],
      scale_min: Number(draft.scale_min ?? 1),
      scale_max: Number(draft.scale_max ?? 5),
      active: draft.active !== false,
    };

    try {
      const saved = question.id
        ? await updateAdminQuestion(question)
        : await createAdminQuestion(question);
      setSelected({
        ...selected,
        questions: question.id
          ? selected.questions.map((item) => (item.id === saved.id ? saved : item))
          : [...selected.questions, saved],
      });
      setSurveys((items) =>
        items.map((item) =>
          item.id === selected.id
            ? {
                ...item,
                questions: question.id
                  ? item.questions.map((q) => (q.id === saved.id ? saved : q))
                  : [...item.questions, saved],
              }
            : item,
        ),
      );
      resetDraft();
      toast.success(question.id ? "บันทึกคำถามแล้ว" : "เพิ่มคำถามแล้ว");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกคำถามไม่สำเร็จ");
    }
  }

  async function deactivate(question: SurveyQuestion) {
    if (!selected) return;
    try {
      const saved = await updateAdminQuestion({ ...question, active: false });
      setSelected({
        ...selected,
        questions: selected.questions.filter((item) => item.id !== saved.id),
      });
      setSurveys((items) =>
        items.map((item) =>
          item.id === selected.id
            ? { ...item, questions: item.questions.filter((q) => q.id !== saved.id) }
            : item,
        ),
      );
      toast.success("ปิดใช้งานคำถามแล้ว");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ปิดใช้งานไม่สำเร็จ");
    }
  }

  const selectedOccurrence = selected
    ? occurrences.find((item) => item.id === selected.occurrence_id)
    : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <AdminPageHeader
        eyebrow="SURVEYS"
        title="จัดการแบบประเมิน"
        description="สร้างและจัดการแบบประเมินกิจกรรม พร้อม Question Builder ในหน้าจอเดียว"
        actions={
          <>
            <Link to="/admin/ai" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 text-sm font-semibold text-violet-800 hover:bg-violet-100">
              <Sparkles className="h-4 w-4" />
              AI Studio
            </Link>
            <AdminButton variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={() => void load()}>
              รีเฟรช
            </AdminButton>
          </>
        }
      />

      <AdminFilterBar>
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาชื่อกิจกรรมหรือแบบประเมิน"
        />
        <div className="flex min-w-[260px] flex-1 items-end gap-2 xl:max-w-3xl">
          <label className="min-w-0 flex-1">
            <span className="mb-1 block text-xs font-semibold text-slate-600">กิจกรรม</span>
            <select
              value={activityFilter}
              onChange={(event) => {
                setActivityFilter(event.target.value);
                setSelected(null);
                resetDraft();
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
            >
              <option value="">เลือกกิจกรรม</option>
              {Object.entries(activityTitles)
                .sort(([, a], [, b]) => a.localeCompare(b, "th"))
                .map(([id, title]) => (
                  <option key={id} value={id}>
                    {title || id}
                  </option>
                ))}
            </select>
          </label>
          <AdminButton
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => void createSurvey()}
            disabled={!activityFilter}
          >
            สร้างแบบประเมิน
          </AdminButton>
        </div>
      </AdminFilterBar>

      <div className="mt-4 grid gap-5 xl:grid-cols-[1.05fr_1.55fr]">
        <AdminCard className="overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#002d62]">รายการแบบประเมิน</h2>
                <p className="mt-0.5 text-xs text-slate-500">เลือกแบบประเมินเพื่อจัดการคำถาม</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">{filteredSurveys.length} รายการ</span>
            </div>
          </div>
          {loading ? (
            <AdminLoadingState label="กำลังโหลดแบบประเมิน..." />
          ) : filteredSurveys.length === 0 ? (
            <AdminEmptyState
              title={surveys.length ? "ไม่พบแบบประเมินตามคำค้น" : "ยังไม่มีแบบประเมิน"}
              description={surveys.length ? "ลองเปลี่ยนคำค้นหาหรือเลือกรอบกิจกรรมใหม่" : "เลือกรอบกิจกรรมด้านบนแล้วสร้างแบบประเมินได้ทันที"}
            />
          ) : (
            <AdminTable minWidth="620px" className="mt-0 rounded-none border-0 shadow-none">
              <AdminTableHeader>
                <tr>
                  <th className="px-5 py-3 text-left">แบบประเมิน</th>
                  <th className="px-4 py-3 text-center">คำถาม</th>
                  <th className="px-4 py-3 text-center">สถานะ</th>
                  <th className="px-4 py-3 text-center">โหมด</th>
                </tr>
              </AdminTableHeader>
              <tbody>
                {filteredSurveys.map((survey) => {
                  const occurrence = occurrences.find((item) => item.id === survey.occurrence_id);
                  const active = selected?.id === survey.id;
                  return (
                    <AdminTableRow key={survey.id}>
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => selectSurvey(survey)} className="w-full text-left">
                          <p className={`font-semibold ${active ? "text-[#002d62]" : "text-slate-900"}`}>
                            {occurrence ? activityTitles[occurrence.activity_id] || occurrence.activity_id : "ไม่พบกิจกรรม"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">แบบประเมินของกิจกรรมที่เลือก</p>
                          <p className="mt-1 font-mono text-[10px] text-slate-400">
                            Survey ID: {survey.id}
                          </p>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-slate-700">{survey.questions.length}</td>
                      <td className="px-4 py-4 text-center">
                        <AdminStatusBadge tone={survey.enabled ? "success" : "neutral"}>
                          {survey.enabled ? "Published" : "Disabled"}
                        </AdminStatusBadge>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <AdminStatusBadge tone={survey.anonymous ? "neutral" : "success"}>
                          {survey.anonymous ? "Anonymous" : "Identified"}
                        </AdminStatusBadge>
                      </td>
                    </AdminTableRow>
                  );
                })}
              </tbody>
            </AdminTable>
          )}
        </AdminCard>

        <AdminCard className="overflow-hidden">
          {selected ? (
            <>
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">QUESTION BUILDER</p>
                    <h2 className="mt-1 text-lg font-bold text-[#002d62]">
                      {selectedOccurrence
                        ? activityTitles[selectedOccurrence.activity_id] || selectedOccurrence.activity_id
                        : "แบบประเมิน"}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">แบบประเมินของกิจกรรมที่เลือก</p>
                    {selectedOccurrence && (
                      <p className="mt-1 font-mono text-[10px] text-slate-400">
                        Activity: {selectedOccurrence.activity_id} · Survey: {selected?.id}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <AdminStatusBadge tone={selected.enabled ? "success" : "neutral"}>
                      {selected.enabled ? "Published" : "Disabled"}
                    </AdminStatusBadge>
                    <AdminButton
                      variant={selected.enabled ? "secondary" : "primary"}
                      onClick={() =>
                        void updateAdminSurvey(selected.id, { enabled: !selected.enabled })
                          .then((updated) => {
                            setSelected({ ...selected, ...updated });
                            setSurveys((items) =>
                              items.map((item) => (item.id === selected.id ? { ...item, ...updated } : item)),
                            );
                            toast.success(updated.enabled ? "เผยแพร่แบบประเมินแล้ว" : "ปิดการเผยแพร่แล้ว");
                          })
                          .catch((e) => toast.error(e instanceof Error ? e.message : "บันทึกสถานะไม่สำเร็จ"))
                      }
                    >
                      {selected.enabled ? "ปิดการเผยแพร่" : "เผยแพร่"}
                    </AdminButton>
                    <AdminButton
                      variant="secondary"
                      onClick={() =>
                        void updateAdminSurvey(selected.id, { anonymous: !selected.anonymous })
                          .then((updated) => {
                            setSelected({ ...selected, ...updated });
                            setSurveys((items) => items.map((item) => (item.id === selected.id ? { ...item, ...updated } : item)));
                          })
                          .catch((e) => toast.error(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ"))
                      }
                    >
                      {selected.anonymous ? "Anonymous" : "Identified"}
                    </AdminButton>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 px-5 py-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-slate-600">เปิดรับ</span>
                    <input
                      type="datetime-local"
                      value={selected.open_at ? selected.open_at.slice(0, 16) : ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        void updateAdminSurvey(selected.id, {
                          open_at: value ? new Date(value).toISOString() : null,
                        })
                          .then((updated) => {
                            setSelected({ ...selected, ...updated });
                            setSurveys((items) => items.map((item) => (item.id === selected.id ? { ...item, ...updated } : item)));
                          })
                          .catch((e) => toast.error(e instanceof Error ? e.message : "บันทึกเวลาเปิดไม่สำเร็จ"));
                      }}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-slate-600">ปิดรับ</span>
                    <input
                      type="datetime-local"
                      value={selected.close_at ? selected.close_at.slice(0, 16) : ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        void updateAdminSurvey(selected.id, {
                          close_at: value ? new Date(value).toISOString() : null,
                        })
                          .then((updated) => {
                            setSelected({ ...selected, ...updated });
                            setSurveys((items) => items.map((item) => (item.id === selected.id ? { ...item, ...updated } : item)));
                          })
                          .catch((e) => toast.error(e instanceof Error ? e.message : "บันทึกเวลาปิดไม่สำเร็จ"));
                      }}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
                  </label>
                </div>
              </div>

              <div className="p-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_auto]">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600">คำถาม</span>
                      <input
                        value={String(draft.question_text ?? "")}
                        onChange={(event) => setDraft((current) => ({ ...current, question_text: event.target.value }))}
                        placeholder="ระบุคำถาม"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600">ประเภท</span>
                      <select
                        value={String(draft.question_type ?? "rating")}
                        onChange={(event) => setDraft((current) => ({ ...current, question_type: event.target.value as SurveyQuestion["question_type"] }))}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                      >
                        <option value="rating">Rating 1–5</option>
                        <option value="text">Text</option>
                        <option value="single_choice">Single choice</option>
                        <option value="multi_choice">Multi choice</option>
                      </select>
                    </label>
                    <AdminButton variant="primary" icon={<Save className="h-4 w-4" />} className="self-end" onClick={() => void saveQuestion()}>
                      บันทึกคำถาม
                    </AdminButton>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600">Section key</span>
                      <input
                        value={String(draft.section_key ?? "general")}
                        onChange={(event) => setDraft((current) => ({ ...current, section_key: event.target.value }))}
                        placeholder="general / opening / learning"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600">Rating scale</span>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={1}
                          value={Number(draft.scale_min ?? 1)}
                          onChange={(event) => setDraft((current) => ({ ...current, scale_min: Number(event.target.value) }))}
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                          aria-label="Rating scale minimum"
                        />
                        <input
                          type="number"
                          min={2}
                          value={Number(draft.scale_max ?? 5)}
                          onChange={(event) => setDraft((current) => ({ ...current, scale_max: Number(event.target.value) }))}
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                          aria-label="Rating scale maximum"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600">Choice options</span>
                      <input
                        value={Array.isArray(draft.options) ? draft.options.join(", ") : ""}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            options: event.target.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          }))
                        }
                        placeholder="ตัวเลือก A, ตัวเลือก B"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        disabled={!["single_choice", "multi_choice"].includes(String(draft.question_type))}
                      />
                    </label>
                  </div>

                  <label className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={draft.required !== false}
                      onChange={(event) => setDraft((current) => ({ ...current, required: event.target.checked }))}
                    />
                    คำถามบังคับ
                  </label>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">รายการคำถาม</h3>
                    <p className="mt-0.5 text-xs text-slate-500">คลิกคำถามเพื่อแก้ไข</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{selected.questions.length} ข้อ</span>
                </div>

                <div className="mt-3 space-y-2">
                  {selected.questions.length === 0 ? (
                    <AdminEmptyState title="ยังไม่มีคำถาม" description="เพิ่มคำถามแรกของแบบประเมินนี้จากช่องด้านบน" />
                  ) : (
                    selected.questions.map((question, index) => (
                      <div key={question.id} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => setDraft(question)}
                            className="flex min-w-0 flex-1 gap-3 text-left"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                              {index + 1}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-semibold text-slate-900">{question.question_text}</span>
                              <span className="mt-1 block text-xs text-slate-500">
                                {question.question_type} · {question.required ? "จำเป็น" : "ไม่จำเป็น"}
                                {question.question_type === "rating" ? ` · ${question.scale_min}–${question.scale_max}` : ""}
                              </span>
                              <span className="mt-1 block font-mono text-[10px] text-slate-400">
                                Question ID: {question.id}
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => void deactivate(question)}
                            aria-label="ปิดใช้งานคำถาม"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="grid min-h-[520px] place-items-center p-8">
              <AdminEmptyState title="เลือกแบบประเมิน" description="เลือกแบบประเมินจากรายการด้านซ้ายเพื่อเริ่มจัดการคำถาม" />
            </div>
          )}
        </AdminCard>
      </div>
    </section>
  );
}
