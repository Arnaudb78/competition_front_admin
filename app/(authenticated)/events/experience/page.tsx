"use client";

import Link from "next/link";
import { ChevronLeft, Ticket, BarChart2, Users, TrendingUp } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/events/stat-card";
import {
  experienceCheckinStats,
  experienceAudit,
  experienceDiscoverySources,
  experienceTopZip,
} from "@/lib/events-data";

const COLORS = [
  "var(--color-chart-2)",
  "var(--color-chart-1)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const checkinPieData = [
  { name: "Checked In",      value: experienceCheckinStats.checkedIn },
  { name: "No Show",         value: experienceCheckinStats.noShow },
];

const ticketTypeData = [
  { type: "Normal (5€)",       sold: 120 },
  { type: "Moins de 15 ans",   sold: 78  },
  { type: "Billets offerts",   sold: 44  },
];

const tauxRemplissage = Math.round((experienceAudit.totalVendus / experienceAudit.capaciteTotale) * 100);
const tauxPresence = Math.round(
  (experienceCheckinStats.checkedIn / (experienceCheckinStats.checkedIn + experienceCheckinStats.noShow)) * 100
);

export default function ExperiencePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">L&apos;Expérience Mirokaï</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Sessions immersives de {experienceAudit.capaciteParCreneau} personnes · données Eventbrite
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Créneaux disponibles"
          value={experienceAudit.nombreCreneaux}
          subtitle={`${experienceAudit.capaciteParCreneau} places par créneau`}
          icon={BarChart2}
        />
        <StatCard
          title="Capacité totale"
          value={experienceAudit.capaciteTotale.toLocaleString("fr-FR")}
          subtitle="Places cumulées"
          icon={Ticket}
        />
        <StatCard
          title="Places vendues"
          value={experienceAudit.totalVendus}
          subtitle={`Taux de remplissage : ${tauxRemplissage}%`}
          icon={Users}
        />
        <StatCard
          title="Taux de présence"
          value={`${tauxPresence}%`}
          subtitle={`${experienceCheckinStats.checkedIn} check-ins / ${experienceCheckinStats.checkedIn + experienceCheckinStats.noShow} inscrits`}
          icon={TrendingUp}
        />
      </div>

      {/* Funnel présence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Funnel de présence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Capacité totale", value: experienceAudit.capaciteTotale, max: experienceAudit.capaciteTotale, color: "bg-muted-foreground/30" },
              { label: "Places vendues", value: experienceAudit.totalVendus, max: experienceAudit.capaciteTotale, color: "bg-chart-1" },
              { label: "Inscrits (custom questions)", value: experienceCheckinStats.attending + experienceCheckinStats.checkedIn, max: experienceAudit.capaciteTotale, color: "bg-chart-2" },
              { label: "Checked In", value: experienceCheckinStats.checkedIn, max: experienceAudit.capaciteTotale, color: "bg-chart-3" },
            ].map((step) => {
              const pct = Math.round((step.value / step.max) * 100);
              return (
                <div key={step.label} className="flex items-center gap-4">
                  <span className="w-60 text-sm text-right shrink-0">{step.label}</span>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${step.color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-16 text-sm tabular-nums font-medium">
                    {step.value.toLocaleString("fr-FR")}
                    <span className="text-muted-foreground font-normal ml-1 text-xs">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Check-in donut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statut check-in</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={checkinPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                >
                  {checkinPieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-1">
              {checkinPieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span>{d.name}</span>
                  </div>
                  <span className="font-medium tabular-nums">
                    {d.value} · {Math.round((d.value / (experienceCheckinStats.checkedIn + experienceCheckinStats.noShow)) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sources de découverte */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comment les visiteurs ont découvert l&apos;Expérience</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={experienceDiscoverySources} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="source" tick={{ fontSize: 12 }} width={130} />
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }}
                />
                <Bar dataKey="count" name="Réponses" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Répartition géographique */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Codes postaux d&apos;origine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {experienceTopZip.map((z) => {
              const maxCount = experienceTopZip[0].count;
              const pct = Math.round((z.count / maxCount) * 100);
              return (
                <div key={z.zip} className="flex items-center gap-3">
                  <span className="w-16 text-sm font-mono text-muted-foreground">{z.zip}</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-sm tabular-nums text-right">{z.count}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">Données partielles (répondants aux questions custom uniquement)</p>
        </CardContent>
      </Card>
    </div>
  );
}
