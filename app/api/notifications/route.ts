import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: tokenData, error: tokenError } = await supabaseAdmin.auth.getUser(token);

    if (tokenError || !tokenData.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = tokenData.user.id;
    const limit = 20;

    // Fetch notifications, most recent first
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notifications: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: tokenData, error: tokenError } = await supabaseAdmin.auth.getUser(token);

    if (tokenError || !tokenData.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type = 'info', link } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: tokenData.user.id,
        title,
        message,
        type,
        link,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notification: data?.[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
