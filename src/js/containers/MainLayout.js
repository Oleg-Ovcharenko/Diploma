import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ControlsNetwork from '../components/MainLayout/ControlsNetwork';
import Network from '../components/MainLayout/Network';

class MainLayout extends Component {
    render() {
        const {
            nodes,
            dispatch,
        } = this.props;

        return (
            <section className="main-layout p-1-25">
                <ControlsNetwork />
                <Network
                    nodes={nodes}
                    dispatch={dispatch}
                />
            </section>
        );
    }
}

MainLayout.propTypes = {
    nodes: PropTypes.array,
};

function mapStateToProps(state) {
    return {
        nodes: state.nodes,
    };
}

export default connect(mapStateToProps)(MainLayout);
