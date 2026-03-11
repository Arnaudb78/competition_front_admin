"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { Question } from "./question-columns";
import { QuestionPicker } from "./question-picker";

interface QuestionCardProps {
  label: string;
  ageGroup: "child" | "adult";
  question?: Question;
  onAttach: () => void;
  onDetach: () => void;
}

function QuestionCard({
  label,
  question,
  onAttach,
  onDetach,
}: QuestionCardProps) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onAttach}>
            {question ? "Remplacer" : "Attacher"}
          </Button>
          {question && (
            <Button size="sm" variant="ghost" onClick={onDetach}>
              Détacher
            </Button>
          )}
        </div>
      </div>

      {question ? (
        <div className="space-y-2">
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
      ) : (
        <p className="text-sm text-muted-foreground">Aucune question liée</p>
      )}
    </div>
  );
}

interface Props {
  moduleId: string;
  childQuestion?: Question;
  adultQuestion?: Question;
}

export function ModuleQuestionsSection({
  moduleId,
  childQuestion,
  adultQuestion,
}: Props) {
  const router = useRouter();
  const [pickerAgeGroup, setPickerAgeGroup] = useState<
    "child" | "adult" | null
  >(null);

  async function handleAttach(questionId: string) {
    if (!pickerAgeGroup) return;
    const res = await apiFetch(`/modules/${moduleId}/questions`, {
      method: "PATCH",
      body: JSON.stringify({ ageGroup: pickerAgeGroup, questionId }),
    });
    if (!res.ok) {
      toast.error("Erreur lors de l'attachement");
      return;
    }
    setPickerAgeGroup(null);
    toast.success("Question attachée");
    router.refresh();
  }

  async function handleDetach(ageGroup: "child" | "adult") {
    const res = await apiFetch(`/modules/${moduleId}/questions/${ageGroup}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Erreur lors du détachement");
      return;
    }
    toast.success("Question détachée");
    router.refresh();
  }

  return (
    <>
      <section className="space-y-4 w-full max-w-3xl mx-auto">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Questions
        </h2>
        <QuestionCard
          label="Enfants (− 12 ans)"
          ageGroup="child"
          question={childQuestion}
          onAttach={() => setPickerAgeGroup("child")}
          onDetach={() => handleDetach("child")}
        />
        <QuestionCard
          label="Adultes (+ 12 ans)"
          ageGroup="adult"
          question={adultQuestion}
          onAttach={() => setPickerAgeGroup("adult")}
          onDetach={() => handleDetach("adult")}
        />
      </section>

      {pickerAgeGroup && (
        <QuestionPicker
          open
          ageGroup={pickerAgeGroup}
          onSelect={handleAttach}
          onClose={() => setPickerAgeGroup(null)}
        />
      )}
    </>
  );
}
