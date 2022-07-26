import React, { ReactNode } from 'react';
import classNames from 'classnames';
import './styles.scss';

type Props = {
  label: string;
  isSelected: boolean;
  icon: ReactNode;
};

export default function TabulatorItem(props: Props) {
  const { label, isSelected, icon } = props;

  const classes = classNames(
    'tabulator-item',
    isSelected && 'tabulator-item_selected'
  );

  return (
    <button tabIndex={0} className={classes}>
      <div className='tabulator-item__icon'>{icon}</div>
      <span className='tabulator-item__label'>{label}</span>
    </button>
  );
}
