"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Mail, Phone, Calendar, GripVertical, StickyNote, Edit2, FileText, Download } from 'lucide-react';
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

const columns = [
  { id: 'new', title: 'Nuevos', color: 'bg-blue-500' },
  { id: 'contacted', title: 'Cotizando', color: 'bg-yellow-500' },
  { id: 'qualified', title: 'Propuesta Entregada', color: 'bg-purple-500' },
  { id: 'won', title: 'Compró', color: 'bg-green-500' },
  { id: 'lost', title: 'Perdido', color: 'bg-red-500' },
];

export default function TableroPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteEditLead, setNoteEditLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
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

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    e.stopPropagation();
    setDraggedLead(lead);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', lead.id.toString());
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverColumn(null);
    
    if (!draggedLead || draggedLead.status === newStatus) {
      setDraggedLead(null);
      setIsDragging(false);
      return;
    }

    const leadId = draggedLead.id;
    const oldStatus = draggedLead.status;

    // Actualización optimista INMEDIATA del estado
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus }
          : lead
      )
    );

    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead');
      }

      const data = await response.json();
      
      // Actualizar con datos del servidor si es necesario
      if (data.lead) {
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadId ? data.lead : lead
          )
        );
      }

      toast.success('Cliente movido exitosamente');
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Error al mover el cliente');
      
      // Revertir al estado anterior
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: oldStatus }
            : lead
        )
      );
    } finally {
      setDraggedLead(null);
      setIsDragging(false);
    }
  };

  const handleViewLead = async (lead: Lead) => {
    if (!isDragging) {
      setSelectedLead(lead);
      setIsDialogOpen(true);
      await fetchLeadFiles(lead.id);
    }
  };

  const handleOpenNoteDialog = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    setNoteEditLead(lead);
    setNoteText(lead.notes || '');
    setIsNoteDialogOpen(true);
  };

  const handleSaveNote = async () => {
    if (!noteEditLead) return;

    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/leads/${noteEditLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...noteEditLead,
          notes: noteText,
        }),
      });

      if (!response.ok) throw new Error('Failed to update note');

      toast.success('Nota guardada exitosamente');
      setIsNoteDialogOpen(false);
      setNoteEditLead(null);
      setNoteText('');
      fetchLeads();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Error al guardar la nota');
    }
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
        <h1 className="text-4xl font-black mb-2">Tablero de Ventas</h1>
        <p className="text-muted">
          Gestiona el pipeline de ventas con drag & drop
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {columns.map((column) => {
          const columnLeads = getLeadsByStatus(column.id);
          const isOver = dragOverColumn === column.id;
          
          return (
            <div
              key={column.id}
              className="flex flex-col"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={`${column.color} text-white p-4 rounded-t-lg`}>
                <h3 className="font-bold text-lg">{column.title}</h3>
                <p className="text-sm opacity-90 mt-1">
                  {columnLeads.length} {columnLeads.length === 1 ? 'cliente' : 'clientes'}
                </p>
              </div>

              {/* Column Cards */}
              <div 
                className={`bg-secondary/30 rounded-b-lg p-4 space-y-3 min-h-[500px] flex-1 transition-all ${
                  isOver ? 'ring-2 ring-accent bg-accent/10' : ''
                }`}
              >
                {columnLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    className={`card-fresh cursor-move hover:shadow-lg transition-all overflow-hidden ${
                      draggedLead?.id === lead.id ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleViewLead(lead)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-semibold">
                            {lead.name}
                          </CardTitle>
                          {lead.ticketNumber && (
                            <p className="text-xs text-muted mt-1">
                              Ticket: {lead.ticketNumber}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => handleOpenNoteDialog(e, lead)}
                            title={lead.notes ? "Editar nota" : "Agregar nota"}
                          >
                            {lead.notes ? (
                              <StickyNote className="h-4 w-4 text-accent fill-accent" />
                            ) : (
                              <Edit2 className="h-4 w-4 text-muted" />
                            )}
                          </Button>
                          <GripVertical className="h-4 w-4 text-muted" />
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize w-fit mt-2">
                        {lead.source}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted" />
                        <span className="text-muted truncate">{lead.email}</span>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted" />
                          <span className="text-muted">{lead.phone}</span>
                        </div>
                      )}
                      {lead.notes && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-muted line-clamp-2 text-xs italic">
                            {lead.notes}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <Calendar className="h-3 w-3 text-muted" />
                        <span className="text-muted">
                          {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note Edit Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {noteEditLead?.notes ? 'Editar Nota' : 'Agregar Nota'}
            </DialogTitle>
            <DialogDescription>
              Agrega notas sobre el cliente: tipo de letrero, presupuesto, detalles, etc.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Nota</Label>
              <Textarea
                id="note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={6}
                placeholder="Ej: Interesado en letrero de neón para restaurante, presupuesto $500-$1000..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNote}>
              Guardar Nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <div className="flex gap-2">
                  <Badge className={`${columns.find(c => c.id === selectedLead.status)?.color} text-white`}>
                    {columns.find(c => c.id === selectedLead.status)?.title}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedLead.source}
                  </Badge>
                </div>
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
                  <div className="flex items-start gap-2 mb-2">
                    <StickyNote className="h-5 w-5 text-accent" />
                    <p className="text-xs text-muted font-semibold">Notas</p>
                  </div>
                  <p className="text-sm bg-secondary/50 p-3 rounded-lg">{selectedLead.notes}</p>
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
                  onClick={() => router.push(`/dashboard/agenda?id=${selectedLead.id}`)}
                  className="flex-1"
                >
                  Ver en Agenda
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}