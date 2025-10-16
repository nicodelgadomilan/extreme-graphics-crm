import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
 
export async function middleware(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});
		
		// Si no hay sesión, redirigir a login
		if(!session?.user) {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}
		
		// Continuar con la request
		return NextResponse.next();
	} catch (error) {
		// En caso de error, redirigir a login
		console.error("Middleware error:", error);
		return NextResponse.redirect(new URL("/login", request.url));
	}
}
 
export const config = {
	runtime: "nodejs",
	matcher: ["/dashboard/:path*"],
};