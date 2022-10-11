import React, { useState, useRef, TouchEvent } from 'react';
import useGlobalMouseClickToggle from 'hooks/useGlobalMouseClickToggle';
import { ROWS, COLUMNS } from 'appConstants';
import Cell, { CellData, Corner } from 'components/Cell';
import './styles.scss';

export enum Mode {
  Answer = 'answer',
  Draw = 'draw',
  Erase = 'erase',
  Puzzle = 'puzzle',
}

export type Props =
  | {
      mode: Mode.Draw | Mode.Erase;
      matrix: boolean[][];
      onChange: (row: number, column: number) => void;
    }
  | {
      mode: Mode.Puzzle;
      matrix: ({
        number: number | null;
      } | null)[][];
    }
  | {
      mode: Mode.Answer;
      matrix: ({
        letter: string;
        number: number | null;
      } | null)[][];
    };

export default function Grid(props: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useGlobalMouseClickToggle((event) => {
    const changeDocumentOverflow = (overflow: string) => {
      document.documentElement.style.overflow = overflow;
    };

    setIsMouseDown(() => {
      if (gridRef.current?.contains(event.target as Node)) {
        changeDocumentOverflow('hidden');
        return !isMouseDown;
      }
      changeDocumentOverflow('auto');
      return false;
    });
  });

  const { mode, matrix } = props;

  const handleEdited = (row: number, column: number) => {
    return mode === Mode.Draw || mode === Mode.Erase
      ? props.onChange(row, column)
      : undefined;
  };

  const handleTouch = (event: TouchEvent<HTMLElement>) => {
    const { clientX, clientY } = event.touches[0];
    const target = document.elementFromPoint(clientX, clientY);

    if (target && gridRef.current) {
      const cells = gridRef.current.querySelectorAll('.cell');
      const index = Array.from(cells).findIndex((cell) =>
        cell.contains(target),
      );
      const row = Math.floor(index / ROWS);
      const column = index % COLUMNS;

      if (row !== -1 && column !== -1) {
        handleEdited(row, column);
      }
    }
  };

  const getData = (row: number, column: number): CellData => {
    switch (mode) {
      case Mode.Draw:
      case Mode.Erase:
        return {
          editable: mode === (matrix[row][column] ? Mode.Erase : Mode.Draw),
          filled: matrix[row][column],
        };
      case Mode.Puzzle:
        return {
          editable: false,
          content: matrix[row][column]
            ? { letter: null, number: matrix[row][column]?.number ?? null }
            : null,
        };
      case Mode.Answer:
        return {
          editable: false,
          content: matrix[row][column],
        };
    }
  };

  const getRoundedCorners = (row: number, column: number): Corner[] => {
    const height = matrix.length - 1;
    const width = matrix[0].length - 1;

    const dimensions: {
      [values in Corner]: [number, number];
    } = {
      [Corner.TopLeft]: [0, 0],
      [Corner.TopRight]: [0, width],
      [Corner.BottomLeft]: [height, 0],
      [Corner.BottomRight]: [height, width],
    };

    return Object.entries(dimensions).flatMap(
      ([key, [dimensionRow, dimensionColumn]]) => {
        return row === dimensionRow && column === dimensionColumn
          ? [key as Corner]
          : [];
      },
    );
  };

  return (
    <div
      className='grid'
      ref={gridRef}
      onTouchMove={(event) => handleTouch(event)}
    >
      {props.matrix.map((row, rowIndex) =>
        row.map((cell, columnIndex) => (
          <Cell
            key={`${rowIndex}-${columnIndex}`}
            data={getData(rowIndex, columnIndex)}
            roundedCorners={getRoundedCorners(rowIndex, columnIndex)}
            onEdited={() => handleEdited(rowIndex, columnIndex)}
            isMouseDown={isMouseDown}
          />
        )),
      )}
    </div>
  );
}
