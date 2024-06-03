import db from '$lib/server/database';
import { sql } from 'drizzle-orm';

async function clearDb() {
  const tableSchema = db._.schema;
  if (!tableSchema) {
    throw new Error('No table schema found');
  }

  console.log('🗑️  Emptying the entire database');

  const dropForeignKeys = sql.raw('PRAGMA foreign_keys = OFF;');
  const enableForeignKeys = sql.raw('PRAGMA foreign_keys = ON;');

  const queries = Object.values(tableSchema).map((table) => {
    console.log(`🧨 Preparing drop query for table: ${table.dbName}`);
    return sql.raw(`DROP TABLE IF EXISTS ${table.dbName};`);
  });

  console.log('📨 Sending DROP queries...');

  await db.transaction(async (tx) => {
    try {
      await tx.run(dropForeignKeys);

      await Promise.all(
        queries.map(async (query) => {
          if (query) await tx.run(query);
        })
      );

      console.log('✅ Database emptied');
    } catch (error) {
      console.error('❌ Error occurred while dropping tables:', error);
    } finally {
      await tx.run(enableForeignKeys);
    }
  });
}

clearDb().catch((e) => {
  console.error(e);
});
