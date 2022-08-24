import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import classnames from 'classnames';
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
  const baseClassName = 'text-field';
  const textareaRef = useRef(null);
  const isMounted = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const classes = classnames(
    baseClassName,
    isEditable && `${baseClassName}_editable`,
    isTransitioning && `${baseClassName}_transition`,
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
  }, [isEditable]);

  useEffect(() => {
    if (isMounted.current) {
      setIsTransitioning(true);
    } else {
      isMounted.current = true;
    }
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
