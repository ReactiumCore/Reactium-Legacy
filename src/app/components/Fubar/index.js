
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'appdir/app';


/**
 * -----------------------------------------------------------------------------
 * React Component: Fubar
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = (state, props) => {
    return Object.assign({}, state['Fubar'], props);
};

const mapDispatchToProps = (dispatch, props) => ({
    mount: () => dispatch(actions.Fubar.mount()),
});

class Fubar extends Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.props);
    }

    componentDidMount() {
        this.props.mount();
    }

    componentWillReceiveProps(nextProps) {
        this.setState((prevState) => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    render() {
        return (
            <div>
            COMPONENT
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fubar);
