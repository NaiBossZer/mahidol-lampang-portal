import React, { useState, useRef } from 'react';
import { ActivityPhoto } from '../types';
import { SAMPLE_ACTIVITY_PHOTOS } from '../data/adminWorkflow';

interface ActivityPhotoManagerProps {
  photos: ActivityPhoto[];
  onUpdatePhotos: (photos: ActivityPhoto[]) => void;
  onProceedToReport: () => void;
  onSkipPhotos: () => void;
  onBackToOverview: () => void;
}

export const ActivityPhotoManager: React.FC<ActivityPhotoManagerProps> = ({
  photos,
  onUpdatePhotos,
  onProceedToReport,
  onSkipPhotos,
  onBackToOverview,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedPreviewPhoto, setSelectedPreviewPhoto] = useState<ActivityPhoto | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadSuccessMsg(null);

    const newPhotos: ActivityPhoto[] = [];
    const count = files.length;
    let processed = 0;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        newPhotos.push({
          id: `photo-upload-${Date.now()}-${index}`,
          url: url || '',
          caption: file.name.replace(/\.[^/.]+$/, ''),
          isCover: photos.length === 0 && index === 0,
          uploadedAt: 'วันนี้ ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          fileName: file.name,
        });

        processed++;
        if (processed === count) {
          setIsUploading(false);
          const updated = [...photos, ...newPhotos];
          // Ensure at least one cover image exists if photos exist
          if (!updated.some((p) => p.isCover) && updated.length > 0) {
            updated[0].isCover = true;
          }
          onUpdatePhotos(updated);
          setUploadSuccessMsg(`อัปโหลดรูปภาพสำเร็จ ${count} รายการ`);
          setTimeout(() => setUploadSuccessMsg(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add sample photos shortcut
  const handleLoadSamplePhotos = () => {
    setIsUploading(true);
    setTimeout(() => {
      onUpdatePhotos(SAMPLE_ACTIVITY_PHOTOS);
      setIsUploading(false);
      setUploadSuccessMsg('เพิ่มรูปภาพบรรยากาศกิจกรรมตัวอย่าง 4 รายการเรียบร้อย');
      setTimeout(() => setUploadSuccessMsg(null), 3000);
    }, 400);
  };

  // Set Cover
  const handleSetCover = (id: string) => {
    const updated = photos.map((p) => ({
      ...p,
      isCover: p.id === id,
    }));
    onUpdatePhotos(updated);
  };

  // Delete Photo
  const handleDeletePhoto = (id: string) => {
    const remaining = photos.filter((p) => p.id !== id);
    if (remaining.length > 0 && !remaining.some((p) => p.isCover)) {
      remaining[0].isCover = true;
    }
    onUpdatePhotos(remaining);
  };

  // Update Caption
  const handleUpdateCaption = (id: string, newCaption: string) => {
    const updated = photos.map((p) =>
      p.id === id ? { ...p, caption: newCaption } : p
    );
    onUpdatePhotos(updated);
  };

  return (
    <div className="space-y-4">
      {/* Step Banner & Description */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-sky-700 text-white flex items-center justify-center font-bold text-[11px]">
              7
            </span>
            <h2 className="text-[16px] font-bold text-slate-900">
              บันทึกรูปภาพกิจกรรม (Activity Photos)
            </h2>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
              ข้อมูลทางเลือก (Optional)
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-1">
            อัปโหลดภาพบรรยากาศการจัดกิจกรรม เพื่อนำไปประกอบในรายงานและแสดงผลบนหน้าเว็บไซต์ข่าวสาร
          </p>
        </div>

        {/* Upload and Sample action buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {photos.length === 0 && (
            <button
              type="button"
              onClick={handleLoadSamplePhotos}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium rounded-lg text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">auto_fix_high</span>
              <span>โหลดรูปตัวอย่างกิจกรรม (4 รูป)</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[12px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
            <span>+ เพิ่มรูปภาพ</span>
          </button>
        </div>
      </div>

      {/* Optional Rule Callout Banner */}
      <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex items-start gap-2.5 text-[11.5px] text-sky-950">
        <span className="material-symbols-outlined text-sky-600 text-[18px] shrink-0 mt-0.5">
          info
        </span>
        <div className="flex-1">
          <span className="font-bold">รูปภาพเป็นข้อมูล OPTIONAL:</span> หากกิจกรรมนี้ไม่มีรูปภาพ หรือยังไม่ได้รับรูปจากฝ่ายถ่ายภาพ ADMIN สามารถกดปุ่ม{' '}
          <strong className="underline text-sky-800 cursor-pointer" onClick={onSkipPhotos}>
            "ข้ามขั้นตอนนี้ (ไม่มีรูปภาพ)"
          </strong>{' '}
          เพื่อไปเขียนรายงานและข่าวกิจกรรมได้ทันที โดยระบบจะไม่ถือเป็นข้อผิดพลาด
        </div>
      </div>

      {/* Success Notification */}
      {uploadSuccessMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11.5px] flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          dragOver
            ? 'border-sky-500 bg-sky-50/50 scale-[1.005]'
            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
          </div>
          <div className="text-[13px] font-bold text-slate-800">
            ลากและวางไฟล์รูปภาพที่นี่ หรือ <span className="text-sky-600 underline">คลิกเพื่อเลือกไฟล์</span>
          </div>
          <p className="text-[11px] text-slate-400">
            รองรับ JPG, PNG, WEBP (เลือกได้พร้อมกันหลายรูป • ขนาดแนะนำไม่เกิน 10MB ต่อรูป)
          </p>
          {isUploading && (
            <div className="flex items-center justify-center gap-2 text-sky-600 text-[11px] font-semibold pt-1">
              <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
              <span>กำลังประมวลผลรูปภาพ...</span>
            </div>
          )}
        </div>
      </div>

      {/* Photos Grid or Empty State */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold text-slate-900">
              รายการรูปภาพกิจกรรม ({photos.length} รูป)
            </h3>
            {photos.length > 0 && (
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                เลือกรูปภาพหลักแล้ว
              </span>
            )}
          </div>
          {photos.length > 0 && (
            <button
              type="button"
              onClick={() => onUpdatePhotos([])}
              className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              ล้างรูปทั้งหมด
            </button>
          )}
        </div>

        {photos.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">photo_library</span>
            </div>
            <div className="font-semibold text-slate-700 text-[13px]">
              ยังไม่มีรูปภาพกิจกรรมในระบบ
            </div>
            <p className="text-slate-400 text-[11px] max-w-sm mx-auto">
              สามารถกดปุ่ม "+ เพิ่มรูปภาพ" ด้านบน หรือกด "ข้ามขั้นตอนนี้" เพื่อเริ่มเขียนข่าวกิจกรรมทันที
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`group rounded-xl border overflow-hidden transition-all bg-white relative flex flex-col justify-between ${
                  photo.isCover
                    ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Photo Image with overlay */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Activity photo'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Cover Badge */}
                  {photo.isCover && (
                    <div className="absolute top-2 left-2 bg-sky-600 text-white font-bold text-[9.5px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">star</span>
                      <span>ภาพหน้าปก (Cover)</span>
                    </div>
                  )}

                  {/* Quick Action Overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      type="button"
                      title="ดูรูปขนาดใหญ่"
                      onClick={() => setSelectedPreviewPhoto(photo)}
                      className="w-7 h-7 rounded-md bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">fullscreen</span>
                    </button>
                    <button
                      type="button"
                      title="ลบรูปภาพนี้"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="w-7 h-7 rounded-md bg-rose-600/80 hover:bg-rose-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Photo Details & Caption */}
                <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between text-[11px]">
                  <div>
                    <label className="text-[9.5px] text-slate-400 font-medium block mb-0.5">
                      คำบรรยายภาพ:
                    </label>
                    <input
                      type="text"
                      value={photo.caption || ''}
                      onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                      placeholder="ระบุคำบรรยายภาพ..."
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 text-[11px] focus:outline-hidden focus:border-sky-500"
                    />
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{photo.fileSize || '3.2 MB'}</span>

                    {!photo.isCover ? (
                      <button
                        type="button"
                        onClick={() => handleSetCover(photo.id)}
                        className="text-sky-600 hover:text-sky-700 font-semibold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[13px]">star_border</span>
                        <span>ตั้งเป็นภาพปก</span>
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">check</span>
                        <span>เป็นภาพปกอยู่</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToOverview}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-lg text-[12px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>กลับหน้ารายละเอียดกิจกรรม</span>
        </button>

        <div className="flex items-center justify-end gap-2.5">
          {photos.length === 0 && (
            <button
              type="button"
              onClick={onSkipPhotos}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[12px] transition-colors cursor-pointer"
            >
              ข้ามขั้นตอนนี้ (ไม่มีรูปภาพ)
            </button>
          )}

          <button
            type="button"
            onClick={onProceedToReport}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-[12px] flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span>ถัดไป: จัดทำรายงาน / ข่าว</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPreviewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="p-3 bg-black/40 flex items-center justify-between text-white text-[12px]">
              <span className="font-semibold">{selectedPreviewPhoto.caption || 'รูปภาพกิจกรรม'}</span>
              <button
                type="button"
                onClick={() => setSelectedPreviewPhoto(null)}
                className="text-white hover:text-rose-400 p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[75vh]">
              <img
                src={selectedPreviewPhoto.url}
                alt={selectedPreviewPhoto.caption}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
