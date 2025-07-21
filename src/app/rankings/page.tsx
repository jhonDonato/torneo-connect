"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart"
import { Trophy } from "lucide-react";


const ChangeIndicator = ({ change }: { change: 'up' | 'down' | 'same' }) => {
  if (change === 'up') return <span className="text-green-500">▲</span>;
  if (change === 'down') return <span className="text-red-500">▼</span>;
  return <span className="text-muted-foreground">-</span>;
};

export default function RankingsPage() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Ranking de Equipos</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          La élite de la competición. Sigue el ascenso de los mejores equipos de la región.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Trophy />Tabla de Clasificación Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">Rank</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead className="text-right">Puntos</TableHead>
                <TableHead className="w-[100px] text-center">Cambio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankingData.map((team) => (
                <TableRow key={team.rank} className="font-medium">
                  <TableCell className="text-center font-bold text-xl text-primary">{team.rank}</TableCell>
                  <TableCell>{team.team}</TableCell>
                  <TableCell className="text-right font-mono">{team.points}</TableCell>
                  <TableCell className="text-center text-lg"><ChangeIndicator change={team.change as 'up' | 'down' | 'same'} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Historial de Puntos (Top 2)</CardTitle>
          <CardDescription>Evolución de puntos de los equipos líderes en los últimos meses.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart accessibilityLayer data={historyData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="Titanes del Caos" fill="var(--color-Titanes del Caos)" radius={4} />
              <Bar dataKey="Fénix Imperial" fill="var(--color-Fénix Imperial)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

const rankingData = [
  { rank: 1, team: 'Titanes del Caos', points: 1580, change: 'up' },
  { rank: 2, team: 'Fénix Imperial', points: 1550, change: 'down' },
  { rank: 3, team: 'Leones de la Grieta', points: 1490, change: 'same' },
  { rank: 4, team: 'Serpientes de Acero', points: 1420, change: 'up' },
  { rank: 5, team: 'Dragones de Ébano', points: 1380, change: 'up' },
  { rank: 6, team: 'Lobos Nocturnos', points: 1350, change: 'down' },
  { rank: 7, team: 'Espectros del Vacío', points: 1290, change: 'same' },
  { rank: 8, team: 'Guardianes de la Runa', points: 1250, change: 'same' },
];

const historyData = [
  { month: 'Ene', "Titanes del Caos": 1200, "Fénix Imperial": 1300 },
  { month: 'Feb', "Titanes del Caos": 1350, "Fénix Imperial": 1320 },
  { month: 'Mar', "Titanes del Caos": 1400, "Fénix Imperial": 1450 },
  { month: 'Abr', "Titanes del Caos": 1480, "Fénix Imperial": 1500 },
  { month: 'May', "Titanes del Caos": 1550, "Fénix Imperial": 1520 },
  { month: 'Jun', "Titanes del Caos": 1580, "Fénix Imperial": 1550 },
];

const chartConfig = {
  "Titanes del Caos": {
    label: "Titanes del Caos",
    color: "hsl(var(--primary))",
  },
  "Fénix Imperial": {
    label: "Fénix Imperial",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;
