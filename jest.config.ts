import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  testPathIgnorePatterns: ['/fixtures/'],
  transform: {
  '^.+\\.tsx?$': 'ts-jest',
  },
};
export default config;