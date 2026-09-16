import React, { useState } from 'react';

interface PhotoGalleryModalProps {
  isOpen: boolean;
  photos: string[];
  initialIndex?: number;
  activityTitle: string;
  onClose: () => void;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  isOpen,
  photos,
  initialIndex = 0,
  activityTitle,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || photos.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0c2340] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-sky-400">
              photo_library
            </span>
            <span className="font-semibold text-[14px] truncate max-w-md">
              ภาพกิจกรรม: {activityTitle}
            </span>
            <span className="text-[12px] text-slate-400">
              ({currentIndex + 1} / {photos.length})
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Main Photo Display */}
        <div className="relative flex-1 bg-black/40 flex items-center justify-center p-4 min-h-[360px] max-h-[60vh] overflow-hidden">
          <img
            src={photos[currentIndex]}
            alt={`Activity photo ${currentIndex + 1}`}
            className="max-h-[55vh] max-w-full object-contain rounded-lg shadow-lg"
          />

          {/* Navigation buttons */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow-md"
              >
                <span className="material-symbols-outlined text-[24px]">
                  chevron_left
                </span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow-md"
              >
                <span className="material-symbols-outlined text-[24px]">
                  chevron_right
                </span>
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        <div className="p-3 bg-[#08182b] border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-16 h-12 rounded overflow-hidden shrink-0 border-2 transition-all ${
                idx === currentIndex
                  ? 'border-sky-400 scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={photo}
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
