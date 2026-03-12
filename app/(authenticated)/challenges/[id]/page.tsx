import { notFound } from "next/navigation";
import { ChallengeEditForm } from "@/components/challenges/challenge-edit-form";
import { ChallengeQuestionsSection } from "@/components/challenges/challenge-questions-section";
import { Challenge } from "@/components/challenges/challenge-columns";

async function getChallenge(id: string): Promise<Challenge | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/challenges/${id}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = await getChallenge(id);
  if (!challenge) notFound();

  return (
    <div className="space-y-10">
      <ChallengeEditForm challenge={challenge} />
      <ChallengeQuestionsSection challenge={challenge} />
    </div>
  );
}
