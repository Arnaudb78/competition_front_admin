"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Film, Music, ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Module } from "@/components/modules/module-columns";
import { apiFetch } from "@/lib/api";

type MediaType = "audio" | "video" | "image" | "none";

function DropZone({
  accept,
  multiple,
  onFiles,
  children,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  children: React.ReactNode;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFiles(files);
    },
    [onFiles],
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`cursor-pointer rounded-lg border-2 border-dashed transition-colors ${
        dragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
      {children}
    </div>
  );
}

async function uploadFile(
  file: File,
  folder: "images" | "videos" | "audios",
): Promise<string> {
  const params = new URLSearchParams({ filename: file.name, contentType: file.type });
  const res = await apiFetch(`/upload/${folder}/presign?${params}`);
  const { presignedUrl, url } = await res.json();
  await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  return url;
}

export function ModuleEditForm({ module }: { module: Module }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartel, setCartel] = useState(module.cartel ?? "");
  const [name, setName] = useState(module.name);

  // Média existant
  const [currentMediaUrl, setCurrentMediaUrl] = useState(module.mediaUrl ?? null);
  const [currentMediaType] = useState<MediaType>(module.mediaType);
  // Nouveau média à uploader
  const [newMediaFile, setNewMediaFile] = useState<File | null>(null);
  const [newMediaPreview, setNewMediaPreview] = useState<string | null>(null);

  // Images existantes (URLs S3)
  const [existingImages, setExistingImages] = useState<string[]>(module.images ?? []);
  // Nouvelles images à uploader
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);

  function handleNewMedia(files: File[]) {
    const file = files[0];
    if (!file) return;
    setNewMediaFile(file);
    setNewMediaPreview(URL.createObjectURL(file));
  }

  function clearNewMedia() {
    if (newMediaPreview) URL.revokeObjectURL(newMediaPreview);
    setNewMediaFile(null);
    setNewMediaPreview(null);
  }

  function handleNewImages(files: File[]) {
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages((prev) => [...prev, ...previews]);
  }

  function removeExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewImage(index: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let mediaUrl = currentMediaUrl ?? undefined;
      if (newMediaFile) {
        const folder = currentMediaType === "video" ? "videos" : "audios";
        mediaUrl = await uploadFile(newMediaFile, folder);
      }

      const uploadedNewImages = await Promise.all(
        newImages.map((img) => uploadFile(img.file, "images")),
      );

      const allImages = [...existingImages, ...uploadedNewImages];

      const res = await apiFetch(`/modules/${module._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name,
          cartel,
          ...(mediaUrl && { mediaUrl }),
          images: allImages,
        }),
      });

      if (!res.ok) {
        toast.error("Une erreur est survenue lors de la mise à jour.");
        return;
      }

      toast.success("Module mis à jour.");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Module #{module.number}</p>
          <h1 className="text-2xl font-semibold">{module.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Spinner />}
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      {/* Infos */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Informations
        </h2>
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cartel">Cartel</Label>
          <textarea
            id="cartel"
            value={cartel}
            onChange={(e) => setCartel(e.target.value)}
            rows={5}
            placeholder="Texte descriptif affiché lors de la visite..."
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
      </section>

      {/* Média */}
      {currentMediaType !== "image" && currentMediaType !== "none" && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Média ({currentMediaType === "video" ? "Vidéo" : "Audio"})
          </h2>

          {/* Média actuel */}
          {currentMediaUrl && !newMediaPreview && (
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-muted text-sm text-muted-foreground">
                <span>Média actuel</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMediaUrl(null)}
                >
                  <Trash2 className="size-4" />
                  Supprimer
                </Button>
              </div>
              {currentMediaType === "video" ? (
                <video
                  src={currentMediaUrl}
                  controls
                  className="w-full max-h-64 object-contain bg-black"
                />
              ) : (
                <div className="flex items-center gap-3 p-4">
                  <Music className="size-8 text-muted-foreground" />
                  <span className="text-sm truncate">{currentMediaUrl}</span>
                </div>
              )}
            </div>
          )}

          {/* Nouveau média */}
          {newMediaPreview ? (
            <div className="relative rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-muted text-sm text-muted-foreground">
                <span>Nouveau média</span>
                <Button type="button" variant="ghost" size="sm" onClick={clearNewMedia}>
                  <X className="size-4" />
                  Annuler
                </Button>
              </div>
              {currentMediaType === "video" ? (
                <video
                  src={newMediaPreview}
                  controls
                  className="w-full max-h-64 object-contain bg-black"
                />
              ) : (
                <div className="flex items-center gap-3 p-4">
                  <Music className="size-8 text-muted-foreground" />
                  <span className="text-sm truncate">{newMediaFile?.name}</span>
                </div>
              )}
            </div>
          ) : (
            <DropZone
              accept={currentMediaType === "video" ? "video/*" : "audio/*"}
              onFiles={handleNewMedia}
            >
              <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                {currentMediaType === "video" ? (
                  <Film className="size-8" />
                ) : (
                  <Music className="size-8" />
                )}
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Remplacer la {currentMediaType === "video" ? "vidéo" : "audio"}
                  </p>
                  <p className="text-xs">ou cliquez pour sélectionner</p>
                </div>
              </div>
            </DropZone>
          )}
        </section>
      )}

      {/* Images */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Images
        </h2>

        {/* Images existantes */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {existingImages.map((url, i) => (
              <div
                key={i}
                className="relative group rounded-md overflow-hidden border aspect-square"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Nouvelles images */}
        {newImages.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground">À ajouter</p>
            <div className="grid grid-cols-3 gap-3">
              {newImages.map((img, i) => (
                <div
                  key={i}
                  className="relative group rounded-md overflow-hidden border aspect-square ring-2 ring-primary/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <DropZone accept="image/*" multiple onFiles={handleNewImages}>
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <Upload className="size-8" />
            <div className="text-center">
              <p className="text-sm font-medium">Ajouter des images</p>
              <p className="text-xs">ou cliquez pour sélectionner</p>
            </div>
          </div>
        </DropZone>
      </section>
    </form>
  );
}
