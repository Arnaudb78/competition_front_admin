"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export interface EventRow {
  _id: string;
  title: string;
  organizer?: string;
  date: string;
  time?: string;
  location?: string;
  price: number;
  isVisible: boolean;
  participants: string[];
  maxCapacity?: number;
}

function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm("Supprimer cet événement ?")) return;
    const res = await apiFetch(`/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Événement supprimé");
      router.refresh();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  }
  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="size-4 text-destructive" />
    </Button>
  );
}

function VisibilitySwitch({ id, value }: { id: string; value: boolean }) {
  const router = useRouter();
  async function toggle(checked: boolean) {
    await apiFetch(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isVisible: checked }),
    });
    router.refresh();
  }
  return <Switch checked={value} onCheckedChange={toggle} />;
}

export const EventColumns: ColumnDef<EventRow>[] = [
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "organizer",
    header: "Organisateur",
    cell: ({ row }) => row.original.organizer ?? "—",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const d = new Date(row.original.date);
      const dateStr = d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `${dateStr}${row.original.time ? ` · ${row.original.time}` : ""}`;
    },
  },
  {
    accessorKey: "location",
    header: "Lieu",
    cell: ({ row }) => row.original.location ?? "—",
  },
  {
    accessorKey: "price",
    header: "Prix",
    cell: ({ row }) =>
      row.original.price === 0 ? "Gratuit" : `${row.original.price} €`,
  },
  {
    id: "inscrits",
    header: "Inscrits",
    cell: ({ row }) => {
      const count = row.original.participants.length;
      const max = row.original.maxCapacity;
      return max ? `${count} / ${max}` : count;
    },
  },
  {
    accessorKey: "isVisible",
    header: "Visible",
    cell: ({ row }) => (
      <VisibilitySwitch id={row.original._id} value={row.original.isVisible} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild>
          <a href={`/events/edit/${row.original._id}`}>
            <Pencil className="size-4" />
          </a>
        </Button>
        <DeleteButton id={row.original._id} />
      </div>
    ),
  },
];
