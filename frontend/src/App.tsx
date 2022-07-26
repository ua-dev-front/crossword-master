import React, { useState } from 'react';
import BackIcon from './components/BackIcon';
import Button from './components/Button';
import Cell from './components/Cell';
import Grid from './components/Grid';
import TabulatorItem from './components/TabulatorItem';
import Corner from './types/corner';
import Mode from './types/mode';

const answerMatrix = [
  [
    { letter: 'D', number: 1 },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    { letter: 'I', number: null },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    { letter: 'S', number: null },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    { letter: 'C', number: 2 },
    { letter: 'R', number: null },
    { letter: 'O', number: null },
    { letter: 'S', number: 3 },
    { letter: 'S', number: null },
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    null,
    null,
    { letter: 'O', number: null },
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    null,
    null,
    { letter: 'N', number: null },
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  ...[...Array(4)].map(() => [...Array(10)].map(() => null)),
];

const puzzleMatrix = answerMatrix.map((row) =>
  row.map((cell) => (cell ? { number: cell.number } : null))
);

const emptyMatrix = [...Array(10)].map(() => [...Array(10)].map(() => false));

function App() {
  const [filled, setFilled] = useState(false);
  const [matrix, setMatrix] = useState(emptyMatrix);

  const handleMatrixChange = (row: number, column: number) => {
    const newMatrix = [...matrix];

    newMatrix[row][column] = !newMatrix[row][column];

    setMatrix(newMatrix);
  };

  return (
    <>
      <p>Under development</p>
      <h3>Pictogram example:</h3>
      <p>Normal:</p>
      <TabulatorItem
        label='Puzzle'
        isSelected={false}
        icon={
          <Cell
            data={{
              editable: false,
              content: {
                letter: null,
                number: null,
              },
            }}
            roundedCorners={[
              Corner.TopLeft,
              Corner.TopRight,
              Corner.BottomLeft,
              Corner.BottomRight,
            ]}
          />
        }
      />
      <hr />
      <TabulatorItem label='Puzzle' isSelected={false} icon={<BackIcon />} />
      <p>Selected:</p>
      <TabulatorItem
        label='Answer'
        isSelected={true}
        icon={
          <Cell
            data={{
              editable: false,
              content: {
                letter: 'A',
                number: null,
              },
            }}
            roundedCorners={[
              Corner.TopLeft,
              Corner.TopRight,
              Corner.BottomLeft,
              Corner.BottomRight,
            ]}
          />
        }
      />
      <hr />
      <p>Cell example:</p>
      <Cell
        data={{
          editable: true,
          filled,
          onEdited: () => setFilled(!filled),
        }}
      />
      <hr />
      <Cell
        data={{
          editable: false,
          content: {
            letter: 'A',
            number: 1,
          },
        }}
        roundedCorners={[Corner.TopLeft]}
      />
      <p>Button example:</p>
      <Button label='Click me' onClick={() => console.log('clicked')} />
      <hr />
      <p>Grid edit example:</p>
      <Grid
        mode={Mode.Draw}
        matrix={matrix}
        onChange={(row: number, column: number) => {
          handleMatrixChange(row, column);
        }}
      />
      <hr />
      <p>Grid puzzle example:</p>
      <Grid mode={Mode.Puzzle} matrix={puzzleMatrix} />
      <hr />
      <p>Grid answer example:</p>
      <Grid mode={Mode.Answer} matrix={answerMatrix} />
    </>
  );
}

export default App;
