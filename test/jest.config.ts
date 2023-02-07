import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testRegex: '.spec.ts$',
    verbose: true,
    silent: true,
    testTimeout: 10000
};

export default config;