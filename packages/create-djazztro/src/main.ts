import inquirer from "inquirer";
import ora from "ora";
import fs from "fs";

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
}

const createProjectDirectory = async (data: PromptData) => {

    const spinner = ora("Creating project directory").start();
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

    spinner.succeed("Created project directory");
    
};

export const main = async () => {
    console.log('Welcome to Djazztro! 🎶');
    console.log("This template will help you get started.");
    const data: PromptData = await inquirer.prompt([
        {
            "type": "input",
            "name": "projectName",
            "message": "What is the name of your project?",
            "default": "MyProject",
        },
        {
            "type": "input",
            "name": "projectDescription",
            "message": "What is the description of your project?",
            "default": "A Djazztro project"
        },
        {
            "type": "input",
            "name": "projectAuthor",
            "message": "Who is the author of your project?",
            "default": "Greg"
        },
        {
            "type": "list",
            "name": "pythonPackageManager",
            "message": "Which Python package manager do you want to use?",
            "choices": [
                "pip",
                "pipenv",
                "poetry"
            ],
            "default": "pip"
        },
        {
            "type": "list",
            "name": "nodePackageManager",
            "message": "Which Node package manager do you want to use?",
            "choices": [
                "npm",
                "yarn",
                "pnpm"
            ],
            "default": "npm"
        },
        {
            "type": "checkbox",
            "name": "features",
            "message": "Which features do you want to enable?",
            "choices": [
                "Prettier",
                "ESLint",
                "TypeScript",
                "Black",
                "Git"
            ],
            "default": []
        }
    ]);

    data["projectName"] = data["projectName"].replace(/\s/g, "");

    await createProjectDirectory(data);
    await makeFrontend(data);
    await makeBackend(data);

    if (data.features.includes("Git")) {
        await execAsync("git add * && git commit -m \"Initial Commit\"", data.projectName);
    }

    console.log("Done! 🎉");

};
