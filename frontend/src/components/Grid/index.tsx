import React from 'react';
import Cell from '../Cell';
import CellData from '../../types/cellData';
import Corner from '../../types/corner';
import Mode from '../../types/mode';
import './styles.scss';

type Props =
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
          editable: true,
          filled: matrix[row][column],
          onEdited: () => props.onChange(row, column),
        };
      case Mode.Puzzle:
        return {
          editable: false,
          content: matrix[row][column]
            ? { letter: null, number: matrix[row][column]!.number }
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
      }
    );
  };

  return (
    <div className='grid'>
      {props.matrix.map((row, rowIndex) =>
        row.map((cell, columnIndex) => (
          <Cell
            data={getData(rowIndex, columnIndex)}
            roundedCorners={getRoundedCorners(rowIndex, columnIndex)}
          />
        ))
      )}
    </div>
  );
}
