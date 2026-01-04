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
  // Force tests to run in band (sequentially)
  runInBand: true,
  // Add coverage configuration
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};
