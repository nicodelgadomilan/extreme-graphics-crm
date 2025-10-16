"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Loader2, 
  Plus, 
  Calendar as CalendarIcon, 
  StickyNote, 
  Trash2, 
  Edit,
  CheckCircle2,
  Circle,
  Target,
  TrendingUp,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'nota' | 'tarea' | 'recordatorio';
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
}

const categories = [
  { value: 'nota', label: 'Nota', icon: StickyNote, color: 'text-blue-500' },
  { value: 'tarea', label: 'Tarea', icon: CheckCircle2, color: 'text-green-500' },
  { value: 'recordatorio', label: 'Recordatorio', icon: CalendarIcon, color: 'text-orange-500' },
];

export default function NotasPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'nota' as 'nota' | 'tarea' | 'recordatorio',
    dueDate: '',
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      loadNotes();
    }
  }, [session]);

  const loadNotes = () => {
    const savedNotes = localStorage.getItem('crm_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    setIsLoading(false);
  };

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem('crm_notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleCreateNote = () => {
    if (!formData.title.trim()) {
      toast.error('El título es requerido');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      completed: false,
      dueDate: formData.dueDate || null,
      createdAt: new Date().toISOString(),
    };

    saveNotes([newNote, ...notes]);
    toast.success('Nota creada exitosamente');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;

    const updatedNotes = notes.map(note =>
      note.id === editingNote.id
        ? { ...note, ...formData }
        : note
    );

    saveNotes(updatedNotes);
    toast.success('Nota actualizada exitosamente');
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta nota?')) return;

    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    toast.success('Nota eliminada exitosamente');
  };

  const handleToggleComplete = (id: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    saveNotes(updatedNotes);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      dueDate: note.dueDate || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'nota',
      dueDate: '',
    });
    setEditingNote(null);
  };

  const filteredNotes = filterCategory === 'all' 
    ? notes 
    : notes.filter(note => note.category === filterCategory);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getNotesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return notes.filter(note => note.dueDate?.startsWith(dateString));
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
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

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const todayTasks = notes.filter(n => n.category === 'tarea' && !n.completed);
  const upcomingReminders = notes.filter(n => n.category === 'recordatorio' && n.dueDate);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black mb-2">Notas y Calendario</h1>
          <p className="text-muted">
            Organiza tus tareas, notas y recordatorios
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="pill-button"
        >
          <Plus className="mr-2 h-5 w-5" />
          Nueva Nota
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-fresh">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <Target className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{todayTasks.length}</div>
            <p className="text-xs text-muted mt-1">
              Por completar
            </p>
          </CardContent>
        </Card>

        <Card className="card-fresh">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notas</CardTitle>
            <StickyNote className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{notes.length}</div>
            <p className="text-xs text-muted mt-1">
              Todas las categorías
            </p>
          </CardContent>
        </Card>

        <Card className="card-fresh">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recordatorios</CardTitle>
            <Clock className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{upcomingReminders.length}</div>
            <p className="text-xs text-muted mt-1">
              Próximos eventos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="card-fresh lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendario</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>
                  ←
                </Button>
                <span className="font-semibold min-w-[150px] text-center">
                  {monthNames[month]} {year}
                </span>
                <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>
                  →
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-muted p-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const notesForDay = getNotesForDate(date);
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <div
                    key={day}
                    className={`
                      p-2 rounded-lg border border-border min-h-[80px]
                      ${isToday ? 'bg-accent/10 border-accent' : 'hover:bg-secondary/50'}
                      transition-colors cursor-pointer
                    `}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-accent' : ''}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {notesForDay.slice(0, 2).map(note => {
                        const Icon = categories.find(c => c.value === note.category)?.icon || StickyNote;
                        return (
                          <div
                            key={note.id}
                            className="text-xs p-1 bg-accent/20 rounded truncate flex items-center gap-1"
                            title={note.title}
                          >
                            <Icon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{note.title}</span>
                          </div>
                        );
                      })}
                      {notesForDay.length > 2 && (
                        <div className="text-xs text-muted">
                          +{notesForDay.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tools */}
        <Card className="card-fresh">
          <CardHeader>
            <CardTitle>Herramientas de Ventas</CardTitle>
            <CardDescription>Accesos rápidos y recursos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp Business
              </a>
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard')}>
              <TrendingUp className="mr-2 h-5 w-5" />
              Ver Estadísticas
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/tablero')}>
              <Target className="mr-2 h-5 w-5" />
              Pipeline de Ventas
            </Button>

            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold mb-3 text-sm">Tips de Ventas</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Seguimiento en 24hrs aumenta conversión</li>
                <li>• Personaliza cada propuesta</li>
                <li>• Mantén notas detalladas</li>
                <li>• Programa recordatorios</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes List */}
      <Card className="card-fresh mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todas las Notas</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={filterCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory('all')}
              >
                Todas
              </Button>
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.value}
                    variant={filterCategory === cat.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory(cat.value)}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => {
                const category = categories.find(c => c.value === note.category);
                const Icon = category?.icon || StickyNote;
                
                return (
                  <div
                    key={note.id}
                    className={`
                      p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors
                      ${note.completed ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {note.category === 'tarea' && (
                          <button
                            onClick={() => handleToggleComplete(note.id)}
                            className="mt-1"
                          >
                            {note.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted" />
                            )}
                          </button>
                        )}
                        <Icon className={`h-5 w-5 mt-1 ${category?.color}`} />
                        <div className="flex-1">
                          <h4 className={`font-semibold ${note.completed ? 'line-through' : ''}`}>
                            {note.title}
                          </h4>
                          {note.content && (
                            <p className="text-sm text-muted mt-1">{note.content}</p>
                          )}
                          <div className="flex gap-3 mt-2 text-xs text-muted">
                            <span>{category?.label}</span>
                            {note.dueDate && (
                              <span>
                                📅 {new Date(note.dueDate).toLocaleDateString('es-ES')}
                              </span>
                            )}
                            <span>
                              Creado: {new Date(note.createdAt).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditNote(note)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted py-8">
                No hay notas {filterCategory !== 'all' ? `de tipo ${categories.find(c => c.value === filterCategory)?.label}` : ''}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingNote ? 'Editar Nota' : 'Nueva Nota'}
            </DialogTitle>
            <DialogDescription>
              {editingNote ? 'Modifica la información de tu nota' : 'Crea una nueva nota, tarea o recordatorio'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Tipo</Label>
              <div className="flex gap-2">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <Button
                      key={cat.value}
                      type="button"
                      variant={formData.category === cat.value ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, category: cat.value as any })}
                      className="flex-1"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Llamar a cliente para seguimiento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Detalles adicionales..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Fecha</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={editingNote ? handleUpdateNote : handleCreateNote}>
              {editingNote ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}