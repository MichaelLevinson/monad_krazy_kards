import { NextRequest, NextResponse } from 'next/server';
import { getUserByFid } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get session cookie
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    // Parse the session
    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (error) {
      console.error('Error parsing session cookie:', error);
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    // Get user from database
    const user = await getUserByFid(session.fid);
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    // Return user data
    return NextResponse.json({
      user: {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfpUrl: user.pfp_url,
        walletAddress: user.wallet_address
      }
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}