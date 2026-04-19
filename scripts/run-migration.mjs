import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Missing POSTGRES_URL or POSTGRES_URL_NON_POOLING environment variable');
  process.exit(1);
}

async function runMigration() {
  const sql = postgres(connectionString, { ssl: 'require' });

  try {
    console.log('Reading SQL migration file...');
    const sqlFile = path.join(__dirname, '01_setup_schema.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');

    console.log('Executing database schema migration...');
    
    // Execute the SQL file
    await sql.file(sqlFile);

    console.log('✓ Migration completed successfully!');
    console.log('Database schema has been created with tables: users, jobs, applications, pipeline_stages');
    console.log('Row-Level Security (RLS) policies have been configured.');
    
    await sql.end();
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    await sql.end();
    process.exit(1);
  }
}

runMigration();
