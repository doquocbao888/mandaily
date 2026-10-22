import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique timestamped name
    const timestamp = Date.now();
    const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${timestamp}_${cleanOriginalName}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv)$/i.test(file.name);
    const mediaType = isVideo ? 'video' : 'image';
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      media: {
        id: `media-${timestamp}`,
        name: file.name,
        url: publicUrl,
        type: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
        mediaType,
        size: file.size,
        createdAt: new Date().toLocaleString('vi-VN'),
      }
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Upload failed';
    console.error('Upload error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
