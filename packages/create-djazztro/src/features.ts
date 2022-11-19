import fs from "fs";

import { PromptData } from "./main.js";
import { execAsync } from "./utils.js";

export const makeEslintConfig = (data: PromptData) => {
    const contents: any = {
        env: {
            browser: true,
            es2021: true
        },
        extends: ["eslint:recommended", "plugin:astro/recommended"],
        parserOptions: {
            ecmaVersion: 12,
            sourceType: "module"
        },
        rules: {},
        overrides: [
            {
                files: ["*.astro"],
                parser: "astro-eslint-parser",
                parserOptions: {
                    parser: "@typescript-eslint/parser",
                    extraFileExtensions: [".astro"]
                }
            }
        ]
    };

    if (data.features.includes("TypeScript")) {
        contents.extends.push("plugin:@typescript-eslint/recommended");
        contents.parser = "@typescript-eslint/parser";
        contents.plugins = ["@typescript-eslint"];
    }

    if (data.features.includes("Prettier")) {
        contents.extends.push("prettier");
    }

    fs.writeFileSync(`${data.projectName}/.eslintrc.json`, JSON.stringify(contents, null, 2));
};

export const makePrettierConfig = (data: PromptData) => {
    const contents: any = {
        semi: true,
        singleQuote: true,
        trailingComma: "es5",
        printWidth: 120,
        tabWidth: 4,
        endOfLine: "lf"
    };

    fs.writeFileSync(`${data.projectName}/.prettierrc.json`, JSON.stringify(contents, null, 2));
};

export const makeGitStuff = (data: PromptData) => {
    const filesToIgnore = ["node_modules", ".venv", "venv", "dist", "db.sqlite3", "__pycache__"];

    if (data.features.includes("ESLint")) {
        filesToIgnore.push(".eslintcache");
    }

    fs.writeFileSync(`${data.projectName}/.gitignore`, filesToIgnore.join("\n"));

    if (data.features.includes("Prettier")) {
        fs.writeFileSync(`${data.projectName}/.prettierignore`, filesToIgnore.join("\n"));
    }

    const readme = `# ${data.projectName}
${data.projectDescription}

## Setup

To setup a development environment first ensure you have python and node installed.
Then also ensure ${data.nodePackageManager} and ${data.pythonPackageManager} are installed as well.

Clone the repo and run \`${data.nodePackageManager} install\` to install all frontend dependencies.
Then, install all backend dependencies (we use ${data.pythonPackageManager}).

## Running

To run a development server, run \`${data.nodePackageManager} run dev\`.
`;

    fs.writeFileSync(`${data.projectName}/README.md`, readme);

    execAsync("git init", `${data.projectName}`);
};
