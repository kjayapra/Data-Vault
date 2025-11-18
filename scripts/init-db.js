const { initializeDatabase } = require('../lib/db.ts');

try {
  console.log('Initializing database...');
  initializeDatabase();
  console.log('Database initialization complete!');
  process.exit(0);
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}
