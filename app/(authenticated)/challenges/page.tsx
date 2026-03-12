import Link from "next/link";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Challenge, ChallengeColumns } from "@/components/challenges/challenge-columns";
import { UserDataTable } from "@/components/users/user-data-table";

async function getData(): Promise<Challenge[]> {
  const token = (await cookies()).get("admin_token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/challenges/all`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ChallengesPage() {
  const data = await getData();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Challenges</h1>
        <Button asChild>
          <Link href="/challenges/create">
            <Plus />
            Ajouter un challenge
          </Link>
        </Button>
      </div>
      <UserDataTable columns={ChallengeColumns} data={data} />
    </>
  );
}
