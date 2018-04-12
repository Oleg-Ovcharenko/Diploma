import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eventEmmiter from '../../utils/eventEmmiter';

class ControlsNetwork extends Component {
    constructor(props) {
        super(props);
    }

    onChangeAlgorithmStatus = () => {
        eventEmmiter.emit('buildAlgorithm');
    }

    render() {
        const {
            nodes,
        } = this.props;

        return (
            <div className="card mb-3 control-networks rounded-0">
                <div className="card-body d-flex align-i-center rounded-0 d-flex">
                    <button
                        type="submit"
                        className="btn btn-success btn-sm"
                        onClick={this.onChangeAlgorithmStatus}
                        disabled={nodes.length === 0}
                    >
                        Build algorithm
                    </button>
                </div>
            </div>
        );
    }
}

ControlsNetwork.propTypes = {
    nodes: PropTypes.array,
};

export default ControlsNetwork;

