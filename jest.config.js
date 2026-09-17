module.exports = {
  preset: 'jest-expo',
  watchman: false,
  testMatch: ['<rootDir>/src/features/**/test/**/*.(test|spec).{js,jsx,ts,tsx}'],
  resolver: 'react-native-worklets/jest/resolver',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
