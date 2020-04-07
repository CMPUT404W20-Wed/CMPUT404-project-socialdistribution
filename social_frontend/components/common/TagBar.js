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
    this.select = this.select.bind(this);
  }

  submit(text) {
    const { onSubmit } = this.props;

    onSubmit(text);

    this.setState({
      text: '',
    });
  }

  checkSubmit(event) {
    const { text } = this.state;

    if (event.key === 'Enter' && text.length) {
      event.preventDefault();

      const { suggestions } = this.props;

      const completedText = suggestions.length ? suggestions[0] : text;
      this.submit(completedText);
    }
  }

  handleChange(event) {
    const { afterChange } = this.props;

    this.setState({
      text: event.target.value,
    });

    if (afterChange) afterChange(event.target.value);
  }

  select(value) {
    this.setState({
      text: value,
    });

    this.submit(value);
  }

  render() {
    const { placeholder, suggestions } = this.props;
    const { text } = this.state;
    return (
      <div className="tag-new">
        <input
          value={text}
          placeholder={placeholder}
          onChange={this.handleChange}
          onKeyPress={this.checkSubmit}
        />
        {
          suggestions && suggestions.length > 0 && (
            <div className="tag-suggestions">
              {
                suggestions.map((s) => (
                  <button type="button" key={s} onClick={() => this.select(s)}>
                    {s}
                  </button>
                ))
              }
            </div>
          )
        }
      </div>
    );
  }
}

TagInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  afterChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

TagInput.defaultProps = {
  afterChange: undefined,
  onSubmit: undefined,
};


const TagBar = ({
  render,
  items,
  editable,
  suggestions,
  editPlaceholder,
  onAddItem,
  onRemoveItem,
  onInputChange,
  className,
}) => (
  <div className={className || 'tag-bar'}>
    {
        items.map((item, i) => (
          <div className="tag" key={item}>
            {
              editable && (
                <button
                  type="button"
                  className="tag-delete"
                  onClick={() => onRemoveItem(i)}
                >
                  ×
                </button>
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
          afterChange={onInputChange}
          placeholder={editPlaceholder}
          suggestions={suggestions}
        />
      )
    }
  </div>
);

TagBar.propTypes = {
  render: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  editable: PropTypes.bool,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  editPlaceholder: PropTypes.string,
  onAddItem: PropTypes.func,
  onRemoveItem: PropTypes.func,
  onInputChange: PropTypes.func,
  className: PropTypes.string,
};

TagBar.defaultProps = {
  editable: false,
  suggestions: [],
  editPlaceholder: '',
  onAddItem: undefined,
  onRemoveItem: undefined,
  onInputChange: undefined,
  className: undefined,
};

export default TagBar;
