import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { pipeline_stage_id, status } = await request.json();

    const updateData: any = {};
    if (pipeline_stage_id) {
      updateData.pipeline_stage_id = pipeline_stage_id;
    }
    if (status) {
      updateData.status = status;
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
