"use client";

import Link from "next/link";
import { ChevronLeft, Mic, Users, CalendarCheck, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/events/stat-card";
import { talksEditions, talksTopCities } from "@/lib/events-data";

const COLORS = [
  "var(--color-chart-2)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-1)",
  "var(--color-chart-3)",
];

const totalInscrits = talksEditions.reduce((s, e) => s + e.inscrits, 0);
const totalCheckedIn = talksEditions.reduce((s, e) => s + e.checkedIn, 0);
const totalNoShow = talksEditions.reduce((s, e) => s + e.noShow, 0);
const avgPresence = Math.round((totalCheckedIn / totalInscrits) * 100);

const barData = talksEditions.map((e) => ({
  name: e.shortTitle,
  Inscrits: e.inscrits,
  Présents: e.checkedIn,
  "No Show": e.noShow,
}));

const globalStatusData = [
  { name: "Présents", value: totalCheckedIn },
  { name: "No Show",  value: totalNoShow },
];

export default function TalksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Enchanted Talks</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {talksEditions.length} conférences · robotique & IA
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Talks organisés"
          value={talksEditions.length}
          subtitle="Juin → Sept 2025"
          icon={Mic}
        />
        <StatCard
          title="Total inscrits"
          value={totalInscrits}
          subtitle="Tous talks confondus"
          icon={Users}
        />
        <StatCard
          title="Total présents"
          value={totalCheckedIn}
          subtitle="Personnes scannées"
          icon={CalendarCheck}
        />
        <StatCard
          title="Taux de présence moyen"
          value={`${avgPresence}%`}
          subtitle={`${totalNoShow} no-shows`}
          icon={TrendingUp}
        />
      </div>

      {/* Bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inscrits vs Présents vs No Show par talk</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }}
              />
              <Legend />
              <Bar dataKey="Inscrits"  fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Présents"  fill={COLORS[1]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="No Show"   fill={COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donut global */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Répartition globale présents / no-shows</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={globalStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                  labelLine={false}
                >
                  {globalStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-1">
              {globalStatusData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span>{d.name}</span>
                  </div>
                  <span className="font-medium tabular-nums">
                    {d.value} · {Math.round((d.value / totalInscrits) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top villes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Villes des participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {talksTopCities.map((c) => {
                const maxCount = talksTopCities[0].count;
                const pct = Math.round((c.count / maxCount) * 100);
                return (
                  <div key={c.city} className="flex items-center gap-3">
                    <span className="w-40 text-sm truncate">{c.city}</span>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-sm tabular-nums text-right">{c.count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détail par talk */}
      <div className="grid gap-4 sm:grid-cols-3">
        {talksEditions.map((talk) => {
          const rate = Math.round((talk.checkedIn / talk.inscrits) * 100);
          return (
            <Card key={talk.shortTitle}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm leading-snug">{talk.title}</CardTitle>
                {talk.speaker && (
                  <p className="text-xs text-muted-foreground">avec {talk.speaker}</p>
                )}
                <p className="text-xs text-muted-foreground">{talk.date}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Inscrits</span>
                    <span className="font-medium">{talk.inscrits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Présents</span>
                    <span className="font-medium">{talk.checkedIn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">No Show</span>
                    <span className="font-medium">{talk.noShow}</span>
                  </div>
                  <div className="pt-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Taux de présence</span>
                      <span className="font-semibold">{rate}%</span>
                    </div>
                    <div className="bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
