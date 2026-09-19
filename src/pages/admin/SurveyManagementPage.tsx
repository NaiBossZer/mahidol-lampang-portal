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
  const [occurrenceId, setOccurrenceId] = useState("");
  const [selected, setSelected] = useState<AdminSurvey | null>(null);
  const [draft, setDraft] = useState<Partial<SurveyQuestion>>(emptyDraft);
  const [search, setSearch] = useState("");
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
      const all: ActivityOccurrence[] = [];
      for (const activity of (body.data ?? []).slice(0, 50)) {
        all.push(
          ...(await getAdminOccurrences(String(activity.id))).filter(
            (x) => !["cancelled", "archived"].includes(x.status),
          ),
        );
      }
      setOccurrences(all);

      const loaded = await getAdminSurveys();
      setSurveys(loaded);
      if (selected) {
        setSelected(loaded.find((x) => x.id === selected.id) ?? null);
      } else {
        setSelected(loaded[0] ?? null);
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
    if (!needle) return surveys;
    return surveys.filter((survey) => {
      const occurrence = occurrences.find((item) => item.id === survey.occurrence_id);
      const occurrenceLabel = occurrence
        ? `ครั้งที่ ${occurrence.occurrence_no} ${new Date(occurrence.start_at).toLocaleDateString("th-TH")}`
        : "";
      return `${occurrenceLabel} ${survey.anonymous ? "anonymous" : "identified"} ${survey.questions.length}`
        .toLowerCase()
        .includes(needle);
    });
  }, [occurrences, search, surveys]);

  function resetDraft() {
    setDraft({ ...emptyDraft });
  }

  function selectSurvey(survey: AdminSurvey) {
    setSelected(survey);
    resetDraft();
  }

  async function createSurvey() {
    if (!occurrenceId) {
      toast.error("กรุณาเลือกรอบกิจกรรม");
      return;
    }
    try {
      const created = await createAdminSurvey({
        occurrenceId,
        enabled: true,
        anonymous: false,
        openAt: null,
        closeAt: null,
        welcomeText: "ขอความร่วมมือประเมินกิจกรรม",
      });
      setSurveys((items) => [created, ...items]);
      setSelected(created);
      resetDraft();
      toast.success("สร้างแบบสอบถามแล้ว");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "สร้างแบบสอบถามไม่สำเร็จ");
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
          placeholder="ค้นหารอบกิจกรรมหรือรูปแบบแบบประเมิน"
        />
        <div className="flex min-w-[260px] flex-1 items-center gap-2 lg:max-w-xl">
          <label className="min-w-0 flex-1">
            <span className="sr-only">เลือกรอบกิจกรรมสำหรับสร้างแบบประเมิน</span>
            <select
              value={occurrenceId}
              onChange={(event) => setOccurrenceId(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#002d62] focus:ring-4 focus:ring-[#002d62]/10"
            >
              <option value="">เลือกรอบกิจกรรม</option>
              {occurrences.map((occurrence) => (
                <option key={occurrence.id} value={occurrence.id}>
                  ครั้งที่ {occurrence.occurrence_no} · {new Date(occurrence.start_at).toLocaleDateString("th-TH")}
                </option>
              ))}
            </select>
          </label>
          <AdminButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => void createSurvey()} disabled={!occurrenceId}>
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
                            แบบประเมิน{occurrence ? ` · ครั้งที่ ${occurrence.occurrence_no}` : ""}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {occurrence ? new Date(occurrence.start_at).toLocaleString("th-TH") : "ไม่พบรอบกิจกรรม"}
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
                      แบบประเมิน{selectedOccurrence ? ` · ครั้งที่ ${selectedOccurrence.occurrence_no}` : ""}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedOccurrence
                        ? new Date(selectedOccurrence.start_at).toLocaleString("th-TH")
                        : "ไม่พบรอบกิจกรรม"}
                    </p>
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
