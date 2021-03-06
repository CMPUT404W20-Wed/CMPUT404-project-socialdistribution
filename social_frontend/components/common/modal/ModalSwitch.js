import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  withRouter,
} from 'react-router-dom';

import Modal from './Modal';


/* Switch that enables the displaying of modals via <ModalLink>.
 * When a <ModalLink> is clicked, <ModalSwitch> displays both the
 * real target of the link (in the modal) and the location that was
 * active when the <ModalLink> was clicked (behind the modal).
 * (But if a modal was already open, the background is not changed.)
 */
class ModalSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.cancelModal = this.cancelModal.bind(this);
  }

  cancelModal() {
    const { history, location } = this.props;
    const background = location.state && location.state.background;

    if (background) history.push(background);
  }

  render() {
    const { location, children } = this.props;
    const background = location.state && location.state.background;

    if (background) {
      return (
        <>
          <Switch location={background}>
            {children}
          </Switch>
          <Modal onCancel={this.cancelModal}>
            <Switch location={location}>
              {children}
            </Switch>
          </Modal>
        </>
      );
    }

    return (
      <Switch location={location}>
        {children}
      </Switch>
    );
  }
}

ModalSwitch.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      background: PropTypes.object,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default withRouter(ModalSwitch);
