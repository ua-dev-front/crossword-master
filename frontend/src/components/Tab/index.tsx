import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './styles.scss';

export type Props = {
  label: string;
  icon: ReactNode;
  isSelected: boolean;
  onClick?: () => void;
  alternativeLabels?: string[];
  hide?: boolean;
};

export default function Tab({
  label,
  icon,
  isSelected,
  onClick,
  alternativeLabels, // used to make width of tab consistent
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
        {alternativeLabels?.map((alternativeLabel, index) => (
          <span
            key={`alternative-label-${index}`}
            className={classnames('tab__label', 'tab__label-hidden')}
          >
            {alternativeLabel}
          </span>
        ))}
      </div>
    </button>
  );
}
