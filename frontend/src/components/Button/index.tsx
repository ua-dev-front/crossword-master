import React from 'react';
import './styles.scss';

export type Props = {
  label: string;
  onClick: () => void;
};

export default function Button({ label, onClick }: Props) {
  return (
    <button className='button' onClick={() => onClick()}>
      <span className='button__label'>{label}</span>
    </button>
  );
}
