import type { Dispatch, SetStateAction } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryPhoto = { id: string; image: string; title: string };

type Props = {
  open: boolean;
  photos: GalleryPhoto[];
  index: number;
  title: string;
  onClose: () => void;
  onIndexChange: Dispatch<SetStateAction<number>>;
};

export function ActivityGalleryModal({ open, photos, index, title, onClose, onIndexChange }: Props) {
  if (!open || !photos.length) return null;

  const current = photos[index] ?? photos[0];
  const safeIndex = photos.indexOf(current);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="relative flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-[#0c2340] text-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <h2 className="truncate text-[15px] font-bold">{`ภาพกิจกรรม: ${current.title || title}`}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white" aria-label="ปิด">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative flex min-h-[420px] flex-1 items-center justify-center bg-black/30 p-5">
          <img src={current.image} alt={current.title} className="max-h-[58vh] max-w-full rounded-lg object-contain" />
          {photos.length > 1 && (
            <>
              <button type="button" onClick={() => onIndexChange(i => (i - 1 + photos.length) % photos.length)} className="absolute left-5 grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80" aria-label="ภาพก่อนหน้า">
                <ChevronLeft />
              </button>
              <button type="button" onClick={() => onIndexChange(i => (i + 1) % photos.length)} className="absolute right-5 grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80" aria-label="ภาพถัดไป">
                <ChevronRight />
              </button>
            </>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-[#08182b] p-3">
          {photos.map((photo, photoIndex) => (
            <button key={photo.id} type="button" onClick={() => onIndexChange(photoIndex)} className={`h-14 w-20 shrink-0 overflow-hidden rounded border-2 ${photoIndex === safeIndex ? "border-sky-400" : "border-transparent opacity-60"}`}>
              <img src={photo.image} alt="thumbnail" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
