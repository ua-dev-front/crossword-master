import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './styles.scss';

export enum TabIconAlign {
  Left = 'left',
  Right = 'right',
}

export type Props = {
  label: string;
  icon: ReactNode;
  isSelected: boolean;
  alignIcon: TabIconAlign;
  onClick?: () => void;
  alternativeLabels?: string[];
};

export default function Tab({
  label,
  icon,
  isSelected,
  alignIcon,
  onClick,
  alternativeLabels, // used to make width of tab consistent
}: Props) {
  const classes = classnames(
    'tab',
    isSelected && 'tab_selected',
    alignIcon === TabIconAlign.Right && 'tab_reverse-direction',
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
  alignIcon: TabIconAlign.Left,
};
