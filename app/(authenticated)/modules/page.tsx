import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Module, ModuleColumns } from "@/components/modules/module-columns";
import { UserDataTable } from "@/components/users/user-data-table";


async function getData(): Promise<Module[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules/all`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ModulesPage() {
  const data = await getData();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Modules</h1>
        <Button asChild>
          <Link href="/modules/create">
            <Plus />
            Ajouter un module
          </Link>
        </Button>
      </div>
      <UserDataTable columns={ModuleColumns} data={data} />
    </>
  );
}
