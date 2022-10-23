import React, { ReactNode, useEffect, useState } from 'react';
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

export default function TransitionContainer({
  items: rawItems,
  className,
}: Props) {
  const [items, setItems] = useState(rawItems);

  const getTransitionDuration = () => {
    const transitionDuration = getComputedStyle(document.documentElement)
      .getPropertyValue('--transition-duration')
      .trim();
    const unit = transitionDuration.replace(/[0-9.]/g, '');

    switch (unit) {
      case 's':
        return parseFloat(transitionDuration) * 1000;
      case 'ms':
        return parseFloat(transitionDuration);
      default:
        return 0;
    }
  };

  useEffect(() => {
    const wereItemsHidden = rawItems.some(
      (item, index) => item.hide && item.hide !== items[index].hide,
    );
    if (!wereItemsHidden) {
      setItems(rawItems);
      return;
    }

    const newItems = rawItems.map((item, index) => {
      if (item.hide) {
        return {
          ...items[index],
          hide: true,
        };
      }
      return item;
    });
    setItems(newItems);

    const timeout = setTimeout(() => {
      setItems(rawItems);
    }, getTransitionDuration());
    return () => clearTimeout(timeout);
  }, [rawItems]);

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
