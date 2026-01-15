import React, { useCallback, useState } from 'react';
import { UploadCloud, FileAudio, FileVideo, Music } from 'lucide-react';

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileAccepted, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndAccept(file);
    }
  }, [disabled, onFileAccepted]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAccept(e.target.files[0]);
    }
  }, [onFileAccepted]);

  const validateAndAccept = (file: File) => {
    // Basic validation for audio/video types
    if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
      // Check size (20MB soft limit for base64 inline)
      if (file.size > 20 * 1024 * 1024) {
        alert("File is too large for this demo (limit 20MB).");
        return;
      }
      onFileAccepted(file);
    } else {
      alert("Please upload a valid audio or video file.");
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative w-full max-w-2xl h-80 rounded-3xl border-4 border-dashed transition-all duration-300 ease-in-out flex flex-col items-center justify-center gap-6 cursor-pointer group
        ${isDragOver 
          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
          : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={handleInputChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className={`p-6 rounded-full bg-white shadow-xl shadow-blue-100 transition-transform duration-300 ${isDragOver ? 'scale-110' : 'group-hover:scale-110'}`}>
        <UploadCloud className="w-12 h-12 text-blue-600" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-slate-800">
          {isDragOver ? 'Drop it like it\'s hot!' : 'Click or Drag Media Here'}
        </h3>
        <p className="text-slate-500 max-w-md mx-auto px-4">
          Support for MP3, MP4, WAV, M4A, and most common audio/video formats. 
          <br/><span className="text-xs text-slate-400">(Max 20MB for this demo)</span>
        </p>
      </div>

      <div className="flex gap-4 text-slate-300">
        <FileAudio className="w-6 h-6" />
        <FileVideo className="w-6 h-6" />
        <Music className="w-6 h-6" />
      </div>
    </div>
  );
};

export default DropZone;
