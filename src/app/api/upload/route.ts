import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would upload to Convex storage here
    // For now, we'll return a mock URL
    const fileId = `file-${uuidv4()}`;
    const fileUrl = `https://storage.convex.cloud/files/${fileId}/${file.name}`;
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      storageId: fileId
    });
    
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
