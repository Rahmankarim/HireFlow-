import 'server-only';

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

const missingEnvVars = [
  !supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL',
  !supabaseAnonKey &&
    'NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  !supabaseServiceKey && 'SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY',
].filter(Boolean) as string[];

const missingEnvMessage =
  missingEnvVars.length > 0
    ? `Missing Supabase environment variables: ${missingEnvVars.join(', ')}`
    : null;

function createMissingClientProxy(clientName: 'supabase' | 'supabaseAdmin') {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(`${missingEnvMessage}. Cannot use ${clientName}.`);
      },
    }
  );
}

const supabase = missingEnvMessage
  ? (createMissingClientProxy('supabase') as any)
  : createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
      },
    });

const supabaseAdmin = missingEnvMessage
  ? (createMissingClientProxy('supabaseAdmin') as any)
  : createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

function getSupabaseEnvError() {
  return missingEnvMessage ? { error: missingEnvMessage } : null;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  role: 'job_seeker' | 'recruiter' = 'job_seeker'
) {
  const envError = getSupabaseEnvError();
  if (envError) {
    return envError;
  }

  try {
    // Create auth user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return { error: authError.message };
    }

    // Create user profile in our users table
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        password_hash: await hashPassword(password),
        full_name: fullName,
        role,
      });

    if (profileError) {
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { error: profileError.message || 'Failed to create user profile' };
    }

    return { user: authData.user };
  } catch (error) {
    return { error: 'Registration failed' };
  }
}

export async function loginUser(email: string, password: string) {
  const envError = getSupabaseEnvError();
  if (envError) {
    return envError;
  }

  try {
    // Get user profile from our users table to verify password
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('id, email, password_hash, full_name, role')
      .eq('email', email)
      .single();

    if (profileError || !userProfile) {
      return { error: 'Invalid email or password' };
    }

    // Verify password
    const passwordValid = await verifyPassword(password, userProfile.password_hash);
    if (!passwordValid) {
      return { error: 'Invalid email or password' };
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    return { error: 'Login failed' };
  }
}

export async function getUserProfile(userId: string) {
  const envError = getSupabaseEnvError();
  if (envError) {
    return envError;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { error: error.message };
    }

    return { user: data };
  } catch (error) {
    return { error: 'Failed to fetch user profile' };
  }
}

export { supabase, supabaseAdmin };
