import db from '$lib/server/database';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

console.log(`Running ${process.env.NODE_ENV} database migrations...`);

migrate(db, { migrationsFolder: './src/lib/db/migrations' })
  .then(() => {
    console.log('Migrations complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migrations failed!', err);
    process.exit(1);
  });
