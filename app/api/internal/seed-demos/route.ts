import { NextRequest, NextResponse } from 'next/server';
import { seedProductionDemos } from '@/lib/seedProductionDemos';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function isAuthorized(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  const commitKey = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12);
  const expected = commitKey ? `forever-seed-${commitKey}` : null;
  return Boolean(expected && key === expected);
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await seedProductionDemos();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error('seed-demos failed', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Seed failed' },
      { status: 500 },
    );
  }
}
