// LIBRARIES
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// COMPONENTS
import Controls from '../components/SideBar/Controls';
import NodeSettings from '../components/SideBar/NodeSettings';
import SelectAlgorithm from '../components/SideBar/SelectAlgorithm';

const SideBar = ({
    networkPanelWidth,
    networkPanelHeight,
    dispatch,
    selectedAlgorithm,
    generateNodes,
}) => (
    <section className="menu overflow-x-a">
        <SelectAlgorithm
            dispatch={dispatch}
        />
        <Controls
            dispatch={dispatch}
            networkPanelWidth={networkPanelWidth}
            networkPanelHeight={networkPanelHeight}
            selectedAlgorithm={selectedAlgorithm}
            generateNodes={generateNodes}
        />
        <NodeSettings
            dispatch={dispatch}
            networkPanelWidth={networkPanelWidth}
            networkPanelHeight={networkPanelHeight}
        />
    </section>
);

SideBar.propTypes = {
    dispatch: PropTypes.func,
    networkPanelWidth: PropTypes.number,
    networkPanelHeight: PropTypes.number,
    selectedAlgorithm: PropTypes.any,
    generateNodes: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        networkPanelWidth: state.ui.networkPanel.width,
        networkPanelHeight: state.ui.networkPanel.height,
        selectedAlgorithm: state.settings.selectedAlgorithm,
        generateNodes: state.settings.generateNodes,
    };
}

export default connect(mapStateToProps)(SideBar);
