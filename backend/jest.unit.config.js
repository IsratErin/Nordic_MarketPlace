export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/*.unit.test.ts'],
  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  clearMocks: true, // Automatically clear mock calls and instances between every test
  collectCoverageFrom: [
    'src/services/**/*.ts',
    '!src/services/authService.ts',
    '!src/services/trackingService.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 80,
      lines: 70,
      statements: 70,
    },
  },
};
