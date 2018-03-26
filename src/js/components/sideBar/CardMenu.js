import React from 'react';
import PropTypes from 'prop-types';

const CardMenu = ({ name, children }) => (
    <div className="card custom-card rounded-0 border-right-0 border-left-0">
        <div className="card-header rounded-0">
            <h6 className="m-0 text-dark">{name}</h6>
        </div>
        <div className="card-body rounded-0">
            {children}
        </div>
    </div>
);

CardMenu.propTypes = {
    name: PropTypes.string,
    children: PropTypes.any,
};

export default CardMenu;
