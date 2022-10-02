import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './styles.scss';

type Props = {
  isSelected: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  alternativeLabel?: string;
};

export default function Tab({
  label,
  icon,
  onClick,
  isSelected,
  alternativeLabel, // used to make width of tab consistent
}: Props) {
  const classes = classnames('tab', isSelected && 'tab_selected');

  return (
    <button
      className={classes}
      onClick={() => onClick?.()}
      disabled={isSelected}
    >
      <div className='tab__icon'>{icon}</div>
      <div className='tab__content'>
        <span className='tab__label'>{label}</span>
        <span className={classnames('tab__label', 'tab__label-hidden')}>
          {alternativeLabel}
        </span>
      </div>
    </button>
  );
}
