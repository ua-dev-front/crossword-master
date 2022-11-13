from app_types import Direction, LoadOptions, Pattern, Position, WordLocation
from helpers import shift_position

__all__ = ['solve']

BackTrackTable = list[list[str | None]]


def update_table(answer: str, table: BackTrackTable, direction: Direction, start_position: Position) -> None:
    position = Position(start_position.row, start_position.column)

    for letter in answer:
        table[position.row][position.column] = letter
        position = shift_position(position, direction)


def get_word_pattern(table: BackTrackTable, direction: Direction, start_position: Position, word_len: int) -> Pattern:
    position = Position(start_position.row, start_position.column)
    pattern = []

    for _ in range(word_len):
        current_cell = table[position.row][position.column]

        pattern.append(current_cell if isinstance(current_cell, str) else None)

        position = shift_position(position, direction)

    return pattern


def get_table(locations: list[WordLocation]) -> BackTrackTable:
    def get_last_position(location: WordLocation) -> Position:
        return shift_position(location.first_letter, location.type, location.length - 1)

    def get_table_size() -> int:
        return max((coord + 1 for location in locations for coord in get_last_position(location)), default=0)

    return [[None for _ in range(get_table_size())] for _ in range(get_table_size())]


def backtrack(locations: list[WordLocation], table: BackTrackTable, load_options: LoadOptions,
              current_index: int = 0, answers: list[str] = None) -> list[str] | None:
    if answers is None:
        answers = []
    if current_index == len(locations):
        return answers

    word = locations[current_index]
    direction = word.type
    start_position = word.first_letter
    word_length = word.length

    pattern = get_word_pattern(table, direction, start_position, word_length)
    loaded_options = load_options(pattern, current_index)
    possible_answers = (
        list(filter(lambda answer: answer not in answers, loaded_options))
        if word_length > 1
        else loaded_options
    )


    for possible_answer in possible_answers:
        if len(answers) == current_index:
            answers.append(possible_answer)
        else:
            answers[current_index] = possible_answer

        update_table(possible_answer, table, direction, start_position)
        answers = backtrack(locations, table, load_options,
                            current_index=current_index + 1,
                            answers=answers)
        if answers is not None:
            return answers


def solve(locations: list[WordLocation], load_options: LoadOptions) -> list[str] | None:
    table = get_table(locations)

    answers = backtrack(locations, table, load_options)

    return answers
