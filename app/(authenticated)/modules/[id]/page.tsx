import { notFound } from "next/navigation";
import { ModuleEditForm } from "@/components/modules/module-edit-form";
import { ModuleQuestionsSection } from "@/components/questions/module-questions-section";
import { Module } from "@/components/modules/module-columns";

async function getModule(id: string): Promise<Module | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const module = await getModule(id);
  if (!module) notFound();

  return (
    <div className="space-y-10">
      <ModuleEditForm module={module} />
      <ModuleQuestionsSection
        moduleId={module._id}
        childQuestion={module.childQuestion}
        adultQuestion={module.adultQuestion}
      />
    </div>
  );
}
