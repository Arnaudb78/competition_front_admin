import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { User, UserColumns } from "@/components/users/user-columns";
import { UserDataTable } from "@/components/users/user-data-table";

async function getData(): Promise<User[]> {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await result.json();
  return data;
}

export default async function UserPage() {
  const data = await getData();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Utilisateurs</h1>
      </div>
      <CreateUserDialog />
      <div className="w-full h-full flex flex-col">
        <UserDataTable columns={UserColumns} data={data} />
      </div>
    </>
  );
}
