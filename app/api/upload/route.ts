import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy tệp tải lên' }, { status: 400 });
    }

    // Check size limit (e.g. 50MB for video)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Tệp quá lớn. Vui lòng tải tệp dưới 50MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv)$/i.test(file.name);
    const mediaType = isVideo ? 'video' : 'image';
    const mimeType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');

    // Convert directly to Data URL (Base64) to bypass server filesystem limits and 413 Payload Too Large errors
    const base64 = buffer.toString('base64');
    const publicUrl = `data:${mimeType};base64,${base64}`;

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
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
