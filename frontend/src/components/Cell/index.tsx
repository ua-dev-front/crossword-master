import React, { KeyboardEvent } from 'react';
import classnames from 'classnames';
import Corner from '../../types/corner';
import './styles.scss';

const ACCESSIBILITY_KEYS = ['Enter', 'Space'];

type Props = {
  data:
    | {
        editable: true;
        filled: boolean;
        onEdited: (filled: boolean) => void;
      }
    | {
        editable: false;
        content: { letter: string | null; number: number | null } | null;
      };
  roundedCorners?: Corner[];
};

export default function Cell({ data, roundedCorners }: Props) {
  const { editable } = data;
  const content = !editable ? data.content : null;
  const filled: boolean = (editable && data.filled) || (!editable && !!content);

  const handleEdited = () => {
    if (editable) {
      data.onEdited(!filled);
    }
  };

  const handleClick = () => {
    handleEdited();
  };

  const handleKeyDown = ({ code, preventDefault }: KeyboardEvent<HTMLElement>) => {
    if (ACCESSIBILITY_KEYS.includes(code)) {
      preventDefault();
      handleEdited();
    }
  };

  const classes = classnames(
    'cell',
    `cell--${filled ? 'filled' : 'empty'}`,
    roundedCorners?.map((corner) => `cell--${corner}`)
  );

  return (
    <div
      className={classes}
      onClick={() => handleClick()}
      onKeyDown={(event) => handleKeyDown(event)}
      tabIndex={0}
    >
      {!editable && (
        <>
          {content?.letter && (
            <span className='cell__letter'>{content.letter}</span>
          )}
          {content?.number && (
            <span className='cell__number'>{content.number}</span>
          )}
        </>
      )}
    </div>
  );
}
