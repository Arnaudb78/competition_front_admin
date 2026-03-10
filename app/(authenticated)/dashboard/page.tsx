import Link from "next/link";
import { cookies } from "next/headers";
import {
  Plus,
  ArrowUpDown,
  Users,
  CalendarDays,
  Puzzle,
  BarChart2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const quickActions = [
  {
    label: "Ajouter un module",
    description: "Créer un nouveau module de visite",
    href: "/modules/create",
    icon: Plus,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    label: "Gérer les modules",
    description: "Voir et modifier les modules existants",
    href: "/modules",
    icon: Puzzle,
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    label: "Ordre de la visite",
    description: "Réorganiser le parcours de visite",
    href: "/modules/order",
    icon: ArrowUpDown,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    label: "Utilisateurs",
    description: "Gérer les administrateurs",
    href: "/users",
    icon: Users,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Événements",
    description: "Analytics Afterworks, Expérience, Talks",
    href: "/events",
    icon: CalendarDays,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    label: "Statistiques",
    description: "Consulter les données de visite",
    href: "/events",
    icon: BarChart2,
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
];

async function getFirstName() {
  // On pourrait enrichir ça avec un appel /auth/me — pour l'instant placeholder
  return null;
}

export default async function DashboardPage() {
  await getFirstName();
  const _token = (await cookies()).get("admin_token")?.value;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Bonjour, bienvenue sur votre espace admin 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez l&apos;expérience Mirokaï — modules de visite, utilisateurs et
          analytics événements depuis cette interface.
        </p>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action) => (
            <Link key={action.href + action.label} href={action.href}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md hover:border-primary/30 group">
                <CardContent className="flex flex-col items-center justify-center gap-3 p-5 text-center aspect-square">
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl ${action.color} transition-transform group-hover:scale-110`}
                  >
                    <action.icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">
                      {action.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight hidden sm:block">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border bg-muted/40 p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            M
          </div>
          <div>
            <p className="font-medium">Mirokaï — Expérience immersive</p>
            <p className="text-sm text-muted-foreground mt-1">
              Cette interface vous permet de configurer les modules affichés
              lors des visites, de suivre les inscriptions aux événements et de
              gérer les accès administrateurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
