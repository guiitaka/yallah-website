import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const isMobile = /mobile|iphone|ipad|android|phone|webos|ipod|blackberry|windows phone/i.test(userAgent);
  const url = request.nextUrl.clone();
  const isMobilePath = url.pathname.startsWith('/mobile');

  // Verifica se é uma requisição de asset estático
  const isStaticAsset = /\.(jpg|jpeg|png|gif|svg|webm|mp4|webp|css|js|ico|json)$/i.test(url.pathname);

  // Se for asset estático ou estiver na pasta public, não redireciona
  if (isStaticAsset || url.pathname.startsWith('/videos/') || url.pathname.startsWith('/icons/')) {
    return NextResponse.next();
  }

  // Se for dispositivo mobile e não estiver em um caminho mobile, redireciona para versão mobile
  if (isMobile && !isMobilePath && !url.pathname.startsWith('/_next')) {
    url.pathname = `/mobile${url.pathname}`;
    return NextResponse.redirect(url);
  }

  // Se for desktop e estiver em um caminho mobile, redireciona para versão desktop
  if (!isMobile && isMobilePath) {
    url.pathname = url.pathname.replace('/mobile', '');
    return NextResponse.redirect(url);
  }

  // Verificar se é a rota admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Configuração de segurança do painel administrativo:
    // - Persistência de sessão temporária: sessão expira quando o navegador é fechado
    // - Cookie com duração de 2 horas: forçando autenticação periódica
    // - Verificação de token em todas as rotas protegidas

    // Se não for exatamente /admin (página de login) e não tiver um token, redirecionar para a página de login
    if (request.nextUrl.pathname !== '/admin' && !request.cookies.get('admin_session')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Se for exatamente /admin (página de login) e já tiver um token, redirecionar para o inbox
    if (request.nextUrl.pathname === '/admin' && request.cookies.get('admin_session')) {
      return NextResponse.redirect(new URL('/admin/inbox', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/admin/:path*'
  ],
}; 