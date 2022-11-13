import fs from 'fs';
import { PromptData } from "./main.js";

export const makeProjectJson = (data: PromptData) => {

    let djangoCommand = "python manage.py";

    if (data.pythonPackageManager === "pipenv") {
        djangoCommand = "pipenv run python manage.py";
    } else if (data.pythonPackageManager === "poetry") {
        djangoCommand = "poetry run python manage.py";
    }

    const contents: any = {
        "name": data.projectName,
        "private": true,
        "version": "0.1.0",
        "scripts": {
            "django": `cd backend && ${djangoCommand}`,
            "astro": "cd frontend && astro",
            "dev:frontend": "npm run astro dev",
            "dev:backend": "npm run django runserver",
            "dev": "concurrently npm:dev:frontend npm:dev:backend -n \"Astro,Django\"",
            "build": "npm run astro build",
            "preview": "cross-env DEBUG=False \"npm run astro build && npm run dev:backend\""
        },
        "keywords": [],
        "author": data.projectAuthor,
        "license": "MIT"
    };

    const prettier = data.features.includes("Prettier");
    const eslint = data.features.includes("ESLint");
    const typescript = data.features.includes("TypeScript");
    const black = data.features.includes("Black");

    if (prettier) {
        contents.scripts["prettify"] = "prettier --plugin-search-dir=. --write ./frontend";
    }

    if (eslint) {
        contents.scripts["lint"] = "eslint ./frontend";
    }

    if (typescript) {
        contents.scripts["typecheck"] = "tsc --noEmit";
    }

    if (black) {
        let blackCommand = "python -m black .";
        if (data.pythonPackageManager === "pipenv") {
            blackCommand = "pipenv run python -m black .";
        } else if (data.pythonPackageManager === "poetry") {
            blackCommand = "poetry run python -m black .";
        }
        contents.scripts["black"] = `cd backend && ${blackCommand}`;
    }

    if (prettier && black) {
        contents.scripts["format"] =  "npm run prettify && npm run black";
    }

    fs.writeFileSync(`${data.projectName}/package.json`, JSON.stringify(contents, null, 2));

}