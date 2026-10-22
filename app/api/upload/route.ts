import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv)$/i.test(file.name);
    const mediaType = isVideo ? 'video' : 'image';
    const mimeType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');

    let publicUrl = '';

    // Attempt to write to local public/uploads directory
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
    } catch (fsErr: any) {
      // On Vercel / serverless environment, filesystem is read-only (EROFS)
      // Fallback: Store as Data URL (Base64) so it works seamlessly without server storage
      if (
        fsErr?.code === 'EROFS' || 
        String(fsErr?.message || '').toLowerCase().includes('read-only') ||
        process.env.VERCEL
      ) {
        const base64 = buffer.toString('base64');
        publicUrl = `data:${mimeType};base64,${base64}`;
      } else {
        throw fsErr;
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      media: {
        id: `media-${timestamp}`,
        name: file.name,
        url: publicUrl,
        type: mimeType,
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
