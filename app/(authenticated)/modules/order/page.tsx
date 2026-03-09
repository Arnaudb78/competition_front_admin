import { ModuleTimeline } from "@/components/modules/module-timeline";
import { Module } from "@/components/modules/module-columns";

async function getModules(): Promise<Module[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules/all`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data: Module[] = await res.json();
  return data.sort((a, b) => a.number - b.number);
}

export default async function ModuleOrderPage() {
  const modules = await getModules();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Ordre des modules</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Glissez les modules pour modifier l&apos;ordre de la visite guidée.
        </p>
      </div>
      <ModuleTimeline initialModules={modules} />
    </div>
  );
}
