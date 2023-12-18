import db from '$lib/server/database';
import { sql } from 'drizzle-orm';

const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

try {
  console.log('ℹ️ collecting database informaton...');
  const tables = await db.execute(query);

  console.log('♻️ deleting database tables...');
  for (const table of tables.rows) {
    console.log(`🗑️ deleting ${table.table_name}...`);
    const query = sql.raw(`TRUNCATE TABLE ${table.table_name} CASCADE;`);
    await db.execute(query);
  }
  console.log('✅ database is ready!');
} catch (error) {
  console.error('🚨 failed to reset database!', error);
}
