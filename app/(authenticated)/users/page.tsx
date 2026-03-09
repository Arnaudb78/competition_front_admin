import { CreateUserDialog } from "@/components/users/create-user-dialog"

export default function UserPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Utilisateurs</h1>
        <CreateUserDialog />
      </div>
    </>
  )
}
