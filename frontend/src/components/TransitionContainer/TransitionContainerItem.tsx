import React, {
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';
import useEventListener from 'hooks/useEventListener';
import './styles.scss';

export type Props = {
  content: ReactNode;
  hide: boolean;
  center?: boolean;
  onTransitionStateChange: (isTransitioning: boolean) => void;
};

export default function TransitionContainerItem({
  content,
  hide,
  center,
  onTransitionStateChange,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  useEventListener(
    'transitionstart',
    () => onTransitionStateChange(true),
    ref.current,
  );
  useEventListener(
    'transitionend',
    () => onTransitionStateChange(false),
    ref.current,
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={classnames(
        'transition-container__item',
        (!isMounted || hide) && 'transition-container__item_hidden',
        center && 'transition-container__item_centered',
      )}
    >
      {content}
    </div>
  );
}
