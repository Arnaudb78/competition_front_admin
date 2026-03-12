"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { Challenge } from "@/components/challenges/challenge-columns";
import { apiFetch } from "@/lib/api";

function DropZone({
  accept,
  onFiles,
  children,
}: {
  accept: string;
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

async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await apiFetch(`/upload/images`, { method: "POST", body });
  const { url } = await res.json();
  return url;
}

export function ChallengeEditForm({ challenge }: { challenge: Challenge }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(challenge.name);
  const [description, setDescription] = useState(challenge.description ?? "");
  const [isVisible, setIsVisible] = useState(challenge.isVisible);

  // Current image URL (from server)
  const [currentImageUrl, setCurrentImageUrl] = useState(
    challenge.imageUrl ?? "",
  );
  // New image file to upload
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  // Manual URL input
  const [manualUrl, setManualUrl] = useState("");

  function handleNewImage(files: File[]) {
    const file = files[0];
    if (!file) return;
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
    setManualUrl("");
  }

  function clearNewImage() {
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImageFile(null);
    setNewImagePreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl: string | undefined;

      if (newImageFile) {
        imageUrl = await uploadFile(newImageFile);
      } else if (manualUrl.trim()) {
        imageUrl = manualUrl.trim();
      } else if (currentImageUrl) {
        imageUrl = currentImageUrl;
      }

      const res = await apiFetch(`/challenges/${challenge._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name,
          ...(description && { description }),
          ...(imageUrl !== undefined && { imageUrl }),
          isVisible,
        }),
      });

      if (!res.ok) {
        toast.error("Une erreur est survenue lors de la mise à jour.");
        return;
      }

      toast.success("Challenge mis à jour.");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const effectivePreview = newImagePreview ?? currentImageUrl ?? null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{challenge.name}</h1>
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

      {/* Informations */}
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
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Description du challenge..."
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="isVisible">Visible</Label>
          <Switch
            id="isVisible"
            checked={isVisible}
            onCheckedChange={setIsVisible}
          />
        </div>
      </section>

      {/* Image */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Image
        </h2>

        {effectivePreview ? (
          <div className="relative rounded-lg border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-muted text-sm text-muted-foreground">
              <span>{newImagePreview ? "Nouvelle image" : "Image actuelle"}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (newImagePreview) {
                    clearNewImage();
                  } else {
                    setCurrentImageUrl("");
                  }
                }}
              >
                <X className="size-4" />
                Supprimer
              </Button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={effectivePreview}
              alt="Preview"
              className="w-full max-h-64 object-contain bg-muted"
            />
          </div>
        ) : (
          <DropZone accept="image/*" onFiles={handleNewImage}>
            <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
              <Upload className="size-8" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {currentImageUrl ? "Remplacer l'image" : "Ajouter une image"}
                </p>
                <p className="text-xs">ou cliquez pour sélectionner</p>
              </div>
            </div>
          </DropZone>
        )}

        {!newImagePreview && !currentImageUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex-1 border-t" />
              <span>ou entrez une URL</span>
              <div className="flex-1 border-t" />
            </div>
            <div className="flex items-center gap-2">
              <ImageIcon className="size-4 text-muted-foreground shrink-0" />
              <Input
                type="url"
                placeholder="https://..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
              />
            </div>
          </div>
        )}
      </section>
    </form>
  );
}
