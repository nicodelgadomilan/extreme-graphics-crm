"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function TestToken() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const testToken = async () => {
      const bearerToken = localStorage.getItem('bearer_token');
      setToken(bearerToken);

      if (!bearerToken) {
        setStatus('error');
        setMessage('No hay token en localStorage');
        return;
      }

      try {
        // Probar acceso al dashboard con el token
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setStatus('success');
          setMessage('✅ Token válido - Puedes acceder al dashboard');
        } else {
          setStatus('error');
          setMessage(`❌ Token inválido - Error ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        setStatus('error');
        setMessage(`❌ Error de red: ${error}`);
      }
    };

    testToken();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔑 Test de Token Bearer</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado del Token</h2>
          <div className={`p-4 rounded ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Token Actual</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {token ? `${token.substring(0, 50)}...` : 'No hay token'}
          </pre>
        </div>

        <div className="flex space-x-4">
          <a 
            href="/dashboard" 
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Probar Dashboard
          </a>
          <a 
            href="/login" 
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Ir a Login
          </a>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Recargar Test
          </button>
        </div>
      </div>
    </div>
  );
}
