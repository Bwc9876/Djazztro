import fs from "fs";
import ora from "ora";
import { PromptData } from "./main.js";
import { getSecretKey } from "./secretKey.js";
import { makeDirIfNotExists, execAsync } from "./utils.js";

export const makeBackend = async (data: PromptData) => {
    const spinner = ora("Creating Backend Folder");

    makeDirIfNotExists(`${data.projectName}/backend`);
    makeDirIfNotExists(`${data.projectName}/backend/${data.projectName}`);

    fs.writeFileSync(`${data.projectName}/backend/${data.projectName}/__init__.py`, "");
    makeManage(data);
    makeSettings(data);
    makeWsgiAndAsgi(data);
    makeUrls(data);

    spinner.succeed("Created Backend Folder");

    spinner.start("Installing Backend Dependencies");

    if (data.pythonPackageManager === "pip") {
        await execAsync(`pip install django django-djazztro`, `${data.projectName}/backend`);
        if (data.features.includes("Black")) {
            await execAsync(`pip install black`, `${data.projectName}/backend`);
        }
    } else if (data.pythonPackageManager === "poetry") {
        makePyProject(data);
        await execAsync(`poetry add django django-djazztro`, `${data.projectName}/backend`);
        if (data.features.includes("Black")) {
            await execAsync(`poetry add black --group dev`, `${data.projectName}/backend`);
        }
    } else {
        await execAsync(`pipenv install django django-djazztro`, `${data.projectName}/backend`);
        if (data.features.includes("Black")) {
            await execAsync(`pipenv install black --dev`, `${data.projectName}/backend`);
        }
    }

    spinner.succeed("Installed Backend Dependencies");

    if (data.features.includes("Black")) {
        spinner.start("Formatting With Black");
        await execAsync(`${data.nodePackageManager} run black .`, `${data.projectName}/backend`);
        spinner.succeed("Formatted With Black");
    }

    spinner.start("Migrating Database");

    await execAsync(`${data.nodePackageManager} run django migrate`, `${data.projectName}`);

    spinner.succeed("Migrated Database");
};

const makeManage = (data: PromptData) => {
    const manage = `#!/usr/bin/env python
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', '${data.projectName}.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
`;

    fs.writeFileSync(`${data.projectName}/backend/manage.py`, manage);
};

const makeSettings = (data: PromptData) => {
    const settings = `import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-${getSecretKey()}'
DEBUG = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_djazztro'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = '${data.projectName}.urls'

TEMPLATES = [
    # Here for the admin module
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
    {
        'BACKEND': 'django_djazztro.backends.DjazztroBackend',
        'DIRS': [BASE_DIR / "../dist/templates"],
        'APP_DIRS': False,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
    

WSGI_APPLICATION = '${data.projectName}.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
`;

    fs.writeFileSync(`${data.projectName}/backend/${data.projectName}/settings.py`, settings);
};

const makeWsgiAndAsgi = (data: PromptData) => {
    const wsgi = `
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TestProject.settings')

application = get_wsgi_application()
`;

    const asgi = `import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TestProject.settings')

application = get_asgi_application()
`;

    fs.writeFileSync(`${data.projectName}/backend/${data.projectName}/wsgi.py`, wsgi);
    fs.writeFileSync(`${data.projectName}/backend/${data.projectName}/asgi.py`, asgi);
};

const makeUrls = (data: PromptData) => {
    const urls = `from django.contrib import admin
from django.urls import path
from django.shortcuts import render

# Simple test view to make sure the backend is working, for actual projects you should make a seperate app with "${data.nodePackageManager} run django startapp <appname>"
def home(request):
    return render(request, "index", {"test": "Hello From Django!"})

urlpatterns = [
    path('', home)
]
`;

    fs.writeFileSync(`${data.projectName}/backend/${data.projectName}/urls.py`, urls);
};

const makePyProject = (data: PromptData) => {
    const pyproject = `[tool.poetry]
name = "${data.projectName}"
version = "0.1.0"
description = ""
authors = ["${data.projectAuthor}"]

[tool.poetry.dependencies]
python = "^3.10"
`;

    fs.writeFileSync(`${data.projectName}/backend/pyproject.toml`, pyproject);
};
