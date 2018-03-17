import React from 'react';
import PropTypes from 'prop-types';

const LINE_WIDTH = 1;
const LINE_COLOR = '#007bff';

const Line = ({ line }) => (
    <line
        x1={`${line.x1}%`}
        y1={`${line.y1}%`}
        x2={`${line.x2}%`}
        y2={`${line.y2}%`}
        strokeWidth={LINE_WIDTH}
        style={{ stroke: LINE_COLOR }}
    />
);

Line.propTypes = {
    line: PropTypes.object,
};

export default Line;
