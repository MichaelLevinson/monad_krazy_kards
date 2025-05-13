import { NextRequest, NextResponse } from "next/server";
import { APP_URL } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    // Get frame message from the body
    const body = await req.json();
    
    // Return a frame response with a redirect to the game page
    return NextResponse.json({
      frames: {
        version: "vNext",
        image: `${APP_URL}/images/game-promo.png`,
        buttons: [
          {
            label: "🎮 Play Now!",
            action: "post_redirect"
          }
        ],
        // Redirect user to the game
        postUrl: `${APP_URL}/api/frame/play`
      }
    });
  } catch (error) {
    console.error('Frame error:', error);
    return NextResponse.json({ error: 'Failed to process frame request' }, { status: 500 });
  }
}