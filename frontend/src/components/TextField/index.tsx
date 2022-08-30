import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import usePreviousValue from 'hooks/usePreviousValue';
import './styles.scss';

type Props = {
  content: string;
  isEditable?: boolean;
  onChange?: (value: string) => void;
  className?: string;
  inputId?: string;
};

const PLACEHOLDER = 'TBD';

export default function TextField({
  content,
  isEditable = false,
  onChange,
  className,
  inputId,
}: Props) {
  const textareaRef = useRef(null);
  const prevIsEditable = usePreviousValue(isEditable);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const baseClassName = 'text-field';
  const classes = classnames(
    baseClassName,
    isEditable && `${baseClassName}_editable`,
    (prevIsEditable !== isEditable || isTransitioning) &&
      `${baseClassName}_transition`,
    className
  );

  const setHeight = (element: HTMLTextAreaElement) => {
    const borderHeight = element.offsetHeight - element.clientHeight;

    // If content has fewer lines than it used to (user deletes content), in order to get real height of content, we
    // have to make sure that strictly set height will be smaller than content height.
    element.style.height = '0';
    const fullHeight = element.scrollHeight + borderHeight;

    element.style.height = `${fullHeight}px`;
  };

  useLayoutEffect(() => {
    if (isEditable && textareaRef.current) {
      setHeight(textareaRef.current);
    }
  }, [isEditable, content]);

  useEffect(() => {
    setIsTransitioning(true);
  }, [isEditable]);

  return (
    <div className={classes} onTransitionEnd={() => setIsTransitioning(false)}>
      {isEditable ? (
        <textarea
          id={inputId}
          className={`${baseClassName}__content`}
          placeholder={PLACEHOLDER}
          value={content}
          onChange={(event) => onChange?.(event.target.value)}
          onFocus={() => setIsTransitioning(false)}
          ref={textareaRef}
        />
      ) : (
        <div className={`${baseClassName}__content`}>
          {content || <>&nbsp;</>}
        </div>
      )}
    </div>
  );
}
