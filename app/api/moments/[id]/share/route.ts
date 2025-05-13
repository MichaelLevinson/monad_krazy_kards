import { NextRequest, NextResponse } from 'next/server';
import { getMomentById } from '@/lib/db';

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

// POST /api/moments/:id/share - Share a moment to Farcaster
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userFid = await getUserFromSession(request);
    
    if (!userFid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const momentId = Number(params.id);
    
    if (isNaN(momentId)) {
      return NextResponse.json({ error: 'Invalid moment ID' }, { status: 400 });
    }
    
    // Get the moment to share
    const moment = await getMomentById(momentId);
    
    if (!moment) {
      return NextResponse.json({ error: 'Moment not found' }, { status: 404 });
    }
    
    // In a real app, you'd call Farcaster API to share the moment
    // For Phase 1, we'll just return success
    
    // Track share analytics (simplified)
    console.log(`Moment ${momentId} shared by user ${userFid}`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Moment shared successfully'
    });
  } catch (error) {
    console.error('Error sharing moment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}