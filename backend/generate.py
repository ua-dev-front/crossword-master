from api import get_possible_word_answers_and_questions
from app_types import Direction, GenerateResponse, GenerateWord, GenerateWords, Pattern, Position, Table, WordLocation
from backtracking import solve

__all__ = ['generate_words_and_questions']


def get_existed_word(position: Position, direction: Direction, words: list[WordLocation]) -> WordLocation | None:
    for word in words:
        if direction == Direction.ACROSS and position.column == word.first_letter.column + word.length \
                and position.row == word.first_letter.row:
            return word
        elif direction == Direction.DOWN and position.row == word.first_letter.row + word.length \
                and position.column == word.first_letter.column:
            return word
    return None


def is_new_word(position: Position, direction: Direction, table: Table) -> bool:
    if direction == Direction.ACROSS:
        return (position.column == 0 or table[position.row][position.column - 1] == 0) \
               and (position.column == len(table) - 1 or table[position.row][position.column + 1] == 1)
    if direction == Direction.DOWN:
        return (position.row == 0 or table[position.row - 1][position.column] == 0) \
               and (position.row == len(table) - 1 or table[position.row + 1][position.column] == 1)
    return False


def define_words(table: Table) -> list[WordLocation]:
    words = []

    for row in range(len(table)):
        for column in range(len(table[0])):
            if table[row][column] == 1:
                for direction in [Direction.ACROSS, Direction.DOWN]:
                    word = get_existed_word(Position(row, column), direction, words)
                    if word is None and is_new_word(Position(row, column), direction, table):
                        words.append(WordLocation(Position(row, column), 1, direction))
                    elif word is not None:
                        word.length += 1

    return words


def get_parsed_response(raw_response: list[str] | None, words: list[WordLocation],
                        cache: list[tuple[str, str]]) -> GenerateWords | None:
    if raw_response is None:
        return None

    def normalize_question(question: str) -> str:
        return question.split('\t')[1]

    def get_id(response: list[dict[str, str | int]]) -> int:
        if len(response) == 0:
            return 1
        return max(response, key=lambda item: item.id).id + 1

    parsed_response = {Direction.ACROSS: [], Direction.DOWN: []}

    for index, answer in enumerate(raw_response):
        word_direction = words[index].type

        parsed_response[word_direction].append(GenerateWord(
            get_id([*parsed_response[Direction.ACROSS], *parsed_response[Direction.DOWN]]),
            normalize_question(list(filter(lambda item: item[0] == answer, cache))[0][1]),
            words[index].first_letter,
            answer
        ))

    return GenerateWords(parsed_response[Direction.ACROSS], parsed_response[Direction.DOWN])


def generate_words_and_questions(table: Table) -> GenerateResponse | None:
    cache = []

    def load_word_answers_and_questions(pattern: Pattern, _word_index: int) -> list[str]:
        response = get_possible_word_answers_and_questions(pattern)
        cache.extend(response)
        return [item[0] for item in response]

    locations = define_words(table)
    answers = solve(locations, load_word_answers_and_questions)

    return get_parsed_response(answers, locations, cache)
