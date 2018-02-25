import React from 'react';
import PropTypes from 'prop-types';

const CardMenu = ({ name, children }) => (
    <div className="card custom-card b-r-0">
        <div className="card-header b-r-0">
            <h6 className="m-0">{name}</h6>
        </div>
        <div className="card-body b-r-0">
            {children}
        </div>
    </div>
);

CardMenu.propTypes = {
    name: PropTypes.string,
    children: PropTypes.array,
};

export default CardMenu;
