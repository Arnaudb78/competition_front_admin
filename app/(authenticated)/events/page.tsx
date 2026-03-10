import Link from "next/link";
import { Calendar, Users, Mic } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { afterworkEditions, talksEditions, experienceAudit, experienceCheckinStats } from "@/lib/events-data";

const totalAfterworkInscrits = afterworkEditions.reduce((s, e) => s + e.inscrits, 0);
const totalAfterworkCheckedIn = afterworkEditions.reduce((s, e) => s + e.checkedIn, 0);
const totalTalksInscrits = talksEditions.reduce((s, e) => s + e.inscrits, 0);
const totalTalksCheckedIn = talksEditions.reduce((s, e) => s + e.checkedIn, 0);

const eventCategories = [
  {
    slug: "afterwork",
    label: "Afterworks",
    description: "Soirées networking mensuelles",
    icon: Users,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    stats: [
      { label: "Éditions", value: afterworkEditions.length },
      { label: "Inscrits total", value: totalAfterworkInscrits.toLocaleString("fr-FR") },
      { label: "Taux de présence", value: `${Math.round((totalAfterworkCheckedIn / totalAfterworkInscrits) * 100)}%` },
    ],
    lastDate: afterworkEditions[afterworkEditions.length - 1].date,
  },
  {
    slug: "experience",
    label: "L'Expérience Mirokaï",
    description: "Sessions immersives de 15 personnes",
    icon: Calendar,
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    stats: [
      { label: "Créneaux", value: experienceAudit.nombreCreneaux },
      { label: "Places vendues", value: experienceAudit.totalVendus },
      { label: "Taux de remplissage", value: `${Math.round((experienceAudit.totalVendus / experienceAudit.capaciteTotale) * 100)}%` },
    ],
    lastDate: "Programmation continue",
  },
  {
    slug: "talks",
    label: "Enchanted Talks",
    description: "Conférences thématiques sur la robotique et l'IA",
    icon: Mic,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    stats: [
      { label: "Talks", value: talksEditions.length },
      { label: "Inscrits total", value: totalTalksInscrits },
      { label: "Taux de présence", value: `${Math.round((totalTalksCheckedIn / totalTalksInscrits) * 100)}%` },
    ],
    lastDate: talksEditions[talksEditions.length - 1].date,
  },
];

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Événements</h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble des événements Mirokaï — cliquez sur une catégorie pour voir les analytics détaillés.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {eventCategories.map((cat) => (
          <Link key={cat.slug} href={`/events/${cat.slug}`} className="group">
            <Card className="h-full transition-shadow hover:shadow-md cursor-pointer border-border group-hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-lg ${cat.color}`}>
                    <cat.icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{cat.label}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{cat.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {cat.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-xl font-bold tabular-nums">{stat.value}</div>
                      <div className="text-xs text-muted-foreground leading-tight mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
                  Dernier événement : <span className="font-medium text-foreground">{cat.lastDate}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
