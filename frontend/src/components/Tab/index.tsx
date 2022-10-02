import React, { ReactNode } from 'react';
import classNames from 'classnames';
import './styles.scss';

export type Props = {
  isSelected: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
};

export default function Tab({ label, icon, onClick, isSelected }: Props) {
  const classes = classNames('tab', isSelected && 'tab_selected');

  return (
    <button
      className={classes}
      onClick={() => onClick?.()}
      disabled={isSelected}
    >
      <div className='tab__icon'>{icon}</div>
      <span className='tab__label'>{label}</span>
    </button>
  );
}
