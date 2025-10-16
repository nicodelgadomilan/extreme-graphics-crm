"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Quote {
  id: number;
  leadId: number;
  leadName: string;
  leadEmail: string;
  productId: number;
  productName: string;
  productCategory: string;
  quantity: number;
  size: string | null;
  estimatedPrice: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500',
  sent: 'bg-blue-500',
  accepted: 'bg-green-500',
  rejected: 'bg-red-500',
};

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
};

export default function QuotesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchQuotes();
    }
  }, [session, currentPage]);

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('bearer_token');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      const response = await fetch(`/api/quotes?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch quotes');

      const data = await response.json();
      setQuotes(data.quotes);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container-fresh py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-black mb-2">Cotizaciones</h1>
          <p className="text-muted">
            Total: {total} cotizaciones
          </p>
        </div>

        {/* Quotes List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Cotizaciones</CardTitle>
            <CardDescription>
              Revisa y gestiona todas las cotizaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : quotes.length > 0 ? (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          Cotización #{quote.id}
                        </h3>
                        <Badge
                          className={`${statusColors[quote.status]} text-white`}
                        >
                          {statusLabels[quote.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted mb-1">
                        👤 Cliente: {quote.leadName} ({quote.leadEmail})
                      </p>
                      <p className="text-sm text-muted mb-1">
                        📦 Producto: {quote.productName} - {quote.productCategory}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm">
                          Cantidad: <span className="font-semibold">{quote.quantity}</span>
                        </p>
                        {quote.size && (
                          <p className="text-sm">
                            Tamaño: <span className="font-semibold">{quote.size}</span>
                          </p>
                        )}
                        <p className="text-sm flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-accent">
                            ${quote.estimatedPrice.toLocaleString()}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs text-muted mt-2">
                        Creada: {new Date(quote.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted py-12">
                No hay cotizaciones disponibles
              </p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <p className="text-sm text-muted">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}