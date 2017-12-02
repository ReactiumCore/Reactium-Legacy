import { actionTypes } from 'appdir/app';
import { services } from 'appdir/app';

export default {
    test: {
        mount: () => (dispatch) => {
            services.fetchHello().then((data) => {
                dispatch({type: actionTypes.TEST_MOUNT, data: data});
            });
        },

        click: () => (dispatch) => {
            dispatch({type: actionTypes.TEST_CLICK});
        }
    }
};
