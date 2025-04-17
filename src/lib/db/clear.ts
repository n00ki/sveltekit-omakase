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
    console.log(`🧨 Preparing DELETE query for table: ${table.dbName}`);
    return {
      query: sql.raw(`DELETE FROM ${table.dbName}; DELETE FROM sqlite_sequence WHERE name='${table.dbName}';`),
      queryString: `DELETE FROM ${table.dbName}; DELETE FROM sqlite_sequence WHERE name='${table.dbName}';`
    };
  });

  try {
    console.log('🔒 Disabling foreign keys...');
    await db.run(dropForeignKeys);

    await db.transaction(async (tx) => {
      console.log('📨 Sending queries...');
      for (const { query, queryString } of queries) {
        console.log(`💽 Executing query: ${queryString}`);
        await tx.run(query);
      }
    });

    console.log('🔓 Enabling foreign keys...');
    await db.run(enableForeignKeys);

    console.log('✅ Database emptied');
  } catch (error) {
    console.error('❌ Error occurred while clearing the database:', error);
  }
}

clearDb().catch((e) => {
  console.error(e);
});
