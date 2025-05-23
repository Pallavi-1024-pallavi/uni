import { useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload } from 'lucide-react';

interface MediaPickerProps {
  currentImage?: string;
  onImageSelected: (imageUrl: string) => void;
}

const MediaPicker = ({ currentImage, onImageSelected }: MediaPickerProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageSelected(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4 cursor-pointer group"
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <Camera className="h-8 w-8 text-gray-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Upload className="h-8 w-8 text-white" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <button
        type="button"
        onClick={triggerFileInput}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Change Image
      </button>
    </div>
  );
};

export default MediaPicker;