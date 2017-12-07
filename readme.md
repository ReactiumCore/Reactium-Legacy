# Reactium
![](https://preview.ibb.co/kcaAQG/atomic_reactor.png)

A framework for creating React + Redux apps.

## Domain Driven Design
Reactium follows the Domain Drive Design and aims to ease the creation of complex applications by connecting the related pieces of the software into an ever-evolving model.

DDD focuses on three core principles:
* Focus on the core domain and domain logic.
* Base complex designs on models of the domain.
* Constantly collaborate with domain experts, in order to improve the application model and resolve any emerging domain-related issues.

### Advantages of DDD
* *Eases Communication:* With an early emphasis on establishing a common and ubiquitous language related to the domain model of the project, teams will often find communication throughout the entire development life cycle to be much easier. Typically, DDD will require less technical jargon when discussing aspects of the application, since the ubiquitous language established early on will likely define simpler terms to refer to those more technical aspects.
* *Improves Flexibility:* Since DDD is based around modularity, nearly everything within the domain model will be based on an object and will, therefore, be quite encapsulated. This allows for various components, or even the entire system as a whole, to be altered and improved on a regular, continuous basis.
* *Emphasizes Domain Over Interface:* Since DDD is the practice of building around the concepts of domain and what the domain experts within the project advise, DDD will often produce applications that are accurately suited for and representative of the domain at hand, as opposed to those applications which emphasize the UI/UX first and foremost. While an obvious balance is required, the focus on domain means that a DDD approach can produce a product that resonates well with the audience associated with that domain.

### Disadvantages
* *Requires Robust Domain Expertise:* Even with the most technically proficient minds working on development, it’s all for naught if there isn’t at least one domain expert on the team that knows the exact ins and outs of the subject area on which the application is intended to apply. In some cases, domain-driven design may require the integration of one or more outside team members who can act as domain experts throughout the development life cycle.
* *Encourages Iterative Practices:* While many would consider this an advantage, it cannot be denied that DDD practices strongly rely on constant iteration and continuous integration in order to build a malleable project that can adjust itself when necessary. Some organizations may have trouble with these practices, particularly if their past experience is largely tied to less-flexible development models, such as the waterfall model or the like.


# Quick Start
```
$ npm run launch
```

# Development Guide
The intent behind the Reactium Framework is to get you quickly creating React components and applications.
With that in mind, we geared the tooling towards automation and ease of use.


## Components
There are 3 types of components you can create:
* [Functional Components](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#functional-components)
* [Class Components](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#class-components)
* [Redux Class Components](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#redux-class-components)

### Functional Components
Create a Functional Component if your component will not need to worry about application state or events. Functional components accept a single `props` argument and should be very clear and concise in their make-up.
```js
const Hello = (props) => {
    return (
        <div>
          <h1>Hey {props.name}!</h1>
        </div>;
    );
}
```
> The functional style components are nice and simple for purely presentational pieces.

### Class Components
Create a Class Component if your component will need the React Life Cycle Methods or internal state management.
```js
import React, { Component } from 'react';

class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.props});
  }

  componentDidMount() {
    console.log("Mounted Hello Component");
  }

  render() {
    return (
        <div>
          <h1>Hey {this.state.name}!</h1>
        </div>
    );
  }
}

Hello.defaultProps = {
  name: "Bob"
};

export default Hello;
```

### Redux Class Components
Create a Redux Class Component if your component will need to interact with the application state.
Redux Class Components work just like Class Components accept you will need to map state to properties and map dispatchers to actions via the [react-redux](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) `connect` method.

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'appdir/app';

// Map state to properties
const mapStateToProps = (state, props) => {
    return Object.assign({}, state['Test'], props);
};

// Map dispatchers to actions
const mapDispatchToProps = (dispatch, props) => ({
    test: {
        click: () => dispatch(actions.Test.click()),
    }
});

class Test extends Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState((prevState) => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    // Use the above mapped click dispatcher on button click
    onClick() {
        this.props.test.click();
    }

    render() {
        return (
            <div>
                <div>{this.state.msg}</div>
                <button type="button" onClick={this.onClick.bind(this)}>
                    Click Me
                </button>
                <div>{this.state.count || 0}</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
```

## Component Architecture
Reactium component architecture is pretty simple when it comes to a function or class component.
1. Create the component domain in the `~/src/app/components` directory.
2. Create an `index.js` file with your component code.

When it comes to a Redux Class Component the following files are required:

| File | Description |
|:----|:----|
| [actions.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-actionsjs-file) | List of action functions. See [Redux Actions](https://redux.js.org/docs/basics/Actions.html). |
| [actionTypes.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-actiontypesjs-file) | List of action filters. See [Redux Actions](https://redux.js.org/docs/basics/Actions.html). |
| [index.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-indexjs-file) | Main component class. |
| [reducers.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-reducersjs-file) | Action handlers. See [Redux Reducers](https://redux.js.org/docs/basics/Reducers.html). |
| [route.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-routejs-file) | Route handler for the component. |
| [services.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-servicesjs-file) | Ajax requests associated with the component. |
| [state.js](https://github.com/Atomic-Reactor/Reactium/blob/master/readme.md#the-statejs-file) | The default state of the component. |

> Don't worry, there's a CLI command that automates component creation.

### The actions.js File

Reactium aggregates all `action.js` files into the `actions` export of the `app.js` file.

A typical `actions.js` file may look like this:

```js
import { actionTypes } from 'appdir/app';

export default {
    mount: params => (dispatch) => {
        dispatch({type: actionTypes.TEST_MOUNT, data: params});
    },

    click: () => (dispatch) => {
        dispatch({type: actionTypes.TEST_CLICK});
    },
};
```

To access the actions simply import the actions:
```
import { actions } from 'appdir/app';
```

Then use an action by targeting the component domain that created the action:
```js
...
actions.Test.mount({some: "params"});
```

> Q: What's this `appdir` thing all about?

> A: `appdir` is a constant defined in the Webpack configuration that references the `~/src/app` directory. It helps clarify where you're importing something from by eliminating the need to do something like: `import { something } from '../../../components/SomeOtherComponent'`.


### The actionTypes.js File
Reactium aggregates all `actionTypes.js` files in the `actionTypes` export of the `app.js` file.

A typical `actionTypes.js` file may look like this:
```js
export default {
    TEST_MOUNT: 'TEST_MOUNT',
    TEST_CLICK: 'TEST_CLICK',
};
```

To access the actionTypes, import them into your component:
```js
import { actionTypes } from 'appdir/app';
```

Usage:
```js
...
dispatch({type: actionTypes.TEST_MOUNT, data: data});
```

### The index.js File
See [Redux Class Components](https://github.com/Atomic-Reactor/Reactium#redux-class-components).

### The reducers.js File
Reactium aggregates all `reducers.js` files into the Redux store using the [react-redux](https://github.com/reactjs/react-redux/tree/master/docs) `combineReducers` method.

A typical `reducers.js` file may look like this:
```js
import { actionTypes } from 'appdir/app';

export default (state = {}, action) => {

    let newState;

    switch (action.type) {

        case actionTypes.TEST_MOUNT:

            newState = Object.assign({}, state, {...action.data});
            return newState;
            break;

        case actionTypes.TEST_CLICK:

            let count = state.count || 0;
            newState = Object.assign({}, state, {count: count + 1});
            return newState;
            break;

        default:
            return state;
    }
};
```

### The route.js File
HELP ME OUT HERE JOHN

### The services.js File
Reactium aggregates all `services.js` files into the `services` export of the `app.js` file.

A typical `services.js` file may look like this:
```js
import axios from 'axios';
import { restHeaders } from "appdir/app";


const fetchHello = () => {
    let hdr = restHeaders();
    return axios.get(`${restAPI}/hello`, {headers: hdr}).then(({data}) => data);
};

export default {
    fetchHello,
}
```
> Reactium uses [axios](https://www.npmjs.com/package/axios) to make XMLHttpRequests from the browser. You can swap that out with whatever you want.

To access the services, import them into your component:
```js
import { services } from 'appdir/app';
```

Usage:
```js
...
services.Test.fetchHello().then((result) => {
    // Do something with the result
});
```


### The state.js File
Reactium aggregates all `state.js` files into the Redux `store` for the application.

A typical `state.js` file may look like this:

```js
export default {
    some: "value",
    another: 1,
};
```

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

Flags:
```
    -n, --name <name>            The name of the component.
    -o, --overwrite [overwrite]  Overwrite if the component already exists.
    -p, --path [path]            Absolute path to where the component is created. Default ~/src/app/components.
    -c, --component [component]  The parent component when creating a child component.
    -r, --route [route]          The route to associate with the component.
    --open [open]                Open the new file(s) in the default application.
    --no-actions [actions]       Exclude the actions.js file.
    --no-types [types]           Exclude the actionsTypes.js file.
    --no-reducers [reducers]     Exclude the reducers.js file.
    --no-services [services]     Exclude the services.js file.
    --no-router [router]         Exclude the route.js file.
    --no-state [state]           Exclude the state.js file.
    -h, --help                   Output usage information.
```


4. Follow the prompts:
* Name: The name of the component that you wish to create.
* Route: If you're building a `Single Page App` (SPA) and your new component uses the Router class, you'll want to specify the `route` that will navigate to this component.
* Use Redux?: Determines if your new component's state will be managed by [Redux](redux.js.org).

![](https://image.ibb.co/iE8y4b/new_component_class.png)


## Using Components
Now that you've created your first component, it's time to use it.
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

> Alternatively, you can just start using the component in your app like you would any other React component.

Reactium will now scan your markup for the `<Component>` tags and bind the specified `type` to the element.
You can pass initial state to the component via attributes but that's not necessary if you're using Redux for state management.
