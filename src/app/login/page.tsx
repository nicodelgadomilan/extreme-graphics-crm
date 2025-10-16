"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending, refetch } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (error?.code) {
        toast.error('Email o contraseña incorrectos. Por favor verifica tus credenciales e intenta de nuevo.');
        setIsLoading(false);
        return;
      }

      // Guardar el token para las API calls
      if (data?.token) {
        localStorage.setItem('bearer_token', data.token);
        console.log('✅ Token guardado:', data.token.substring(0, 20) + '...');
      }

      console.log('✅ Login exitoso, sesión creada');
      console.log('🔄 Redirigiendo directamente...');
      
      toast.success('¡Bienvenido de nuevo!');
      
      const redirect = searchParams.get('redirect') || '/dashboard';
      
      // Esperar un momento para que se vea el toast
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Redirigir directamente sin verificar sesión (el middleware se encargará)
      console.log('🚀 Navegando a:', redirect);
      window.location.href = redirect;
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión. Por favor intenta de nuevo.');
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-black text-center">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center">
            Accede al panel de administración del CRM
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@extremegraphics.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Recordarme
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full pill-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
            <Link href="/" className="w-full">
              <Button type="button" variant="ghost" className="w-full">
                Volver al inicio
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>}>
      <LoginForm />
    </Suspense>
  );
}