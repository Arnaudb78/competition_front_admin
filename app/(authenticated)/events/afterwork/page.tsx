"use client";

import Link from "next/link";
import { ChevronLeft, Users, TrendingUp, CalendarCheck, XCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/events/stat-card";
import { afterworkEditions, afterworkDiscoverySources, afterworkTopCities } from "@/lib/events-data";

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "oklch(0.7 0.15 140)",
  "oklch(0.6 0.18 30)",
];

const totalInscrits = afterworkEditions.reduce((s, e) => s + e.inscrits, 0);
const totalCheckedIn = afterworkEditions.reduce((s, e) => s + e.checkedIn, 0);
const totalNotAtt = afterworkEditions.reduce((s, e) => s + e.notAttending, 0);
const totalOrders = afterworkEditions.reduce((s, e) => s + e.orders, 0);
const avgPresence = Math.round((totalCheckedIn / totalInscrits) * 100);

const barData = afterworkEditions.map((e) => ({
  name: e.edition,
  Inscrits: e.inscrits,
  Présents: e.checkedIn,
  "Non venus": e.notAttending,
}));

const statusData = [
  { name: "Présents", value: totalCheckedIn },
  { name: "Inscrits (non vérifiés)", value: totalInscrits - totalCheckedIn - totalNotAtt },
  { name: "Non venus", value: totalNotAtt },
];

export default function AfterworkPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Afterworks Mirokaï</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{afterworkEditions.length} éditions · données Eventbrite</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total inscrits"
          value={totalInscrits.toLocaleString("fr-FR")}
          subtitle={`Sur ${afterworkEditions.length} éditions`}
          icon={Users}
        />
        <StatCard
          title="Total présents"
          value={totalCheckedIn.toLocaleString("fr-FR")}
          subtitle="Personnes scannées"
          icon={CalendarCheck}
        />
        <StatCard
          title="Taux de présence moyen"
          value={`${avgPresence}%`}
          subtitle={`Min 33% · Max 67%`}
          icon={TrendingUp}
        />
        <StatCard
          title="Non venus déclarés"
          value={totalNotAtt}
          subtitle={`${Math.round((totalNotAtt / totalInscrits) * 100)}% des inscrits`}
          icon={XCircle}
        />
      </div>

      {/* Bar chart inscrits vs présents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inscrits vs Présents par édition</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }}
              />
              <Legend />
              <Bar dataKey="Inscrits" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Présents" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Non venus" fill={COLORS[6]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Taux de présence par édition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Taux de présence par édition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {afterworkEditions.map((e) => {
              const rate = Math.round((e.checkedIn / e.inscrits) * 100);
              return (
                <div key={e.edition} className="flex items-center gap-3">
                  <span className="w-14 text-sm font-medium text-right shrink-0">{e.edition}</span>
                  <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm tabular-nums text-right text-muted-foreground">{rate}%</span>
                  <span className="w-28 text-xs text-muted-foreground">{e.date}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sources de découverte */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sources de découverte</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={afterworkDiscoverySources}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                >
                  {afterworkDiscoverySources.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 w-full space-y-1.5">
              {afterworkDiscoverySources.map((s, i) => (
                <div key={s.source} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span>{s.source}</span>
                  </div>
                  <span className="font-medium tabular-nums">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top villes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top villes des participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {afterworkTopCities.map((c) => {
                const total = afterworkTopCities.reduce((s, x) => s + x.count, 0);
                const pct = Math.round((c.count / total) * 100);
                return (
                  <div key={c.city} className="flex items-center gap-3">
                    <span className="w-36 text-sm truncate">{c.city}</span>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-sm tabular-nums text-right">{c.count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau récap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Récapitulatif par édition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">Édition</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Orders</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Inscrits</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Présents</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Non venus</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Taux</th>
                </tr>
              </thead>
              <tbody>
                {afterworkEditions.map((e) => (
                  <tr key={e.edition} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 font-medium">{e.edition}</td>
                    <td className="py-2 text-muted-foreground">{e.date}</td>
                    <td className="py-2 text-right tabular-nums">{e.orders}</td>
                    <td className="py-2 text-right tabular-nums">{e.inscrits}</td>
                    <td className="py-2 text-right tabular-nums">{e.checkedIn}</td>
                    <td className="py-2 text-right tabular-nums">{e.notAttending}</td>
                    <td className="py-2 text-right tabular-nums font-medium">
                      {Math.round((e.checkedIn / e.inscrits) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t bg-muted/20">
                  <td className="py-2 font-semibold" colSpan={2}>Total</td>
                  <td className="py-2 text-right font-semibold tabular-nums">{totalOrders}</td>
                  <td className="py-2 text-right font-semibold tabular-nums">{totalInscrits}</td>
                  <td className="py-2 text-right font-semibold tabular-nums">{totalCheckedIn}</td>
                  <td className="py-2 text-right font-semibold tabular-nums">{totalNotAtt}</td>
                  <td className="py-2 text-right font-semibold tabular-nums">{avgPresence}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
