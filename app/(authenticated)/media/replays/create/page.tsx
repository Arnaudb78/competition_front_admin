"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

function DropZone({ accept, onFile, children }: {
  accept: string;
  onFile: (file: File) => void;
  children: React.ReactNode;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile]);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`cursor-pointer rounded-lg border-2 border-dashed transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
      />
      {children}
    </div>
  );
}

async function uploadFile(file: File, folder: "videos" | "images"): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await apiFetch(`/upload/${folder}`, { method: "POST", body });
  const { url } = await res.json();
  return url;
}

export default function CreateReplayPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [languages, setLanguages] = useState("FR / EN");
  const [isVisible, setIsVisible] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  function handleThumbnail(file: File) {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!videoFile) { toast.error("Veuillez sélectionner une vidéo."); return; }
    setLoading(true);
    try {
      const [videoUrl, thumbnailUrl] = await Promise.all([
        uploadFile(videoFile, "videos"),
        thumbnailFile ? uploadFile(thumbnailFile, "images") : Promise.resolve(undefined),
      ]);

      const res = await apiFetch("/replays", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          languages: languages.split("/").map((l) => l.trim()).filter(Boolean),
          videoUrl,
          thumbnailUrl,
          isVisible,
        }),
      });

      if (!res.ok) { toast.error("Erreur lors de la création."); return; }
      router.push("/media/replays");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nouveau replay</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="isVisible">Visible</Label>
          <Switch id="isVisible" checked={isVisible} onCheckedChange={setIsVisible} />
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Informations</h2>
        <div className="space-y-2">
          <Label>Titre *</Label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enchanted Tools — Robot Drinks" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={3} placeholder="Description du replay…"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label>Langues</Label>
          <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="FR / EN" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Vidéo *</h2>
        {videoFile ? (
          <div className="relative rounded-lg border overflow-hidden">
            <button type="button" onClick={() => setVideoFile(null)}
              className="absolute top-2 right-2 z-10 rounded-full bg-background/80 p-1 hover:bg-background">
              <X className="size-4" />
            </button>
            <div className="flex items-center gap-3 p-4">
              <Film className="size-8 text-muted-foreground" />
              <span className="text-sm truncate">{videoFile.name}</span>
            </div>
          </div>
        ) : (
          <DropZone accept="video/*" onFile={setVideoFile}>
            <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
              <Film className="size-10" />
              <p className="text-sm font-medium">Glissez votre vidéo ici</p>
              <p className="text-xs">ou cliquez pour sélectionner</p>
            </div>
          </DropZone>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Thumbnail</h2>
        {thumbnailPreview ? (
          <div className="relative w-48 rounded-lg overflow-hidden border">
            <button type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
              className="absolute top-2 right-2 z-10 rounded-full bg-background/80 p-1">
              <X className="size-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnailPreview} alt="" className="w-full aspect-video object-cover" />
          </div>
        ) : (
          <DropZone accept="image/*" onFile={handleThumbnail}>
            <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
              <Upload className="size-8" />
              <p className="text-sm font-medium">Thumbnail (optionnel)</p>
            </div>
          </DropZone>
        )}
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Enregistrement…" : "Créer le replay"}
        </Button>
      </div>
    </form>
  );
}
