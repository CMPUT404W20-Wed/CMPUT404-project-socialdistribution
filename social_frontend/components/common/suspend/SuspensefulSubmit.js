import React from 'react';
import PropTypes from 'prop-types';

import Suspender from './Suspender';

import '../../../styles/suspend.css';


/* Submit button that can display a progress indicator.
 *
 * Set 'suspended' to show the progress indicator
 * (this also disables the button).
 *
 * label can be any node.
 */
const SuspensefulSubmit = ({
  label,
  disabled,
  suspended,
  action,
  className,
}) => (
  action ? (
    <button
      type="button"
      disabled={disabled || suspended}
      className={`submit suspenseful action ${className}`}
      onClick={action}
    >
      {label}
      {suspended && <Suspender />}
    </button>
  ) : (
    <button
      type="submit"
      disabled={disabled || suspended}
      className={`submit suspenseful ${className}`}
    >
      {label}
      {suspended && <Suspender />}
    </button>
  )
);

SuspensefulSubmit.propTypes = {
  label: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  suspended: PropTypes.bool,
  action: PropTypes.func,
  className: PropTypes.string,
};

SuspensefulSubmit.defaultProps = {
  disabled: false,
  suspended: false,
  action: null,
  className: '',
};

export default SuspensefulSubmit;
