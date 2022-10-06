import { Question, Questions, State } from 'store';

const getIndexedQuestions = (
  questions: Question[]
): { [id: number]: Question } => {
  return questions.reduce(
    (accumulator, current) => ({
      ...accumulator,
      [current.id]: {
        ...current,
      },
    }),
    {}
  );
};

const getNumberGrid = (grid: State['grid']) =>
  grid.map((row) => row.map((cell) => (cell ? 1 : 0)));

function getQuestionsFromGrid(grid: State['grid']): Questions {
  const acrossQuestions: Question[] = [];
  const downQuestions: Question[] = [];

  const shifts = [
    {
      array: acrossQuestions,
      shift: [0, 1],
    },
    {
      array: downQuestions,
      shift: [1, 0],
    },
  ];

  let currentId = 1;

  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (grid[row][column]) {
        const arrays = [];

        for (const {
          array,
          shift: [rowShift, columnShift],
        } of shifts) {
          if (
            !grid[row - rowShift]?.[column - columnShift] &&
            grid[row + rowShift]?.[column + columnShift]
          ) {
            arrays.push(array);
          }
        }

        if (arrays.length > 0) {
          arrays.forEach((array) =>
            array.push({
              id: currentId,
              question: '',
              startPosition: { row, column },
            })
          );
          currentId += 1;
        }
      }
    }
  }

  return { across: acrossQuestions, down: downQuestions };
}

export { getIndexedQuestions, getNumberGrid, getQuestionsFromGrid };
