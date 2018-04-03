import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { changeAlgorithmStatus } from '../../actions';

class ControlsNetwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            algorithmStatus: false,
        };
    }

    onChangeAlgorithmStatus = () => {
        const {
            algorithmStatus,
        } = this.state;

        this.props.dispatch(changeAlgorithmStatus(!algorithmStatus));

        this.setState({
            algorithmStatus: !this.state.algorithmStatus,
        });
    }

    render() {
        const {
            algorithmStatus,
        } = this.state;

        const {
            disableStartAlgorithm,
        } = this.props;

        return (
            <div className="card mb-3 control-networks rounded-0">
                <div className="card-body d-flex align-i-center rounded-0 d-flex">
                    <button
                        type="submit"
                        className="btn btn-success btn-sm"
                        onClick={this.onChangeAlgorithmStatus}
                        disabled={disableStartAlgorithm}
                    >
                        {
                            algorithmStatus ? 'Stop algorithm' : 'Start algorithm'
                        }
                    </button>
                </div>
            </div>
        );
    }
}

ControlsNetwork.propTypes = {
    dispatch: PropTypes.func,
    disableStartAlgorithm: PropTypes.bool,
};

export default ControlsNetwork;

