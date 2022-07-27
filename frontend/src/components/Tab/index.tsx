import React, { ReactNode } from 'react';
import classNames from 'classnames';
import './styles.scss';
import tabData from '../../types/tabData';

type Props = {
  data: tabData;
  icon: ReactNode;
  label: string;
};

export default function Tab(props: Props) {
  const { data, label, icon } = props;
  const { isSelected } = data;

  const classes = classNames('tab', isSelected && 'tab_selected');

  return (
    <div
      tabIndex={isSelected ? undefined : 0}
      className={classes}
      onClick={isSelected ? undefined : data.onClick}
    >
      <div className='tab__icon'>{icon}</div>
      <span className='tab__label'>{label}</span>
    </div>
  );
}
