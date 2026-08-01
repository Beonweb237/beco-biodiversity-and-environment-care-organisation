import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { trpc } from "@/providers/trpc";

interface AdminImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function AdminImageUploader({
  value,
  onChange,
  label = "Image",
}: AdminImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewError, setPreviewError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const uploadMutation = trpc.admin.public.uploadImage.useMutation();

  const handleUrlChange = (url: string) => {
    setPreviewError(false);
    setUploadError("");
    onChange(url);
  };

  const handleClear = () => {
    setPreviewError(false);
    setUploadError("");
    onChange("");
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const result = await uploadMutation.mutateAsync({
        name: file.name,
        type: file.type,
        base64,
      });
      onChange(result.url);
    } catch {
      setUploadError("Erreur lors de l'upload. Veuillez réessayer.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await uploadFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {/* URL Input + Upload button */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary"
          placeholder="/assets/... ou URL https://..."
        />
        {value && (
          <button
            onClick={handleClear}
            className="px-2 py-2 border rounded-lg hover:bg-gray-50"
            title="Effacer l'image"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Image Preview / Upload Zone */}
      {isUploading ? (
        <div className="mt-2 w-full h-36 rounded-lg border-2 border-dashed border-beco-primary bg-beco-primary/5 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-beco-primary animate-spin" />
          <p className="text-xs text-beco-primary">Upload en cours...</p>
        </div>
      ) : value ? (
        <div className="mt-2 relative w-full h-36 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
          <img
            src={value}
            alt="Aperçu"
            className={`w-full h-full object-cover ${previewError ? "hidden" : ""}`}
            onError={() => setPreviewError(true)}
          />
          {previewError && (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-8 h-8 mb-1" />
              <p className="text-xs">Image invalide ou inaccessible</p>
              <p className="text-[10px] mt-0.5">{value}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Cliquez pour modifier
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("image-upload-input")?.click()}
          className={`mt-2 w-full h-28 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            isDragging
              ? "border-beco-primary bg-beco-primary/5"
              : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
          }`}
        >
          <Upload className={`w-5 h-5 ${isDragging ? "text-beco-primary" : "text-gray-400"}`} />
          <p className="text-xs text-gray-500">
            {isDragging ? "Déposez l'image ici" : "Cliquez ou glissez une image, ou saisissez l'URL ci-dessus"}
          </p>
          <p className="text-[10px] text-gray-400">PNG, JPG, WebP max 5 Mo</p>
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}
      {uploadError && (
        <p className="mt-1 text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  );
}
