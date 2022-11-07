from api import get_possible_word_answers
from app_types import Direction, Pattern, Position, SolveAnswers, SolveWords, Table, WordLocation
from backtracking import solve
from helpers import is_cell_filled, shift_position

__all__ = ['solve_questions']


def get_word_length(start_position: Position, table: Table, direction: Direction) -> int:
    position = Position(start_position.row, start_position.column)
    length = 0

    while is_cell_filled(position, table):
        length += 1
        position = shift_position(position, direction)

    return length


def get_locations(words: SolveWords, table: Table) -> list[WordLocation]:
    return [WordLocation(Position(word.start_position.row, word.start_position.column),
                         get_word_length(Position(word.start_position.row, word.start_position.column),
                                         table,
                                         word.direction), word.direction)
            for word in words]


def get_parsed_answers(raw_answers: list[str] | None, words: SolveWords) -> SolveAnswers | None:
    if raw_answers is None:
        return None

    parsed_answers = {Direction.ACROSS: [], Direction.DOWN: []}

    for index, answer in enumerate(raw_answers):
        word_direction = words[index].direction

        parsed_answers[word_direction].append(answer)

    return SolveAnswers(parsed_answers[Direction.ACROSS], parsed_answers[Direction.DOWN])


def solve_questions(table: Table, words: SolveWords) -> SolveAnswers | None:
    def load_word_answers(pattern: Pattern, word_index: int) -> list[str]:
        return get_possible_word_answers(words[word_index].question, pattern)

    locations = get_locations(words, table)
    answers = solve(locations, load_word_answers)

    return get_parsed_answers(answers, words)
