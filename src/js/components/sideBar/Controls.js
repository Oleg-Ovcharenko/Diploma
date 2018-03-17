import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import CardMenu from './CardMenu';
import { generateNodes, generateLines } from '../../actions';
import {
    validationNumberField,
    randomFloatRange,
} from './../../helpers/helpersFunctions';
import { NODE_RADIUS } from '../../constants';
import eventEmmiter from '../../utils/eventEmmiter';

const MIN_NODES = 1;
const MAX_NODES = 300;

class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodesValue: 10,
            error: {
                errorMessage: '',
                hasError: false,
            },
        };

        this.handleNodes = this.handleNodes.bind(this);
        this.handleGenerate = this.handleGenerate.bind(this);
    }

    // getters

    getNodes() {
        const {
            nodesValue,
        } = this.state;

        const {
            networkPanelWidth,
            networkPanelHeight,
        } = this.props;

        const nodes = [];
        const nodeSizePercentX = (NODE_RADIUS * 100) / networkPanelWidth;
        const nodeSizePercentY = (NODE_RADIUS * 100) / networkPanelHeight;

        for (let i = 0; i < nodesValue; i += 1) {
            const node = {
                id: i + 1,
                x: randomFloatRange(nodeSizePercentX, 100 - nodeSizePercentX),
                y: randomFloatRange(nodeSizePercentY, 100 - nodeSizePercentY),
                params: {},
            };

            nodes.push(node);
        }

        return nodes;
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

    handleNodes(e) {
        const val = e.target.value.trim();
        const validationErr = validationNumberField(MIN_NODES, MAX_NODES, val);

        let nodesValue = 0;

        if (val.length === 0) {
            nodesValue = '';
        } else {
            nodesValue = val.match(/\d+/g).map(Number);
        }

        this.setState({
            nodesValue,
            error: { ...validationErr },
        });
    }

    handleGenerate(e) {
        e.preventDefault();
        eventEmmiter.emit('generateNodes');

        const nodes = this.getNodes();
        const lines = this.getLines(nodes);

        this.props.dispatch(generateNodes(nodes));
        this.props.dispatch(generateLines(lines));
    }

    render() {
        const {
            nodesValue,
            error: {
                errorMessage,
                hasError,
            },
        } = this.state;

        const inputNodes = cx({
            'form-control form-control-sm': true,
            'is-invalid': hasError,
        });

        return (
            <CardMenu
                name="Controls"
            >
                <p className="text-center text-muted mb-1">
                    <small>Generate some nodes</small>
                </p>
                <form className="text-center mb-1">
                    <div className="form-group">
                        <input
                            type="text"
                            className={inputNodes}
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Please enter a number"
                            min={MIN_NODES}
                            max={MAX_NODES}
                            value={nodesValue}
                            onChange={this.handleNodes}
                        />
                        {
                            !errorMessage ?
                                <small id="emailHelp" className="form-text text-muted text-uppercase">{`Min ${MIN_NODES} - Max ${MAX_NODES}`}</small> :
                                <div className="invalid-feedback">{errorMessage}</div>
                        }
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" onClick={this.handleGenerate} disabled={hasError}>Generate</button>
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
