"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Question } from "@/components/questions/question-columns";

export type ChallengeQuestion = {
  childQuestion: Question;
  adultQuestion: Question;
};

export type Challenge = {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isVisible: boolean;
  questions: ChallengeQuestion[];
};

function VisibleSwitch({ id, isVisible }: { id: string; isVisible: boolean }) {
  const [checked, setChecked] = useState(isVisible);

  return (
    <Switch
      checked={checked}
      onCheckedChange={async (value) => {
        setChecked(value);
        await apiFetch(`/challenges/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ isVisible: value }),
        });
      }}
    />
  );
}

export const ChallengeColumns: ColumnDef<Challenge>[] = [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;
      return imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="size-10 rounded-md object-cover"
        />
      ) : (
        <div className="size-10 rounded-md bg-muted" />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.getValue<string | undefined>("description");
      return (
        <span className="line-clamp-2 max-w-sm text-muted-foreground text-sm">
          {desc ?? "—"}
        </span>
      );
    },
  },
  {
    id: "nbQuestions",
    header: "Paires",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.questions?.length ?? 0}
      </span>
    ),
  },
  {
    accessorKey: "isVisible",
    header: "Visible",
    cell: ({ row }) => (
      <VisibleSwitch
        id={row.original._id}
        isVisible={row.getValue("isVisible")}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/challenges/${row.original._id}`}>
          <Pencil className="size-4" />
        </Link>
      </Button>
    ),
  },
];
