import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByFid } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Parse the authorization code from query parameters
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      // If no code is provided, redirect to the Farcaster auth endpoint
      // This is a simplified version - in a real app you'd use a proper OAuth flow
      const fcUrl = new URL('https://api.warpcast.com/v2/auth');
      fcUrl.searchParams.append('response_type', 'code');
      fcUrl.searchParams.append('client_id', process.env.FARCASTER_CLIENT_ID || '');
      fcUrl.searchParams.append('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/farcaster`);
      fcUrl.searchParams.append('scope', 'user:read');
      
      return NextResponse.redirect(fcUrl.toString());
    }
    
    // Exchange code for token - mock implementation
    // In a real app, you'd call the Farcaster API to exchange the code for an access token
    // Then use that token to fetch the user profile
    
    // Mock user data - in a real app this would come from the Farcaster API
    const mockUser = {
      fid: 12345,
      username: 'monad_user',
      displayName: 'Monad User',
      pfpUrl: 'https://cdn.stamp.fyi/avatar/eth:0x0000000000000000000000000000000000000000?s=300',
      walletAddress: null
    };
    
    // Store user in database
    const user = await createUser(mockUser);
    
    // Create a session cookie
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set({
      name: 'session',
      value: JSON.stringify({ fid: user.fid }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 1 week
    });
    
    return response;
  } catch (error) {
    console.error('Error in Farcaster authentication:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}

// In a real implementation, you'd also need to implement token refresh and other OAuth flow components