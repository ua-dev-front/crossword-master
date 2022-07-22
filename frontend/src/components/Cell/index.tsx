import React, { KeyboardEvent } from 'react';
import classnames from 'classnames';
import CellData from '../../types/cellData';
import Corner from '../../types/corner';
import './styles.scss';

const ACCESSIBILITY_KEYS = ['Enter', 'Space'];

type Props = {
  data: CellData;
  roundedCorners?: Corner[];
};

export default function Cell({ data, roundedCorners }: Props) {
  const { editable } = data;
  const content = !editable ? data.content : null;
  const filled: boolean = (editable && data.filled) || (!editable && !!content);

  const handleEdited = () => {
    if (editable) {
      data.onEdited();
    }
  };

  const handleClick = () => {
    handleEdited();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (ACCESSIBILITY_KEYS.includes(event.code)) {
      event.preventDefault();
      handleEdited();
    }
  };

  const className = 'cell';

  const classes = classnames(
    className,
    `${className}_${filled ? 'filled' : 'empty'}`,
    editable && `${className}_editable`,
    roundedCorners?.map((corner) => `${className}_${corner}`)
  );

  return (
    <div
      className={classes}
      onClick={() => handleClick()}
      onKeyDown={(event) => handleKeyDown(event)}
      tabIndex={editable ? 0 : -1}
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
