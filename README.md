# Djazztro

The full stack web development framework for astronauts with deadlines. It combines the awesome power of [Django](https://www.djangoproject.com/) with the amazing [Astro](https://www.astro.build/) static site generator tool.

## Why?

Djazztro is a framework for people who want to use Astro, but don't want to give up Django's admin panel, or Django's ORM. It's also a framework for people who want to use Django, but don't want to give up Astro's component based approach to frontend development.

## Setup

To get started, ensure you have python and node installed.

Now, run `npm create djazztro@latest` and follow the prompts.

You can now `cd` into your new project's directory and run `npm run dev` to launch a development server.

## How It Works

### In Code

In code, your project will be split up into `backend` and frontend` directories. The backend directory will contain your Django project, and the frontend directory will contain your Astro project.

To reference an Astro page in a Django view, simply enter its name as a string without the `.astro`. For example, if you have a page called `home.astro`, you can reference it in a Django view like so:

```python
def home(request):
    return render(request, 'home')
```

Any context you pass to the template can be accessed using Djazztro's tags:

```astro
---
import { Variable, For, If } from "djazztro";
---

{/*Inserts a variable from the context called "my_variable"*/}
<Variable expression="my_variable" />

{/*You can also apply filters by editing `expression`*/}
<Variable expression="my_variable|upper" />

{/*Loops over a list called "my_list", saving the current item in a variable called `item`*/}
<For itemName="item" sourceList="my_list">
    <Variable expression="item" />
</For>

{/*Checks if a variable called "my_variable" is truthy*/}
<If expression="my_variable">
    True!
    <h2 slot="else">Not True!</h2>
</If>
```

All these components secretly use Django's template language.

- The `<Variable>` component simple renders to `{{ {expression} }}`.
- The `<Tag>` component renders to `{% {expression} %}`.
- All other components combine these two components to create more some useful ones.

All expressions also have escaping turned off **on Astro's side**, Django will still escape them.

### In Development

Djazztro starts a django development server and an astro dev server. Django's server then has a custom template backend that makes an HTTP request to the Astro dev server to get the HTML. This HTML is then rendered as a Django template.

<!-- TODO: Diagram -->

### In Production

Djazztro has Astro build your frontend into a static site, and then Django uses the root of that static site as it's templates folder.

<!-- TODO: Diagram -->
