import React, { useState } from 'react';
import Button from './components/Button';
import Cell from './components/Cell';
import Grid, { Mode } from './components/Grid';
import Label, { LabelSize } from './components/Label';
import Tab from './components/Tab';
import TextField from './components/TextField';
import Corner from './components/Cell/corner';
import LeftArrow from './icons/LeftArrow';
import Square from './icons/Square';
import QuestionPanel, { panelColor } from './components/QuestionPanel';

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

export type Question = {
  id: number;
  question: string;
};

function App() {
  const [filled, setFilled] = useState(false);
  const [matrix, setMatrix] = useState(emptyMatrix);
  const [questions, setQuestions] = useState([
    { id: 1, question: 'A thin, flat, circular plate or similar object.' },
    {
      id: 33,
      question:
        'A male person considered to have been significantly shaped by some external influence; a male adopted person in relation to his adoptive parents.',
    },
  ]);

  const handleMatrixChange = (row: number, column: number) => {
    const newMatrix = [...matrix];

    newMatrix[row][column] = !newMatrix[row][column];

    setMatrix(newMatrix);
  };

  const handleQuestionsChange = (value: string, index: number) => {
    const newQuestions = [...questions];

    newQuestions[index].question = value;

    setQuestions(newQuestions);
  };

  return (
    <>
      <p>Under development</p>
      <h3>Question panel exapmle:</h3>
      <QuestionPanel
        questions={questions}
        isEditable={true}
        color={panelColor.Pink}
        onChange={(value, index) => handleQuestionsChange(value, index)}
      />
      <hr />
      <QuestionPanel
        questions={questions}
        isEditable={false}
        color={panelColor.Yellow}
      />
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
      <hr />
      <p>Label small example:</p>
      <Label content='Please enter questions below' size={LabelSize.Small} />
      <hr />
      <p>Label large example:</p>
      <Label content='Across' size={LabelSize.Large} />
    </>
  );
}

export default App;
