import React, { useEffect } from 'react';

interface ImageViewerProps {
  images: string[]|undefined; // array of image URLs
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (images?.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90  flex items-center justify-center z-[999999999999999]">
      <div className="absolute top-4 right-4 text-white text-3xl cursor-pointer" onClick={onClose}>
       {"×"}
      </div>

      <button
        onClick={onPrev}
        className="absolute left-4 text-white text-4xl font-bold bg-black bg-opacity-30 px-3 py-1 rounded hover:bg-opacity-60"
      >
      {"‹"}
      </button>

      <img
        src={images && images[currentIndex]}
        alt={`image-${currentIndex}`}
        className="max-h-[90vh]  w-full  object-contain rounded shadow-lg"
      />

      <button
        onClick={onNext}
        className="absolute right-4 text-white text-4xl font-bold bg-black bg-opacity-30 px-3 py-1 rounded hover:bg-opacity-60"
      >
       { "›"}
      </button>
    </div>
  );
};

export default ImageViewer;
