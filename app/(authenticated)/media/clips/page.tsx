import Link from "next/link";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Clip, ClipColumns } from "@/components/media/clip-columns";
import { UserDataTable } from "@/components/users/user-data-table";

async function getData(): Promise<Clip[]> {
  const token = (await cookies()).get("admin_token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clips`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ClipsPage() {
  const data = await getData();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clips</h1>
        <Button asChild>
          <Link href="/media/clips/create">
            <Plus />
            Nouveau clip
          </Link>
        </Button>
      </div>
      <UserDataTable columns={ClipColumns} data={data} />
    </>
  );
}
