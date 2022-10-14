import React, { KeyboardEvent, PointerEvent } from 'react';
import classnames from 'classnames';
import './styles.scss';

const ACCESSIBILITY_KEYS = ['Enter', 'Space'];

export enum Corner {
  TopLeft = 'top-left',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
}

export type CellData =
  | {
      editable: boolean;
      filled: boolean;
    }
  | {
      editable: false;
      content: { letter: string | null; number: number | null } | null;
    };

export type Props = {
  data: CellData;
  roundedCorners?: Corner[];
  onEdited?: () => void;
  isPointerDown?: boolean;
};

export default function Cell({
  data,
  roundedCorners,
  onEdited,
  isPointerDown,
}: Props) {
  const { editable } = data;
  const content =
    ('content' in data && data.content) ||
    ('filled' in data && data.filled && { letter: null, number: null }) ||
    null;
  const filled: boolean = (editable && data.filled) || (!editable && !!content);

  const handleEdited = () => editable && onEdited && onEdited();

  const handleClick = () => {
    handleEdited();
  };

  const handlePointerMove = (event: PointerEvent) => {
    event.preventDefault();

    if (isPointerDown) {
      handleEdited();
    }
  };

  const handlePointerDown = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    target.releasePointerCapture(event.pointerId);
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
    roundedCorners?.map((corner) => `${className}_${corner}`),
  );

  return (
    <div
      className={classes}
      onClick={() => handleClick()}
      onPointerMove={(event) => handlePointerMove(event)}
      onPointerDown={(event) => handlePointerDown(event)}
      onKeyDown={(event) => handleKeyDown(event)}
      tabIndex={editable ? 0 : undefined}
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
