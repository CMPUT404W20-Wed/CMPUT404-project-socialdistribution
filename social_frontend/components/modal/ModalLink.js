import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';


/* <Link> wrapper that opens the target in a modal over the current page.
 * eg. <ModalLink to="/posts/0" hash="comments">link text</ModalLink>
 * If there is already a modal open, the new target displays in the
 * current modal, and the "background" page is unchanged.
 */
const ModalLink = ({
  location,
  hash,
  to,
  className,
  children,
}) => {
  const background = ((location.state && location.state.background)
    || location);
  return (
    <Link
      className={className}
      to={{
        hash,
        pathname: to,
        state: { background },
      }}
    >
      {children}
    </Link>
  );
};

ModalLink.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      background: PropTypes.object,
    }),
  }).isRequired,
  hash: PropTypes.string,
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ModalLink.defaultProps = {
  hash: '',
  className: undefined,
};

export default withRouter(ModalLink);
