from app_types import Direction, LoadOptions, Pattern, Position, WordLocation

__all__ = ['solve']

BackTrackTable = list[list[str | None]]


def increase_position(previous_position: Position, direction: Direction, delta: int = 1) -> Position:
    row, column = previous_position

    if direction == Direction.ACROSS:
        column += delta
    elif direction == Direction.DOWN:
        row += delta

    return Position(row, column)


def update_table(answer: str, table: BackTrackTable, direction: Direction, start_position: Position) -> None:
    position = Position(start_position.row, start_position.column)

    for letter in answer:
        table[position.row][position.column] = letter
        position = increase_position(position, direction)


def get_word_pattern(table: BackTrackTable, direction: Direction, start_position: Position, word_len: int) -> Pattern:
    position = Position(start_position.row, start_position.column)
    pattern = []

    for _ in range(word_len):
        current_cell = table[position.row][position.column]

        pattern.append(current_cell if isinstance(current_cell, str) else None)

        position = increase_position(position, direction)

    return pattern


def get_table(locations: list[WordLocation]) -> BackTrackTable:
    def get_last_position(location: WordLocation) -> Position:
        position = Position(location.first_letter.row, location.first_letter.column)

        return increase_position(position, location.type, location.length)

    def get_table_size() -> int:
        return max(coord for location in locations for coord in get_last_position(location))

    return [[None for _ in range(get_table_size())] for _ in range(get_table_size())]


def backtrack(locations: list[WordLocation], table: BackTrackTable, load_options: LoadOptions,
              current_index: int, answers: list[str], loaded_more_answers: list[bool]) -> list[str] | None:
    if current_index >= len(locations):
        return answers

    word = locations[current_index]
    direction = word.type
    start_position = word.first_letter
    word_length = word.length

    pattern = get_word_pattern(table, direction, start_position, word_length)
    possible_answers = load_options(pattern, current_index)

    for possible_answer in possible_answers:
        update_table(possible_answer, table, direction, start_position)
        next_answer = backtrack(locations, table, load_options,
                                current_index=current_index + 1,
                                answers=answers,
                                loaded_more_answers=loaded_more_answers)
        if next_answer:
            answers[current_index] = possible_answer
            return answers


def solve(locations: list[WordLocation], load_options: LoadOptions) -> list[str] | None:
    table = get_table(locations)

    answers = backtrack(locations, table, load_options, current_index=0, answers=[''] * len(locations),
                        loaded_more_answers=[False] * len(locations))

    return answers
