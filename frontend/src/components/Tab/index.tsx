import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './styles.scss';

export type Props = {
  label: string;
  icon: ReactNode;
  isSelected: boolean;
  onClick?: () => void;
  alternativeLabel?: string;
  hide?: boolean;
};

export default function Tab({
  label,
  icon,
  isSelected,
  onClick,
  alternativeLabel, // used to make width of tab consistent
  hide,
}: Props) {
  const classes = classnames(
    'tab',
    isSelected && 'tab_selected',
    hide && 'tab_hidden',
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
        <span className={classnames('tab__label', 'tab__label-hidden')}>
          {alternativeLabel}
        </span>
      </div>
    </button>
  );
}
