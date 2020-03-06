import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/popupmenu.css';


/* Pop-up menu.
 *
 * Clicking on the handle causes the children to be made visible
 * (using CSS focus-within)
 */
const PopupMenu = ({ handle, children, className }) => (
  <div className={`popup ${className}`}>
    <button type="button" className="popup-handle">
      { handle }
    </button>
    <div className="popup-menu">
      { children }
    </div>
  </div>
);

PopupMenu.propTypes = {
  handle: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

PopupMenu.defaultProps = {
  className: undefined,
};

export default PopupMenu;
