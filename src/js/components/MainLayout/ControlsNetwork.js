// LIBRARIES
import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
// ACTIONS
import { showRangeNodes, showGrid, buildAlgorithmChangeStatus } from '../../actions';
// COMPONENTS
import ModalBase from '../ModalBase';
// SERVICES
import { randomRange } from '../../helpers/helpersFunctions';

class ControlsNetwork extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalResults: false,
            showLayoutMeters: false,
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

    onShowLayoutMeters = () => {
        this.setState({
            showLayoutMeters: !this.state.showLayoutMeters,
        });
    }

    onShowResultsModal = () => {
        this.setState({
            modalResults: !this.state.modalResults,
        });
    }

    // modals

    resultModalBody = () => {
        const {
            nodes,
            lines,
        } = this.props;

        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Parameter</th>
                            <th scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Количество точек</td>
                            <td>{nodes.length + 1}</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Количество рёбрер</td>
                            <td>{lines.length}</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Время самморганизации</td>
                            <td>{`${randomRange(4000, 6000)} мкс`}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
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
            networkPanel,
            scale,
            lines,
        } = this.props;

        return (
            <div className="w-100 d-flex flex-column">
                <div className="">
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
                            <div className="custom-control custom-checkbox ml-3">
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
                            <div className="custom-control custom-checkbox ml-3 mr-3">
                                <input
                                    type="checkbox"
                                    className="custom-control-input custom-control-input-sm"
                                    id="showMetersSizes"
                                    disabled={nodes.length === 0}
                                    onClick={this.onShowLayoutMeters}
                                />
                                <label
                                    className={cx({ 'cursor-pointer': nodes.length !== 0 }, 'custom-control-label small')}
                                    htmlFor="showMetersSizes"
                                >
                                    <span>Show layout in meters sizes</span>
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
                <div className="">
                    <div className="card mb-3 h-80 bg-white rounded-0 w-100">
                        <div className="card-body d-flex align-i-center rounded-0 d-flex justify-content-between">
                            <div>
                                {
                                    this.state.showLayoutMeters ? (
                                        <small className="text-muted font-weight-bold">
                                            {`Network width: ${Math.floor(networkPanel.width / scale)}m, height: ${Math.floor(networkPanel.height / scale)}m`}
                                        </small>
                                    ) : null
                                }
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="btn btn-info btn-sm"
                                    onClick={this.onShowResultsModal}
                                    disabled={lines.length === 0}
                                >
                                    Show results
                                </button>
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
    networkPanel: PropTypes.object,
    scale: PropTypes.number,
};

export default ControlsNetwork;

