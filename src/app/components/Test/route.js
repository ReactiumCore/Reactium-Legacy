import actions from './actions';

export default {
    key: 'Test',
    path: '/',
    exact: true,
    load: params => actions.test.mount(params),
};
