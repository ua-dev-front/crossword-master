from app_types import Direction, LoadOptions, Pattern, Position, WordLocation
from helpers import increase_position

__all__ = ['solve']

BackTrackTable = list[list[str | None]]


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
        return increase_position(location.first_letter, location.type, location.length)

    def get_table_size() -> int:
        return max(coord for location in locations for coord in get_last_position(location))

    return [[None for _ in range(get_table_size())] for _ in range(get_table_size())]


def backtrack(locations: list[WordLocation], table: BackTrackTable, load_options: LoadOptions,
              current_index: int = 0, response: list[dict[str, str]] = None) -> list[dict[str, str]] | None:
    if response is None:
        response = []
    if current_index == len(locations):
        return response

    word = locations[current_index]
    direction = word.type
    start_position = word.first_letter
    word_length = word.length

    pattern = get_word_pattern(table, direction, start_position, word_length)
    possible_response = load_options(pattern, current_index)

    if len(possible_response):
        response.append(possible_response[0])

    for item in possible_response:
        update_table(item['answer'], table, direction, start_position)
        response = backtrack(locations, table, load_options,
                             current_index=current_index + 1,
                             response=response)
        if response is not None:
            response[current_index] = item
            return response


def solve(locations: list[WordLocation], load_options: LoadOptions) -> list[str] | None:
    table = get_table(locations)

    answers = backtrack(locations, table, load_options)

    return answers
