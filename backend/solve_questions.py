import re
import requests
from app_types import *
import string
from copy import deepcopy


API_PATH = 'https://api.datamuse.com/words?'


def remove_punctuation(raw_str: str) -> str:
    return raw_str.translate(str.maketrans('', '', string.punctuation))


def parse_question(question: Question) -> str:
    return remove_punctuation(question).strip().replace(' ', '+')


def api_get_answers(question: Question, length: int) -> Word:
    answers_path = f'{API_PATH}ml={question}&sp='+'?'*length
    res = requests.get(answers_path)
    if res.status_code == 200:
        return res.json()
    else:
        raise Exception('API responded with code: ', res.status_code)


def get_possible_word_answers(question: Question, length: int) -> list[str]:
    answers = api_get_answers(question, length)

    return [answer['word'] for answer in answers]


def get_possible_answers(words: SolveWords, table: Table) -> dict[int, list[str]]:
    possible_ans = {}
    for direction, value in words.items():
        for word in value:
            possible_ans[word['id']] = get_possible_word_answers(word['question'],
                                                              get_word_length(word['startPosition'],
                                                              table,
                                                              direction))

    return possible_ans


def increase_position(prev_pos: list[int], direction: str) -> None:
    position = deepcopy(prev_pos)

    if direction == 'across':
        position[1] += 1
    elif direction == 'down':
        position[0] += 1
    return position


def is_correct_cell(position: list[int], table: Table) -> bool:
    return all(coord < len(table) for coord in position) and table[position[0]][position[1]]


def get_word_length(startPosition: StartPosition, table: Table, direction: str) -> int:
    position = deepcopy(startPosition)
    length = 0

    while is_correct_cell(position, table):
        length += 1
        position = increase_position(position, direction)

    return length


def get_word_pattern(table: Table, start_pos: StartPosition, direction: str) -> str:
    position = deepcopy(start_pos)
    pattern = ''

    while is_correct_cell(position, table):
        if table[position[0]][position[1]] == 1:
            pattern += '[a-zA-Z]?'
        elif isinstance(table[position[0]][position[1]], str):
            pattern += table[position[0]][position[1]]

        position = increase_position(position, direction)

    return pattern


def get_word(words: SolveWords, id: int) -> Word | None:
    for direction in words.values():
        for word in direction:
            if word['id'] == id:
                return word

    return None


def get_direction(words: SolveWords, id: int) -> str | None:
    for direction, value in words.items():
        for word in value:
            if word['id'] == id:
                return direction

    return None


def update_table(answer: str, table: Table, word: Word, direction: str) -> None:
    position = deepcopy(word['startPosition'])
    for letter in answer:
        if is_correct_cell(position, table):
            table[position[0]][position[1]] = letter
            position = increase_position(position, direction)


def update_answers(answers: SolveAnswers, answer: str, id: int, direction: str) -> None:
    for value in answers.values():
        for word in value:
            if word['id'] == id:
                word['answer'] = answer
                return None

    answers[direction].append({ 'id': id, 'answer': answer })


def solve_word(words: SolveWords,
               table: Table,
               possible_answers: list[list[str]],
               word_id: int, answers: SolveAnswers) -> SolveAnswer:
    word = get_word(words, word_id)
    direction = get_direction(words, word_id)

    if not word:
        return answers

    pattern = get_word_pattern(table, word['startPosition'], direction)


    for possible_answer in possible_answers[word_id]:
        if re.match(pattern, possible_answer):
            update_table(possible_answer, table, word, direction)
            next_ans = solve_word(words, table, possible_answers, word_id=word_id + 1, answers=answers)
            if next_ans:
                update_answers(answers, possible_answer, word_id, direction)
                return answers


def solve_questions(table: Table, words: SolveWords) -> SolveResponse:
    possible_answers = get_possible_answers(words, table)

    answers = {'across': [], 'down': []}

    answers = solve_word(words, table, possible_answers, word_id=1, answers=answers)

    return { 'answers': answers }
