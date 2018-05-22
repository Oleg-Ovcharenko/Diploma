// LIBRARIES
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// COMPONENTS
import Controls from '../components/sidebar/Controls';
import NodeSettings from '../components/sidebar/NodeSettings';
import SelectAlgorithm from '../components/sidebar/SelectAlgorithm';

const SideBar = ({
    networkPanelWidth,
    networkPanelHeight,
    dispatch,
    selectedAlghoritm,
}) => (
    <section className="menu overflow-x-a">
        <SelectAlgorithm
            dispatch={dispatch}
        />
        <Controls
            dispatch={dispatch}
            networkPanelWidth={networkPanelWidth}
            networkPanelHeight={networkPanelHeight}
            selectedAlghoritm={selectedAlghoritm}
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
    selectedAlghoritm: PropTypes.any,
};

function mapStateToProps(state) {
    return {
        networkPanelWidth: state.ui.networkPanel.width,
        networkPanelHeight: state.ui.networkPanel.height,
        selectedAlghoritm: state.selectedAlghoritm,
    };
}

export default connect(mapStateToProps)(SideBar);
