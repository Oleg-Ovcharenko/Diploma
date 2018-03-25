import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Controls from '../components/SideBar/Controls';
import NodeSettings from '../components/SideBar/NodeSettings';
import SelectAlgorithm from '../components/SideBar/SelectAlgorithm';

class SideBar extends Component {
    render() {
        const {
            networkPanelWidth,
            networkPanelHeight,
            dispatch,
        } = this.props;

        return (
            <section className="menu">
                <SelectAlgorithm
                    dispatch={dispatch}
                />
                <Controls
                    dispatch={dispatch}
                    networkPanelWidth={networkPanelWidth}
                    networkPanelHeight={networkPanelHeight}
                />
                <NodeSettings
                    dispatch={dispatch}
                    networkPanelWidth={networkPanelWidth}
                    networkPanelHeight={networkPanelHeight}
                />
            </section>
        )
    }
}

SideBar.propTypes = {
    networkPanelWidth: PropTypes.number,
    networkPanelHeight: PropTypes.number,
};

function mapStateToProps(state) {
    return {
        networkPanelWidth: state.ui.networkPanel.width,
        networkPanelHeight: state.ui.networkPanel.height,
    };
}

export default connect(mapStateToProps)(SideBar);
