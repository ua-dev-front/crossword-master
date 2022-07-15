import React, { useState } from 'react';
import Button from './components/Button';
import Cell from './components/Cell';
import Corner from './types/corner';

function App() {
  const [filled, setFilled] = useState(false);

  return (
    <>
      <p>Under development</p>
      <p>Cell example:</p>
      <Cell
        data={{
          editable: true,
          filled,
          onEdited: (filled: boolean) => setFilled(filled),
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
    </>
  );
}

export default App;
