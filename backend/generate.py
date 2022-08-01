from api import get_possible_word_answers_and_questions
from app_types import Direction, GenerateResponse, GenerateWord, GenerateWords, Pattern, Position, Table, WordLocation, \
    GenerateApiResponse
from backtracking import solve
from helpers import get_axes, shift_position

__all__ = ['generate_words_and_questions']


def determine_locations(table: Table) -> list[WordLocation]:
    def extract_location(position: Position, scope_direction: Direction,
                         scope_locations: list[WordLocation]) -> WordLocation | None:
        axis_to_change, another_axis = get_axes(scope_direction)
        return next((scope_location for scope_location in scope_locations
                     if getattr(scope_location.first_letter, axis_to_change) + scope_location.length ==
                     getattr(position, axis_to_change)
                     and getattr(scope_location.first_letter, another_axis) == getattr(position, another_axis)), None)

    def is_new_location(position: Position, scope_direction: Direction) -> bool:
        axis_to_change, another_axis = get_axes(scope_direction)
        previous_row, previous_column = shift_position(position, scope_direction, -1)
        next_row, next_column = shift_position(position, scope_direction)

        return (getattr(position, axis_to_change) == 0 or table[previous_row][previous_column] == 0) and \
               (getattr(position, axis_to_change) == len(table) - 1 or table[next_row][next_column] == 1)

    locations = []

    for row in range(len(table)):
        for column in range(len(table[0])):
            if table[row][column] == 1:
                for direction in [Direction.ACROSS, Direction.DOWN]:
                    location = extract_location(Position(row, column), direction, locations)
                    if location is None and is_new_location(Position(row, column), direction):
                        locations.append(WordLocation(Position(row, column), 1, direction))
                    elif location is not None:
                        location.length += 1

    return locations


def get_parsed_response(raw_response: list[str] | None, words: list[WordLocation],
                        cache: list[GenerateApiResponse]) -> GenerateWords | None:
    if raw_response is None:
        return None

    parsed_response = {Direction.ACROSS: [], Direction.DOWN: []}

    for index, answer in enumerate(raw_response):
        word_direction = words[index].type

        parsed_response[word_direction].append(GenerateWord(
            answer,
            next(map(lambda item: item.question, filter(lambda item: item.answer == answer, cache))),
            words[index].first_letter,
        ))

    return GenerateWords(parsed_response[Direction.ACROSS], parsed_response[Direction.DOWN])


def generate_words_and_questions(table: Table) -> GenerateResponse | None:
    cache = []

    def load_word_answers_and_questions(pattern: Pattern, _word_index: int) -> list[str]:
        response = get_possible_word_answers_and_questions(pattern)
        cache.extend(response)
        return [item.answer for item in response]

    locations = determine_locations(table)
    answers = solve(locations, load_word_answers_and_questions)

    return get_parsed_response(answers, locations, cache)
