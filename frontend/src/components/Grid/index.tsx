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
    const matrixHeight = matrix.length - 1;
    const matrixWidth = matrix[0].length - 1;

    return Object.values(Corner).filter((corner) => {
      switch (corner) {
        case Corner.TopLeft:
          return row === 0 && column === 0;
        case Corner.TopRight:
          return row === 0 && column === matrixWidth;
        case Corner.BottomLeft:
          return row === matrixHeight && column === 0;
        case Corner.BottomRight:
          return row === matrixHeight && column === matrixWidth;
        default:
          return false;
      }
    });
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
