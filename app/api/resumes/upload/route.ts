import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const applicationId = formData.get('applicationId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get auth token from header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user from token
    const { data: tokenData, error: tokenError } = await supabaseAdmin.auth.getUser(token);

    if (tokenError || !tokenData.user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = tokenData.user.id;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF and Word documents are allowed' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const fileName = `${userId}/${applicationId || 'profile'}_${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('resumes')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrl } = supabaseAdmin.storage
      .from('resumes')
      .getPublicUrl(uploadData.path);

    // Save resume record to database
    const { data: resumeData, error: dbError } = await supabaseAdmin
      .from('resumes')
      .insert({
        user_id: userId,
        application_id: applicationId || null,
        file_url: publicUrl.publicUrl,
        file_name: file.name,
        file_size: file.size,
        content_type: file.type,
      })
      .select('id, file_url, file_name');

    if (dbError) {
      // Clean up uploaded file if DB insert fails
      await supabaseAdmin.storage
        .from('resumes')
        .remove([uploadData.path]);

      return NextResponse.json(
        { error: 'Failed to save resume record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      resume: resumeData?.[0],
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
