import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import TagBar from './common/TagBar';
import ProfileTag from './ProfileTag';
import { userSearchEndpoint } from '../util/endpoints';

export default class EditorUserBar extends React.Component {
  state = {
    suggestions: [],
  };

  constructor(props) {
    super(props);

    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.userMap = new Map();
  }

  handleInputChange(value) {
    if (!value) {
      this.setState({
        suggestions: [],
      });
    } else {
      Axios.get(userSearchEndpoint(value)).then(({ data: { matches } }) => {
        this.setState({
          suggestions: matches.map(({ displayName }) => displayName),
        });
        matches.forEach(
          (match) => { this.userMap[match.displayName] = match; },
        );
      });
    }
  }

  handleAddItem(username) {
    const { onAddUser } = this.props;

    onAddUser(this.userMap[username].id);

    this.setState({
      suggestions: [],
    });
  }

  render() {
    const { items, onRemoveUser } = this.props;
    const { suggestions } = this.state;

    return (
      <TagBar
        editable
        className="user-bar"
        items={items}
        suggestions={suggestions}
        placeholder="Add person"
        onAddItem={this.handleAddItem}
        onRemoveItem={onRemoveUser}
        onInputChange={this.handleInputChange}
        render={(id) => <ProfileTag id={id} />}
      />
    );
  }
}

EditorUserBar.propTypes = {
  onAddUser: PropTypes.func.isRequired,
  onRemoveUser: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};
