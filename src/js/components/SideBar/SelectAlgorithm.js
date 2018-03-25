import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import CardMenu from './CardMenu';

class SelectAlgorithm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <CardMenu
                name="Algorithm"
            >
                <div>
                    <p className="text-center text-muted mb-1">
                        <small>Select algorithm</small>
                    </p>
                    <select className="form-control form-control-sm">
                        <option>OPTICS</option>
                    </select>
                </div>
            </CardMenu>
        );
    }
}

SelectAlgorithm.propTypes = {

};

export default SelectAlgorithm;
