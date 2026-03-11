import Link from "next/link";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Replay, ReplayColumns } from "@/components/media/replay-columns";
import { UserDataTable } from "@/components/users/user-data-table";

async function getData(): Promise<Replay[]> {
  const token = (await cookies()).get("admin_token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/replays`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ReplaysPage() {
  const data = await getData();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Replays</h1>
        <Button asChild>
          <Link href="/media/replays/create">
            <Plus />
            Nouveau replay
          </Link>
        </Button>
      </div>
      <UserDataTable columns={ReplayColumns} data={data} />
    </>
  );
}
