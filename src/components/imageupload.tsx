import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface ImageUploadProps {
  value?: string;
  setPhotoPreview: (url: string) => void;
  label?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  setPhotoPreview,
  label = "Profile photo",
  className = "",
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
      "image/gif",
    ];
    const maxSize = 3 * 1024 * 1024; // 3MB

    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type.");
      return;
    }
    if (file.size > maxSize) {
      setError("File too large (Max 3MB).");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/upload/single`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const imageUrl = data.data?.url;
      setPreview(imageUrl);
      setPhotoPreview(imageUrl);
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="relative w-12 h-12">
          {isLoading ? (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : preview ? (
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700 ring-2 ring-blue-200">
              IMG
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-sm font-medium text-gray-800">
            {preview ? "Image Uploaded" : "No image"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Upload className="w-3 h-3 inline mr-1" /> Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
