import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
 
export async function middleware(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});
		
		console.log('🔍 Middleware check:', {
			path: request.nextUrl.pathname,
			hasSession: !!session,
			hasUser: !!session?.user,
			userId: session?.user?.id
		});
		
		// Si no hay sesión, redirigir a login
		if(!session?.user) {
			console.log('❌ No hay sesión, redirigiendo a login');
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}
		
		console.log('✅ Sesión válida, permitiendo acceso');
		// Continuar con la request
		return NextResponse.next();
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