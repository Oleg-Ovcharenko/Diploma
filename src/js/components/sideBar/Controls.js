import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import CardMenu from './CardMenu';
import { generateNodes } from '../../actions';
import {
    validationNumberField,
    randomRange,
} from './../../helpers/helpersFunctions';
import { NODE_RADIUS } from '../../constants';

const MIN_NODES = 1;
const MAX_NODES = 200;

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

    handleNodes(e) {
        const nodesValue = e.target.value.match(/\d+/g).map(Number);
        const validationErr = validationNumberField(MIN_NODES, MAX_NODES, nodesValue);

        this.setState({
            nodesValue,
            error: { ...validationErr },
        });
    }

    handleGenerate(e) {
        e.preventDefault();

        const {
            nodesValue,
        } = this.state;

        const {
            networkPanelWidth,
            networkPanelHeight,
        } = this.props;

        const nodes = [];

        for (let i = 0; i < nodesValue; i += 1) {
            const node = {
                id: i + 1,
                x: randomRange(NODE_RADIUS, networkPanelWidth - NODE_RADIUS),
                y: randomRange(NODE_RADIUS, networkPanelHeight - NODE_RADIUS),
                params: {},
            };

            nodes.push(node);
        }

        this.props.dispatch(generateNodes(nodes));
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
                <h6 className="text-center text-muted m-b-1-rem">Generate some nodes</h6>
                <form className="text-center">
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
