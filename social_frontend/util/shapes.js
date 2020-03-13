import PropTypes from 'prop-types';

/* PropTypes validation shapes for model objects. */

export const userShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
});

export const postShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  author: userShape.isRequired,
  content: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.any).isRequired,
});
