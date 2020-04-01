import React from 'react';
import PropTypes from 'prop-types';


class TagInput extends React.Component {
  state = {
    text: '',
  };

  constructor(props) {
    super(props);

    this.checkSubmit = this.checkSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  checkSubmit(event) {
    const { text } = this.state;

    if (event.key === 'Enter' && text.length) {
      event.preventDefault();
      const { onSubmit } = this.props;

      onSubmit(text);

      this.setState({
        text: '',
      });
    }
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
    });
  }

  render() {
    const { placeholder } = this.props;
    const { text } = this.state;
    return (
      <input
        value={text}
        placeholder={placeholder}
        onChange={this.handleChange}
        onKeyPress={this.checkSubmit}
      />
    );
  }
}


const TagBar = ({
  render,
  items,
  editable,
  editPlaceholder,
  onAddItem,
  onRemoveItem,
}) => (
  <div className="tag-bar">
    {
        items.map((item, i) => (
          <div className="tag" key={item}>
            {
              editable && (
                <button
                  type="button"
                  className="tag-delete"
                  onClick={() => onRemoveItem(i)}
                >×</button>
              )
            }
            {render(item)}
          </div>
        ))
    }
    {
      editable && (
        <TagInput
          onSubmit={(text) => onAddItem(text)}
          placeholder={editPlaceholder}
        />
      )
    }
  </div>
);

export default TagBar;
