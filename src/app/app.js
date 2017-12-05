'use strict';

/**
 * -----------------------------------------------------------------------------
 * Includes
 * -----------------------------------------------------------------------------
 */

import React from 'react';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { save as lsSave, load as lsLoad, clear as lsClear } from 'redux-localstorage-simple';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

// babel-plugin-import-glob loaded imports, use with care
// import * as allActionTypes from 'glob:./components/**/actionTypes.js';
// import * as allActions from 'glob:./components/**/actions.js';
// import * as allReducers from 'glob:./components/**/reducers.js';
// import * as allServices from 'glob:./components/**/services.js';

/**
 * -----------------------------------------------------------------------------
 * @description Redux setup
 * -----------------------------------------------------------------------------
 */
let localizeState     = true;
let reducerObj        = {};
let actionObj         = {};
let actionTypeObj     = {};
let serviceObj        = {};
let initialState      = {};

const components      = [];
const elements        = document.querySelectorAll('component');


if (elements.length > 0) {
    elements.forEach((elm) => {

        let req, path, reducer, action, actionType, service;
        let cname = elm.getAttribute('type');

        if (!cname) { return; }

        let paths = [
            `./components/${cname}`,
            `./components/${cname}/index`,
        ];

        while (!req && paths.length > 0) {
            path = paths.shift();

            try { req = require(path + ''); } catch (err) { }

            if (req) {
                if (req.hasOwnProperty('default')) {
                    req = req.default;
                }
            }
        }

        if (!req) {
            console.log(`${cname} component does not exist`);
            elm.innerHTML = '';
        } else {
            // Get the component directory so we can find the redux files
            let parr = path.split('/');
            if (parr.pop() === 'index') {
                path = parr.join('/');
            }

            // Get parameters from container element
            let params = {};
            Object.entries(elm.attributes).forEach(([key, attr]) => {
                params[attr.name] = attr.value;
            });
            initialState[cname] = Object.assign({}, params);

            // Create the React element and apply parameters
            let cmp = React.createElement(req);
            components.push({component: cmp, element: elm});
        }
    });
}

// Utility for importing webpack define plugin defined files
const importDefined = filesObj => Object.keys(filesObj).reduce((loaded, key) => {
    let fileName = filesObj[key];
    if (fileName) {
        let newLoaded = require(fileName + "");
        if ( 'default' in newLoaded ) {
            newLoaded = newLoaded.default;
        }
        loaded = {
            ...loaded,
            [key]: newLoaded,
        };
    }
    return loaded;
}, {})

export const actions = importDefined(allActions);

let importedActionTypes = importDefined(allActionTypes);
export const actionTypes = Object.keys(importedActionTypes).reduce((types, key) => ({
    ...types,
    ...importedActionTypes[key],
}), {});

export const services = importDefined(allServices);

export const restAPI = "http://demo3914762.mockable.io";

export const restHeaders = () => {
    return {};
};


/**
 * -----------------------------------------------------------------------------
 * @function App()
 * @description Scan DOM for <Component> elements and render React components
 * inside of them.
 * -----------------------------------------------------------------------------
 */
export const App = () => {
    if (components.length > 0) {

        // Load middleware
        let middleWare = [thunk];

        // Get localized state and apply it
        if (localizeState === true) {
            middleWare.push(lsSave());
            initialState = Object.assign(initialState, lsLoad());
        } else {
            lsClear();
        }

        let enhancer   = compose(applyMiddleware(...middleWare));

        // Combine reducers
        let reducerArr = combineReducers(importDefined(allReducers));

        // Create the store
        const store = createStore(reducerArr, initialState, enhancer);

        // Render the React Components
        components.forEach((item) => {
            ReactDOM.render(
                <Provider store={store}>
                    {item.component}
                </Provider>,
                item.element
            );
        });
    }
};
