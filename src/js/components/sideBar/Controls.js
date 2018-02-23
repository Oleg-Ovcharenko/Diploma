import React from 'react';
import cx from 'classnames';
import CardMenu from './CardMenu';
import {
    randomRange,
    validationNumberField,
} from './../../helpers/helpersFunctions';

const MIN_NODES = 1;
const MAX_NODES = 200;

class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodesValue: 10,
            generateNodes: 0,
            error: {
                errorMessage: '',
                hasError: false,
            },
        };

        this.handleNodes = this.handleNodes.bind(this);
        this.handleGenerate = this.handleGenerate.bind(this);
    }

    handleNodes(e) {
        const nodesValue = e.target.value;
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

        // to do
        this.setState({
            generateNodes: nodesValue,
        });
    }

    render() {
        const {
            nodesValue,
            generateNodes,
            error: {
                errorMessage,
                hasError,
            },
        } = this.state;

        console.log(generateNodes);

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
                            type="number"
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

export default Controls;
