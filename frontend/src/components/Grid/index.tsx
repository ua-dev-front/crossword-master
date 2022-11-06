import React, { RefObject, useRef, useState } from 'react';
import useEventListener from 'hooks/useEventListener';
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
  const ref = useRef<HTMLElement>(null);

  const [isPointerDown, setIsPointerDown] = useState(false);
  useEventListener('pointerdown', (event) =>
    setIsPointerDown(!!ref.current?.contains(event.target as HTMLElement)),
  );
  useEventListener('pointerup', () => setIsPointerDown(false));

  const { mode, matrix } = props;

  const handleEdited = (row: number, column: number) =>
    (mode === Mode.Draw || mode === Mode.Erase) && props.onChange(row, column);

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
    <div className='grid' ref={ref as RefObject<HTMLDivElement>}>
      {matrix.map((row, rowIndex) =>
        row.map((_cell, columnIndex) => (
          <Cell
            key={`${rowIndex}-${columnIndex}`}
            data={getData(rowIndex, columnIndex)}
            roundedCorners={getRoundedCorners(rowIndex, columnIndex)}
            onEdited={() => handleEdited(rowIndex, columnIndex)}
            isPointerDown={isPointerDown}
          />
        )),
      )}
    </div>
  );
}
