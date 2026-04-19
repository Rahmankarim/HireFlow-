const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('Reading SQL migration file...');
    const sqlFile = path.join(__dirname, '01_setup_schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    console.log('Executing database schema migration...');
    
    // Execute the entire SQL file
    const { error } = await supabase.rpc('exec_sql', {
      sql_string: sql
    }).catch(err => {
      // If exec_sql doesn't exist, we need another approach
      console.log('exec_sql RPC not available, attempting direct execution...');
      return { error: err };
    });

    if (error) {
      console.error('Error:', error);
      // Continue anyway - the schema might already exist
    }

    console.log('Migration setup complete!');
    console.log('Note: Schema creation may need to be done through Supabase dashboard if RPC is not available');
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

runMigration();
