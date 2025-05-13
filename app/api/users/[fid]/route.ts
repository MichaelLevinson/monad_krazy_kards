import { NextRequest, NextResponse } from 'next/server';
import { getUserByFid, updateUserWallet } from '@/lib/db';

// Helper function to get user FID from session cookie
async function getUserFromSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const session = JSON.parse(sessionCookie.value);
    return session.fid;
  } catch (error) {
    console.error('Error parsing session cookie:', error);
    return null;
  }
}

// GET /api/users/:fid - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const currentUserFid = await getUserFromSession(request);
    
    if (!currentUserFid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const targetFid = Number(params.fid);
    
    if (isNaN(targetFid)) {
      return NextResponse.json({ error: 'Invalid FID' }, { status: 400 });
    }
    
    const user = await getUserByFid(targetFid);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Don't expose wallet address unless it's the current user
    const publicUser = {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url,
      ...(currentUserFid === targetFid ? { walletAddress: user.wallet_address } : {})
    };
    
    return NextResponse.json(publicUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/users/:fid - Update user wallet
export async function PUT(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const currentUserFid = await getUserFromSession(request);
    
    if (!currentUserFid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const targetFid = Number(params.fid);
    
    if (isNaN(targetFid)) {
      return NextResponse.json({ error: 'Invalid FID' }, { status: 400 });
    }
    
    // Users can only update their own profile
    if (currentUserFid !== targetFid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await request.json();
    
    if (!body.walletAddress) {
      return NextResponse.json(
        { error: 'Missing walletAddress field' },
        { status: 400 }
      );
    }
    
    // Update the wallet address
    const updatedUser = await updateUserWallet(targetFid, body.walletAddress);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      fid: updatedUser.fid,
      username: updatedUser.username,
      displayName: updatedUser.display_name,
      pfpUrl: updatedUser.pfp_url,
      walletAddress: updatedUser.wallet_address
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}