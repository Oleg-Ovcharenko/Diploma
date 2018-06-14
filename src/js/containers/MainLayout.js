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
    showGrid,
    scale,
    networkPanel,
}) => (
    <section className="flex-grow-1 bg-gray-200 d-flex flex-column p-3">
        <ControlsNetwork
            dispatch={dispatch}
            nodes={nodes}
            lines={lines}
            scale={scale}
            networkPanel={networkPanel}
        />
        <Network
            nodes={nodes}
            lines={lines}
            mainNode={mainNode}
            dispatch={dispatch}
            showRange={showRange}
            showGrid={showGrid}
            selectedAlgorithm={selectedAlgorithm}
            generateNodes={generateNodes}
            buildAlgorithm={buildAlgorithm}
            scale={scale}
        />
    </section>
);

MainLayout.propTypes = {
    dispatch: PropTypes.func,
    nodes: PropTypes.array,
    lines: PropTypes.array,
    mainNode: PropTypes.object,
    showRange: PropTypes.bool,
    showGrid: PropTypes.bool,
    selectedAlgorithm: PropTypes.any,
    generateNodes: PropTypes.bool,
    buildAlgorithm: PropTypes.bool,
    scale: PropTypes.number,
    networkPanel: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        nodes: state.nodes,
        lines: state.lines,
        showRange: state.ui.showRange,
        showGrid: state.ui.showGrid,
        mainNode: state.mainNode,
        scale: state.settings.scale,
        selectedAlgorithm: state.settings.selectedAlgorithm,
        generateNodes: state.settings.generateNodes,
        buildAlgorithm: state.settings.buildAlgorithm,
        networkPanel: state.ui.networkPanel,
    };
}

export default connect(mapStateToProps)(MainLayout);
