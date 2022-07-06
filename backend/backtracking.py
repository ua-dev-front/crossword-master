import re

from app_types import ParsedWord, ParsedWords, Position, PossibleAnswers, RawWords, SolveAnswers, Table

__all__ = ['solve_crossword']


def increase_position(prev_pos: list[Position], direction: str) -> list[int]:
    position = [*prev_pos]

    if direction == 'across':
        position[1] += 1
    elif direction == 'down':
        position[0] += 1

    return position


def is_correct_cell(position: list[Position], table: Table) -> bool:
    return all(coord < len(table) for coord in position) and table[position[0]][position[1]]


def update_table(answer: str, table: Table, direction: str, start_row: Position, start_column: Position) -> None:
    position = [start_row, start_column]
    for letter in answer:
        table[position[0]][position[1]] = letter
        position = increase_position(position, direction)


def get_word_pattern(table: Table, direction: str, start_row: Position, start_column: Position) -> str:
    position = [start_row, start_column]
    pattern = ''

    while is_correct_cell(position, table):
        if table[position[0]][position[1]] == 1:
            pattern += '[a-zA-Z]?'
        elif isinstance(table[position[0]][position[1]], str):
            pattern += table[position[0]][position[1]]

        position = increase_position(position, direction)

    return pattern


def update_answers(answers, answer: str, word_id: int, direction: str) -> None:
    for value in answers.values():
        for word in value:
            if word['id'] == word_id:
                word['answer'] = answer
                return None

    answers[direction].append({'id': word_id, 'answer': answer})


def get_all_words(words: RawWords) -> ParsedWords:
    return [{**word, 'direction': direction} for direction, items in words.items() for word in items]


def get_word(words: ParsedWords, word_id: int, direction: str) -> ParsedWord | None:
    return next((word for word in words if word['id'] == word_id and word['direction'] == direction), None)


def backtracking(words: ParsedWords, table: Table, possible_answers: PossibleAnswers, current_id: int = 0,
                 answers: SolveAnswers = None):
    if answers is None:
        answers = {'across': [], 'down': []}

    if current_id >= len(words):
        return answers

    word = words[current_id]
    direction = word['direction']
    start_row = word['startRow']
    start_column = word['startColumn']
    word_id = word['id']

    pattern = get_word_pattern(table, direction, start_row, start_column)

    for possible_answer in possible_answers[direction][word_id]:
        if re.match(pattern, possible_answer):
            update_table(possible_answer, table, direction, start_row, start_column)
            next_ans = backtracking(words, table, possible_answers, current_id=current_id + 1, answers=answers)
            if next_ans:
                update_answers(answers, possible_answer, word_id, direction)
                return answers


def solve_crossword(words: RawWords, table: Table, possible_answers: PossibleAnswers) -> SolveAnswers | None:
    parsed_words = get_all_words(words)

    answers = backtracking(parsed_words, table, possible_answers)

    if not any(answers.values()):
        return None

    return answers
