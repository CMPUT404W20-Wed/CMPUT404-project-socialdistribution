import React from 'react';
import PropTypes from 'prop-types';

/* Wraps children in a modal sheet. */
export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.captureKeyPress = this.captureKeyPress.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.captureKeyPress);
  }

  captureKeyPress(event) {
    const { onCancel } = this.props;
    if (event.key === 'Escape') {
      onCancel();
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div className="modal">
        {children}
      </div>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onCancel: PropTypes.func,
};

Modal.defaultProps = {
  onCancel: () => null,
};
