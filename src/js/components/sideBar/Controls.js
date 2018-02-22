import React from 'react';
import CardMenu from './CardMenu';

const MIN_NODES = 2;
const MAX_NODES = 200;

class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodesValue: 0,
            generateNodes: 0,
        };

        this.handleNodes = this.handleNodes.bind(this);
        this.handleGenerate = this.handleGenerate.bind(this);
    }

    handleNodes(e) {
        this.setState({
            nodesValue: e.target.value,
        });
    }

    handleGenerate(e) {
        e.preventDefault();

        this.setState({
            generateNodes: 10,
        });
    }

    render() {
        const {
            nodesValue,
            generateNodes,
        } = this.state;

        console.log(generateNodes);

        return (
            <CardMenu
                name="Controls"
            >
                <h6 className="text-center text-muted m-b-1-rem">Generate some nodes</h6>
                <form className="text-center">
                    <div className="form-group">
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Please enter a number"
                            min={MIN_NODES}
                            max={MAX_NODES}
                            value={nodesValue}
                            onChange={this.handleNodes}
                        />
                        <small id="emailHelp" className="form-text text-muted text-uppercase">Min 2 - Max 200</small>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" onClick={this.handleGenerate}>Generate</button>
                </form>
            </CardMenu>
        )
    }
}

export default Controls;
