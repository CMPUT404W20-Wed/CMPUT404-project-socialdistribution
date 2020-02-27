import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  StaticRouter,
  withRouter,
} from 'react-router-dom';

import './modal.css';


/* Wraps children in a modal sheet. */
const Modal = ({ children }) => (
  <div className="modal">
    {children}
  </div>
);

Modal.propTypes = {
  children: PropTypes.node.isRequired,
};


/* Switch that enables the displaying of modals via <ModalLink>.
 * When a <ModalLink> is clicked, <ModalSwitch> displays both the
 * real target of the link (in the modal) and the location that was
 * active when the <ModalLink> was clicked (behind the modal).
 * (But if a modal was already open, the background is not changed.)
 */
const ModalSwitch = ({ location, children }) => {
  const background = location.state && location.state.background;

  if (background) {
    return (
      <>
        <StaticRouter location={background}>
          <Switch>
            {children}
          </Switch>
        </StaticRouter>
        <Modal>
          <Switch>
            {children}
          </Switch>
        </Modal>
      </>
    );
  }

  return (
    <Switch>
      {children}
    </Switch>
  );
};

ModalSwitch.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      background: PropTypes.object,
    }),
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default withRouter(ModalSwitch);
