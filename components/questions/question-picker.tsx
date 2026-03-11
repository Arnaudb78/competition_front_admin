"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { Question } from "./question-columns";

interface Props {
  open: boolean;
  ageGroup: "child" | "adult";
  onSelect: (questionId: string) => void;
  onClose: () => void;
}

export function QuestionPicker({ open, ageGroup, onSelect, onClose }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    apiFetch(`/questions?ageGroup=${ageGroup}`)
      .then((r) => r.json())
      .then(setQuestions)
      .finally(() => setLoading(false));
  }, [open, ageGroup]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Choisir une question —{" "}
            {ageGroup === "child" ? "− 12 ans" : "+ 12 ans"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Chargement...
          </p>
        ) : questions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Aucune question disponible pour cette tranche d&apos;âge.
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
            {questions.map((q) => (
              <button
                key={q._id}
                onClick={() => onSelect(q._id)}
                className="text-left rounded-lg border p-4 hover:bg-muted transition-colors"
              >
                <p className="text-sm font-medium line-clamp-2">{q.text}</p>
                <div className="mt-2 flex flex-col gap-0.5">
                  {q.answers.map((a, i) => (
                    <span
                      key={i}
                      className={`text-xs ${a.isCorrect ? "text-green-600 font-medium" : "text-muted-foreground"}`}
                    >
                      {a.isCorrect ? "✓ " : "· "}
                      {a.text}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-1">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
