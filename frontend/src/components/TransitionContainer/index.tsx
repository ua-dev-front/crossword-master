import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './styles.scss';

export type Props = {
  items: {
    content: ReactNode;
    hide: boolean;
    className?: string;
  }[];
  className?: string;
};

export default function TransitionContainer({ items, className }: Props) {
  return (
    <div className={classnames('transition-container', className)}>
      {items.map(({ content, hide, className: itemClassName }, index) => (
        <div
          key={index}
          className={classnames(
            'transition-container__item',
            hide && 'transition-container__item_hidden',
            itemClassName,
          )}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
