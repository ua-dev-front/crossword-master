from dataclasses import dataclass
from enum import Enum
from typing import Callable

Table = list[list[int]]
Answer = str
Question = str
WordOptions = list[str]
Pattern = list[str | None]  # Each element represents either a letter on its respective position or a wildcard (None)

# Accepts word pattern and index of word, returns word options that fit pattern
LoadOptions = Callable[[Pattern, int], WordOptions]


class Direction(Enum):
    ACROSS = 'across'
    DOWN = 'down'


@dataclass
class Position:
    row: int
    column: int

    def __iter__(self):
        return iter((self.row, self.column))


@dataclass
class WordLocation:
    first_letter: Position
    length: int
    type: Direction


@dataclass
class GenerateWord:
    answer: Answer
    question: Question
    start_position: Position


@dataclass
class GenerateWords:
    across: list[GenerateWord]
    down: list[GenerateWord]


@dataclass
class SolveWord:
    question: Question
    start_position: Position
    direction: Direction


SolveWords = list[SolveWord]


@dataclass
class SolveAnswers:
    across: list[Answer]
    down: list[Answer]
