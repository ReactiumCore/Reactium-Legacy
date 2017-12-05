import { actionTypes } from 'appdir/app';

export default {
    updateRoute: (location, route, params) => (dispatch, getState) => {
        const { Router } = getState();

        if ( Router.pathname !== location.pathname ) {
            window.scrollTo(0,0);
        }

        dispatch({
            type: actionTypes.UPDATE_ROUTE,
            routing: location,
        });

        // load route data
        if ( route.hasOwnProperty('load') ) {
            dispatch(route.load(params));
        }
    },
};
