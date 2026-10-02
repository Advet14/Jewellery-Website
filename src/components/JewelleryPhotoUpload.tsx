import React, { useRef } from 'react';
import { Camera, Upload, Trash2, RefreshCw, Sparkles } from 'lucide-react';

interface JewelleryPhotoUploadProps {
  photo?: string;
  onPhotoChange: (photoDataUrl?: string) => void;
}

export const JewelleryPhotoUpload: React.FC<JewelleryPhotoUploadProps> = ({
  photo,
  onPhotoChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onPhotoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="bg-[#fdfcf9] rounded-2xl p-5 sm:p-7 border border-[#d4af37]/40 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2d7c0]">
        <div className="flex items-center space-x-2.5">
          <Camera className="w-5 h-5 text-[#c59b27]" />
          <h2 className="font-playfair text-xl font-bold text-[#06231a]">
            Jewellery Photograph
          </h2>
        </div>
        <span className="text-[11px] font-medium text-[#c59b27] bg-[#fbf6e8] px-2.5 py-1 rounded-full border border-[#c59b27]/30">
          Ornament Details Box
        </span>
      </div>

      <p className="text-xs text-[#6e7d77]">
        Upload an HD photograph of the purchased ornament. It will automatically fit precisely inside the master invoice&apos;s Ornament Details area without distortion.
      </p>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {photo ? (
        /* Preview State */
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-white border border-[#e5dfd3]">
          <div className="relative w-36 h-36 rounded-xl border-2 border-[#d4af37]/40 bg-[#fdfbf7] p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            <img
              src={photo}
              alt="Uploaded Jewellery Ornament Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="flex-1 flex flex-col space-y-3 w-full sm:w-auto">
            <div className="flex items-center space-x-1.5 text-xs text-[#06231a] font-medium">
              <Sparkles className="w-4 h-4 text-[#c59b27]" />
              <span>Image loaded & calibrated for Ornament Details box</span>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[44px] inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#06231a] text-white text-xs font-semibold hover:bg-[#0b3d2f] active:scale-95 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Replace Photo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onPhotoChange(undefined);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="min-h-[44px] inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-red-200 text-red-700 bg-red-50 text-xs font-semibold hover:bg-red-100 active:scale-95 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#d4af37]/60 hover:border-[#c59b27] bg-[#fdfbf6] hover:bg-[#fbf7ed] rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
        >
          <div className="w-14 h-14 rounded-full bg-[#faeed2] text-[#06231a] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-[#9a781b] stroke-[2]" />
          </div>

          <span className="font-playfair text-base font-semibold text-[#06231a]">
            Click or drag jewellery photo here
          </span>

          <span className="text-xs text-[#808d87] mt-1 font-sans-ui">
            Supports PNG, JPG, WebP up to 10MB
          </span>

          <button
            type="button"
            className="mt-4 min-h-[44px] px-5 py-2 rounded-xl bg-[#06231a] text-[#fbf8f0] text-xs font-semibold group-hover:bg-[#0b3d2f] shadow-sm transition-colors"
          >
            Select from Device
          </button>
        </div>
      )}
    </div>
  );
};
