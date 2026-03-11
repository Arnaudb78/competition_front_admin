import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ReplayEditForm } from "@/components/media/replay-edit-form";
import { Replay } from "@/components/media/replay-columns";

async function getReplay(id: string): Promise<Replay | null> {
  const token = (await cookies()).get("admin_token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/replays/${id}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditReplayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const replay = await getReplay(id);
  if (!replay) notFound();
  return <ReplayEditForm replay={replay} />;
}
