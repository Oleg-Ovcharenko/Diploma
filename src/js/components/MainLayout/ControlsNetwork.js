import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eventEmmiter from '../../utils/eventEmmiter';
import { showRangeNodes } from '../../actions';

class ControlsNetwork extends Component {
    constructor(props) {
        super(props);
    }

    // handlers 

    onChangeAlgorithmStatus = () => {
        eventEmmiter.emit('buildAlgorithm');
    }

    onShowRange = () => {
        this.props.dispatch(showRangeNodes());
    }

    render() {
        const {
            nodes,
        } = this.props;

        return (
            <div className="card mb-3 control-networks rounded-0">
                <div className="card-body d-flex align-i-center rounded-0 d-flex justify-content-between">
                    <div className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            className="custom-control-input custom-control-input-sm"
                            id="customCheck1"
                            disabled={nodes.length === 0}
                            onClick={this.onShowRange}
                        />
                        <label
                            className="custom-control-label small cursor-pointer"
                            htmlFor="customCheck1"
                        >
                            Show range
                        </label>
                    </div>
                    <div>
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
            </div>
        );
    }
}

ControlsNetwork.propTypes = {
    dispatch: PropTypes.func,
    nodes: PropTypes.array,
};

export default ControlsNetwork;

