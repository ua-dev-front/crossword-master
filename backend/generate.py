from app_types import Table, GenerateResponse, GenerateWords, GenerateWord, WordLocation, Position, Direction, Pattern
from api import get_possible_word_answers_and_questions
from backtracking import solve

__all__ = ['generate_questions_and_words']


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


def get_parsed_response(raw_response: list[dict[str, str]] | None, words: list[WordLocation]) -> GenerateWords | None:
    if raw_response is None:
        return None

    def normalize_question(question: str) -> str:
        return question.split('\t')[1]

    def get_id(response: list[dict[str, str | int]]) -> int:
        return response[len(response) - 1].id + 1 if len(response) > 0 else 1

    parsed_response = {Direction.ACROSS: [], Direction.DOWN: []}

    for index, item in enumerate(raw_response):
        word_direction = words[index].type

        parsed_response[word_direction].append(GenerateWord(
            get_id(parsed_response[word_direction]),
            normalize_question(item['question']),
            words[index].first_letter,
            item['answer']
        ))

    return GenerateWords(parsed_response[Direction.ACROSS], parsed_response[Direction.DOWN])


def generate_questions_and_words(table: Table) -> GenerateResponse | None:
    def load_word_answers(pattern: Pattern, word_index: int) -> list[dict[str, str]]:
        return get_possible_word_answers_and_questions(pattern)

    locations = define_words(table)
    answers = solve(locations, load_word_answers)

    return get_parsed_response(answers, locations)
