// LIBRARIES
import React from 'react';
import PropTypes from 'prop-types';
// COMPONENTS
import CardMenu from './CardMenu';
// CONSTANTS
import { ALGORITHMS_LIST } from '../../constants';
// ACTIONS
import { selectAlgorithm } from '../../actions';

class SelectAlgorithm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAlgorithm: 0,
        };
    }

    onSelect = (e) => {
        this.props.dispatch(selectAlgorithm(e.target.value));
        this.setState({
            selectedAlgorithm: e.target.value,
        });
    }

    render() {
        const {
            selectedAlgorithm,
        } = this.state;

        return (
            <CardMenu
                name="Algorithm"
            >
                <div>
                    <p className="text-center text-muted mb-1">Select algorithm</p>
                    <select className="form-control form-control-sm" onChange={this.onSelect} value={selectedAlgorithm}>
                        <option disabled value={0}>-</option>
                        {
                            ALGORITHMS_LIST.map((item) => <option key={item} value={item}>{item}</option>)
                        }
                    </select>
                </div>
            </CardMenu>
        );
    }
}

SelectAlgorithm.propTypes = {
    dispatch: PropTypes.func,
};

export default SelectAlgorithm;
