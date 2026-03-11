"use client";

import { useState, useRef, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import type { MapModule } from "@/app/(authenticated)/modules/map/page";

type Position = { x: number; y: number }; // 0.0 – 1.0 (pourcentage du plan)

export function ModuleMapEditor({ modules }: { modules: MapModule[] }) {
  const [positions, setPositions] = useState<Record<string, Position>>(() => {
    const init: Record<string, Position> = {};
    modules.forEach((m) => {
      if (m.mapX !== undefined && m.mapY !== undefined) {
        init[m._id] = { x: m.mapX, y: m.mapY };
      }
    });
    return init;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });

  const handleDragStart = useCallback(
    (e: React.DragEvent, moduleId: string, fromMap = false) => {
      e.dataTransfer.setData("moduleId", moduleId);
      if (fromMap) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        dragOffsetRef.current = {
          x: e.clientX - rect.left - rect.width / 2,
          y: e.clientY - rect.top - rect.height / 2,
        };
      } else {
        dragOffsetRef.current = { x: 0, y: 0 };
      }
    },
    [],
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const moduleId = e.dataTransfer.getData("moduleId");
    if (!moduleId || !mapRef.current) return;

    const mapRect = mapRef.current.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(
        1,
        (e.clientX - mapRect.left - dragOffsetRef.current.x) / mapRect.width,
      ),
    );
    const y = Math.max(
      0,
      Math.min(
        1,
        (e.clientY - mapRect.top - dragOffsetRef.current.y) / mapRect.height,
      ),
    );

    setPositions((prev) => ({ ...prev, [moduleId]: { x, y } }));
    setIsDirty(true);
  }, []);

  const removeFromMap = useCallback((moduleId: string) => {
    setPositions((prev) => {
      const next = { ...prev };
      delete next[moduleId];
      return next;
    });
    setIsDirty(true);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all(
        modules.map((m) => {
          const pos = positions[m._id];
          return apiFetch(`/modules/${m._id}`, {
            method: "PATCH",
            body: JSON.stringify(
              pos !== undefined
                ? { mapX: pos.x, mapY: pos.y }
                : { mapX: null, mapY: null },
            ),
          });
        }),
      );
      toast.success("Positions sauvegardées");
      setIsDirty(false);
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const placedModules = modules.filter((m) => positions[m._id] !== undefined);
  const unplacedModules = modules.filter((m) => positions[m._id] === undefined);

  return (
    <div className="flex gap-4 items-start">
      {/* Liste des modules non placés */}
      <div className="w-52 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Non placés ({unplacedModules.length})
        </p>
        {unplacedModules.map((m) => (
          <div
            key={m._id}
            draggable
            onDragStart={(e) => handleDragStart(e, m._id)}
            className="flex items-center gap-2 px-3 py-2 rounded-md border bg-card cursor-grab active:cursor-grabbing select-none hover:bg-accent transition-colors"
          >
            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {m.number}
            </span>
            <span className="text-xs text-foreground truncate">{m.name}</span>
          </div>
        ))}
        {unplacedModules.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            Tous les modules sont placés
          </p>
        )}

        {placedModules.length > 0 && (
          <>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-4">
              Placés ({placedModules.length})
            </p>
            {placedModules.map((m) => (
              <div
                key={m._id}
                className="flex items-center gap-2 px-3 py-2 rounded-md border bg-primary/10 select-none"
              >
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {m.number}
                </span>
                <span className="text-xs text-foreground truncate flex-1">
                  {m.name}
                </span>
                <button
                  onClick={() => removeFromMap(m._id)}
                  className="text-muted-foreground hover:text-destructive text-sm leading-none"
                  title="Retirer du plan"
                >
                  ×
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Zone du plan */}
      <div className="flex-1 flex flex-col items-center gap-2 min-w-0 overflow-y-auto">
        {isDirty && (
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-sm flex-shrink-0">
            <span className="text-yellow-600 dark:text-yellow-400 text-xs">
              Modifications non sauvegardées
            </span>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50"
            >
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        )}

        {/* Le conteneur suit la taille naturelle de l'image */}
        <div
          ref={mapRef}
          className="relative w-fit rounded-lg border-2 border-dashed border-muted"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* Image du plan — dicte la taille du conteneur */}
          <img
            src="/mirokai-plan.png"
            alt="Plan Mirokaï Experience"
            className="block max-h-[calc(100vh-16rem)] w-auto select-none rounded-lg"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{ WebkitUserDrag: "none" } as React.CSSProperties}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          {/* Fallback si pas d'image */}
          {placedModules.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-sm bg-background/80 px-4 py-2 rounded-md">
                Glissez les modules sur le plan
              </p>
            </div>
          )}

          {/* Modules placés sur le plan */}
          {placedModules.map((m) => {
            const pos = positions[m._id];
            return (
              <div
                key={m._id}
                draggable
                onDragStart={(e) => handleDragStart(e, m._id, true)}
                style={{
                  position: "absolute",
                  left: `${pos.x * 100}%`,
                  top: `${pos.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold cursor-grab active:cursor-grabbing select-none shadow-lg z-10 whitespace-nowrap group"
                title={m.name}
              >
                <span>{m.number}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromMap(m._id);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 ml-0.5 hover:text-red-300 transition-opacity leading-none"
                  title="Retirer du plan"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
