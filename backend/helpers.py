from app_types import Direction, Position
from dataclasses import dataclass
from enum import Enum

__all__ = ['get_axes', 'shift_position']


class Axis(Enum):
    ROW = 'row'
    COLUMN = 'column'


@dataclass
class Axes:
    changeable: str
    fixed: str


def get_axes(direction: Direction) -> Axes:
    if direction == Direction.ACROSS:
        return Axes(Axis.COLUMN.value, Axis.ROW.value)
    elif direction == Direction.DOWN:
        return Axes(Axis.ROW.value, Axis.COLUMN.value)
    else:
        raise ValueError('Unknown direction')


def shift_position(previous_position: Position, direction: Direction, delta: int = 1) -> Position:
    new_position = Position(previous_position.row, previous_position.column)
    new_axes_position = new_position.__getattribute__(get_axes(direction).changeable) + delta
    new_position.__setattr__(get_axes(direction).changeable, new_axes_position)

    return new_position
