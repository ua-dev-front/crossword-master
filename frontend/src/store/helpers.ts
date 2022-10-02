import { Direction, GenerateResponseDirection, Question, State } from 'store';

function getQuestionsFromGrid(grid: State['grid']) {
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

function getQuestionId(
  direction: Direction,
  currentQuestion: GenerateResponseDirection[0],
  grid: State['grid']
) {
  const newQuestions = getQuestionsFromGrid(grid);
  return newQuestions[direction as Direction].find(
    (newQuestion) => newQuestion.startPosition === currentQuestion.startPosition
  )!.id;
}

export { getQuestionsFromGrid, getQuestionId };
