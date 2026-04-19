import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const recruiterId = request.nextUrl.searchParams.get('recruiterId');

    if (!recruiterId) {
      return NextResponse.json(
        { error: 'Recruiter ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select(
        `
        id,
        title,
        description,
        location,
        salary_min,
        salary_max,
        job_type,
        experience_level,
        status,
        created_at,
        applications (
          id,
          status,
          applicant_id,
          pipeline_stage_id,
          users:applicant_id (full_name, email, avatar_url)
        ),
        pipeline_stages (
          id,
          name,
          order_index
        )
      `
      )
      .eq('recruiter_id', recruiterId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const recruiterId = request.nextUrl.searchParams.get('recruiterId');
    const { title, description, location, job_type, experience_level, salary_min, salary_max, skills_required } = await request.json();

    if (!recruiterId) {
      return NextResponse.json(
        { error: 'Recruiter ID is required' },
        { status: 400 }
      );
    }

    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .insert({
        recruiter_id: recruiterId,
        title,
        description,
        location,
        job_type,
        experience_level,
        salary_min,
        salary_max,
        skills_required,
        status: 'open',
      })
      .select()
      .single();

    if (jobError) {
      return NextResponse.json({ error: jobError.message }, { status: 400 });
    }

    // Create default pipeline stages
    const defaultStages = ['Applied', 'Screening', 'Interview', 'Offer'];
    const { error: stagesError } = await supabaseAdmin
      .from('pipeline_stages')
      .insert(
        defaultStages.map((name, index) => ({
          job_id: job.id,
          name,
          order_index: index,
        }))
      );

    if (stagesError) {
      console.error('Failed to create pipeline stages:', stagesError);
    }

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
