import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Clear session cookie
  const response = NextResponse.json({ success: true });
  
  response.cookies.set({
    name: 'session',
    value: '',
    expires: new Date(0),
    path: '/'
  });
  
  return response;
}