import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import CardMenu from './CardMenu';
import { generateNodes, generateLines, generateMainNode } from '../../actions';
import {
    validationNumberField,
    randomFloatRange,
} from './../../helpers/helpersFunctions';
import { NODE_RADIUS, RANGE_NODE_MIN, RANGE_NODE_MAX, MIN_NODES, MAX_NODES, DEFAULT_NODES, PADDING } from '../../constants';
import eventEmmiter from '../../utils/eventEmmiter';

class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodesValue: DEFAULT_NODES,
            nodeRadiusMin: RANGE_NODE_MIN,
            nodeRadiusMax: RANGE_NODE_MAX,
            errorNodesValue: {
                errorMessage: '',
                hasError: false,
            },
            errorNodeRadiusMin: {
                errorMessage: '',
                hasError: false,
            },
            errorNodeRadiusMax: {
                errorMessage: '',
                hasError: false,
            },
        };
    }

    // handlers

    onHandleNodes = (e) => {
        const val = e.target.value.trim();
        const errorNodesValue = validationNumberField(MIN_NODES, MAX_NODES, val);

        let nodesValue = 0;

        if (val.length === 0) {
            nodesValue = '';
        } else {
            nodesValue = val.match(/\d+/g).map(Number);
        }

        this.setState({
            nodesValue,
            errorNodesValue: { ...errorNodesValue },
        });
    }

    onRangeMinChange = (e) => {
        const val = e.target.value.trim();
        const errorNodeRadiusMin = validationNumberField(RANGE_NODE_MIN, RANGE_NODE_MAX, val);

        let nodeRadiusMin = 0;

        if (val.length === 0) {
            nodeRadiusMin = '';
        } else {
            nodeRadiusMin = val.match(/\d+/g).map(Number);
        }

        this.setState({
            nodeRadiusMin,
            errorNodeRadiusMin: { ...errorNodeRadiusMin },
        });
    }

    onRangeMaxChange = (e) => {
        const val = e.target.value.trim();
        const errorNodeRadiusMax = validationNumberField(RANGE_NODE_MIN, RANGE_NODE_MAX, val);

        let nodeRadiusMax = 0;

        if (val.length === 0) {
            nodeRadiusMax = '';
        } else {
            nodeRadiusMax = val.match(/\d+/g).map(Number);
        }

        this.setState({
            nodeRadiusMax,
            errorNodeRadiusMax: { ...errorNodeRadiusMax },
        });
    }

    onHandleGenerate = (e) => {
        e.preventDefault();
        eventEmmiter.emit('generateNodes');

        const nodes = this.getNodes();
        const lines = this.getLines(nodes);
        const mainNode = this.getMainNode();

        this.props.dispatch(generateMainNode(mainNode));
        this.props.dispatch(generateNodes(nodes));
        this.props.dispatch(generateLines(lines));
    }

    // getters

    getNodes() {
        const {
            nodesValue,
            nodeRadiusMin,
            nodeRadiusMax,
        } = this.state;

        const {
            networkPanelWidth,
            networkPanelHeight,
        } = this.props;

        const nodes = [];
        const nodeSizePercentX = (NODE_RADIUS * PADDING) / networkPanelWidth;
        const nodeSizePercentY = (NODE_RADIUS * PADDING) / networkPanelHeight;

        for (let i = 0; i < nodesValue; i += 1) {
            const node = {
                id: i + 1,
                x: randomFloatRange(nodeSizePercentX, PADDING - nodeSizePercentX),
                y: randomFloatRange(nodeSizePercentY, PADDING - nodeSizePercentY),
                params: {
                    radius: randomFloatRange(nodeRadiusMin, nodeRadiusMax),
                },
            };

            nodes.push(node);
        }

        return nodes;
    }

    getMainNode() {
        const {
            networkPanelWidth,
            networkPanelHeight,
        } = this.props;

        const nodeSizePercentX = (NODE_RADIUS * PADDING) / networkPanelWidth;
        const nodeSizePercentY = (NODE_RADIUS * PADDING) / networkPanelHeight;

        return {
            id: 'MAIN',
            x: randomFloatRange(nodeSizePercentX, PADDING - nodeSizePercentX),
            y: randomFloatRange(nodeSizePercentY, PADDING - nodeSizePercentY),
            params: {},
        };
    }

    getLines(nodes) {
        const rez = [];
        let iter = 0;
        let n = nodes;

        while (n.length >= 2) {
            n = n.slice(iter, n.length);
            iter = +1;

            for (let i = 1; i < n.length; i += 1) {
                rez.push({
                    id: `${n[0].id}${n[i].id}`,
                    x1: n[0].x,
                    y1: n[0].y,
                    x2: n[i].x,
                    y2: n[i].y,
                });
            }
        }
        return rez;
    }

    render() {
        const {
            nodesValue,
            nodeRadiusMin,
            nodeRadiusMax,
            errorNodesValue,
            errorNodeRadiusMin,
            errorNodeRadiusMax,
        } = this.state;

        const inputNodesCx = cx({
            'form-control form-control-sm': true,
            'is-invalid': errorNodesValue.hasError,
        });

        const nodeRadiusMinCx = cx({
            'form-control form-control-sm': true,
            'is-invalid': errorNodeRadiusMin.hasError,
        });

        const nodeRadiusMaxCx = cx({
            'form-control form-control-sm': true,
            'is-invalid': errorNodeRadiusMax.hasError,
        });

        const disabledSaveBtn = errorNodesValue.hasError || errorNodeRadiusMin.hasError || errorNodeRadiusMax.hasError;

        return (
            <CardMenu
                name="Controls"
            >
                <p className="text-center text-muted mb-1">Generate some nodes</p>
                <form className="text-center mb-1">
                    <div className="form-group">
                        <input
                            type="text"
                            className={inputNodesCx}
                            placeholder="Please enter a number"
                            value={nodesValue}
                            onChange={this.onHandleNodes}
                        />
                        {
                            !errorNodesValue.errorMessage ?
                                <small id="emailHelp" className="form-text text-muted text-uppercase">{`Min ${MIN_NODES} - Max ${MAX_NODES}`}</small> :
                                <div className="invalid-feedback">{errorNodesValue.errorMessage}</div>
                        }
                        <p className="text-center text-muted mb-1 mt-2 border-top pt-2">Range</p>
                        <div className="row">
                            <div className="col-6 pr-2">
                                <input
                                    type="text"
                                    onChange={this.onRangeMinChange}
                                    value={nodeRadiusMin}
                                    className={nodeRadiusMinCx}
                                />
                                <p className="text-center text-muted mb-0">
                                    {
                                        !errorNodeRadiusMin.errorMessage ?
                                            <small>{`Min ${RANGE_NODE_MIN}%`}</small> :
                                            <small className="invalid-feedback d-inline">{errorNodeRadiusMin.errorMessage}</small>
                                    }
                                </p>
                            </div>
                            <div className="col-6 pl-2">
                                <input
                                    type="text"
                                    className={nodeRadiusMaxCx}
                                    onChange={this.onRangeMaxChange}
                                    value={nodeRadiusMax}
                                />
                                <p className="text-center text-muted mb-0">
                                    {
                                        !errorNodeRadiusMax.errorMessage ?
                                            <small>{`Max ${RANGE_NODE_MAX}%`}</small> :
                                            <small className="invalid-feedback d-inline">{errorNodeRadiusMax.errorMessage}</small>
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" onClick={this.onHandleGenerate} disabled={disabledSaveBtn}>Generate</button>
                </form>
            </CardMenu>
        );
    }
}

Controls.propTypes = {
    networkPanelWidth: PropTypes.number,
    networkPanelHeight: PropTypes.number,
    dispatch: PropTypes.func,
};

export default Controls;
