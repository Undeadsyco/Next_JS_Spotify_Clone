import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { url } = req;

  // allow requests if following is true
  if (url?.includes('/api/auth') || token) return NextResponse.next();

  // else redirect to login 
  if (!token && !url.includes('/login')) return NextResponse.redirect('http://localhost:3000/login');
}