import React from 'react';
import PropTypes from 'prop-types';

import '../../../styles/modal.css';


/* Wraps children in a modal sheet.
 *
 * The modal sheet overlays the page; it can be cancelled by pressing Escape.
 * (Cancelling calls the onCancel prop, which can then decide whether to
 *  actually close the modal.)
 * While the modal is active, the DOM root element will have the class
 * 'modal-active' -- this is used to prevent the content behind the
 * modal from being scrolled while the modal is active.
 */
export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.captureKeyPress = this.captureKeyPress.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.captureKeyPress);
    document.documentElement.classList.add('modal-active');
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.captureKeyPress);
    document.documentElement.classList.remove('modal-active');
  }

  captureKeyPress(event) {
    const { onCancel } = this.props;
    if (event.key === 'Escape') {
      onCancel();
    }
  }

  render() {
    const { children, onCancel } = this.props;
    return (
      <div className="modal">
        <button
          type="button"
          className="modal-closer"
          onClick={onCancel}
        >
          ×
        </button>
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
