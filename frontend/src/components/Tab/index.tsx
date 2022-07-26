import React, { ReactNode } from 'react';
import classNames from 'classnames';
import './styles.scss';

type Props = {
  onClick: () => void;
  label: string;
  isSelected: boolean;
  icon: ReactNode;
};

export default function Tab(props: Props) {
  const { onClick, label, isSelected, icon } = props;

  const classes = classNames(
    'tabulator-item',
    isSelected && 'tabulator-item_selected'
  );

  return (
    <button tabIndex={0} className={classes} onClick={onClick}>
      <div className='tabulator-item__icon'>{icon}</div>
      <span className='tabulator-item__label'>{label}</span>
    </button>
  );
}
