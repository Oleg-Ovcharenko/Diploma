import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ControlsNetwork from '../components/mainlayout/ControlsNetwork';
import Network from '../components/mainlayout/Network';

const MainLayout = ({
    nodes,
    lines,
    mainNode,
    dispatch,
    startAlgorithm,
}) => (
    <section className="main-layout d-flex flex-column p-3">
        <ControlsNetwork
            dispatch={dispatch}
            disableStartAlgorithm={!nodes || nodes.length === 0}  
        />
        <Network
            nodes={nodes}
            lines={lines}
            mainNode={mainNode}
            dispatch={dispatch}
            startAlgorithm={startAlgorithm}
        />
    </section>
);


MainLayout.propTypes = {
    dispatch: PropTypes.func,
    nodes: PropTypes.array,
    lines: PropTypes.array,
    mainNode: PropTypes.object,
    startAlgorithm: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        startAlgorithm: state.controlNetwork.start,
        nodes: state.nodes,
        lines: state.lines,
        mainNode: state.mainNode,
    };
}

export default connect(mapStateToProps)(MainLayout);
