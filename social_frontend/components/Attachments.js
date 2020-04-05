import React from 'react';
import PropTypes from 'prop-types';

import '../styles/attachments.css';

export default class Attachments extends React.Component {
  constructor(props) {
    super(props);

    this.filesRef = React.createRef();

    this.doAskForFiles = this.doAskForFiles.bind(this);
    this.doProcessFiles = this.doProcessFiles.bind(this);
  }

  doAskForFiles() {
    this.filesRef.current.click();
  }

  doProcessFiles(event) {
    const { onAttach } = this.props;

    [...event.target.files].map((file) => onAttach(file));
  }

  render() {
    const { attachments, onDetach, visible } = this.props;
    if (!visible) return null;
    return (
      <div className="attachments">
        <input
          ref={this.filesRef}
          onChange={this.doProcessFiles}
          type="file"
          multiple
          accept="image/*"
          name="attachments"
          className="attachment-impl"
        />
        {
          attachments.map(({ file, url }) => (
            <div className="attachment" key={url}>
              <img src={url} alt="Attachment" />
              <div className="attachment-name">{file.name}</div>
              <button
                type="button"
                className="attachment-detach"
                onClick={() => onDetach(file)}
              >
                ×
              </button>
            </div>
          ))
        }
        <button
          type="button"
          onClick={this.doAskForFiles}
          className="attachment attachments-add"
        >
          <div className="attachments-add-placeholder" />
        </button>
      </div>
    );
  }
}

Attachments.propTypes = {
  attachments: PropTypes.arrayOf(PropTypes.shape({
    file: PropTypes.any.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
  onAttach: PropTypes.func.isRequired,
  onDetach: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};
