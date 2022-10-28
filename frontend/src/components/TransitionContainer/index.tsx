import React, { ReactNode, useEffect, useState } from 'react';
import classnames from 'classnames';
import './styles.scss';

export type Props = {
  items: {
    key: string;
    content: ReactNode;
    hide: boolean;
    center?: boolean;
  }[];
  className?: string;
};

/**
 * Component is used to create a transition effect on switching between `items`.
 * On hiding an `item`, it will take the `item` from the saved state,
 * so even if the `item` was changed during hiding, the transition will be smooth.
 * After the transition is complete, `item` will be updated in the state.
 * Hidden items still exist in the `DOM`, but they are not visible.
 */
export default function TransitionContainer({
  items: rawItems,
  className,
}: Props) {
  const [items, setItems] = useState(rawItems);
  useEffect(() => {
    setItems((currentItems) =>
      rawItems.map((item) => {
        const oldItem = currentItems.find(
          (currentOldItem) => currentOldItem.key === item.key,
        );
        if (oldItem && item.hide && oldItem.hide !== item.hide) {
          return {
            ...oldItem,
            hide: true,
          };
        }
        return item;
      }),
    );
  }, [rawItems]);

  return (
    <div className={classnames('transition-container', className)}>
      {items.map(({ key, content, hide, center }) => (
        <div
          key={key}
          className={classnames(
            'transition-container__item',
            hide && 'transition-container__item_hidden',
            center && 'transition-container__item_centered',
          )}
          onTransitionEnd={() => {
            setItems((currentItems) =>
              currentItems.map((currentItem) =>
                currentItem.key === key
                  ? (rawItems.find(
                      (rawItem) => rawItem.key === key,
                    ) as Props['items'][number])
                  : currentItem,
              ),
            );
          }}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
