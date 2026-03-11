"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export type Replay = {
  _id: string;
  title: string;
  description?: string;
  languages: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  isVisible: boolean;
  createdAt: string;
};

function VisibleSwitch({ id, isVisible }: { id: string; isVisible: boolean }) {
  const [checked, setChecked] = useState(isVisible);
  return (
    <Switch
      checked={checked}
      onCheckedChange={async (value) => {
        setChecked(value);
        await apiFetch(`/replays/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ isVisible: value }),
        });
      }}
    />
  );
}

function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer ce replay ?")) return;
    setLoading(true);
    await apiFetch(`/replays/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="size-4" />
    </Button>
  );
}

export const ReplayColumns: ColumnDef<Replay>[] = [
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "languages",
    header: "Langues",
    cell: ({ row }) => {
      const langs = row.getValue<string[]>("languages");
      return (
        <span className="text-muted-foreground text-sm">
          {langs.length ? langs.join(" / ") : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt")).toLocaleDateString("fr-FR"),
  },
  {
    accessorKey: "isVisible",
    header: "Visible",
    cell: ({ row }) => (
      <VisibleSwitch id={row.original._id} isVisible={row.getValue("isVisible")} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/media/replays/${row.original._id}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
        <DeleteButton id={row.original._id} />
      </div>
    ),
  },
];
