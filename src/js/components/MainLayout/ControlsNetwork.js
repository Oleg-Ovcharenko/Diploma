// LIBRARIES
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
// UTILS
import eventEmmiter from '../../utils/eventEmmiter';
// ACTIONS
import { showRangeNodes } from '../../actions';
// COMPONENTS
import ModalBase from '../ModalBase';

class ControlsNetwork extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalResults: false,
        };
    }

    // handlers
    onChangeAlgorithmStatus = () => {
        eventEmmiter.emit('buildAlgorithm');
    }

    onShowRange = () => {
        this.props.dispatch(showRangeNodes());
    }

    onShowResultsModal = () => {
        this.setState({
            modalResults: !this.state.modalResults,
        });
    }

    // modals
    resultModalBody() {
        return (
            <p>asdf</p>
        );
    }

    // renders
    renderModals() {
        return (
            <ModalBase
                show={this.state.modalResults}
                toggle={this.onShowResultsModal}
                modalBody={this.resultModalBody}
                size="lg"
                title="Results"
            />
        );
    }

    render() {
        const {
            nodes,
        } = this.props;

        return (
            <div className="w-100 d-flex">
                <div className="w-50 mr-2">
                    <div className="card mb-3 h-80 bg-white rounded-0 w-100">
                        <div className="card-body d-flex align-i-center rounded-0">
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
                            <div className="custom-control custom-checkbox ml-3">
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
                <div className="w-50 ml-2">
                    <div className="card mb-3 h-80 bg-white rounded-0 w-100">
                        <div className="card-body d-flex align-i-center rounded-0 d-flex justify-content-between">
                            <div>
                                <Button
                                    onClick={this.onShowResultsModal}
                                    outline
                                    color="primary"
                                    size="sm"
                                >
                                    Show results
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.renderModals()
                }
            </div>
        );
    }
}

ControlsNetwork.propTypes = {
    dispatch: PropTypes.func,
    nodes: PropTypes.array,
};

export default ControlsNetwork;

