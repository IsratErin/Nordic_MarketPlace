export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/*.integration.test.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  maxWorkers: 1,
  clearMocks: true,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Fix ESM relative imports
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  testTimeout: 30000,
};
