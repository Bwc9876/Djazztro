---
title: Getting Started
description: Learn about Djazztro and how it works
---

This guide will walk you through setting up a new Djazztro project.

## Prerequisites

Djazztro has a few requirements:

-   Node
-   Python 3.9+
-   Pip, Pipenv, or Poetry, whichever you prefer
-   NPM, PNPM, or Yarn, whichever you prefer

## Creating a new project

To get started, use your node package manager of choice to create a new Djazztro project:

```bash
npm create djazztro
```

Replace `npm` with `pnpm` or `yarn` if you prefer those.

This will walk you through creating a new project. Follow the prompts to create your project.

## Running the project

Once you've created your project, you can run it using the `dev` command:

```bash
npm run dev
```

This will start both the Django and Astro development servers. You can access the Django server at `localhost:8000` and the Astro server at `localhost:3000`.

Most of the time you'll be working with the Django server, but if you want to work on the frontend before it gets integrated with Django, you can use the Astro server.

## Building the project

Once you're ready to build your project, you can use the `build` command:

```bash
npm run build
```

This will build the frontend into `dist/templates`, which Django will use as its templates folder in production.

You can preview the built site using the `preview` command, which will start a Django server that serves the built site:

```bash
npm run preview
```

## Next Steps

From here on you'll need knowledge of both Django and Astro, this library acts as the glue between the two but leaves how to structure each part up to you.

You can see the [Components Reference](/Djazztro/reference/components) for info on how the components Djazztro provides to you for inter-oping between Astro and Django.
