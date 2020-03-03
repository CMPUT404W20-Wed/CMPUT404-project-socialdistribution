import React from 'react';
import PropTypes from 'prop-types';

import './submit.css';


const Suspender = () => (
  <div className="suspender">
    <span>·</span>
    <span>·</span>
    <span>·</span>
  </div>
);

const SuspensefulSubmit = ({ label, disabled, suspended }) => (
  <button
    type="submit"
    disabled={disabled || suspended}
    className="submit suspenseful"
  >
    {label}
    {suspended ? <Suspender /> : null}
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
