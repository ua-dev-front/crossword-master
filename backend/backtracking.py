import re

from app_types import Position, PossibleAnswers, RawWord, RawWords, SolveAnswers, Table


__all__ = ['solve_crossword']


def increase_position(prev_pos: Position, direction: str) -> list[int]:
    position = [*prev_pos]

    if direction == 'across':
        position[1] += 1
    elif direction == 'down':
        position[0] += 1

    return position


def is_correct_cell(position: Position, table: Table) -> bool:
    return all(coord < len(table) for coord in position) and table[position[0]][position[1]]


def update_table(answer: str, table: Table, start_position: Position, direction: str) -> None:
    position = [*start_position]
    for letter in answer:
        if is_correct_cell(position, table):
            table[position[0]][position[1]] = letter
            position = increase_position(position, direction)


def get_word_pattern(table: Table, start_pos: Position, direction: str) -> str:
    position = [*start_pos]
    pattern = ''

    while is_correct_cell(position, table):
        if table[position[0]][position[1]] == 1:
            pattern += '[a-zA-Z]?'
        elif isinstance(table[position[0]][position[1]], str):
            pattern += table[position[0]][position[1]]

        position = increase_position(position, direction)

    return pattern


def get_word(words: RawWords, word_id: int) -> RawWord | None:
    for direction in words.values():
        for word in direction:
            if word['id'] == word_id:
                return word

    return None


def get_direction(words: RawWords, word_id: int) -> str | None:
    for direction, value in words.items():
        for word in value:
            if word['id'] == word_id:
                return direction

    return None


def update_answers(answers, answer: str, word_id: int, direction: str) -> None:
    for value in answers.values():
        for word in value:
            if word['id'] == word_id:
                word['answer'] = answer
                return None

    answers[direction].append({'id': word_id, 'answer': answer})


def solve_crossword(words: RawWords, table: Table, possible_answers: PossibleAnswers, word_id: int = 1,
                    answers: SolveAnswers = None) -> SolveAnswers:
    if answers is None:
        answers = {'across': [], 'down': []}

    word = get_word(words, word_id)
    direction = get_direction(words, word_id)

    if not word:
        return answers

    start_position = word['startPosition']

    pattern = get_word_pattern(table, start_position, direction)

    for possible_answer in possible_answers[direction][word_id]:
        if re.match(pattern, possible_answer):
            update_table(possible_answer, table, start_position, direction)
            next_ans = solve_crossword(words, table, possible_answers, word_id=word_id + 1, answers=answers)
            if next_ans:
                update_answers(answers, possible_answer, word_id, direction)
                return answers
