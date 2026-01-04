import dotenv from 'dotenv';

// Load .env.test and override any existing environment variables
dotenv.config({ path: '.env.test', override: true });

export default {
  preset: 'ts-jest/presets/default-esm',
  testMatch: ['**/*.int.test.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  maxWorkers: 1,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  clearMocks: true,
  testTimeout: 30000,
  // Force tests to run in band
  runInBand: true,
  // coverage configuration - focus on routes, controllers, and services
  collectCoverageFrom: [
    'src/routes/**/*.ts',
    'src/controllers/**/*.ts',
    'src/services/**/*.ts',
    'src/middleware/**/*.ts',
    '!src/services/authService.ts',
    '!src/services/trackingService.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
