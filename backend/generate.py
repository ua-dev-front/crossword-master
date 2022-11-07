from api import get_possible_word_answers_and_questions
from app_types import Direction, GenerateWord, GenerateWords, Pattern, Position, Table, WordLocation
from backtracking import solve
from helpers import is_cell_filled, get_axes, shift_position

__all__ = ['generate_words_and_questions']


def determine_locations(table: Table) -> list[WordLocation]:
    def extract_location(position: Position, location_direction: Direction, all_locations: list[WordLocation]) -> \
            WordLocation | None:
        axes = get_axes(location_direction)
        return next((current_location for current_location in all_locations
                     if getattr(current_location.first_letter, axes.changeable) + current_location.length ==
                     getattr(position, axes.changeable)
                     and getattr(current_location.first_letter, axes.fixed) == getattr(position, axes.fixed)), None)

    def is_new_location(position: Position, location_direction: Direction) -> bool:
        previous_row, previous_column = shift_position(position, location_direction, -1)
        next_row, next_column = shift_position(position, location_direction)

        def has_no_filled_neighbours() -> bool:
            return all(not is_cell_filled(Position(position.row + row_shift, position.column + column_shift), table)
                       for row_shift, column_shift in [[-1, 0], [0, -1], [1, 0], [0, 1]])

        return (not is_cell_filled(Position(previous_row, previous_column), table) and
                is_cell_filled(Position(next_row, next_column), table)) or has_no_filled_neighbours()

    locations = []

    for row in range(len(table)):
        for column in range(len(table[0])):
            if table[row][column] == 1:
                for direction in [Direction.ACROSS, Direction.DOWN]:
                    location = extract_location(
                        Position(row, column), direction, locations)
                    if location is None and is_new_location(Position(row, column), direction):
                        locations.append(WordLocation(
                            Position(row, column), 1, direction))
                    elif location is not None:
                        location.length += 1

    return locations


def get_parsed_response(raw_response: list[str] | None, words: list[WordLocation],
                        cache: dict[str, str]) -> GenerateWords | None:
    if raw_response is None:
        return None

    parsed_response = {Direction.ACROSS: [], Direction.DOWN: []}

    for index, answer in enumerate(raw_response):
        word_direction = words[index].type

        parsed_response[word_direction].append(GenerateWord(
            answer,
            cache[answer],
            words[index].first_letter,
        ))

    return GenerateWords(parsed_response[Direction.ACROSS], parsed_response[Direction.DOWN])


def generate_words_and_questions(table: Table) -> GenerateWords | None:
    cache = {}

    def load_word_answers_and_questions(pattern: Pattern, _word_index: int) -> list[str]:
        response = get_possible_word_answers_and_questions(pattern)
        cache.update(response)
        return list(response.keys())

    locations = determine_locations(table)
    answers = solve(locations, load_word_answers_and_questions)

    return get_parsed_response(answers, locations, cache)
