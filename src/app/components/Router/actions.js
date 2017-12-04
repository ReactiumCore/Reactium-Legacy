import * as actions from './actionTypes';

export const updateRoute = (location, route, params) => (dispatch, getState) => {
    const { Router } = getState();
    console.log('actions.js getState().Router', Router);

    if ( Router.pathname !== location.pathname ) {
        window.scrollTo(0,0);
    }

    dispatch({
        type: actions.UPDATE_ROUTE,
        routing: location,
    });

    // load route data
    if ( route.hasOwnProperty('load') ) {
        dispatch(route.load(params));
    }
};
