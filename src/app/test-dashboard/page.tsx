"use client";

import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function TestDashboard() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">❌ No hay sesión</h1>
          <p>El usuario no está autenticado</p>
          <a href="/login" className="text-blue-500 underline mt-4 block">
            Ir a Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-8">✅ Dashboard de Prueba</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Información de Sesión</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {session.user.id}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>Nombre:</strong> {session.user.name || 'No disponible'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado de Autenticación</h2>
          <p className="text-green-600 font-semibold">✅ Usuario autenticado correctamente</p>
          <p className="text-sm text-gray-600 mt-2">
            Si puedes ver esta página, la autenticación funciona.
          </p>
        </div>

        <div className="flex space-x-4">
          <a 
            href="/dashboard" 
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Ir al Dashboard Real
          </a>
          <a 
            href="/login" 
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Ir a Login
          </a>
        </div>
      </div>
    </div>
  );
}
