import React, { ChangeEvent } from 'react';
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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Set height of textarea according to content
    e.target.style.height = '0px';
    e.target.style.height = `${e.target.scrollHeight}px`;

    onChange?.(e.target.value);
  };

  return isEditable ? (
    <textarea
      className={classes}
      placeholder='TBD'
      value={content}
      onChange={handleChange}
    />
  ) : (
    <div className={classes}>{content}</div>
  );
}
