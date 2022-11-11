import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './styles.scss';

export enum TabIconAlignment {
  Left = 'left',
  Right = 'right',
}

export type Props = {
  label: string;
  icon: ReactNode;
  isSelected: boolean;
  iconAlignment: TabIconAlignment;
  onClick?: () => void;
  alternativeLabels?: string[];
};

export default function Tab({
  label,
  icon,
  isSelected,
  iconAlignment,
  onClick,
  alternativeLabels, // used to make width of tab consistent
}: Props) {
  const classes = classnames(
    'tab',
    isSelected && 'tab_selected',
    iconAlignment === TabIconAlignment.Right
      ? 'tab_icon-right-alignment'
      : 'tab_icon-left-alignment',
  );

  return (
    <button
      className={classes}
      onClick={() => onClick?.()}
      disabled={isSelected}
    >
      <div className='tab__icon'>{icon}</div>
      <div className='tab__content'>
        <span className='tab__label'>{label}</span>
        {alternativeLabels?.map((alternativeLabel, index) => (
          <span
            key={index}
            className={classnames('tab__label', 'tab__label-hidden')}
          >
            {alternativeLabel}
          </span>
        ))}
      </div>
    </button>
  );
}

Tab.defaultProps = {
  alignIcon: TabIconAlignment.Left,
};
