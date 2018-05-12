// LIBRARIES
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// COMPONENTS
import ControlsNetwork from '../components/mainlayout/ControlsNetwork';
import Network from '../components/mainlayout/Network';

const MainLayout = ({
    nodes,
    lines,
    mainNode,
    dispatch,
    showRange,
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
        />
    </section>
);

MainLayout.propTypes = {
    dispatch: PropTypes.func,
    nodes: PropTypes.array,
    lines: PropTypes.array,
    mainNode: PropTypes.object,
    showRange: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        nodes: state.nodes,
        lines: state.lines,
        showRange: state.ui.show,
        mainNode: state.mainNode,
    };
}

export default connect(mapStateToProps)(MainLayout);
