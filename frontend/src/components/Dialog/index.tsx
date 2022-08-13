import React from 'react';
import Button from '../Button';
import Label, { LabelSize } from '../Label';
import './styles.scss';

type Props = {
  label: string;
  buttons: {
    label: string;
    onClick: () => void;
  }[];
};

export default function Dialog({ label, buttons }: Props) {
  return (
    <div className='dialog'>
      <Label content={label} size={LabelSize.Large} />
      <div className='dialog__buttons-wrapper'>
        <div className='dialog__buttons'>
          {buttons.map(({ label, onClick }) => (
            <Button key={label} label={label} onClick={onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
