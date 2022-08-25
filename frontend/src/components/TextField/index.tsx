import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
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
  const prevIsEditable = useRef(isEditable);
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const classes = classnames(
    baseClassName,
    isEditable && `${baseClassName}_editable`,
    prevIsEditable.current !== isEditable && `${baseClassName}_transition`,
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
    prevIsEditable.current = isEditable;
  }, [isEditable]);

  return (
    <div className={classes} onTransitionEnd={() => forceUpdate()}>
      {isEditable ? (
        <textarea
          id={inputId}
          className={`${baseClassName}__content`}
          placeholder={PLACEHOLDER}
          value={content}
          onChange={(event) => onChange?.(event.target.value)}
          onFocus={() => forceUpdate()}
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
