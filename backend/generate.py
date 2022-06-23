import copy
import requests
import random
from typing import TypedDict

API_PATH = 'https://api.datamuse.com/words'
MAX_API_ATTEMPTS = 1000


Answer = str | None
Coord = list[int]
Coords = list[Coord]
Id = int
Length = int
Pattern = str
Question = str | None
WordType = str


class Relation(TypedDict):
    id: Id
    coord: Coord


class StartWord(TypedDict):
    answer: Answer
    api_attempts: int
    coords: Coords
    length: int
    question: Question
    relations: list[Relation]
    type: WordType


class Word(StartWord):
    id: Id


Words = list[Word]


class NormalizedWord(TypedDict):
    answer: Answer
    id: Id
    question: Question
    startPosition: Coord


NormalizedWords = list[NormalizedWord]


def set_words_id(words: list[StartWord]) -> Words:
    new_words = copy.deepcopy(words)

    word_id = 1
    for word in new_words:
        word['id'] = word_id
        word_id += 1

    return new_words


def modify_existing_word(word: StartWord, coord: Coord) -> None:
    word['length'] += 1
    word['coords'].append(coord)


def get_new_word(coord: Coord, word_type: WordType) -> StartWord:
    word = {
        'length': 1,
        'coords': [coord],
        'type': word_type,
        'answer': None,
        'question': None,
        'api_attempts': 0,
        'relations': []
    }

    return word


def get_current_coord(current_axis_coord: int, coord: Coord, is_x: bool) -> Coord:
    return [current_axis_coord, coord[1]] if is_x else [coord[0], current_axis_coord]


def define_words_by_type(word_type: WordType, words: list[StartWord], coord: Coord, is_x: bool = True) -> \
        list[StartWord]:
    new_words = copy.deepcopy(words)

    is_new_word = True

    axis_coord = coord[0] if is_x else coord[1]

    for current_axis_coord in range(axis_coord - 1, axis_coord + 2):
        for word in new_words:
            current_coord = get_current_coord(current_axis_coord, coord, is_x)
            if current_coord in word['coords'] and coord not in word['coords'] and word['type'] == word_type:
                is_new_word = False
                modify_existing_word(word, coord)

    if is_new_word:
        new_words.append(get_new_word(coord, word_type))

    return new_words


def filter_words(words: Words) -> Words:
    return [word for word in words if word['length'] > 1]


def get_relation(word, other_word, coord) -> None:
    if other_word['id'] != word['id'] and coord in other_word['coords']:
        word['relations'].append({'id': other_word['id'], 'coord': coord})


def get_relations(words: Words) -> Words:
    new_words = copy.deepcopy(words)

    for word in new_words:
        for other_word in new_words:
            for coord in word['coords']:
                get_relation(word, other_word, coord)

    return new_words


def define_words(table) -> Words:
    words = []

    for i in range(len(table)):
        for j in range(len(table[i])):
            if table[i][j] == 1:
                words = define_words_by_type(word_type='across', words=words, coord=[i, j])
                words = define_words_by_type(word_type='down', words=words, coord=[i, j], is_x=False)

    words = filter_words(words)
    words = set_words_id(words)
    words = get_relations(words)

    return words


def find_word_by_id(word_id: Id, words: Words) -> Word:
    for word in words:
        if word['id'] == word_id:
            return word


def find_coord_index(coord: Coord, coords: Coords) -> int:
    return coords.index(coord)


def get_word_pattern(word: Word, words: Words) -> Pattern:
    pattern = '?' * word['length']

    if word['relations']:
        for relation in word['relations']:
            other_word = find_word_by_id(relation['id'], words)

            if other_word['answer']:
                other_word_coord_index = find_coord_index(relation['coord'], other_word['coords'])
                char = other_word['answer'][other_word_coord_index]

                word_coord_index = find_coord_index(relation['coord'], word['coords'])
                pattern = pattern[:word_coord_index] + char + pattern[word_coord_index + 1:]

    return pattern


def normalize_question(question: Question) -> Question:
    return question[2:].capitalize()


def filter_api_response(response):
    return [item for item in response if 'defs' in item]


def get_random_word_from_words(words) -> dict:
    return words[random.randint(0, len(words) - 1)]


def add_answer_and_question_to_word(word, response):
    random_word = get_random_word_from_words(response)

    word.update({
        'answer': random_word['word'],
        'question': normalize_question(random_word['defs'][0]),
        'api_attempts': word['api_attempts'] + 1
    })


def get_api_url(pattern: Pattern) -> str:
    return f'{API_PATH}?sp={pattern}&md=d&max={MAX_API_ATTEMPTS}'


def get_answers_and_questions(words: Words, patterns) -> None:
    for word in words:
        pattern = get_word_pattern(word, words)

        if pattern in patterns:
            add_answer_and_question_to_word(word, patterns[pattern])
        else:
            response = requests.get(get_api_url(pattern)).json()

            if response:
                response = filter_api_response(response)
                add_answer_and_question_to_word(word, response)
                patterns[pattern] = response


def divide_words_by_type(word_type: WordType, words: Words) -> Words:
    return [word for word in words if word['type'] == word_type]


def is_words_valid(words) -> bool:
    for word in words:
        if word['answer'] is None or word['question'] is None:
            return False
    return True


def is_no_solution(words) -> bool:
    for word in words:
        if word['api_attempts'] >= MAX_API_ATTEMPTS:
            return True
    return False


def normalize_words(words) -> NormalizedWords:
    new_words = []

    for word in words:
        new_word = {
            'id': word['id'],
            'question': word['question'],
            'answer': word['answer'],
            'startPosition': word['coords'][0]
        }

        new_words.append(new_word)

    return new_words


def get_response(words):
    response = {'words': None if is_no_solution(words) and not is_words_valid(words) else {
        'across': normalize_words(divide_words_by_type('across', words)),
        'down': normalize_words(divide_words_by_type('down', words))
    }}

    return response


def generate_words(table):
    words = define_words(table)

    patterns = {}

    while not is_words_valid(words) and not is_no_solution(words):
        get_answers_and_questions(words, patterns)

    return get_response(words)
