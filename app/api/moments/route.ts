import { NextRequest, NextResponse } from 'next/server';
import { getUserMoments, getFriendMoments, createMoment, sql } from '@/lib/db';
import { DEFAULT_LIMIT, MAX_LIMIT } from '@/lib/constants';

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

// GET /api/moments - Get moments with filtering
export async function GET(request: NextRequest) {
  try {
    const userFid = await getUserFromSession(request);
    
    if (!userFid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const feedType = searchParams.get('feedType') || 'friends';
    const specificFid = searchParams.get('fid');
    const limit = Math.min(
      Number(searchParams.get('limit') || DEFAULT_LIMIT),
      MAX_LIMIT
    );
    const offset = Number(searchParams.get('offset') || 0);
    
    let moments = [];
    
    // If a specific FID is requested, get that user's moments
    if (specificFid) {
      moments = await getUserMoments(Number(specificFid), limit, offset);
    } 
    // Otherwise, get moments based on feed type
    else if (feedType === 'friends') {
      // In a real app, you'd fetch the user's friend list from Farcaster
      // For now, we'll use mock friend data
      const mockFriendFids = [54321, 65432, 76543]; // These would come from Farcaster API
      moments = await getFriendMoments(userFid, mockFriendFids, limit, offset);
    } else {
      // Get global feed (all moments)
      moments = await sql`
        SELECT m.*, u.username, u.display_name, u.pfp_url
        FROM moments m
        JOIN users u ON m.fid = u.fid
        ORDER BY m.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }
    
    return NextResponse.json({ moments });
  } catch (error) {
    console.error('Error fetching moments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/moments - Create a new moment
export async function POST(request: NextRequest) {
  try {
    const userFid = await getUserFromSession(request);
    
    if (!userFid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.momentType || !body.title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create the moment
    const moment = await createMoment({
      fid: userFid,
      momentType: body.momentType,
      title: body.title,
      description: body.description,
      transactionHash: body.transactionHash,
      contractAddress: body.contractAddress,
      customMessage: body.customMessage,
      imageUrl: body.imageUrl,
      isRare: body.isRare || false,
      metadata: body.metadata || {}
    });
    
    if (!moment) {
      throw new Error('Failed to create moment');
    }
    
    return NextResponse.json({ moment }, { status: 201 });
  } catch (error) {
    console.error('Error creating moment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}