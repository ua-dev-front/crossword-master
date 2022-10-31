import React, { useLayoutEffect, useState } from 'react';
import classnames from 'classnames';
import TransitionContainerItem, {
  Props as Item,
} from './TransitionContainerItem';
import './styles.scss';

export type Props = {
  items: (Omit<Item, 'onTransitionStateChange'> & { key: string })[];
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
  const [itemsTransitionState, setItemsTransitionState] = useState<
    Record<string, boolean>
  >(rawItems.reduce((acc, item) => ({ ...acc, [item.key]: false }), {}));

  useLayoutEffect(() => {
    setItems((prevItems) => {
      const changedItems = rawItems.map((rawItem) => {
        const oldItem = prevItems.find((item) => item.key === rawItem.key);
        if (!oldItem) {
          return {
            ...rawItem,
            hide: true,
          };
        }
        if (
          itemsTransitionState[rawItem.key] ||
          (!oldItem.hide && rawItem.hide)
        ) {
          return {
            ...oldItem,
            hide: rawItem.hide,
          };
        }
        return rawItem;
      });

      const deletedItems = prevItems
        .filter(
          (item) =>
            !rawItems.find((rawItem) => rawItem.key === item.key) &&
            (!item.hide || itemsTransitionState[item.key]),
        )
        .map((item) => ({
          ...item,
          hide: true,
        }));

      return [...deletedItems, ...changedItems];
    });
  }, [rawItems, itemsTransitionState]);

  return (
    <div className={classnames('transition-container', className)}>
      {items.map(({ key, ...itemProps }) => (
        <TransitionContainerItem
          {...itemProps}
          key={key}
          onTransitionStateChange={(isTransitioning) =>
            setItemsTransitionState((prevState) => ({
              ...prevState,
              [key]: isTransitioning,
            }))
          }
        />
      ))}
    </div>
  );
}
