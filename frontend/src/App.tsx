import React from 'react';

import Cell from './components/Cell';
import Corner from './types/corner';

function App() {
  return (
    <>
      <p>Under development</p>
      <p>Cell example:</p>
      <Cell
        data={{
          editable: true,
          filled: false,
          onEdited: (filled) => console.log(filled),
        }}
      />
      <hr />
      <Cell
        data={{
          editable: true,
          filled: true,
          onEdited: (filled) => console.log(filled),
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
        corner={Corner.TopLeft}
      />
    </>
  );
}

export default App;
