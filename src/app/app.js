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
import { createStore, applyMiddleware, combineReducers } from 'redux';
import DevTools from 'appdir/components/DevTools';

/**
 * -----------------------------------------------------------------------------
 * @description Redux setup
 * -----------------------------------------------------------------------------
 */
let localizeState     = true;
let initialState      = {};
const components      = [];
const elements        = document.querySelectorAll('Component');

if (elements.length > 0) {
    elements.forEach((elm) => {

        let req, comp;
        let cname = elm.getAttribute('type');

        if (!cname) { return; }

        let paths = [
            `./components/${cname}`,
            `./components/${cname}/index`,
        ];

        while (!req && paths.length > 0) {
            comp = paths.shift();

            try { req = require(comp + ''); } catch (err) { }

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

            // Get parameters from container element
            let params = {};
            Object.entries(elm.attributes).forEach(([key, attr]) => {
                if ( key !== 'type') {
                    params[attr.name] = attr.value;
                }
            });

            // Create the React element and apply parameters
            let cmp = React.createElement(req, params);
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
}, {});

export const actions = importDefined(allActions);

let importedActionTypes = importDefined(allActionTypes);
export const actionTypes = Object.keys(importedActionTypes).reduce((types, key) => ({
    ...types,
    ...importedActionTypes[key],
}), {});

export const services = importDefined(allServices);

export const routes = importDefined(allRoutes);

export const restHeaders = () => {
    return {};
};

// Make sure initial loaded state matches reducers and that
// the current route will dictate the Router state
const sanitizeInitialState = state => Object.keys(state)
    .filter(s => s in allReducers)
    .filter(s => s !== 'Router')
    .reduce((states, key) => ({
        ...states,
        [key]: state[key],
    }), {});

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

        // Load InitalState first from modules
        let importedStates = importDefined(allInitialStates);
        initialState = {
            ...initialState,
            ...sanitizeInitialState(importedStates),
        };
        // Don't use Router state on reload

        // Get localized state and apply it
        if (localizeState === true) {
            middleWare.push(lsSave());
            initialState = {
                ...initialState,
                ...sanitizeInitialState(lsLoad()),
            };
        } else {
            lsClear();
        }

        const createStoreWithMiddleware = applyMiddleware(...middleWare)(createStore);

        // Combine all Top-level reducers into one
        let rootReducer = combineReducers(importDefined(allReducers));

        // Add DevTools redux enhancer in development
        let storeEnhancer = process.env.NODE_ENV === 'development' ? DevTools.instrument() : _=>_;

        // Create the store
        const store = createStoreWithMiddleware(rootReducer, initialState, storeEnhancer);

        // Render the React Components
        components.forEach((item, i) => {
            // Add DevTools to first bound component in development
            let Tools = null;
            if (i === 0 && process.env.NODE_ENV === 'development') {
                Tools = DevTools;
            }

            ReactDOM.render(
                <Provider store={store}>
                    <div>
                        {item.component}
                        <Tools />
                    </div>
                </Provider>,
                item.element
            );
        });
    }
};
