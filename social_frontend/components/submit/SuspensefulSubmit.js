import React from 'react';
import PropTypes from 'prop-types';

import './submit.css';


/* Overlay for the suspenseful button; displayed when suspended. */
const Suspender = () => (
  <div className="suspender">
    <span>·</span>
    <span>·</span>
    <span>·</span>
  </div>
);


/* Submit button that can display a progress indicator.
 *
 * Set 'suspended' to show the progress indicator
 * (this also disables the button).
 *
 * label can be any node.
 */
const SuspensefulSubmit = ({ label, disabled, suspended }) => (
  <button
    type="submit"
    disabled={disabled || suspended}
    className="submit suspenseful"
  >
    {label}
    {suspended && <Suspender />}
  </button>
);

SuspensefulSubmit.propTypes = {
  label: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  suspended: PropTypes.bool,
};

SuspensefulSubmit.defaultProps = {
  disabled: false,
  suspended: false,
};

export default SuspensefulSubmit;
