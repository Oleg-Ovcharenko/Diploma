// LIBRARIES
import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

class ModalBase extends Component {
    toggle = () => {
        this.props.toggle();
    }

    render() {
        const {
            show,
            title,
            size,
            modalBody,
        } = this.props;

        return (
            <Modal
                isOpen={show}
                toggle={this.toggle}
                size={size}
                centered
            >
                <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
                <ModalBody>{modalBody()}</ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle} size="sm">Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

ModalBase.propTypes = {
    modalBody: PropTypes.func,
    // data
    show: PropTypes.bool,
    title: PropTypes.string,
    toggle: PropTypes.func,
    size: PropTypes.string,
};

ModalBase.defaultProps = {
    modalBody: () => 'Modal body is empty',
    show: true,
    title: 'Modal title is empty',
    size: 'md',
};

export default ModalBase;
