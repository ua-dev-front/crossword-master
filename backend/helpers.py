from app_types import Direction, Position, Table
from dataclasses import dataclass
from enum import Enum

__all__ = ['Axes', 'cell_exists', 'get_axes', 'shift_position']


class Axis(Enum):
    ROW = 'row'
    COLUMN = 'column'


@dataclass
class Axes:
    changeable: str
    fixed: str


def cell_exists(position: Position, table: Table):
    return position.row in range(len(table)) and position.column in range(len(table[0]))


def get_axes(direction: Direction) -> Axes:
    if direction == Direction.ACROSS:
        return Axes(Axis.COLUMN.value, Axis.ROW.value)
    elif direction == Direction.DOWN:
        return Axes(Axis.ROW.value, Axis.COLUMN.value)
    else:
        raise ValueError('Unknown direction')


def shift_position(previous_position: Position, direction: Direction, delta: int = 1) -> Position:
    new_position = Position(previous_position.row, previous_position.column)
    new_axes_position = getattr(new_position, get_axes(direction).changeable) + delta
    setattr(new_position, get_axes(direction).changeable, new_axes_position)

    return new_position
