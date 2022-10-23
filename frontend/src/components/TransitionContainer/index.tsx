import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './styles.scss';

export type Props = {
  items: {
    content: ReactNode;
    hide: boolean;
    className?: string;
    center?: boolean;
  }[];
  className?: string;
};

export default function TransitionContainer({ items, className }: Props) {
  return (
    <div className={classnames('transition-container', className)}>
      {items.map(
        ({ content, hide, center, className: itemClassName }, index) => (
          <div
            key={index}
            className={classnames(
              'transition-container__item',
              hide && 'transition-container__item_hidden',
              center && 'transition-container__item_centered',
              itemClassName,
            )}
          >
            {content}
          </div>
        ),
      )}
    </div>
  );
}
