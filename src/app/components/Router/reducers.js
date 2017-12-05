import * as actions from './actionTypes';
import { combineReducers } from 'redux';

const Router = (state = {}, action) => {
    switch ( action.type ) {
        case actions.UPDATE_ROUTE: {
            return {
                ...state,
                ...action.location,
            };
        }
        default: {
            return state;
        }
    }
};

export default Router;
