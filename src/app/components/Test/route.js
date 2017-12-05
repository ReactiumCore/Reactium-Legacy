import Test from './index';
import { actions } from 'appdir/app';

export default {
    key: 'Test',
    path: '/',
    exact: true,
    component: Test,
    load: params => actions.Test.mount(params),
};
