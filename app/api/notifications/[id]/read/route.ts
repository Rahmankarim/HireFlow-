import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if notification belongs to user
    const { data: notification, error: notifError } = await supabaseAdmin
      .from('notifications')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', tokenData.user.id)
      .single();

    if (notifError || !notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('id', params.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notification: data?.[0] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
