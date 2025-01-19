import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const tvmToken = request.cookies.get('TVM_TOKEN')

  const response = NextResponse.next();

  if (tvmToken) {
    response.headers.set('Authorization', `Bearer ${tvmToken.value}`);
  }
  return response;
  // if (request.nextUrl.pathname !== '/auth') {
  //   return NextResponse.redirect(new URL('/auth', request.url))
  // }
}