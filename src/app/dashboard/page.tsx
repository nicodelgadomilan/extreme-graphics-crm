"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, TrendingUp, DollarSign, ArrowUpRight, Loader2, Target, Clock } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  lostLeads: number;
  totalQuotes: number;
  activeQuotes: number;
  acceptedQuotes: number;
  conversionRate: number;
  leadsByStatus: Record<string, number>;
  leadsBySource: Record<string, number>;
  recentLeads: Array<{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    source: string;
    status: string;
    createdAt: string;
  }>;
}

const statusLabels: Record<string, string> = {
  new: 'Nuevos',
  contacted: 'Cotizando',
  qualified: 'Propuesta Entregada',
  won: 'Compró',
  lost: 'Perdido',
};

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido de nuevo, {session.user.name}
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="card-fresh">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats?.totalLeads || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.newLeads || 0} nuevos esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="card-fresh">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats?.totalQuotes || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.activeQuotes || 0} activas
            </p>
          </CardContent>
        </Card>

        <Card className="card-fresh">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats?.conversionRate?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.wonLeads || 0} ganados de {stats?.totalLeads || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="card-fresh">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Cerradas</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats?.wonLeads || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.acceptedQuotes || 0} cotizaciones aceptadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="card-fresh">
          <CardHeader>
            <CardTitle>Distribución por Etapa</CardTitle>
            <CardDescription>Estado actual de todos los clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusLabels).map(([status, label]) => {
                const count = stats?.leadsByStatus?.[status] || 0;
                const percentage = stats?.totalLeads ? (count / stats.totalLeads) * 100 : 0;
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-sm text-muted-foreground">{count} clientes</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="card-fresh">
          <CardHeader>
            <CardTitle>Fuentes de Leads</CardTitle>
            <CardDescription>De dónde vienen tus clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.leadsBySource && Object.entries(stats.leadsBySource).map(([source, count]) => {
                const percentage = stats.totalLeads ? (count / stats.totalLeads) * 100 : 0;
                
                return (
                  <div key={source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{source}</span>
                      <span className="text-sm text-muted-foreground">{count} clientes</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/agenda">
          <Card className="card-fresh cursor-pointer h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Agenda de Clientes</CardTitle>
              <CardDescription>
                Ver todos los clientes y su información
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ir a Agenda
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/tablero">
          <Card className="card-fresh cursor-pointer h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Tablero de Ventas</CardTitle>
              <CardDescription>
                Gestiona el pipeline de ventas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ver Tablero
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/notas">
          <Card className="card-fresh cursor-pointer h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Notas y Calendario</CardTitle>
              <CardDescription>
                Organiza tus tareas y notas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ver Notas
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Leads */}
      <Card className="card-fresh">
        <CardHeader>
          <CardTitle>Últimos Tickets Creados</CardTitle>
          <CardDescription>
            Los últimos clientes registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentLeads && stats.recentLeads.length > 0 ? (
              stats.recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                        {lead.source}
                      </span>
                      <span className="text-xs px-2 py-1 bg-secondary rounded">
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </div>
                  </div>
                  <Link href={`/dashboard/agenda?id=${lead.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No hay tickets recientes
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}