import React, { useEffect, useRef } from 'react';
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
  const textareaRef = useRef(null);

  const classes = classnames('text-field', isEditable && 'text-field_editable');
  const placeholder = 'TBD';

  const setHeight = (element: HTMLTextAreaElement) => {
    // Set height to zero to get real height of content, instead of strictly set height
    element.style.height = '0';

    const elementStyles = window.getComputedStyle(element);
    const fullHeight =
      element.scrollHeight -
      parseInt(elementStyles.paddingTop) -
      parseInt(elementStyles.paddingBottom);

    element.style.height = `${fullHeight}px`;
  };

  useEffect(() => {
    if (isEditable && textareaRef.current) setHeight(textareaRef.current);
  }, [content, isEditable]);

  return isEditable ? (
    <textarea
      className={classes}
      placeholder={placeholder}
      value={content}
      onChange={(e) => onChange?.(e.target.value)}
      ref={textareaRef}
    />
  ) : (
    <div className={classes}>{content}</div>
  );
}
