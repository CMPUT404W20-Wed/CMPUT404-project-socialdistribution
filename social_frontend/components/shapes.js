import PropTypes from 'prop-types';

export const userShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
});

export const postShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  author: userShape.isRequired,
  content: PropTypes.string.isRequired,
  commentCount: PropTypes.number.isRequired,
});
