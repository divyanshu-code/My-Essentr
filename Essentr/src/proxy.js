import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// In nextjs.16 middleware is called as proxy

export async function proxy(req){
     
      const { pathname } = req.nextUrl;

      const publicRoutes = ['/api/auth','/register' , '/_next'];

      if(publicRoutes.some(route => pathname.startsWith(route))){
          return NextResponse.next();
      }

      // here we will create logic if the user is not authenticated then redirect to register page

    const token = await getToken({ req, secret: process.env.AUTH_SECRET}); 

    if(!token){
        const url = new URL("/register", req.url);
        url.searchParams.set("callbackUrl", req.url);    // we store the requested url in callbackUrl so that after login we can redirect the user to the requested page
        return NextResponse.redirect(url);
    }
    
    const role = token.role;

    // role based access control

    if(pathname.startsWith('/vendor') && role !== 'vendor'){
        const url = new URL("/unauthorized", req.url);
        return NextResponse.redirect(url);
    }

    if(pathname.startsWith('/delivery') && role !== 'delivery'){
        const url = new URL("/unauthorized", req.url);
        return NextResponse.redirect(url);
    }

    if(pathname.startsWith('/customer') && role !== 'customer'){
        const url = new URL("/unauthorized", req.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// when not to run the middleware . excluded for static files and next image files and other modules 

export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};