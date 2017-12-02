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
const reactify        = document.querySelectorAll('component');


if (reactify.length > 0) {
    reactify.forEach((elm) => {

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

            // Get the reducers
            try { reducer = require(path + '/reducers');} catch (err) {}
            if (reducer) {
                if (reducer.hasOwnProperty('default')) {
                    reducer = reducer.default;
                }

                reducerObj[cname] = reducer;
            }

            // Get the actions
            try { action = require(path + '/actions'); } catch (err) { }
            if (action) {
                if (action.hasOwnProperty('default')) {
                    action = action.default;
                }

                actionObj = Object.assign({}, actionObj, {...action});
            }

            // Get the actionTypes
            try { actionType = require(path + '/actionTypes'); } catch (err) { }
            if (actionType) {
                if (actionType.hasOwnProperty('default')) {
                    actionType = actionType.default;
                }

                actionTypeObj = Object.assign({}, actionTypeObj, {...actionType});
            }

            // Get the services
            try { service = require(path + '/services'); } catch (err) { }
            if (service) {
                if (service.hasOwnProperty('default')) {
                    service = service.default;
                }

                serviceObj = Object.assign({}, serviceObj, {...service});
            }
        }
    });
}


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
        let reducerArr = combineReducers({...reducerObj});

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

export const actions = {
    ...actionObj
};

export const actionTypes = {
    ...actionTypeObj
};

export const services = {
    ...serviceObj
};

export const restAPI = "http://demo3914762.mockable.io";

export const restHeaders = () => {
    return {};
};