
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { ArrowUpRight, ArrowDownLeft, DollarSign, Users, CheckCircle, Clock } from 'lucide-react';

const financialData = {
  totalRevenue: 45231.89,
  totalExpenses: 21890.50,
  netProfit: 23341.39,
  participants: 1250,
};

const monthlyData = [
  { month: "Enero", revenue: 4000, expenses: 2400 },
  { month: "Febrero", revenue: 3000, expenses: 1398 },
  { month: "Marzo", revenue: 5000, expenses: 3800 },
  { month: "Abril", revenue: 2780, expenses: 1908 },
  { month: "Mayo", revenue: 1890, expenses: 800 },
  { month: "Junio", revenue: 2390, expenses: 1800 },
];

const chartConfig = {
  revenue: { label: "Ingresos", color: "hsl(var(--chart-1))" },
  expenses: { label: "Egresos", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const recentTransactions = [
    { id: 1, type: 'Ingreso', amount: 25, description: 'Inscripción Torneo Valorant', user: 'GamerPro123', status: 'validado' },
    { id: 2, type: 'Egreso', amount: 500, description: 'Premio Torneo Verano', user: 'Titanes del Caos', status: 'pagado' },
    { id: 3, type: 'Ingreso', amount: 5, description: 'Inscripción Sorteo Skin', user: 'PlayerX', status: 'validado' },
    { id: 4, type: 'Egreso', amount: 200, description: 'Premio 2do Lugar', user: 'Fénix Imperial', status: 'pagado' },
    { id: 5, type: 'Ingreso', amount: 100, description: 'Inscripción Camp. Dota 2', user: 'Dragones de Ébano', status: 'validado' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);
  
  if (user?.role !== 'admin') {
    return null; // or a loading component
  }

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="font-headline text-4xl font-bold text-primary">Dashboard de Administrador</h1>
        <p className="mt-2 text-lg text-muted-foreground">Una vista general de las finanzas y actividad de la plataforma.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {financialData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {financialData.totalExpenses.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">+15.3% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {financialData.netProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Balance general actualizado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{financialData.participants}</div>
            <p className="text-xs text-muted-foreground">+180 desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Rendimiento Financiero Mensual</CardTitle>
            <CardDescription>Comparativa de ingresos y egresos en los últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `S/${value/1000}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle className="font-headline">Transacciones Recientes</CardTitle>
             <CardDescription>Últimos 5 movimientos registrados en el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <Badge variant={tx.type === 'Ingreso' ? 'secondary' : 'destructive'} className="text-xs">
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.user}</p>
                    </TableCell>
                    <TableCell className="text-right font-mono">S/ {tx.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
