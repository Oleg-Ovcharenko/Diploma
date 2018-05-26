// LIBRARIES
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// COMPONENTS
import ControlsNetwork from '../components/MainLayout/ControlsNetwork';
import Network from '../components/MainLayout/Network';

const MainLayout = ({
    nodes,
    lines,
    mainNode,
    dispatch,
    showRange,
    selectedAlgorithm,
    generateNodes,
    buildAlgorithm,
}) => (
    <section className="flex-grow-1 bg-gray-200 d-flex flex-column p-3">
        <ControlsNetwork
            dispatch={dispatch}
            nodes={nodes}
        />
        <Network
            nodes={nodes}
            lines={lines}
            mainNode={mainNode}
            dispatch={dispatch}
            showRange={showRange}
            selectedAlgorithm={selectedAlgorithm}
            generateNodes={generateNodes}
            buildAlgorithm={buildAlgorithm}
        />
    </section>
);

MainLayout.propTypes = {
    dispatch: PropTypes.func,
    nodes: PropTypes.array,
    lines: PropTypes.array,
    mainNode: PropTypes.object,
    showRange: PropTypes.bool,
    selectedAlgorithm: PropTypes.any,
    generateNodes: PropTypes.bool,
    buildAlgorithm: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        nodes: state.nodes,
        lines: state.lines,
        showRange: state.ui.show,
        mainNode: state.mainNode,
        selectedAlgorithm: state.settings.selectedAlgorithm,
        generateNodes: state.settings.generateNodes,
        buildAlgorithm: state.settings.buildAlgorithm,
    };
}

export default connect(mapStateToProps)(MainLayout);
