import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RouteObserver from './RouteObserver';
import { routes } from 'appdir/app';
import NotFound from 'appdir/components/NotFound';

export default class AppRouter extends Component {
    // Add order property greater than 0 to route
    // to weight it down (have it evaluate later)
    sortRoutes(routeA, routeB) {
        let orderA = routeA['order'] || 0;
        let orderB = routeB['order'] || 0;
        return orderA - orderB;
    }

    render() {
        return (
            <Router>
                <main>
                    <RouteObserver />
                    <Switch>
                        {
                            Object.keys(routes)
                                .sort((a,b) => this.sortRoutes(routes[a], routes[b]))
                                .map(route => (<Route key={route} {...routes[route]} />))
                        }
                        <Route component={NotFound}/>
                    </Switch>
                </main>
            </Router>
        );
    }
}
