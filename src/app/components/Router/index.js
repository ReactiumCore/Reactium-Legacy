import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import RouteObserver from './RouteObserver';
import { routes } from 'appdir/app';

export default class AppRouter extends Component {
    render() {
        return (
            <Router>
                <main>
                    <RouteObserver />

                    {Object.keys(routes).map(route => (
                        <Route key={route} {...routes[route]} />
                    ))}
                </main>
            </Router>
        );
    }
}
