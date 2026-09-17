import { useEffect, useRef, useState } from "react";
import { ExternalLink, FolderOpen, Loader2 } from "lucide-react";

type GooglePickerFile = {
  id: string;
  name?: string;
  mimeType?: string;
};

type GoogleDriveImagePickerProps = {
  value?: string | null;
  onChange: (url: string) => void;
};

type GoogleAccounts = {
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: { access_token?: string; error?: string }) => void;
    }) => { requestAccessToken: () => void };
  };
};

type GoogleApi = {
  load: (name: string, callback: () => void) => void;
};

type GooglePicker = {
  PickerBuilder: new () => {
    addView: (view: unknown) => unknown;
    setOAuthToken: (token: string) => unknown;
    setDeveloperKey: (key: string) => unknown;
    setCallback: (callback: (data: { action?: string; docs?: GooglePickerFile[] }) => void) => unknown;
    build: () => { setVisible: (visible: boolean) => void };
  };
  ViewId: { DOCS: unknown };
  Action: { PICKED: string };
  DocsView: new (viewId: unknown) => {
    setMimeTypes: (mimeTypes: string) => unknown;
  };
};

declare global {
  interface Window {
    google?: { accounts?: GoogleAccounts };
    gapi?: GoogleApi;
    googlePicker?: GooglePicker;
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined;
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

function loadScript(src: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("โหลด Google Drive Picker ไม่สำเร็จ"));
    document.head.appendChild(script);
  });
}

async function ensureGooglePicker() {
  await loadScript("https://accounts.google.com/gsi/client", "google-gsi-client");
  await loadScript("https://apis.google.com/js/api.js", "google-api-client");
  await new Promise<void>((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error("ไม่พบ Google API client"));
      return;
    }
    window.gapi.load("picker", resolve);
    window.setTimeout(() => reject(new Error("Google Picker โหลดไม่ทันเวลา")), 10000);
  });
}

export default function GoogleDriveImagePicker({ value, onChange }: GoogleDriveImagePickerProps) {
  const [loading, setLoading] = useState(false);
  const tokenClient = useRef<{ requestAccessToken: () => void } | null>(null);
  const pendingOpen = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID || !API_KEY) return;
    void ensureGooglePicker().catch(() => undefined);
  }, []);

  async function openPicker() {
    if (!CLIENT_ID || !API_KEY) {
      window.alert("ยังไม่ได้ตั้งค่า Google Drive Picker: VITE_GOOGLE_CLIENT_ID และ VITE_GOOGLE_API_KEY");
      return;
    }

    setLoading(true);
    pendingOpen.current = true;

    try {
      await ensureGooglePicker();
      if (!window.google?.accounts || !window.googlePicker) {
        throw new Error("Google Drive Picker พร้อมใช้งานไม่ครบ");
      }

      const showPicker = (accessToken: string) => {
        const view = new window.googlePicker!.DocsView(window.googlePicker!.ViewId.DOCS);
        view.setMimeTypes("image/jpeg,image/png,image/webp,image/gif");
        const picker = new window.googlePicker!.PickerBuilder()
          .addView(view)
          .setOAuthToken(accessToken)
          .setDeveloperKey(API_KEY)
          .setCallback((data) => {
            if (data.action === window.googlePicker!.Action.PICKED && data.docs?.[0]?.id) {
              const fileId = data.docs[0].id;
              onChange(`https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1600`);
            }
            pendingOpen.current = false;
            setLoading(false);
          })
          .build();
        picker.setVisible(true);
      };

      tokenClient.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: DRIVE_SCOPE,
        callback: (response) => {
          if (response.error || !response.access_token) {
            pendingOpen.current = false;
            setLoading(false);
            return;
          }
          showPicker(response.access_token);
        },
      });
      tokenClient.current.requestAccessToken();
    } catch (error) {
      pendingOpen.current = false;
      setLoading(false);
      window.alert(error instanceof Error ? error.message : "เปิด Google Drive ไม่สำเร็จ");
    }
  }

  return (
    <div className="mt-1 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => void openPicker()}
          disabled={loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderOpen className="h-4 w-4" />}
          {loading ? "กำลังเชื่อมต่อ Google Drive..." : "เลือกภาพจาก Google Drive"}
        </button>
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-[#002d62] hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" /> เปิดภาพ
          </a>
        ) : null}
      </div>
      <input
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="dashboard-control w-full"
        placeholder="หรือวาง URL รูปภาพโดยตรง"
      />
      {value ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
          <img src={value} alt="ตัวอย่างรูปภาพหน้าปกกิจกรรม" className="max-h-48 w-full rounded-lg object-contain" />
        </div>
      ) : null}
      <p className="text-xs leading-5 text-slate-500">
        หากใช้ Google Drive ต้องตั้งสิทธิ์ไฟล์เป็น “ทุกคนที่มีลิงก์สามารถดูได้” เพื่อให้เว็บไซต์แสดงภาพได้
      </p>
    </div>
  );
}
