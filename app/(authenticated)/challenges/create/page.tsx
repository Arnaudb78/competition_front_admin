"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { apiFetch } from "@/lib/api";

interface FormState {
  name: string;
  description: string;
  imageFile: File | null;
  imagePreview: string | null;
  imageUrl: string;
  isVisible: boolean;
}

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

export default function CreateChallengePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    imageFile: null,
    imagePreview: null,
    imageUrl: "",
    isVisible: true,
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: preview,
      imageUrl: "",
    }));
  }

  function clearImage() {
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    setForm((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: null,
    }));
  }

  async function uploadFile(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const res = await apiFetch(`/upload/images`, { method: "POST", body });
    const { url } = await res.json();
    return url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Le nom est requis.");
      return;
    }
    setLoading(true);

    try {
      let imageUrl = form.imageUrl.trim() || undefined;
      if (form.imageFile) {
        imageUrl = await uploadFile(form.imageFile);
      }

      const res = await apiFetch(`/challenges`, {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          ...(form.description && { description: form.description }),
          ...(imageUrl && { imageUrl }),
          isVisible: form.isVisible,
        }),
      });

      if (!res.ok) {
        toast.error("Une erreur est survenue lors de la création du challenge.");
        return;
      }

      toast.success("Challenge créé avec succès.");
      router.push("/challenges");
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
        <h1 className="text-2xl font-semibold">Ajouter un challenge</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="isVisible">Visible</Label>
          <Switch
            id="isVisible"
            checked={form.isVisible}
            onCheckedChange={(v) => set("isVisible", v)}
          />
        </div>
      </div>

      {/* Informations */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Informations
        </h2>
        <div className="space-y-2">
          <Label htmlFor="name">Nom *</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Nom du challenge"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Description du challenge..."
            rows={4}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
      </section>

      {/* Image */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Image
        </h2>

        {form.imagePreview ? (
          <div className="relative rounded-lg border overflow-hidden">
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 z-10 rounded-full bg-background/80 p-1 hover:bg-background"
            >
              <X className="size-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.imagePreview}
              alt="Preview"
              className="w-full max-h-64 object-contain bg-muted"
            />
          </div>
        ) : form.imageUrl ? (
          <div className="relative rounded-lg border overflow-hidden">
            <button
              type="button"
              onClick={() => set("imageUrl", "")}
              className="absolute top-2 right-2 z-10 rounded-full bg-background/80 p-1 hover:bg-background"
            >
              <X className="size-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-full max-h-64 object-contain bg-muted"
            />
          </div>
        ) : (
          <DropZone accept="image/*" onFiles={handleImageFile}>
            <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
              <Upload className="size-8" />
              <div className="text-center">
                <p className="text-sm font-medium">Glissez votre image ici</p>
                <p className="text-xs">ou cliquez pour sélectionner</p>
              </div>
            </div>
          </DropZone>
        )}

        {!form.imagePreview && (
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
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
              />
            </div>
          </div>
        )}
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Enregistrement..." : "Créer le challenge"}
        </Button>
      </div>
    </form>
  );
}
