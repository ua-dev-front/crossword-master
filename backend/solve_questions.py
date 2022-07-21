import requests

from app_types import Direction, Pattern, Position, Question, SolveAnswers, SolveWords, Table, WordLocation
from backtracking import solve
from increase_position import increase_position

__all__ = ['solve_questions']

API_PATH = 'https://api.datamuse.com/words'


def is_correct_cell(position: Position, table: Table) -> bool:
    return position.row < len(table) and position.column < len(table) and table[position.row][position.column]


def get_word_length(start_position: Position, table: Table, direction: Direction) -> int:
    position = Position(start_position.row, start_position.column)
    length = 0

    while is_correct_cell(position, table):
        length += 1
        position = increase_position(position, direction)

    return length


def get_api_pattern(pattern: Pattern) -> str:
    return ''.join(letter if isinstance(letter, str) else '?' for letter in pattern)


def get_possible_word_answers(question: Question, length: int, pattern=None) -> list[str]:
    if pattern is None:
        pattern = "?" * length

    answers_path = f'{API_PATH}?ml={question}&sp={pattern}'
    res = requests.get(answers_path)
    if res.status_code == 200:
        return [answer['word'] for answer in res.json()]
    else:
        raise Exception(f'API responded with code: {res.status_code} \nPath: {res.url}')


def get_locations(words: SolveWords, table: Table) -> list[WordLocation]:
    return [WordLocation(Position(word.start_position.row, word.start_position.column),
                         get_word_length(Position(word.start_position.row, word.start_position.column),
                                         table,
                                         word.direction), word.direction)
            for word in words]


def get_parsed_answers(raw_answers: list[str] | None, words: SolveWords) -> SolveAnswers | None:
    if raw_answers is None:
        return None

    parsed_answers = {'across': [], 'down': []}

    for ind, answer in enumerate(raw_answers):
        word_direction = words[ind].direction.value

        parsed_answers[word_direction].append(answer)

    return SolveAnswers(parsed_answers['across'], parsed_answers['down'])


def solve_questions(table: Table, words: SolveWords) -> SolveAnswers:
    def load_more_answers(pattern, word_id):
        word = words[word_id]
        return get_possible_word_answers(word.question, len(pattern), get_api_pattern(pattern))

    locations = get_locations(words, table)

    answers = solve(locations, load_more_answers)

    return get_parsed_answers(answers, words)
