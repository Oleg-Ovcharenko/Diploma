// LIBRARIES
import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
// ACTIONS
import { showRangeNodes, showGrid, buildAlgorithmChangeStatus } from '../../actions';
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
        this.props.dispatch(buildAlgorithmChangeStatus(true));
    }

    onShowRange = () => {
        this.props.dispatch(showRangeNodes());
    }

    onShowGrid = () => {
        this.props.dispatch(showGrid());
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
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input custom-control-input-sm"
                                    id="showRanges"
                                    disabled={nodes.length === 0}
                                    onClick={this.onShowRange}
                                />
                                <label
                                    className={cx({ 'cursor-pointer': nodes.length !== 0 }, 'custom-control-label small')}
                                    htmlFor="showRanges"
                                >
                                    <span>Show range</span>
                                </label>
                            </div>
                            <div className="custom-control custom-checkbox ml-3 mr-3">
                                <input
                                    type="checkbox"
                                    className="custom-control-input custom-control-input-sm"
                                    id="showGrid"
                                    disabled={nodes.length === 0}
                                    onClick={this.onShowGrid}
                                />
                                <label
                                    className={cx({ 'cursor-pointer': nodes.length !== 0 }, 'custom-control-label small')}
                                    htmlFor="showGrid"
                                >
                                    <span>Show grid</span>
                                </label>
                            </div>
                            <div className="ml-auto">
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
                {this.renderModals()}
            </div>
        );
    }
}

ControlsNetwork.propTypes = {
    dispatch: PropTypes.func,
    nodes: PropTypes.array,
};

export default ControlsNetwork;

