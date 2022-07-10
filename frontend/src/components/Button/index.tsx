import React, { useState } from 'react';
import './styles.scss';

type Props = {
  label: string;
  onClick: () => void;
};

export default function Button({ label, onClick }: Props) {
  const [isKeyDown, setIsKeyDown] = useState(false);

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      if (!isKeyDown) {
        setIsKeyDown(true);

        event.preventDefault();
        onClick();

        event.currentTarget.style.backgroundColor = '#b1b3b580';
      }
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      setIsKeyDown(false);
      event.currentTarget.style.backgroundColor = '';
    }
  };

  return (
    <button
      className='button'
      onClick={() => onClick()}
      onKeyDown={(event) => onKeyDown(event)}
      onKeyUp={(event) => onKeyUp(event)}
    >
      {label}
    </button>
  );
}
