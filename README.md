<!-- Disables the inline html warning -->
<!-- markdownlint-disable MD030 MD033 -->

# Djazztro

<p align="center">
<img src="https://user-images.githubusercontent.com/25644444/201508399-c98f41ab-3790-4c20-b82c-5b47ff3370f2.png" alt="Djazztro Logo"/><br/><br/>
The web development stack for astronauts with deadlines.
</p>

## What is Djazztro

Djazztro combines the versatility of [Django](https://www.djangoproject.com/) with the elegance of the [Astro](https://www.astro.build/) static site generator.

## Why?

Djazztro is a stack for people who want to use Astro, but don't want to give up Django's admin panel, or Django's ORM. It's also a stack for people who want to use Django, but don't want to give up Astro's component based approach to frontend development.

## Setup

To get started, ensure you have python and node installed.

Now, run `npm create djazztro@latest` and follow the prompts.

You can now `cd` into your new project's directory and run `npm run dev` to launch a development server.

## How It Works

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
        <ElseIf expression="some_other_variable" />
        First thing is false, but this is true!
        <Else />
        False!
    </If>
</Layout>
```

All these components secretly use Django's template language.

-   The `<Variable>` component renders to `{{ {expression} }}`.
-   The `<Tag>` component renders to `{% {expression} %}`.
-   All other components combine these two components to create more some useful ones.

All expressions also have escaping turned off **on Astro's side**, Django will still escape them.

### In Development

Djazztro starts a django development server and an astro dev server. Django's server then has a custom template backend that makes an HTTP request to the Astro dev server to get the HTML. This HTML is then rendered as a Django template.

![Djazztro-Dev-Explanation](https://user-images.githubusercontent.com/25644444/201508127-5d5d76b2-0f07-4c8c-a80a-9a0e3718104f.png)

### In Production

Djazztro has Astro build your frontend into a static site, and then Django uses the root of that static site as it's templates folder.

![Djazztro-Prod-Explanation](https://user-images.githubusercontent.com/25644444/201508342-d728a9ff-aead-4544-baa9-9de8adc9f026.png)

## Contributing

Contributions are welcome! Please open an issue or a PR if you have any ideas.

## License

Djazztro is licensed under the [MIT License](LICENSE).
