import React from 'react';
import classNames from 'classnames';
import autosize from 'autosize';
import styles from './styles.scss';

class EditableParagraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      paragraphHeight: 0,
    };
  }

  setNewParagraph() {
    if (!this.textarea) return;
    this.setState({ isEditing: false });
    if (this.textarea.value === this.props.value) return;
    if (this.props.onChange) this.props.onChange(this.textarea.value);
  }

  onEditLooseFocus() {
    this.setNewParagraph();
  }

  onType(e) {
    if (!e.shiftKey && e.keyCode === 13) {
      this.setNewParagraph();
      e.preventDefault();
    }
  }

  onParagraphClick(e) {
    this.setState({
      isEditing: true,
      paragraphHeight: e.target.offsetHeight,
    });
    e.preventDefault();
  }

  componentDidMount() {
    if (this.props.onChangeState) this.props.onChangeState('show');
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isEditing && this.state.isEditing) {
      autosize(this.textarea);
      if (this.props.onChangeState) this.props.onChangeState('edit');
    }
    if (prevState.isEditing && !this.state.isEditing) {
      if (this.props.onChangeState) this.props.onChangeState('show');
    }
  }

  render() {
    const isParagraphEmpty = !(typeof this.props.value === 'string' && this.props.value.length > 0);
    const paragraphContent = isParagraphEmpty ? 'Clique para editar...' : this.props.value;

    return (
      <div className={this.props.wrapperClass}>
        {!this.state.isEditing ? (
          <p
            onClick={this.onParagraphClick.bind(this)}
            className={classNames(styles.paragraph, this.props.paragraphClass, { [styles.empty]: isParagraphEmpty })}
          >
            {paragraphContent}
          </p>
        ) : (
          <textarea
            ref={(el) => {
              this.textarea = el;
            }}
            className={classNames(styles.textarea, this.props.paragraphClass)}
            autoFocus={true}
            onKeyDown={this.onType.bind(this)}
            onBlur={this.onEditLooseFocus.bind(this)}
            rows="1"
            tabIndex="0"
            defaultValue={this.props.value}
          ></textarea>
        )}
      </div>
    );
  }
}

export default EditableParagraph;
