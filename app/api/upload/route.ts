import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy tệp tải lên' }, { status: 400 });
    }

    // Check size limit (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Tệp quá lớn. Vui lòng tải tệp dưới 50MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv)$/i.test(file.name);
    const mediaType = isVideo ? 'video' : 'image';
    const mimeType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');

    // Clean filename
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filename = `${timestamp}_${safeName}`;

    // 1. Write to public/uploads on disk as secondary copy
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
    } catch (fsErr) {
      console.warn('Could not write file to public/uploads disk:', fsErr);
    }

    // 2. For images and files under 15MB, generate a self-contained Data URL
    // This guarantees the image is saved directly in MySQL LONGTEXT and NEVER gets lost
    // across container restarts, preview URLs, or multi-replica deployments!
    let publicUrl = '';
    if (!isVideo || file.size < 15 * 1024 * 1024) {
      const base64 = buffer.toString('base64');
      publicUrl = `data:${mimeType};base64,${base64}`;
    } else {
      publicUrl = `/uploads/${filename}`;
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
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Upload failed';
    console.error('Upload error:', errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
