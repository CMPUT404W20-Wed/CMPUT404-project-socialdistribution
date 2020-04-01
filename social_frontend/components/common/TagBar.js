import React from 'react';
import PropTypes from 'prop-types';

export default class TagBar extends React.Component {
  render() {
    const { render, items } = this.props;

    return (
      <div className="tag-bar">
        {
            items.map((item) => (
              <div className="tag" key={item}>{render(item)}</div>
            ))
        }
      </div>
    );
  }
}
