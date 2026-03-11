"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Clip } from "./clip-columns";

export function ClipEditForm({ clip }: { clip: Clip }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(clip.title);
  const [author, setAuthor] = useState(clip.author);
  const [isVisible, setIsVisible] = useState(clip.isVisible);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch(`/clips/${clip._id}`, {
        method: "PATCH",
        body: JSON.stringify({ title, author, isVisible }),
      });
      if (!res.ok) { toast.error("Erreur lors de la mise à jour."); return; }
      toast.success("Clip mis à jour.");
      router.push("/media/clips");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Modifier le clip</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="isVisible">Visible</Label>
          <Switch id="isVisible" checked={isVisible} onCheckedChange={setIsVisible} />
        </div>
      </div>

      <section className="space-y-4">
        <div className="space-y-2">
          <Label>Titre / Caption *</Label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Auteur *</Label>
          <Input required value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>URL vidéo (lecture seule)</Label>
          <Input value={clip.videoUrl} readOnly className="text-muted-foreground" />
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Likes : {clip.likedBy.length}</p>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Enregistrement…" : "Sauvegarder"}
        </Button>
      </div>
    </form>
  );
}
