import fs from "fs";
import ora from "ora";
import { PromptData } from "./main.js";
import { makeDirIfNotExists, execAsync } from "./utils.js";

const astroFile = `import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    "srcDir": "./src",
    "outDir": "../dist/templates",
    "build": {
        "format": "file",
        "client": "../static"
    }
});
`;

// Cheating here bc the package isn't published yet
const djazztroPath = "\"C:\\Users\\bwc67\\Documents\\Actual Documents\\Djazztro\\packages\\djazztro\"";

export const makeFrontend = async (data: PromptData) => {
    const spinner = ora("Creating Frontend Directory").start();

    makeDirIfNotExists(`${data.projectName}/frontend`);
    makeDirIfNotExists(`${data.projectName}/frontend/src`);
    makeDirIfNotExists(`${data.projectName}/frontend/src/components`);
    makeDirIfNotExists(`${data.projectName}/frontend/src/layouts`);
    makeDirIfNotExists(`${data.projectName}/frontend/src/pages`);

    const layoutHtml = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <meta name="generator" content={Astro.generator} />
        <title>${data.projectName}</title>
    </head>
    <body>
        <slot />
    </body>
</html>
`;

    const indexHtml = `---
import { Variable } from "djazztro";

import Layout from "@layouts/MainLayout.astro";
---
<Layout>
    <h1>Hello, ${data.projectName}!</h1>
    <p>Example of getting variables from context: <Variable expression="test"/></p>
</Layout>
`;

    fs.writeFileSync(`${data.projectName}/frontend/src/layouts/MainLayout.astro`, layoutHtml);
    fs.writeFileSync(`${data.projectName}/frontend/src/pages/index.astro`, indexHtml);

    fs.writeFileSync(`${data.projectName}/frontend/astro.config.mjs`, astroFile);

    makeTsConfig(data);

    if (data.nodePackageManager === "pnpm") { 
        const npmrc = `# Expose Astro dependencies for \`pnpm\` users
shamefully-hoist=true
    `;

        fs.writeFileSync(`${data.projectName}/.npmrc`, npmrc);
    }

    spinner.succeed("Created Frontend Directory");

    const spinner2 = ora("Installing Frontend Dependencies").start();

    const packagesToInstall = [
        "astro",
        djazztroPath
    ];

    const devPackagesToInstall = [
        "concurrently",
        "cross-env",
    ];

    if (data.features.includes("TypeScript")) {
        devPackagesToInstall.push("typescript");
    }

    if (data.features.includes("Prettier")) {
        devPackagesToInstall.push("prettier");
        devPackagesToInstall.push("prettier-plugin-astro");
    }

    if (data.features.includes("ESLint")) {
        devPackagesToInstall.push("eslint");
        devPackagesToInstall.push("eslint-plugin-astro");
        if (data.features.includes("Prettier")) {
            devPackagesToInstall.push("eslint-config-prettier");
        }
        if (data.features.includes("TypeScript")) {
            devPackagesToInstall.push("@typescript-eslint/eslint-plugin");
            devPackagesToInstall.push("@typescript-eslint/parser");
        }
    }

    await execAsync(`${data.nodePackageManager} add ${packagesToInstall.join(" ")}`, `${data.projectName}`);
    await execAsync(`${data.nodePackageManager} add -D ${devPackagesToInstall.join(" ")}`, `${data.projectName}`);

    spinner2.succeed("Installed Frontend Dependencies");

    if (data.features.includes("Prettier")) {
        const spinner3 = ora("Formatting With Prettier").start();
        await execAsync(`${data.nodePackageManager} run prettify`, `${data.projectName}`);
        spinner3.succeed("Formatted With Prettier");
    }

}

const makeTsConfig = (data: PromptData) => {
    const contents = {
        "extends": "astro/tsconfigs/strict",
        "compilerOptions": {
            "baseUrl": ".",
            "paths": {
                "@layouts/*": ["src/layouts/*"],
                "@components/*": ["src/components/*"]
            }
        }
    };

    fs.writeFileSync(`${data.projectName}/frontend/tsconfig.json`, JSON.stringify(contents, null, 2));
};


