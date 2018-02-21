import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CardMenu extends Component {
    render() {
        const {
            name,
        } = this.props;

        return (
            <div className="card custom-card">
                <div className="card-header b-r-0">
                    <h6 className="m-0">{name}</h6>
                </div>
                <div className="card-body b-r-0">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

CardMenu.propTypes = {
    name: PropTypes.string,
};

export default CardMenu;
