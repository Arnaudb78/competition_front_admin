import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserDataTable } from "@/components/users/user-data-table";
import { EventColumns, EventRow } from "@/components/events/event-columns";
import { PlusCircle } from "lucide-react";

async function getData(): Promise<EventRow[]> {
  const token = (await cookies()).get("admin_token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/admin/all`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function EventsListPage() {
  const events = await getData();
  const now = new Date();

  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Événements</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez vos événements à venir et passés.
          </p>
        </div>
        <Button asChild>
          <Link href="/events/create">
            <PlusCircle className="size-4 mr-2" />
            Créer un événement
          </Link>
        </Button>
      </div>

      {/* Événements à venir */}
      <section>
        <h2 className="text-base font-semibold mb-3">
          Événements à venir{" "}
          <span className="text-muted-foreground font-normal text-sm">
            ({upcoming.length})
          </span>
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucun événement à venir.</p>
        ) : (
          <UserDataTable columns={EventColumns} data={upcoming} />
        )}
      </section>

      {/* Événements passés */}
      <section>
        <h2 className="text-base font-semibold mb-3">
          Événements passés{" "}
          <span className="text-muted-foreground font-normal text-sm">
            ({past.length})
          </span>
        </h2>
        {past.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucun événement passé.</p>
        ) : (
          <UserDataTable columns={EventColumns} data={past} />
        )}
      </section>
    </div>
  );
}
