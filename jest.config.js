const { pathsToModuleNameMapper } = require("ts-jest/utils");
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require("./tsconfig");

module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    moduleFileExtensions: ["ts", "tsx", "js"],
    testEnvironment: "node",
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src" }),
    resolver: null,
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
};
