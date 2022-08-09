import React, { useLayoutEffect, useRef } from 'react';
import classnames from 'classnames';
import './styles.scss';

type Props = {
  isEditable?: boolean;
  content: string;
  onChange?: (value: string) => void;
};

const PLACEHOLDER = 'TBD';

export default function TextField({
  isEditable = false,
  content,
  onChange,
}: Props) {
  const textareaRef = useRef(null);

  const classes = classnames('text-field', isEditable && 'text-field_editable');

  const setHeight = (element: HTMLTextAreaElement) => {
    // If content has less lines than it used to (user deletes content), in order to get real height of content,
    // instead of strictly set height, reset height to 0.
    element.style.height = '0';

    const elementStyles = window.getComputedStyle(element);
    const fullHeight =
      element.scrollHeight -
      parseInt(elementStyles.paddingTop) -
      parseInt(elementStyles.paddingBottom);

    element.style.height = `${fullHeight}px`;
  };

  useLayoutEffect(() => {
    if (isEditable && textareaRef.current) {
      setHeight(textareaRef.current);
    }
  }, [content, isEditable]);

  return isEditable ? (
    <textarea
      className={classes}
      placeholder={PLACEHOLDER}
      value={content}
      onChange={(e) => onChange?.(e.target.value)}
      ref={textareaRef}
    />
  ) : (
    <div className={classes}>{content}</div>
  );
}
