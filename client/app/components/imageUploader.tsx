import { useDropzone } from 'react-dropzone';
import { useCallback, useState, useEffect } from 'react';

interface ImageUploaderProps {
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setImages }) => {
  const [previews, setPreviews] = useState<(File & { preview: string })[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + previews.length > 4) {
        alert('You can only upload a maximum of 4 images');
        return;
      }

      const newPreviews = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setPreviews((prev) => [...prev, ...newPreviews]);
      setImages((prev) => [...prev, ...acceptedFiles]);
    },
    [previews, setImages]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
    multiple: true,
    maxFiles: 4,
  });

  const removeImage = (index: number) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    setImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [previews]);

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-400 p-4 rounded text-center cursor-pointer hover:bg-gray-50 transition"
      >
        <input {...getInputProps()} />
        <p>Click on/Drag and drop up to 4 images here</p>
      </div>

      <div className="flex gap-3 flex-wrap mt-4">
        {previews.map((file, index) => (
          <div key={index} className="relative w-24 h-24">
            <img
              src={file.preview}
              alt={`preview-${index}`}
              className="rounded object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 text-white bg-red-600 hover:bg-red-700 rounded-full px-2 py-0.5 text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
