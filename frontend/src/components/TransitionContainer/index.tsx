import React, { useLayoutEffect, useState } from 'react';
import classnames from 'classnames';
import TransitionContainerItem, {
  Props as ItemProps,
} from './TransitionContainerItem';
import './styles.scss';

export type Props = {
  items: (Omit<ItemProps, 'onTransitionStateChange'> & { key: string })[];
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
  >(Object.fromEntries(rawItems.map((item) => [item.key, false])));

  useLayoutEffect(() => {
    setItems((prevItems) => {
      const presentItems = rawItems.map((rawItem) => {
        const oldItem = prevItems.find((item) => item.key === rawItem.key);
        if (
          oldItem &&
          (itemsTransitionState[rawItem.key] ||
            (oldItem.display && !rawItem.display))
        ) {
          return {
            ...oldItem,
            display: rawItem.display,
          };
        } else {
          return rawItem;
        }
      });

      const deletedItems = prevItems
        .filter(
          (item) =>
            !rawItems.find((rawItem) => rawItem.key === item.key) &&
            (item.display || itemsTransitionState[item.key]),
        )
        .map((item) => ({
          ...item,
          display: false,
        }));

      return [...deletedItems, ...presentItems];
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
              ...Object.fromEntries(
                items.map((item) => [item.key, prevState?.[item.key] ?? false]),
              ),
              [key]: isTransitioning,
            }))
          }
        />
      ))}
    </div>
  );
}
