
import React, { useState, useRef } from "react";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesUploaded }) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    const newImages: string[] = [];
    const loadingPromises: Promise<void>[] = [];
    
    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        toast.error(`Tipo de archivo no soportado: ${file.type}`);
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`La imagen es demasiado grande: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Máximo 5MB.`);
        return;
      }
      
      const reader = new FileReader();
      
      const loadingPromise = new Promise<void>((resolve) => {
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            resolve();
          }
        };
        
        reader.onerror = () => {
          toast.error(`Error al leer el archivo: ${file.name}`);
          resolve();
        };
      });
      
      loadingPromises.push(loadingPromise);
      reader.readAsDataURL(file);
    });
    
    Promise.all(loadingPromises).then(() => {
      if (newImages.length > 0) {
        setPreviewImages(newImages);
        onImagesUploaded(newImages);
      }
      setIsUploading(false);
      
      // Reset the file input so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...previewImages];
    newImages.splice(index, 1);
    setPreviewImages(newImages);
    onImagesUploaded(newImages);
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
      />
      
      <button
        onClick={handleClick}
        disabled={isUploading}
        className={`
          p-2.5 rounded-full transition-all duration-200 ease-in-out
          bg-chat-user/10 hover:bg-chat-user/20 text-chat-user
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title="Subir imágenes"
      >
        {isUploading ? (
          <Loader2 size={22} className="animate-spin" />
        ) : (
          <ImageIcon size={22} />
        )}
      </button>
      
      {previewImages.length > 0 && (
        <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-md p-2 border border-gray-200 max-w-[300px]">
          <div className="flex flex-wrap gap-2">
            {previewImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="h-16 w-16 object-cover rounded-md border border-gray-200"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 transform translate-x-1/4 -translate-y-1/4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
