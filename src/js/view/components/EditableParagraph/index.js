import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

class EditableParagraph extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isEditing: false,
      paragraphHeight: 0,
    };
  }

  setNewParagraph () {
    if (!this.textarea) return;
    this.setState({ isEditing: false });
    if (this.textarea.value === this.props.value) return;
    if (this.props.onChange) this.props.onChange(this.textarea.value);
  }

  onEditLooseFocus (e) {
    this.setNewParagraph();
  }

  onType (e) {
    if (!e.shiftKey && e.keyCode === 13) {
      this.setNewParagraph();
      e.preventDefault();
    }
  }

  onParagraphClick (e) {
    this.setState({
      isEditing: true,
      paragraphHeight: e.target.offsetHeight,
    });
    e.preventDefault();
  }

  componentDidUpdate () {
    if (this.textarea) this.textarea.focus();
  }

  render () {
    return (
      <div className={classNames(styles.wrapper, this.props.wrapperClass)}>
        {!this.state.isEditing
          ? (
            <p
              onClick={this.onParagraphClick.bind(this)}
              className={classNames(styles.paragraph, this.props.paragraphClass)}>{this.props.value}</p>
          )
          : (
            <textarea
              ref={(el) => { this.textarea = el; }}
              className={classNames(this.props.paragraphClass, styles.textarea)}
              style={{height: this.state.paragraphHeight}}
              onKeyDown={this.onType.bind(this)}
              onBlur={this.onEditLooseFocus.bind(this)}
              tabIndex="0"
              defaultValue={this.props.value}></textarea>
          )
        }
      </div>
    );
  }
};

export default EditableParagraph;
