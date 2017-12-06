# Reactium
![](https://preview.ibb.co/kcaAQG/atomic_reactor.png)

A framework for creating React + Redux apps using the domain driven design (DDD) paradigm.

# Quick Start
```
$ npm run launch
```

# Development Guide
The intent behind the Reactium Framework is to get you quickly creating React components and applications. With that in mind, we geared the tooling towards automation and ease of use.


## Creating Components
1. Before creating a component, grab the Atomic Reactor CLI:
```
$ npm i -g atomic-reactor-cli
```

2. Change directory into your project:
```
$ cd /MyAwesome/Project
```

3. Input the new component command:
```
$ arcli re:gen class --open
```

| Flag | Description |  |  |
|:-----|:------------|:-------|:--------|
| -h, --help | Output usage information.
| -n, --name | The name of the component. | String |
| -o, --overwrite | Overwrite if the component already exists. | Y/N | Default: `N` |
| -p, --path | Absolute path to where the component is created. | String | Default: `~/src/app/components`. |
| -c, --component | The parent component when creating a child component. | String | |
| --open | Open the new component in the default application. | |
| --no-actions | Exclude the actions.js file. | |
| --no-types | Exclude the actionsTypes.js file. | |
| --no-reducers | Exclude the reducers.js file. | |
| --no-services | Exclude the services.js file. | |
| --no-routes | Exclude the routes.js file. | |



4. Follow the prompts:
* Name: The name of the component that you wish to create.
* Route: If you're building a `Single Page App` (SPA) and your new component uses the Router class, you'll want to specify the `route` that will navigate to this component.
* Use Redux?: Determines if your new component's state will be managed by [Redux](redux.js.org).

![](https://image.ibb.co/iE8y4b/new_component_class.png)

Now that you've created your first component, it's time to use it.

## Using Components

Open the `~/src/index.html` file and add the component to the layout using the custom element `<Component>`.

```html
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Reactium</title>
        <meta name="description" content="A framework for creating React + Redux apps using the domain driven design (DDD) paradigm.">
        <link rel="stylesheet" href="/assets/style/style.css">
    </head>
    <body>
        <Component type="Fubar"></Component>
        <script src="/assets/js/main.js"></script>
    </body>
</html>
```

> _Alternatively, you can just start using the component in your app like you would any other React component._

Reactium will now scan your markup for the `<Component>` tags and bind the specified `type` to the element.
You can pass initial state to the component via attributes but that's not necessary if you're using Redux for state management.