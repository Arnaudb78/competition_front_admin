import { cookies } from "next/headers";
import { ModuleMapEditor } from "@/components/modules/module-map-editor";

export interface MapModule {
  _id: string;
  number: number;
  name: string;
  mapX?: number;
  mapY?: number;
}

async function getModules(): Promise<MapModule[]> {
  const token = (await cookies()).get("admin_token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules/all`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ModuleMapPage() {
  const modules = await getModules();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Plan de l&apos;expérience</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Glissez les modules sur le plan pour définir leur emplacement dans le jeu.
          </p>
        </div>
      </div>
      <ModuleMapEditor modules={modules} />
    </>
  );
}
