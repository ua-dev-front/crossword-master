import React from 'react';
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
  const { mode, matrix } = props;

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
    <div className='grid'>
      {props.matrix.map((row, rowIndex) =>
        row.map((cell, columnIndex) => (
          <Cell
            key={`${rowIndex}-${columnIndex}`}
            data={getData(rowIndex, columnIndex)}
            roundedCorners={getRoundedCorners(rowIndex, columnIndex)}
            onEdited={
              mode === Mode.Draw || mode === Mode.Erase
                ? () => props.onChange(rowIndex, columnIndex)
                : undefined
            }
          />
        )),
      )}
    </div>
  );
}
