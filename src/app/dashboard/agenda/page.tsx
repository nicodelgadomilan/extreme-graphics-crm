"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Search, Mail, Phone, Calendar, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: string;
  notes: string | null;
  ticketNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FileData {
  id: number;
  leadId: number;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export default function AgendaPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [leadFiles, setLeadFiles] = useState<FileData[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchLeads();
    }
  }, [session]);

  useEffect(() => {
    const leadId = searchParams.get('id');
    if (leadId && leads.length > 0) {
      const lead = leads.find(l => l.id === parseInt(leadId));
      if (lead) {
        handleViewLead(lead);
      }
    }
  }, [searchParams, leads]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch('/api/leads?limit=1000', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch leads');

      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Error al cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeadFiles = async (leadId: number) => {
    setIsLoadingFiles(true);
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/files?leadId=${leadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch files');

      const data = await response.json();
      setLeadFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Error al cargar los archivos');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleViewLead = async (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
    await fetchLeadFiles(lead.id);
  };

  const handleDownloadFile = (file: FileData) => {
    const link = document.createElement('a');
    link.href = file.fileUrl;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPending || isLoading) {
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Agenda de Clientes</h1>
        <p className="text-muted">
          Visualiza y gestiona todos tus clientes
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <Input
            placeholder="Buscar por nombre, email, teléfono o ticket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Clients Table */}
      <Card className="card-fresh">
        <CardHeader>
          <CardTitle>Todos los Clientes ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => handleViewLead(lead)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{lead.name}</h3>
                    {lead.ticketNumber && (
                      <Badge variant="outline" className="text-xs">
                        {lead.ticketNumber}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {lead.email}
                    </span>
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
                <Badge className="capitalize">{lead.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
            <DialogDescription>
              Información completa del cliente y archivos adjuntos
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedLead.name}</h3>
                {selectedLead.ticketNumber && (
                  <p className="text-sm text-muted mb-2">
                    Ticket: <span className="font-mono font-semibold">{selectedLead.ticketNumber}</span>
                  </p>
                )}
                <Badge className="capitalize">{selectedLead.status}</Badge>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-xs text-muted">Email</p>
                    <p className="font-medium">{selectedLead.email}</p>
                  </div>
                </div>

                {selectedLead.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted" />
                    <div>
                      <p className="text-xs text-muted">Teléfono</p>
                      <p className="font-medium">{selectedLead.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-xs text-muted">Fecha de creación</p>
                    <p className="font-medium">
                      {new Date(selectedLead.createdAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>

              {selectedLead.notes && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted mb-2 font-semibold">Notas</p>
                  <p className="text-sm bg-secondary/50 p-3 rounded-lg whitespace-pre-wrap">
                    {selectedLead.notes}
                  </p>
                </div>
              )}

              {/* Archivos Adjuntos */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-muted" />
                  <p className="text-sm font-semibold">Archivos Adjuntos</p>
                </div>
                {isLoadingFiles ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  </div>
                ) : leadFiles.length > 0 ? (
                  <div className="space-y-2">
                    {leadFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{file.filename}</p>
                          <p className="text-xs text-muted">
                            {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadFile(file)}
                          title="Descargar archivo"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted text-center py-6">
                    No hay archivos adjuntos
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cerrar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/tablero`)}
                  className="flex-1"
                >
                  Ver en Tablero
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}