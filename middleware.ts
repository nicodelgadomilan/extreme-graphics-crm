import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
 
export async function middleware(request: NextRequest) {
	try {
		// Intentar obtener sesión por cookies
		const session = await auth.api.getSession({
			headers: request.headers
		});
		
		console.log('🔍 Middleware check:', {
			path: request.nextUrl.pathname,
			hasSession: !!session,
			hasUser: !!session?.user,
			userId: session?.user?.id,
			hasAuthHeader: !!request.headers.get('authorization')
		});
		
		// Si hay sesión válida, permitir acceso
		if(session?.user) {
			console.log('✅ Sesión válida (cookies), permitiendo acceso');
			return NextResponse.next();
		}
		
		// Si no hay sesión por cookies, verificar si hay token bearer
		const authHeader = request.headers.get('authorization');
		if (authHeader && authHeader.startsWith('Bearer ')) {
			const token = authHeader.substring(7);
			console.log('🔑 Token bearer encontrado, verificando...');
			
			// Verificar el token con Better Auth
			try {
				const tokenSession = await auth.api.getSession({
					headers: new Headers({
						'authorization': `Bearer ${token}`
					})
				});
				
				if (tokenSession?.user) {
					console.log('✅ Token válido, permitiendo acceso');
					return NextResponse.next();
				}
			} catch (tokenError) {
				console.log('❌ Token inválido:', tokenError);
			}
		}
		
		// Si no hay sesión válida, redirigir a login
		console.log('❌ No hay sesión válida, redirigiendo a login');
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(loginUrl);
		
	} catch (error) {
		// En caso de error, redirigir a login
		console.error("❌ Middleware error:", error);
		return NextResponse.redirect(new URL("/login", request.url));
	}
}
 
export const config = {
	runtime: "nodejs",
	matcher: ["/dashboard/:path*"],
};