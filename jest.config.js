/** @type {import("ts-jest").JestCOnfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist'],
    resolver: 'jest-ts-webcompat-resolver',
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['index.ts', 'app.ts', 'routers'],
};
