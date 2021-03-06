// LIBRARIES
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
// COMPONENTS
import CardMenu from './CardMenu';
// ACTIONS
import { generateNodes, generateMainNode, generateLines, generateNodesChangeStatus, setScale } from '../../actions';
// HELPERS
import { validationNumberField, randomFloatRange } from './../../helpers/helpersFunctions';
// CONSTANTS
import { RANGE_NODE_MIN, RANGE_NODE_MAX, MIN_NODES, MAX_NODES, DEFAULT_NODES, PADDING, DEFAULT_SCALE } from '../../constants';

class Controls extends React.Component {
    constructor(props) {
        super(props);

        this.initialValues = {
            scale: DEFAULT_SCALE,
            nodes: DEFAULT_NODES,
            nodeRangeMin: RANGE_NODE_MIN,
            nodeRangeMax: RANGE_NODE_MAX,
        };

        this.formValues = {
            ...this.initialValues,
        };

        this.state = {
            selectedAlgorithm: null,
        };
    }

    // life

    componentWillReceiveProps(nextProps) {
        if (nextProps.generateNodes && nextProps.networkPanelWidth && nextProps.networkPanelHeight) {
            const w = nextProps.networkPanelWidth;
            const h = nextProps.networkPanelHeight;

            this.props.dispatch(generateLines([]));
            this.props.dispatch(generateNodesChangeStatus(false));

            this.props.dispatch(generateMainNode(this.getMainNode(w, h)));
            this.props.dispatch(generateNodes(this.getNodes(w, h)));
        }

        if (this.props.selectedAlgorithm !== nextProps.selectedAlgorithm) {
            this.setState({
                selectedAlgorithm: nextProps.selectedAlgorithm,
            });
        }
    }

    // handlers

    onHandleGenerate = () => {
        this.props.dispatch(generateNodesChangeStatus(true));
        this.props.dispatch(setScale(this.formValues.scale));
    }

    // getters

    getNodes(w, h) {
        const {
            scale,
            nodes,
            nodeRangeMin,
            nodeRangeMax,
        } = this.formValues;

        const {
            networkPanelWidth,
            networkPanelHeight,
        } = this.props;

        const nodesArr = [];

        for (let i = 0; i < nodes; i += 1) {
            const node = {
                id: i + 1,
                x: randomFloatRange(PADDING, (w || networkPanelWidth) - PADDING),
                y: randomFloatRange(PADDING, (h || networkPanelHeight) - PADDING),
                params: {
                    radius: randomFloatRange(nodeRangeMin, nodeRangeMax) * scale,
                },
            };

            nodesArr.push(node);
        }

        return nodesArr;
    }

    getMainNode(w, h) {
        const {
            networkPanelWidth,
            networkPanelHeight,
        } = this.props;

        const {
            scale,
            nodeRangeMin,
            nodeRangeMax,
        } = this.formValues;

        return {
            id: 'MAIN',
            x: randomFloatRange(PADDING, (w || networkPanelWidth) - PADDING),
            y: randomFloatRange(PADDING, (h || networkPanelHeight) - PADDING),
            params: {
                radius: (randomFloatRange(nodeRangeMin, nodeRangeMax) * scale) / 1.2,
            },
        };
    }

    validationForm = (values) => {
        const errors = { };

        const required = Object.keys(this.initialValues);
        required.forEach((field) => {
            if (field && !values[field]) {
                errors[field] = 'Required field';
            }
        });

        if (values.scale && validationNumberField(1, 2000, values.scale)) {
            errors.scale = validationNumberField(1, 2000, values.scale);
        }

        if (values.nodes && validationNumberField(MIN_NODES, MAX_NODES, values.nodes)) {
            errors.nodes = validationNumberField(MIN_NODES, MAX_NODES, values.nodes);
        }

        if (values.nodeRangeMin && validationNumberField(RANGE_NODE_MIN, RANGE_NODE_MAX, values.nodeRangeMin)) {
            errors.nodeRangeMin = validationNumberField(RANGE_NODE_MIN, RANGE_NODE_MAX, values.nodeRangeMin);
        }

        if (values.nodeRangeMax && validationNumberField(RANGE_NODE_MIN, RANGE_NODE_MAX, values.nodeRangeMax)) {
            errors.nodeRangeMax = validationNumberField(RANGE_NODE_MIN, RANGE_NODE_MAX, values.nodeRangeMax);
        }

        return errors;
    }

    submitForm = (values) => {
        this.formValues = { ...values };
        this.onHandleGenerate();
    }

    renderForm = ({
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
    }) => (
        <form className="text-center mb-1">
            <div className="form-group">
                <p className="text-center text-muted mb-1">Scale</p>
                <div className="input-group input-group-sm">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">1 meter</span>
                    </div>
                    <input
                        type="number"
                        className={cx({ 'is-invalid': errors.scale }, 'form-control form-control-sm')}
                        value={values.scale}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="scale"
                    />
                    <div className="input-group-append">
                        <span className="input-group-text">px</span>
                    </div>
                </div>
                {
                    <p className="text-center text-muted mb-0">
                        {
                            !errors.scale ?
                                <small>Adjusting width and height in meters</small> :
                                <small className="invalid-feedback d-inline">{errors.scale}</small>
                        }
                    </p>
                }
            </div>
            <div className="form-group">
                <p className="text-center text-muted mb-1 mt-2 border-top pt-2">Generate some nodes</p>
                <input
                    type="number"
                    className={cx({ 'is-invalid': errors.nodes }, 'form-control form-control-sm')}
                    placeholder="Please enter a number"
                    value={values.nodes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="nodes"
                />
                {
                    !errors.nodes ?
                        <small className="form-text text-muted text-uppercase">{`Min ${MIN_NODES} - Max ${MAX_NODES}`}</small> :
                        <div className="invalid-feedback">{errors.nodes}</div>
                }
            </div>
            <div className="form-group">
                <p className="text-center text-muted mb-1 mt-2 border-top pt-2">Range</p>
                <div className="row">
                    <div className="col-6 pr-2">
                        <input
                            type="number"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nodeRangeMin}
                            className={cx({ 'is-invalid': errors.nodeRangeMin }, 'form-control form-control-sm')}
                            name="nodeRangeMin"
                        />
                        <p className="text-center text-muted mb-0">
                            {
                                !errors.nodeRangeMin ?
                                    <small>{`MIN ${RANGE_NODE_MIN} METERS`}</small> :
                                    <small className="invalid-feedback d-inline">{errors.nodeRangeMin}</small>
                            }
                        </p>
                    </div>
                    <div className="col-6 pl-2">
                        <input
                            type="number"
                            className={cx({ 'is-invalid': errors.nodeRangeMax }, 'form-control form-control-sm')}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nodeRangeMax}
                            name="nodeRangeMax"
                        />
                        <p className="text-center text-muted mb-0">
                            {
                                !errors.nodeRangeMax ?
                                    <small>{`MAX ${RANGE_NODE_MAX} METERS`}</small> :
                                    <small className="invalid-feedback d-inline">{errors.nodeRangeMax}</small>
                            }
                        </p>
                    </div>
                </div>
            </div>
            <button
                type="submit"
                className="btn btn-primary btn-sm"
                onClick={handleSubmit}
                disabled={!this.state.selectedAlgorithm}
            >
                Generate
            </button>
        </form>
    );

    render() {
        return (
            <CardMenu
                name="Controls app"
            >
                <Formik
                    initialValues={this.initialValues}
                    validate={this.validationForm}
                    onSubmit={this.submitForm}
                    render={this.renderForm}
                />
            </CardMenu>
        );
    }
}

Controls.propTypes = {
    networkPanelWidth: PropTypes.number,
    networkPanelHeight: PropTypes.number,
    dispatch: PropTypes.func,
    selectedAlgorithm: PropTypes.any,
    generateNodes: PropTypes.bool,
};

export default Controls;
