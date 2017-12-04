import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import RouteObserver from './RouteObserver';

import routes from './routes';

export default class AppRouter extends Component {
    render() {
        return (
            <Router>
                <main>
                    <RouteObserver />

                    {routes.map(route => (
                        <Route {...route} />
                    ))}
                </main>
            </Router>
        );
    }
}
