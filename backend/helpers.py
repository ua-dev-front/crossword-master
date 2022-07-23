from app_types import Direction, Position

__all__ = ['increase_position']


def increase_position(previous_position: Position, direction: Direction, delta: int = 1) -> Position:
    row, column = previous_position

    if direction == Direction.ACROSS:
        column += delta
    elif direction == Direction.DOWN:
        row += delta

    return Position(row, column)
