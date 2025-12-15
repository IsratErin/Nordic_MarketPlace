import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.test before anything else
dotenv.config({
  path: resolve(process.cwd(), '.env.test'),
  override: true,
});

// Log to verify test environment variables are loaded
//console.log('Test DATABASE_URL:', process.env.DATABASE_URL);
//console.log('Test POSTGRES_PORT:', process.env.POSTGRES_PORT);
