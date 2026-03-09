"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Film, Music, ImageIcon, Bot } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Module } from "@/components/modules/module-columns";

const MEDIA_ICONS: Record<Module["mediaType"], React.ReactNode> = {
  video: <Film className="size-4" />,
  audio: <Music className="size-4" />,
  image: <ImageIcon className="size-4" />,
  none: <Bot className="size-4" />,
};

function SortableModule({
  module,
  index,
  total,
}: {
  module: Module;
  index: number;
  total: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: module._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col items-center">
      {/* Card */}
      <div
        className={`w-full flex items-center gap-4 rounded-xl border bg-card p-4 shadow-xs transition-shadow ${
          isDragging ? "shadow-lg opacity-50 ring-2 ring-primary" : ""
        }`}
      >
        {/* Drag handle */}
        <button
          className="touch-none text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5" />
        </button>

        {/* Numéro */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
          {index + 1}
        </div>

        {/* Thumbnail ou icône */}
        <div className="size-14 shrink-0 rounded-md overflow-hidden border bg-muted flex items-center justify-center text-muted-foreground">
          {module.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={module.images[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            MEDIA_ICONS[module.mediaType]
          )}
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{module.name}</p>
          {module.cartel && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {module.cartel}
            </p>
          )}
        </div>
      </div>

      {/* Connecteur vers le module suivant */}
      {index < total - 1 && (
        <div className="flex flex-col items-center py-1">
          <div className="w-px h-4 bg-border" />
          <div className="w-2 h-2 rotate-45 border-r-2 border-b-2 border-border -mt-1" />
        </div>
      )}
    </div>
  );
}

export function ModuleTimeline({ initialModules }: { initialModules: Module[] }) {
  const [modules, setModules] = useState(initialModules);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setModules((prev) => {
      const oldIndex = prev.findIndex((m) => m._id === active.id);
      const newIndex = prev.findIndex((m) => m._id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: modules.map((m) => m._id) }),
      });

      if (!res.ok) {
        toast.error("Erreur lors de la sauvegarde de l'ordre.");
        return;
      }

      toast.success("Ordre de la visite mis à jour.");
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {dirty && (
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <p className="text-sm text-primary font-medium">
            Modifications non sauvegardées
          </p>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving && <Spinner />}
            {saving ? "Sauvegarde..." : "Sauvegarder l'ordre"}
          </Button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={modules.map((m) => m._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {modules.map((module, index) => (
              <SortableModule
                key={module._id}
                module={module}
                index={index}
                total={modules.length}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
