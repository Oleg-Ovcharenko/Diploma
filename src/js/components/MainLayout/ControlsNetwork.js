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
            <div className="w-100 d-flex">
                <div className="w-50 mr-2">
                    <div className="card mb-3 h-80 bg-white rounded-0 w-100">
                        <div className="card-body d-flex align-i-center rounded-0 d-flex justify-content-between">
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
                        </div>
                    </div>
                </div>
                <div className="w-50">
                    <div className="card mb-3 h-80 bg-white rounded-0 w-100">
                        <div className="card-body d-flex align-i-center rounded-0 d-flex justify-content-between">
                            <div>
                                <button
                                    type="submit"
                                    className="btn btn-success btn-sm"
                                >
                                    Show results
                                </button>
                            </div>
                        </div>
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

