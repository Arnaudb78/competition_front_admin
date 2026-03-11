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
import { Replay } from "./replay-columns";

export function ReplayEditForm({ replay }: { replay: Replay }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(replay.title);
  const [description, setDescription] = useState(replay.description ?? "");
  const [languages, setLanguages] = useState(replay.languages.join(" / "));
  const [isVisible, setIsVisible] = useState(replay.isVisible);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch(`/replays/${replay._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title,
          description,
          languages: languages.split("/").map((l) => l.trim()).filter(Boolean),
          isVisible,
        }),
      });
      if (!res.ok) { toast.error("Erreur lors de la mise à jour."); return; }
      toast.success("Replay mis à jour.");
      router.push("/media/replays");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Modifier le replay</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="isVisible">Visible</Label>
          <Switch id="isVisible" checked={isVisible} onCheckedChange={setIsVisible} />
        </div>
      </div>

      <section className="space-y-4">
        <div className="space-y-2">
          <Label>Titre *</Label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label>Langues</Label>
          <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="FR / EN" />
        </div>
        <div className="space-y-2">
          <Label>URL vidéo (lecture seule)</Label>
          <Input value={replay.videoUrl} readOnly className="text-muted-foreground" />
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
