import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { Button } from '../../components/shared/Button';
import { CameraIcon, PlusIcon, XIcon } from 'lucide-react';
export function AddMachineStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const equipmentData = location.state?.equipmentData || {};

  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = [...images];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    // If no images uploaded, use a fallback mock image, else use uploaded base64 strings
    const finalImages = images.length > 0 
      ? images 
      : ["https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"];
      
    const updatedData = {
      ...equipmentData,
      images: JSON.stringify(finalImages)
    };
    navigate('/provider/add-machine/3', { state: { equipmentData: updatedData } });
  };

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Add Equipment" showBack />

      {/* Stepper */}
      <div className="bg-surface px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-primary">Step 2 of 4</span>
          <span className="text-sm font-medium text-gray-500">Photos</span>
        </div>
        <div className="flex gap-2">
          <div className="h-2 flex-1 bg-primary rounded-full" />
          <div className="h-2 flex-1 bg-primary rounded-full" />
          <div className="h-2 flex-1 bg-gray-200 rounded-full" />
          <div className="h-2 flex-1 bg-gray-200 rounded-full" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-bold text-blue-900 mb-1">Photo Tips</h3>
          <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
            <li>Take photos in good daylight</li>
            <li>Show all sides of the equipment</li>
            <li>Include close-ups of attachments</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Upload Photos
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />

            {/* Primary Photo Placeholder or Uploaded */}
            <div 
              className="col-span-2 aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-primary transition-colors cursor-pointer relative overflow-hidden"
              onClick={() => { if (images.length === 0) fileInputRef.current?.click(); }}
            >
              {images.length > 0 ? (
                <>
                  <img
                    src={images[0]}
                    alt="Uploaded Primary"
                    className="absolute inset-0 w-full h-full object-contain p-2 bg-gray-950/90 rounded-2xl" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeImage(0); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full z-10 hover:bg-red-600">
                    <XIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    Primary Cover
                  </div>
                </>
              ) : (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"
                    alt="Placeholder"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
                  <div className="relative z-10 flex flex-col items-center">
                    <CameraIcon className="w-8 h-8 mb-2 text-primary" />
                    <span className="font-semibold text-gray-900">
                      Upload Primary Photo
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Additional Photos */}
            {images.slice(1).map((img, idx) => (
              <div key={idx + 1} className="aspect-square bg-gray-100 rounded-2xl border border-gray-200 relative overflow-hidden">
                <img src={img} alt={`Additional ${idx+1}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(idx + 1)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600">
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ))}

            <div 
              className="aspect-square bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <PlusIcon className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">Add Photo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          onClick={handleNext}>
          
          Next Step
        </Button>
      </div>
    </div>);

}