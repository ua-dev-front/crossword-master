import { Question, Questions, State } from 'store';

export type IndexedQuestions<T extends string | number | symbol> = {
  [id in T]: Question;
};

const getIndexedQuestions = <T extends string | number | symbol>(
  questions: Question[],
  getQuestionIndex: (question: Question) => T,
): IndexedQuestions<T> => {
  const indexedQuestions = {} as IndexedQuestions<T>;

  for (const question of questions) {
    indexedQuestions[getQuestionIndex(question)] = question;
  }

  return indexedQuestions;
};

const getNumberGrid = (grid: State['grid']) =>
  grid.map((row) => row.map((cell) => (cell ? 1 : 0)));

function getQuestionsFromGrid(grid: State['grid']): Questions {
  const acrossQuestions: Question[] = [];
  const downQuestions: Question[] = [];

  const hasNoAdjacentCells = (row: number, column: number): boolean =>
    (row === 0 || grid[row - 1][column] === null) &&
    (column === 0 || grid[row][column - 1] === null) &&
    (row === grid.length - 1 || grid[row + 1][column] === null) &&
    (column === grid.length - 1 || grid[row][column + 1] === null);

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
            (!grid[row - rowShift]?.[column - columnShift] &&
              grid[row + rowShift]?.[column + columnShift]) ||
            hasNoAdjacentCells(row, column)
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
            }),
          );
          currentId += 1;
        }
      }
    }
  }

  return { across: acrossQuestions, down: downQuestions };
}

export { getIndexedQuestions, getNumberGrid, getQuestionsFromGrid };
