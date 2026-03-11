import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ClipEditForm } from "@/components/media/clip-edit-form";
import { Clip } from "@/components/media/clip-columns";

async function getClip(id: string): Promise<Clip | null> {
  const token = (await cookies()).get("admin_token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clips/${id}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditClipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clip = await getClip(id);
  if (!clip) notFound();
  return <ClipEditForm clip={clip} />;
}
