---
title: Introduction
description: Learn about Djazztro and how it works
---

Djazztro is a web stack for building server-side rendered web applications. It uses Django for the backend and Astro for the frontend.

## Why Djazztro?

Djazztro is a stack for people who want to use Astro, but don't want to give up Django's admin panel, or Django's ORM. It's also a stack for people who want to use Django, but don't want to give up Astro's component-based approach to frontend development.

I chose Astro specifically because it supports many other component frameworks such as React, Vue, Svelte, and more. Meaning this stack not only connects Django and Astro, but Django and all those frameworks and their ecosystems.

## How does it work?

If you understand both Django and Astro, the way Djazztro works should be easy to understand. If you don't, here's a quick overview.

### In Code

In code, your project will be split up into `backend` and `frontend` directories. The backend directory will contain your Django project, and the frontend directory will contain your Astro project.

To reference an Astro page in a Django view, simply enter its name as a string without the `.astro`. For example, if you have a page called `home.astro`, you can reference it in a Django view like so:

```python
def home(request):
    return render(request, 'home')
```

Any context you pass to the template can be accessed using Djazztro's tags:

```astro
---
import { Variable, For, If, ElseIf, Else } from "djazztro";
---

<Layout>
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
        <ElseIf expression="some_other_variable">
            First thing is false, but this is true!
        </ElseIf>
        <Else>
            False!
        </Else>
    </If>
</Layout>
```

All these components secretly use Django's template language.

-   The `<Variable>` component renders to `{{ {expression} }}`.
-   The `<Tag>` component renders to `{% {expression} %}`.
-   All other components combine these two components to create some more useful ones.

All expressions also have escaping turned off **on Astro's side**, Django will still escape them.

For more info on components, check out [the components reference](/Djazztro/reference/components).

### In Development

Djazztro starts a Django development server and an Astro dev server. Django's server then has a custom template backend that makes an HTTP request to the Astro dev server to get the HTML. This HTML is then rendered as a Django template.

![Djazztro-Dev-Explanation](https://user-images.githubusercontent.com/25644444/201508127-5d5d76b2-0f07-4c8c-a80a-9a0e3718104f.png)

### In Production

Djazztro has Astro build your frontend into a static site, and then Django uses the root of that static site as it's templates folder.

![Djazztro-Prod-Explanation](https://user-images.githubusercontent.com/25644444/201508342-d728a9ff-aead-4544-baa9-9de8adc9f026.png)
