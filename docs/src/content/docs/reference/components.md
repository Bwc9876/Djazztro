---
title: Components Reference
description: Reference for the components Djazztro provides for easier Django interop.
---

This reference shows the various Astro components Djazztro provides for you to interface with Django.

## Variable

Renders a variable (`{{ name | filters }}`) from the Django context

```astro
---
import { Variable } from "djazztro";
---

Welcome, <Variable expression="request.user.name" />!

```

You don't need the {{ }} characters in `expression`, those are placed for you.

You can also use them with filters like so

```astro
---
import { Variable } from "djazztro";
---

WELCOME TO THE SCREAMING PARTY, <Variable expression="request.user.name | upper" />!!!
```

## Tag

Renders a tag (`{% name args %}`) into the template

```astro
---
import { Tag } from "djazztro";
---

<h2>Cool Lorem Text:</h2>

<Tag expression="lorem 5" />
```

## If, ElseIf, Else

Allows conditional rendering of its children

```astro
---
import { If } from "djazztro";
---

<If expression="request.user.is_authenticated">You are logged in!</If>
```

You can also use Else

```astro
---
import { If, Else } from "djazztro";
---

You <If expression="request.user.is_authenticated">Are<Else>Are Not</Else></If> Logged In!.
```

And ElseIf

```astro
---
import { If, ElseIf } from "djazztro";
---

<If expression="request.user.name == 'admin'">
    Admin Data
    <ElseIf expression="request.user.is_authenticated">User Data</ElseIf>
    <Else>Login Page</Else>
</If>

```

## For

Allows you to iterate over items in a template.

```astro
---
import { For } from "djazztro";
---

<For itemName="person" sourceList="people">
    Hello, <Variable expression="person.name"/>.
</For>
```

:::tip
You can use `{% empty %}` by using a Tag component too

```astro
<For itemName="person" sourceList="people">
    Hello, <Variable expression="person.name"/>.
    <Tag expression="empty">No People!</Tag>
</For>
```

:::

## Url

Use Django's URL router in an `a` tag.

```astro
---
import { Url } from "djazztro";
---

<!-- All <a> props are supported (except href for obvious reasons) -->
<Url name="home" target="_blank">Go Home</Url>
```

You can also specify URL args

```astro
---
import { Url } from "djazztro";
---

<Url name="post" args="1234">Post With ID 1234</Url>
```

## Load

Loads a custom tag library

```astro
---
import { Load } from "djazztro";
---

<Load tabLibraryName="my_tags" />
```

## Block

Declare an override-able block for Django's template inheritance system.

:::note
While although this functionality is handy, you'll probably want to use Astro's design systems to reduce redundancy via layouts and re-usable components.
:::

```astro
---
import { Block } from "djazztro";
---

<Block blockName="content">
Override this content via extends!
</Block>
```
