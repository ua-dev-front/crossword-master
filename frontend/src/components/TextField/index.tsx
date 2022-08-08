import React from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import classnames from 'classnames';
import './styles.scss';

type Props = {
  isEditable?: boolean;
  content: string;
  onChange?: (value: string) => void;
};

export default function TextField({
  isEditable = false,
  content,
  onChange,
}: Props) {
  const classes = classnames('text-field', isEditable && 'text-field_editable');
  const placeholder = 'TBD';

  return isEditable ? (
    <ReactTextareaAutosize
      className={classes}
      placeholder={placeholder}
      value={content}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ) : (
    <div className={classes}>{content}</div>
  );
}
