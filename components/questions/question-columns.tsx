"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { CreateQuestionDialog } from "./create-question-dialog";

export type Answer = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  _id: string;
  text: string;
  ageGroup: "child" | "adult";
  answers: Answer[];
  createdAt: string;
};

function QuestionActions({ question }: { question: Question }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer cette question ?")) return;
    setDeleting(true);
    await apiFetch(`/questions/${question._id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setEditOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={deleting}
        onClick={handleDelete}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
      <CreateQuestionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        question={question}
      />
    </div>
  );
}

export const QuestionColumns: ColumnDef<Question>[] = [
  {
    accessorKey: "ageGroup",
    header: "Tranche",
    cell: ({ row }) =>
      row.getValue("ageGroup") === "child" ? (
        <Badge variant="outline">− 12 ans</Badge>
      ) : (
        <Badge>+ 12 ans</Badge>
      ),
  },
  {
    accessorKey: "text",
    header: "Question",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-sm">{row.getValue("text")}</span>
    ),
  },
  {
    id: "answers",
    header: "Réponses",
    cell: ({ row }) => {
      const answers: Answer[] = row.original.answers;
      return (
        <div className="flex flex-col gap-1">
          {answers.map((a, i) => (
            <span
              key={i}
              className={`text-xs ${a.isCorrect ? "text-green-600 font-medium" : "text-muted-foreground"}`}
            >
              {a.isCorrect ? "✓ " : "· "}
              {a.text}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <QuestionActions question={row.original} />,
  },
];
