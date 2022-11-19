import inquirer from "inquirer";
import ora from "ora";

import { makeProjectJson } from "./packageTemplate.js";
import { makeEslintConfig, makeGitStuff, makePrettierConfig } from "./features.js";
import { makeFrontend } from "./frontend.js";
import { makeBackend } from "./backend.js";
import { execAsync, makeDirIfNotExists } from "./utils.js";

export type PromptData = {
    projectName: string;
    projectDescription: string;
    projectAuthor: string;
    pythonPackageManager: string;
    nodePackageManager: string;
    features: string[];
};

const createProjectDirectory = async (data: PromptData) => {
    const spinner = ora("Creating Project Directory").start();
    makeDirIfNotExists(data.projectName);
    makeProjectJson(data);

    if (data.features.includes("ESLint")) {
        makeEslintConfig(data);
    }

    if (data.features.includes("Prettier")) {
        makePrettierConfig(data);
    }

    if (data.features.includes("Git")) {
        makeGitStuff(data);
    }

    spinner.succeed("Created Project Directory");
};

export const main = async () => {
    console.log("Welcome to Djazztro! 🎶");
    console.log("This template will help you get started.");
    const data: PromptData = await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: "What is the name of your project?",
            default: "my-app"
        },
        {
            type: "input",
            name: "projectDescription",
            message: "What is the description of your project?",
            default: "A Djazztro project"
        },
        {
            type: "input",
            name: "projectAuthor",
            message: "Who is the author of your project?",
            default: "Greg"
        },
        {
            type: "list",
            name: "pythonPackageManager",
            message: "Which Python package manager do you want to use?",
            choices: ["pip", "pipenv", "poetry"],
            default: "pip"
        },
        {
            type: "list",
            name: "nodePackageManager",
            message: "Which Node package manager do you want to use?",
            choices: ["npm", "yarn", "pnpm"],
            default: "npm"
        },
        {
            type: "checkbox",
            name: "features",
            message: "Which features do you want to enable?",
            choices: ["Prettier", "ESLint", "TypeScript", "Black", "Git"],
            default: []
        }
    ]);

    data["projectName"] = data["projectName"].replace(/\s/g, "");

    await createProjectDirectory(data);
    await makeFrontend(data);
    await makeBackend(data);

    console.log("Done! 🎉");
    console.log("You can now run the following commands:");
    console.log(`cd ${data.projectName}`);
    console.log(`${data.nodePackageManager} run dev`);
    console.log(
        `To run Django (manage.py) commands run "${data.nodePackageManager} run django {command}"`
    );
    console.log(`To run Astro commands run "${data.nodePackageManager} run astro {command}"`);
    console.log("Happy coding! 🚀");
};
