import { NextRequest, NextResponse } from "next/server";
import { APP_URL } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    return NextResponse.json({
      frames: {
        version: "vNext",
        image: `${APP_URL}/images/game-loading.png`,
        buttons: [],
        redirect: `${APP_URL}/game`
      }
    });
  } catch (error) {
    console.error('Frame error:', error);
    return NextResponse.json({ error: 'Failed to process frame request' }, { status: 500 });
  }
}