import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ControlsNetwork from '../components/MainLayout/ControlsNetwork';
import Network from '../components/MainLayout/Network';

const MainLayout = ({
    nodes,
    lines,
    dispatch,
}) => (
    <section className="main-layout p-1-25">
        <ControlsNetwork />
        <Network
            nodes={nodes}
            lines={lines}
            dispatch={dispatch}
        />
    </section>
);


MainLayout.propTypes = {
    dispatch: PropTypes.func,
    nodes: PropTypes.array,
    lines: PropTypes.array,
};

function mapStateToProps(state) {
    return {
        nodes: state.nodes,
        lines: state.lines,
    };
}

export default connect(mapStateToProps)(MainLayout);
