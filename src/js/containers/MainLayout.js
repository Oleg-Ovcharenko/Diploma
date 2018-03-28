import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ControlsNetwork from '../components/MainLayout/ControlsNetwork';
import Network from '../components/MainLayout/Network';

const MainLayout = ({
    nodes,
    lines,
    mainNode,
    dispatch,
}) => (
    <section className="main-layout d-flex flex-column p-3">
        <ControlsNetwork />
        <Network
            nodes={nodes}
            lines={lines}
            mainNode={mainNode}
            dispatch={dispatch}
        />
    </section>
);


MainLayout.propTypes = {
    dispatch: PropTypes.func,
    nodes: PropTypes.array,
    lines: PropTypes.array,
    mainNode: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        nodes: state.nodes,
        lines: state.lines,
        mainNode: state.mainNode,
    };
}

export default connect(mapStateToProps)(MainLayout);
