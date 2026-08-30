import { Component, type ErrorInfo, type ReactNode } from "react";

type RuntimeErrorBoundaryProps = { children: ReactNode };
type RuntimeErrorBoundaryState = { error: Error | null };

export class RuntimeErrorBoundary extends Component<
  RuntimeErrorBoundaryProps,
  RuntimeErrorBoundaryState
> {
  override state: RuntimeErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): RuntimeErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Mahidol Portal] Client render error", error, info.componentStack);
  }

  override render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
          <section
            className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
            role="alert"
          >
            <p className="text-sm font-semibold text-[#F2A900]">MAHIDOL UNIVERSITY</p>
            <h1 className="mt-2 text-xl font-bold text-[#002D62]">หน้าเว็บขัดข้องชั่วคราว</h1>
            <p className="mt-2 text-sm text-slate-600">
              กรุณารีเฟรชหน้าเว็บ หรือลองกลับไปที่หน้าหลัก
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg bg-[#002D62] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002D62]/90"
              >
                รีเฟรชหน้าเว็บ
              </button>
              <a
                href="/"
                className="rounded-lg border border-[#002D62] px-4 py-2 text-sm font-semibold text-[#002D62] hover:bg-blue-50"
              >
                หน้าหลัก
              </a>
            </div>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
