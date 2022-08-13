import React, { useState } from 'react';
import Button from './components/Button';
import Cell from './components/Cell';
import Grid from './components/Grid';
import Tab from './components/Tab';
import TextField from './components/TextField';
import Corner from './types/corner';
import Mode from './types/mode';
import LeftArrow from './icons/LeftArrow';
import Square from './icons/Square';

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
  const [textFieldValue, setTextFieldValue] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  );

  const handleMatrixChange = (row: number, column: number) => {
    const newMatrix = [...matrix];

    newMatrix[row][column] = !newMatrix[row][column];

    setMatrix(newMatrix);
  };

  return (
    <>
      <p>Under development</p>
      <h3>Text field exapmle:</h3>
      <div style={{ width: '200px' }}>
        <TextField
          isEditable
          content={textFieldValue}
          onChange={(value) => setTextFieldValue(value)}
        />
      </div>
      <hr />
      <div style={{ width: '200px' }}>
        <TextField content={textFieldValue} />
      </div>
      <hr />
      <h3>Pictogram example:</h3>
      <p>Normal:</p>
      <Tab
        label='Puzzle'
        isSelected={false}
        onClick={() => console.log('clicked tab')}
        icon={<Square isFilled={true} />}
      />
      <hr />
      <Tab
        label='Puzzle'
        isSelected={false}
        onClick={() => console.log('clicked tab')}
        icon={<LeftArrow />}
      />
      <hr />
      <Tab
        label='Puzzle'
        isSelected={false}
        onClick={() => console.log('clicked tab')}
        icon={<Square isFilled={false} />}
      />
      <p>Selected:</p>
      <Tab
        label='Answer'
        isSelected={true}
        icon={<Square isFilled={false} content={'A'} />}
      />
      <hr />
      <p>Cell example:</p>
      <Cell
        data={{
          editable: true,
          filled,
        }}
        onEdited={() => setFilled(!filled)}
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
