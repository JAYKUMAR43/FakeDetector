import React, { useRef, useState } from 'react';
import { ArrowUp, Download } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (files: FileList) => void;
  isBatch?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isBatch = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleAreaClick}
      className={`relative w-full h-[280px] rounded-3xl border-2 border-dashed flex flex-col justify-center items-center cursor-pointer transition-all duration-500 backdrop-blur-md overflow-hidden group
        ${isDragOver 
          ? 'border-brandGreen bg-brandGreen/10 shadow-[0_0_40px_rgba(0,230,130,0.15)] scale-[0.99]' 
          : 'border-white/[0.08] hover:border-brandGreen/50 bg-[#0b0f19]/45 hover:bg-brandGreen/5 hover:shadow-[0_0_35px_rgba(0,230,130,0.06)]'}`}
    >
      {/* Background Volumetric Glow follow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brandGreen/5 blur-[80px] rounded-full pointer-events-none transition-all duration-500 group-hover:bg-brandGreen/10 group-hover:scale-125" />

      <div className="flex flex-col items-center z-10 text-center px-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300
          ${isDragOver 
            ? 'bg-brandGreen text-bg0 scale-110 shadow-[0_0_20px_rgba(0,230,130,0.4)]' 
            : 'bg-[#121826]/80 text-brandGreen border border-white/[0.03] group-hover:scale-105 group-hover:border-brandGreen/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'}`}
        >
          {isBatch ? <Download size={24} /> : <ArrowUp size={24} />}
        </div>

        <h3 className="font-display text-4xl font-extrabold tracking-wide mb-2 text-text1">
          {isBatch ? 'UPLOAD SEVERAL FILES' : 'UPLOAD FILES'}
        </h3>
        
        <p className="text-sm text-text2 max-w-[280px] leading-relaxed">
          {isBatch 
            ? 'Add several images, videos, or documents to check them all simultaneously.' 
            : 'Drop images or videos here, or click to browse'}
        </p>

        {isBatch && (
          <span className="text-mono mt-6 text-[10px] uppercase tracking-wider text-brandGreen font-bold px-3 py-1 bg-brandGreen/10 rounded-full border border-brandGreen/15">
            READY TO START
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={isBatch}
        style={{ display: 'none' }}
        accept={isBatch ? ".mp4,.mov,.mkv,.avi,.jpg,.png,.webp,.pdf,.txt,.wav,.mp3" : "video/*,image/*"}
      />
    </div>
  );
};
export default UploadZone;
