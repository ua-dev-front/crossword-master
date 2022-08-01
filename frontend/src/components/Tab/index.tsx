import React, { ReactNode } from 'react';
import classNames from 'classnames';
import './styles.scss';

type Props = {
  isSelected: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
};

export default function Tab(props: Props) {
  const { label, icon, onClick, isSelected } = props;

  const classes = classNames('tab', isSelected && 'tab_selected');

  return (
    <button
      tabIndex={0}
      className={classes}
      onClick={onClick}
      disabled={isSelected}
    >
      <div className='tab__icon'>{icon}</div>
      <span className='tab__label'>{label}</span>
    </button>
  );
}
