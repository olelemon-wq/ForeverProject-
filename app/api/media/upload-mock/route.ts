import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }

    // Ensure the key is safe and starts with 'uploads/'
    if (!key.startsWith('uploads/')) {
      return NextResponse.json({ error: 'Invalid key path' }, { status: 400 });
    }

    // Read the arrayBuffer from request body
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Construct target path under the public directory
    const targetPath = path.join(process.cwd(), 'public', key);

    // Ensure parent directory exists
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file to public folder
    fs.writeFileSync(targetPath, buffer);

    return NextResponse.json({ success: true, filePath: `/${key}` });
  } catch (error: any) {
    console.error('Error writing mock file to disk:', error);
    return NextResponse.json({ error: error.message || 'Failed to save mock file' }, { status: 500 });
  }
}
