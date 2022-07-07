from app_types import LoadMore, ParsedWord, ParsedWords, Position, PossibleAnswers, Pattern, RawWords, SolveAnswers, \
    Table

__all__ = ['solve_crossword']


def increase_position(prev_pos: Position, direction: str) -> Position:
    position = {**prev_pos}

    if direction == 'across':
        position['column'] += 1
    elif direction == 'down':
        position['row'] += 1

    return position


def is_correct_cell(position: Position, table: Table) -> bool:
    return all(coord < len(table) for coord in position.values()) and table[position['row']][position['column']]


def update_table(answer: str, table: Table, direction: str, start_position: Position) -> None:
    position = {**start_position}
    for letter in answer:
        table[position['row']][position['column']] = letter
        position = increase_position(position, direction)


def get_word_pattern(table: Table, direction: str, start_position: Position) -> Pattern:
    position = {**start_position}
    pattern = []

    while is_correct_cell(position, table):
        if table[position['row']][position['column']] == 1:
            pattern.append(None)
        elif isinstance(table[position['row']][position['column']], str):
            pattern.append(table[position['row']][position['column']])

        position = increase_position(position, direction)

    return pattern


def word_fits_pattern(pattern: Pattern, word: str) -> bool:
    return all(pattern[ind] is None or letter == pattern[ind] for ind, letter in enumerate(word))


def get_api_pattern(pattern: Pattern) -> str:
    return ''.join(letter if isinstance(letter, str) else '?' for letter in pattern)


def update_answers(answers, answer: str, word_id: int, direction: str) -> None:
    for value in answers.values():
        for word in value:
            if word['id'] == word_id:
                word['answer'] = answer
                return None

    answers[direction] = [*answers[direction], {'id': word_id, 'answer': answer}]


def get_all_words(words: RawWords) -> ParsedWords:
    return [{**word, 'direction': direction} for direction, items in words.items() for word in items]


def get_word(words: ParsedWords, word_id: int, direction: str) -> ParsedWord | None:
    return next((word for word in words if word['id'] == word_id and word['direction'] == direction), None)


def backtrack(words: ParsedWords, table: Table, possible_answers: PossibleAnswers, load_more_answers: LoadMore,
              current_id: int, answers: SolveAnswers, loaded_more_answers: list[bool]) -> SolveAnswers | None:
    if current_id >= len(words):
        return answers

    word = words[current_id]
    direction = word['direction']
    start_position = word['startPosition']
    word_id = word['id']

    pattern = get_word_pattern(table, direction, start_position)

    while True:
        for possible_answer in possible_answers[direction][word_id]:
            if word_fits_pattern(pattern, possible_answer):
                update_table(possible_answer, table, direction, start_position)
                next_ans = backtrack(words, table, possible_answers, load_more_answers, current_id=current_id + 1,
                                     answers=answers, loaded_more_answers=loaded_more_answers)
                if next_ans:
                    update_answers(answers, possible_answer, word_id, direction)
                    return answers

        if loaded_more_answers[current_id]:
            return None

        possible_answers = load_more_answers(get_api_pattern(pattern), direction, word_id)
        loaded_more_answers[current_id] = True


def solve_crossword(words: RawWords, table: Table, possible_answers: PossibleAnswers, load_more_answers: LoadMore) -> \
        SolveAnswers | None:
    parsed_words = get_all_words(words)

    answers = backtrack(parsed_words, table, possible_answers, load_more_answers, current_id=0,
                        answers={'across': [], 'down': []}, loaded_more_answers=[False]*len(parsed_words))

    if not any(answers.values()):
        return None

    return answers
