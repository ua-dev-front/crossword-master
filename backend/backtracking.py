from app_types import Direction, LoadOptions, Pattern, Position, Table, WordLocation

__all__ = ['solve']


def increase_position(prev_pos: Position, direction: Direction) -> Position:
    position = Position(prev_pos.row, prev_pos.column)

    if direction.value == 'across':
        position.column += 1
    elif direction.value == 'down':
        position.row += 1

    return position


def update_table(answer: str, table: Table, direction: Direction, start_position: Position) -> None:
    position = Position(start_position.row, start_position.column)

    for letter in answer:
        table[position.row][position.column] = letter
        position = increase_position(position, direction)


def get_word_pattern(table: Table, direction: Direction, start_position: Position, word_len: int) -> Pattern:
    position = Position(start_position.row, start_position.column)
    pattern = []

    for _ in range(word_len):
        if isinstance(table[position.row][position.column], str):
            pattern.append(table[position.row][position.column])
        else:
            pattern.append(None)

        position = increase_position(position, direction)

    return pattern


def word_fits_pattern(pattern: Pattern, word: str) -> bool:
    return all(pattern[ind] is None or letter == pattern[ind] for ind, letter in enumerate(word))


def backtrack(locations: list[WordLocation], table: Table, load_options: LoadOptions,
              current_id: int, answers: list[str], loaded_more_answers: list[bool]) -> list[str] | None:
    if current_id >= len(locations):
        return answers

    word = locations[current_id]
    direction = word.type
    start_position = word.first_letter
    word_len = word.length

    pattern = get_word_pattern(table, direction, start_position, word_len)
    possible_answers = load_options(pattern, current_id)

    while True:
        for possible_answer in possible_answers:
            if word_fits_pattern(pattern, possible_answer):
                update_table(possible_answer, table, direction, start_position)
                next_ans = backtrack(locations, table, load_options, current_id=current_id + 1,
                                     answers=answers, loaded_more_answers=loaded_more_answers)
                if next_ans:
                    answers[current_id] = possible_answer
                    return answers

        if loaded_more_answers[current_id]:
            return None

        possible_answers = load_options(pattern, current_id)
        loaded_more_answers[current_id] = True


def solve(locations: list[WordLocation], table_size: int, load_options: LoadOptions) -> list[str] | None:
    table = [[0 for _ in range(table_size)] for _ in range(table_size)]

    answers = backtrack(locations, table, load_options, current_id=0,
                        answers=[''] * len(locations), loaded_more_answers=[False] * len(locations))

    return answers
