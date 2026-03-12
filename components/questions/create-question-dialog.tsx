"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { Question } from "./question-columns";

const defaultAnswers = [
  { text: "", isCorrect: true },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
];

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  question?: Question;
}

export function CreateQuestionDialog({ open, onOpenChange, question }: Props) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [ageGroup, setAgeGroup] = useState<"child" | "adult">("child");
  const [answers, setAnswers] = useState(defaultAnswers);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  // Initialise le formulaire selon mode création / édition
  useEffect(() => {
    if (isOpen) {
      if (question) {
        setText(question.text);
        setAgeGroup(question.ageGroup);
        setAnswers(question.answers.map((a) => ({ ...a })));
      } else {
        setText("");
        setAgeGroup("child");
        setAnswers(defaultAnswers.map((a) => ({ ...a })));
      }
      setError(null);
    }
  }, [isOpen, question]);

  function setAnswerText(index: number, value: string) {
    setAnswers((prev) =>
      prev.map((a, i) => (i === index ? { ...a, text: value } : a)),
    );
  }

  function setCorrect(index: number) {
    setAnswers((prev) =>
      prev.map((a, i) => ({ ...a, isCorrect: i === index })),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { text, ageGroup, answers };

    try {
      const res = question
        ? await apiFetch(`/questions/${question._id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          })
        : await apiFetch(`/questions`, {
            method: "POST",
            body: JSON.stringify(payload),
          });

      console.log(await res.json());

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Erreur lors de l'enregistrement");
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  const content = (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {question ? "Modifier la question" : "Nouvelle question"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
        {/* Tranche d'âge */}
        <div className="flex flex-col gap-2">
          <Label>Tranche d&apos;âge</Label>
          <div className="flex gap-3">
            {(["child", "adult"] as const).map((group) => (
              <label
                key={group}
                className={`flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  ageGroup === group
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:bg-muted"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="ageGroup"
                  value={group}
                  checked={ageGroup === group}
                  onChange={() => setAgeGroup(group)}
                />
                {group === "child" ? "− 12 ans" : "+ 12 ans"}
              </label>
            ))}
          </div>
        </div>

        {/* Texte de la question */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="question-text">Question</Label>
          <textarea
            id="question-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            required
            placeholder="Saisissez la question..."
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* Réponses */}
        <div className="flex flex-col gap-2">
          <Label>
            Réponses{" "}
            <span className="text-muted-foreground text-xs">
              (sélectionnez la bonne)
            </span>
          </Label>
          <div className="flex flex-col gap-2">
            {answers.map((answer, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correct-answer"
                  checked={answer.isCorrect}
                  onChange={() => setCorrect(i)}
                  className="size-4 cursor-pointer accent-primary shrink-0"
                  title="Bonne réponse"
                />
                <Input
                  value={answer.text}
                  onChange={(e) => setAnswerText(i, e.target.value)}
                  placeholder={`Réponse ${i + 1}`}
                  required
                  className={
                    answer.isCorrect
                      ? "border-green-500 focus-visible:ring-green-500"
                      : ""
                  }
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Le bouton radio indique la bonne réponse
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Enregistrement..."
              : question
                ? "Mettre à jour"
                : "Créer"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );

  if (isControlled) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {content}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="size-4" />
          Nouvelle question
        </Button>
      </DialogTrigger>
      {content}
    </Dialog>
  );
}
