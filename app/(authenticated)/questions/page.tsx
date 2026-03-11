import { cookies } from "next/headers";
import { Question, QuestionColumns } from "@/components/questions/question-columns";
import { UserDataTable } from "@/components/users/user-data-table";
import { CreateQuestionDialog } from "@/components/questions/create-question-dialog";

async function getData(): Promise<Question[]> {
  const token = (await cookies()).get("admin_token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function QuestionsPage() {
  const data = await getData();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Questions</h1>
        <CreateQuestionDialog />
      </div>
      <UserDataTable columns={QuestionColumns} data={data} />
    </>
  );
}
