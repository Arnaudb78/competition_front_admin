"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { Challenge, ChallengeQuestion } from "@/components/challenges/challenge-columns";
import { Question } from "@/components/questions/question-columns";

// ── Question card (read-only display) ────────────────────────────────────────

function QuestionCard({
  label,
  question,
}: {
  label: string;
  question: Question;
}) {
  return (
    <div className="rounded-lg border p-4 space-y-2 flex-1">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <p className="text-sm">{question.text}</p>
      <div className="flex flex-col gap-1">
        {question.answers.map((a, i) => (
          <span
            key={i}
            className={`text-xs ${a.isCorrect ? "text-green-600 font-medium" : "text-muted-foreground"}`}
          >
            {a.isCorrect ? "✓ " : "· "}
            {a.text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Question picker dialog ────────────────────────────────────────────────────

function QuestionPickerDialog({
  open,
  ageGroup,
  onSelect,
  onClose,
}: {
  open: boolean;
  ageGroup: "child" | "adult";
  onSelect: (question: Question) => void;
  onClose: () => void;
}) {
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
                onClick={() => onSelect(q)}
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

// ── Add pair modal ────────────────────────────────────────────────────────────

function AddPairModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (childQuestionId: string, adultQuestionId: string) => Promise<void>;
}) {
  const [childQuestion, setChildQuestion] = useState<Question | null>(null);
  const [adultQuestion, setAdultQuestion] = useState<Question | null>(null);
  const [pickerOpen, setPickerOpen] = useState<"child" | "adult" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setChildQuestion(null);
      setAdultQuestion(null);
    }
  }, [open]);

  function handleChildSelect(question: Question) {
    setChildQuestion(question);
    setPickerOpen(null);
  }

  function handleAdultSelect(question: Question) {
    setAdultQuestion(question);
    setPickerOpen(null);
  }

  async function handleConfirm() {
    if (!childQuestion || !adultQuestion) return;
    setSubmitting(true);
    try {
      await onConfirm(childQuestion._id, adultQuestion._id);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open && pickerOpen === null} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une paire de questions</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Child question */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Question enfant (− 12 ans)</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setPickerOpen("child")}
                >
                  {childQuestion ? "Remplacer" : "Choisir"}
                </Button>
              </div>
              {childQuestion ? (
                <div className="rounded-lg border p-3 space-y-1">
                  <p className="text-sm line-clamp-2">{childQuestion.text}</p>
                  <div className="flex flex-col gap-0.5">
                    {childQuestion.answers.map((a, i) => (
                      <span
                        key={i}
                        className={`text-xs ${a.isCorrect ? "text-green-600 font-medium" : "text-muted-foreground"}`}
                      >
                        {a.isCorrect ? "✓ " : "· "}
                        {a.text}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune question sélectionnée</p>
              )}
            </div>

            {/* Adult question */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Question adulte (+ 12 ans)</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setPickerOpen("adult")}
                >
                  {adultQuestion ? "Remplacer" : "Choisir"}
                </Button>
              </div>
              {adultQuestion ? (
                <div className="rounded-lg border p-3 space-y-1">
                  <p className="text-sm line-clamp-2">{adultQuestion.text}</p>
                  <div className="flex flex-col gap-0.5">
                    {adultQuestion.answers.map((a, i) => (
                      <span
                        key={i}
                        className={`text-xs ${a.isCorrect ? "text-green-600 font-medium" : "text-muted-foreground"}`}
                      >
                        {a.isCorrect ? "✓ " : "· "}
                        {a.text}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune question sélectionnée</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!childQuestion || !adultQuestion || submitting}
            >
              {submitting ? "Ajout..." : "Ajouter la paire"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {pickerOpen === "child" && (
        <QuestionPickerDialog
          open
          ageGroup="child"
          onSelect={handleChildSelect}
          onClose={() => setPickerOpen(null)}
        />
      )}
      {pickerOpen === "adult" && (
        <QuestionPickerDialog
          open
          ageGroup="adult"
          onSelect={handleAdultSelect}
          onClose={() => setPickerOpen(null)}
        />
      )}
    </>
  );
}

// ── Pair row ──────────────────────────────────────────────────────────────────

function PairRow({
  index,
  pair,
  challengeId,
  onDeleted,
}: {
  index: number;
  pair: ChallengeQuestion;
  challengeId: string;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer la paire ${index + 1} ?`)) return;
    setDeleting(true);
    const res = await apiFetch(
      `/challenges/${challengeId}/questions/${index}`,
      { method: "DELETE" },
    );
    if (!res.ok) {
      toast.error("Erreur lors de la suppression.");
      setDeleting(false);
      return;
    }
    toast.success("Paire supprimée.");
    onDeleted();
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Paire {index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={deleting}
          onClick={handleDelete}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
      <div className="flex gap-3">
        <QuestionCard label="Enfant (− 12 ans)" question={pair.childQuestion} />
        <QuestionCard label="Adulte (+ 12 ans)" question={pair.adultQuestion} />
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

interface Props {
  challenge: Challenge;
}

export function ChallengeQuestionsSection({ challenge }: Props) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);

  async function handleAddPair(childQuestionId: string, adultQuestionId: string) {
    const res = await apiFetch(`/challenges/${challenge._id}/questions`, {
      method: "POST",
      body: JSON.stringify({ childQuestionId, adultQuestionId }),
    });
    if (!res.ok) {
      toast.error("Erreur lors de l'ajout de la paire.");
      return;
    }
    toast.success("Paire ajoutée.");
    setAddOpen(false);
    router.refresh();
  }

  return (
    <>
      <section className="space-y-4 w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Paires de questions
          </h2>
          <Button
            type="button"
            size="sm"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="size-4" />
            Ajouter une paire
          </Button>
        </div>

        {challenge.questions?.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune paire de questions pour ce challenge.
          </p>
        ) : (
          <div className="space-y-3">
            {challenge.questions?.map((pair, index) => (
              <PairRow
                key={index}
                index={index}
                pair={pair}
                challengeId={challenge._id}
                onDeleted={() => router.refresh()}
              />
            ))}
          </div>
        )}
      </section>

      <AddPairModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onConfirm={handleAddPair}
      />
    </>
  );
}
