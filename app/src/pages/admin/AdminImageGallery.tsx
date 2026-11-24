import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Images,
  Upload,
  RefreshCw,
  Loader2,
  Check,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  deleteGalleryImage,
  listGalleryImages,
  uploadImage,
  type GalleryImage,
} from "@/lib/api/forms";
import { LOCAL_ASSETS } from "@/lib/generated-assets";

interface AdminImageGalleryProps {
  value: string;
  onChange: (url: string) => void;
}

/** Vignette cliquable d'une image (bucket ou asset du thème). */
function Thumb({
  src,
  label,
  selected,
  onSelect,
  onDelete,
  deleting,
}: {
  src: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  deleting?: boolean;
}) {
  return (
    <div
      className={`relative aspect-square rounded-lg overflow-hidden border-2 bg-gray-100 group ${selected ? "border-beco-primary" : "border-transparent hover:border-gray-300"
        }`}
    >
      <button
        type="button"
        onClick={onSelect}
        title={`Utiliser ${label}`}
        className="absolute inset-0 w-full h-full focus:outline-none"
      >
        <img
          src={src}
          alt={label}
          loading="lazy"
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
        />
      </button>
      {selected && (
        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-beco-primary text-white flex items-center justify-center pointer-events-none">
          <Check className="w-3 h-3" />
        </span>
      )}
      {onDelete &&
        (deleting ? (
          <span className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Supprimer cette image"
            className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity focus:opacity-100 focus:outline-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        ))}
      <span className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] px-1.5 py-0.5 truncate text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </div>
  );
}

/**
 * Galerie d'images intégrée : liste les images déjà téléversées dans le
 * bucket Supabase (beco-images) et permet d'en choisir une en un clic,
 * ou d'en uploader une nouvelle directement depuis la galerie.
 */
export default function AdminImageGallery({ value, onChange }: AdminImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingName, setDeletingName] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setImages(await listGalleryImages());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de charger la galerie");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setError("");
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await uploadImage({ name: file.name, type: file.type, base64 });
      await load();
      onChange(result.url);
    } catch {
      setError("Erreur lors de l'upload. Veuillez réessayer.");
    } finally {
      setUploading(false);
    }
  };

  const select = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  const handleDelete = async (img: GalleryImage) => {
    if (!window.confirm(`Supprimer l'image « ${img.name} » ?\nCette action est définitive.`)) return;
    setDeletingName(img.name);
    setError("");
    try {
      await deleteGalleryImage(img.name);
      if (value === img.url) onChange("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la suppression");
    } finally {
      setDeletingName(null);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        title="Ouvrir la galerie d'images"
      >
        <Images className="w-4 h-4" />
        Galerie
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] p-0 flex flex-col gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Galerie d'images
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Cliquez sur une image pour l'utiliser, ou téléversez-en une nouvelle.
            </DialogDescription>
          </DialogHeader>

          {/* Barre d'actions */}
          <div className="px-6 py-3 flex items-center gap-3 border-b border-gray-100">
            <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-beco-primary text-white text-sm cursor-pointer hover:bg-beco-primary-light disabled:opacity-60">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Upload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Téléverser une image
                </>
              )}
              <input
                id="gallery-upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
            <p className="text-xs text-gray-400 ml-auto">
              {images.length} téléversée(s) · {LOCAL_ASSETS.length} asset(s) du site
            </p>
          </div>

          {error && (
            <div className="mx-6 mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Grille d'images */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Chargement de la galerie...
              </div>
            ) : images.length === 0 && LOCAL_ASSETS.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Images className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune image disponible pour le moment.</p>
                <p className="text-xs mt-1">
                  Utilisez « Téléverser une image » pour commencer.
                </p>
              </div>
            ) : (
              <>
                {images.length > 0 && (
                  <section className="mb-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                      Images téléversées
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {images.map((img) => (
                        <Thumb
                          key={img.name}
                          src={img.url}
                          label={img.name}
                          selected={value === img.url}
                          onSelect={() => select(img.url)}
                          onDelete={() => handleDelete(img)}
                          deleting={deletingName === img.name}
                        />
                      ))}
                    </div>
                  </section>
                )}
                {LOCAL_ASSETS.length > 0 && (
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                      Assets du site
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {LOCAL_ASSETS.map((src) => (
                        <Thumb
                          key={src}
                          src={src}
                          label={src}
                          selected={value === src}
                          onSelect={() => select(src)}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
