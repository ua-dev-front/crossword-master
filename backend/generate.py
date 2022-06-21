import requests

from app import API_PATH


def set_words_id(words):
    word_id = 1
    for word in words:
        word['id'] = word_id
        word_id += 1
    return words


def define_words_by_type(word_type, words, coord, is_x=True):
    is_new_word = True

    axis_coord = coord[0] if is_x else coord[1]

    for current_axis_coord in range(axis_coord - 1, axis_coord + 2):
        for word in words:
            current_coord = [current_axis_coord, coord[1]] if is_x else [coord[0], current_axis_coord]

            if current_coord in word['coords'] and coord not in word['coords'] and word['type'] == word_type:
                is_new_word = False
                word['length'] += 1
                word['coords'].append(coord)

    if is_new_word:
        word = {'length': 1, 'coords': [coord], 'type': word_type, 'answer': None, 'api_attempts': 0}
        words.append(word)


def filter_words(words):
    return [word for word in words if word['length'] > 1]


def define_words(table):
    words = []

    for i in range(len(table)):
        for j in range(len(table[i])):
            if table[i][j] == 1:
                define_words_by_type(word_type='across', words=words, coord=[i, j])
                define_words_by_type(word_type='down', words=words, coord=[i, j], is_x=False)

    words = filter_words(words)
    set_words_id(words)

    return words


def get_relation(word, other_word, coord):
    if other_word['id'] != word['id'] and coord in other_word['coords']:
        word['relations'].append({'id': other_word['id'], 'coord': coord})


def get_relations(words):
    for word in words:
        word['relations'] = []
        for coord in word['coords']:
            for other_word in words:
                get_relation(word, other_word, coord)


def find_word_by_id(word_id, words):
    for word in words:
        if word['id'] == word_id:
            return word


def find_coord_index(coord, coords):
    return coords.index(coord)


def get_word_pattern(word, words):
    pattern = '?' * word['length']
    if word['relations']:
        for relation in word['relations']:
            other_word = find_word_by_id(relation['id'], words)

            if other_word['answer']:
                char = other_word['answer'][find_coord_index(relation['coord'], other_word['coords'])]
                coord_index = find_coord_index(relation['coord'], word['coords'])
                pattern = pattern[:coord_index] + char + pattern[coord_index + 1:]

    return pattern


def normalize_question(question):
    return question[2:].capitalize()


def get_answers_and_questions(words):
    for word in words:
        pattern = get_word_pattern(word, words)
        url = API_PATH + '?sp=' + pattern + '&md=d&max=1000'

        response = requests.get(url)
        if response.status_code == 200:
            response_json = response.json()
            if response_json:
                word['answer'] = response_json[word['api_attempts']]['word']
                word['question'] = normalize_question(response_json[word['api_attempts']]['defs'][0])
                word['api_attempts'] += 1
        else:
            print('Error:', response.status_code)


def divide_words_by_type(word_type, words):
    return [word for word in words if word['type'] == word_type]


def is_words_valid(words):
    for word in words:
        if word['answer'] is None or word['question'] is None:
            return False
    return True


def is_no_solution(words):
    for word in words:
        if word['api_attempts'] >= 1000:
            return True
    return False


def normalize_words(words):
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


def generate(table):
    words = define_words(table)
    get_relations(words)

    while not is_words_valid(words) and not is_no_solution(words):
        get_answers_and_questions(words)

    return get_response(words)


generate([[1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 1, 1]])
