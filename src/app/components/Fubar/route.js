import Fubar from './index';
import { actions } from 'appdir/app';

export default {
    path: '/page/fubar',
    exact: true,
    component: Fubar,
    load: params => actions.Fubar.mount(params),
};
