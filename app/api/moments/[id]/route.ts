import { NextRequest, NextResponse } from 'next/server';
import { getMomentById, updateMomentCustomMessage } from '@/lib/db';

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

// GET /api/moments/:id - Get a specific moment
export async function GET(
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
    
    const moment = await getMomentById(momentId);
    
    if (!moment) {
      return NextResponse.json({ error: 'Moment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ moment });
  } catch (error) {
    console.error('Error fetching moment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/moments/:id - Update a moment's custom message
export async function PATCH(
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
    
    // Get the moment to check ownership
    const moment = await getMomentById(momentId);
    
    if (!moment) {
      return NextResponse.json({ error: 'Moment not found' }, { status: 404 });
    }
    
    // Check if the user owns this moment
    if (moment.fid !== userFid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await request.json();
    
    if (!body.customMessage) {
      return NextResponse.json(
        { error: 'Missing customMessage field' },
        { status: 400 }
      );
    }
    
    // Update the custom message
    const updatedMoment = await updateMomentCustomMessage(
      momentId,
      body.customMessage
    );
    
    return NextResponse.json({ moment: updatedMoment });
  } catch (error) {
    console.error('Error updating moment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}