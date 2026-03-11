"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Film, Music, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { apiFetch } from "@/lib/api";

type MediaType = "audio" | "video" | "none";

interface FormState {
  number: string;
  name: string;
  cartel: string;
  mediaType: MediaType;
  mediaFile: File | null;
  mediaPreview: string | null;
  images: { file: File; preview: string }[];
  isVisible: boolean;
}

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
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
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

export default function CreateModulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    number: "",
    name: "",
    cartel: "",
    mediaType: "none",
    mediaFile: null,
    mediaPreview: null,
    images: [],
    isVisible: true,
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleMediaFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    set("mediaFile", file);
    set("mediaPreview", preview);
  }

  function handleImageFiles(files: File[]) {
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...previews] }));
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function clearMedia() {
    if (form.mediaPreview) URL.revokeObjectURL(form.mediaPreview);
    set("mediaFile", null);
    set("mediaPreview", null);
  }

  async function uploadFile(
    file: File,
    folder: "images" | "videos" | "audios",
  ): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const res = await apiFetch(`/upload/${folder}`, { method: "POST", body });
    const { url } = await res.json();
    return url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let mediaUrl: string | undefined;
      if (form.mediaFile) {
        const folder = form.mediaType === "video" ? "videos" : "audios";
        mediaUrl = await uploadFile(form.mediaFile, folder);
      }

      const imageUrls = await Promise.all(
        form.images.map((img) => uploadFile(img.file, "images")),
      );

      const res = await apiFetch(`/modules`, {
        method: "POST",
        body: JSON.stringify({
          number: Number(form.number),
          name: form.name,
          ...(form.cartel && { cartel: form.cartel }),
          mediaType: form.mediaType,
          ...(mediaUrl && { mediaUrl }),
          images: imageUrls,
          isVisible: form.isVisible,
        }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          toast.error("Ce numéro de module est déjà utilisé", {
            description: "Veuillez choisir un numéro différent.",
          });
          return;
        }
        toast.error("Une erreur est survenue lors de la création du module.");
        return;
      }

      router.push("/modules");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ajouter un module</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="isVisible">Visible</Label>
          <Switch
            id="isVisible"
            checked={form.isVisible}
            onCheckedChange={(v) => set("isVisible", v)}
          />
        </div>
      </div>

      {/* Infos de base */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Informations
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number">Numéro *</Label>
            <Input
              id="number"
              type="number"
              min={1}
              required
              value={form.number}
              onChange={(e) => set("number", e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nom du module"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cartel">Cartel</Label>
          <textarea
            id="cartel"
            value={form.cartel}
            onChange={(e) => set("cartel", e.target.value)}
            placeholder="Texte descriptif affiché lors de la visite..."
            rows={4}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
      </section>

      {/* Média */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Média
        </h2>

        <div className="flex gap-3">
          {(["none", "video", "audio"] as MediaType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                set("mediaType", type);
                clearMedia();
              }}
              className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                form.mediaType === type
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted"
              }`}
            >
              {type === "video" && <Film className="size-4" />}
              {type === "audio" && <Music className="size-4" />}
              {type === "none" && <ImageIcon className="size-4" />}
              {type === "none"
                ? "Image"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {form.mediaType !== "none" && (
          <>
            {form.mediaPreview ? (
              <div className="relative rounded-lg border overflow-hidden">
                <button
                  type="button"
                  onClick={clearMedia}
                  className="absolute top-2 right-2 z-10 rounded-full bg-background/80 p-1 hover:bg-background"
                >
                  <X className="size-4" />
                </button>
                {form.mediaType === "video" ? (
                  <video
                    src={form.mediaPreview}
                    controls
                    className="w-full max-h-64 object-contain bg-black"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-4">
                    <Music className="size-8 text-muted-foreground" />
                    <span className="text-sm truncate">
                      {form.mediaFile?.name}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <DropZone
                accept={form.mediaType === "video" ? "video/*" : "audio/*"}
                onFiles={handleMediaFiles}
              >
                <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                  {form.mediaType === "video" ? (
                    <Film className="size-10" />
                  ) : (
                    <Music className="size-10" />
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Glissez votre{" "}
                      {form.mediaType === "video" ? "vidéo" : "audio"} ici
                    </p>
                    <p className="text-xs">ou cliquez pour sélectionner</p>
                  </div>
                </div>
              </DropZone>
            )}
          </>
        )}
      </section>

      {/* Images */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Images
        </h2>

        <DropZone accept="image/*" multiple onFiles={handleImageFiles}>
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <Upload className="size-8" />
            <div className="text-center">
              <p className="text-sm font-medium">Glissez vos images ici</p>
              <p className="text-xs">
                ou cliquez pour sélectionner (plusieurs possibles)
              </p>
            </div>
          </div>
        </DropZone>

        {form.images.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {form.images.map((img, i) => (
              <div
                key={i}
                className="relative group rounded-md overflow-hidden border aspect-square"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Enregistrement..." : "Créer le module"}
        </Button>
      </div>
    </form>
  );
}
