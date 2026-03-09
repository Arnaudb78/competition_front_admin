"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

export type Module = {
  _id: string;
  number: number;
  name: string;
  cartel?: string;
  mediaType: "audio" | "video" | "image" | "none";
  mediaUrl?: string;
  images: string[];
  isVisible: boolean;
};

function VisibleSwitch({ id, isVisible }: { id: string; isVisible: boolean }) {
  const [checked, setChecked] = useState(isVisible);

  return (
    <Switch
      checked={checked}
      onCheckedChange={async (value) => {
        setChecked(value);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isVisible: value }),
        });
      }}
    />
  );
}

const MEDIA_LABELS: Record<Module["mediaType"], string> = {
  audio: "Audio",
  video: "Vidéo",
  image: "Image",
  none: "Aucun",
};

export const ModuleColumns: ColumnDef<Module>[] = [
  {
    accessorKey: "number",
    header: "#",
    cell: ({ row }) => (
      <span className="font-mono font-medium">{row.getValue("number")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "mediaType",
    header: "Média",
    cell: ({ row }) => {
      const type = row.getValue<Module["mediaType"]>("mediaType");
      return <Badge variant="outline">{MEDIA_LABELS[type]}</Badge>;
    },
  },
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      const images = row.getValue<string[]>("images");
      return <span className="text-muted-foreground">{images.length}</span>;
    },
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
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/modules/${row.original._id}`}>
          <Pencil className="size-4" />
        </Link>
      </Button>
    ),
  },
];
