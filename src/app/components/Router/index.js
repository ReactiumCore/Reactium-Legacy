import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RouteObserver from './RouteObserver';
import { routes } from 'appdir/app';
import NotFound from 'appdir/components/NotFound';
import _ from 'underscore';

export default class AppRouter extends Component {

    // Add order property greater than 0 to route
    // to weight it down (have it evaluate later)
    sortRoutes(routes) {
        return _.sortBy(Object.keys(routes).map((route) => {
            return Object.assign(
                {},
                routes[route],
                {
                    key: route,
                    order: routes[route]['order'] || 0
                },
            );
        }), 'order');
    }

    render() {
        return (
            <Router>
                <div>
                    <RouteObserver />
                    <Switch>
                        {
                            this.sortRoutes(routes).map((route) => {
                                if (typeof route.path === 'string') {
                                    return (<Route {...route} />);
                                }

                                if (Array.isArray(route.path)) {
                                    return route.path.map((p) => {
                                        let params = Object.assign({}, route, {path: p});
                                        return <Route {...params} />;
                                    });
                                }
                            })
                        }
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

