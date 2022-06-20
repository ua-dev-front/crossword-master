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

    return res.json()


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


def get_word_length(startPosition: StartPosition, table: Table, direction: str) -> int:
    position = deepcopy(startPosition)
    length = 0

    while all(coord < len(table) for coord in position) and table[position[0]][position[1]]:
        length += 1
        position = increase_position(position, direction)

    return length


def get_word_pattern(table: Table, start_pos: StartPosition, direction: str) -> str:
    position = deepcopy(start_pos)
    pattern = ''

    while all(coord < len(table) for coord in position) and table[position[0]][position[1]]:
        if table[position[0]][position[1]] == 1:
            pattern += '[\s\S]?'
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


def update_table(answer, table, word, direction):
    position = deepcopy(word['startPosition'])
    ind = 0
    while all(coord < len(table) for coord in position) and table[position[0]][position[1]]:
        table[position[0]][position[1]] = answer[ind]
        ind+=1
        position = increase_position(position, direction)


def solve_word(words: SolveWords, table: Table, possible_answers: list[list[str]], word_id: int, answer={'across': [], 'down': []}) -> SolveAnswer:
    word = get_word(words, word_id)
    direction = get_direction(words, word_id)

    if not word:
        return None

    pattern = get_word_pattern(table, word['startPosition'], direction)

    for direction, value in words.items():
        for word in value:
            for ind in range(len(possible_answers[word['id']])):
                if re.match(pattern, possible_answers[word['id']][ind]):
                    answer[direction].append({'id': word['id'], 'answer': possible_answers[word['id']][ind]})
                    update_table(possible_answers[word['id']][ind], table, word, direction)
                    solve_word(words, table, possible_answers, word_id=word_id+1, answer=answer)

    return answer


def get_last_by_id(answers):
    new_ans = {
        'down': [],
        'across': [],
    }
    used_ids = []
    for direction, value in reversed(answers.items()):
        for ans in value:
            if ans['id'] in used_ids:
                continue
            new_ans[direction].append(ans)
            used_ids.append(ans['id'])
    return new_ans


def solve_questions(table: Table, words: SolveWords) -> SolveResponse:
    possible_answers = get_possible_answers(words, table)

    answers = solve_word(words, table, possible_answers, word_id=1)
    real_ans = get_last_by_id(answers)
    return { 'answers': real_ans }