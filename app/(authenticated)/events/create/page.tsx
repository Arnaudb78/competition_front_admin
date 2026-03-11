"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

function DropZone({ onFile }: { onFile: (file: File) => void }) {
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
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
      />
      <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
        <Upload className="size-8" />
        <p className="text-sm font-medium">Image de couverture</p>
        <p className="text-xs">Glissez ou cliquez pour sélectionner</p>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("0");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImage(file: File) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) { toast.error("Veuillez choisir une date."); return; }
    setLoading(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const body = new FormData();
        body.append("file", imageFile);
        const res = await apiFetch("/upload/images", { method: "POST", body });
        const data = await res.json();
        imageUrl = data.url;
      }

      const res = await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          date,
          time,
          location,
          price: Number(price),
          organizer,
          imageUrl,
          isVisible,
          ...(maxCapacity ? { maxCapacity: Number(maxCapacity) } : {}),
        }),
      });

      if (!res.ok) { toast.error("Erreur lors de la création."); return; }
      toast.success("Événement créé !");
      router.push("/events/list");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nouvel événement</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="isVisible">Visible</Label>
          <Switch id="isVisible" checked={isVisible} onCheckedChange={setIsVisible} />
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Informations</h2>
        <div className="space-y-2">
          <Label>Titre *</Label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Robot Drinks" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Organisateur</Label>
            <Input value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="Enchanted Tools" />
          </div>
          <div className="space-y-2">
            <Label>Lieu</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Paris 75011" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2 col-span-1">
            <Label>Date *</Label>
            <Input required type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Heure</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Prix (€, 0 = gratuit)</Label>
            <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Capacité max (laisser vide = illimitée)</Label>
            <Input type="number" min={1} value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} placeholder="ex: 50" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={4} placeholder="Description de l'événement…"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Image de couverture</h2>
        {imagePreview ? (
          <div className="relative w-full max-w-sm rounded-lg overflow-hidden border">
            <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
              className="absolute top-2 right-2 z-10 rounded-full bg-background/80 p-1 hover:bg-background">
              <X className="size-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="" className="w-full aspect-video object-cover" />
          </div>
        ) : (
          <DropZone onFile={handleImage} />
        )}
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Enregistrement…" : "Créer l'événement"}
        </Button>
      </div>
    </form>
  );
}
