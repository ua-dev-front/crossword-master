from dataclasses import dataclass
from enum import Enum
from typing import Callable

Table = list[list[int]]
Id = int
Answer = str
Question = str
WordOptions = list[str]
Pattern = list[str | None]  # Each element represents either a letter on its respective position or a wildcard(None)
LoadOptions = Callable[[Pattern, Id], WordOptions]
BackTrackTable = list[list[str | None]]


class Direction(Enum):
    ACROSS = "across"
    DOWN = "down"


@dataclass
class Position:
    row: int
    column: int


@dataclass
class WordLocation:
    first_letter: Position
    length: int
    type: Direction


@dataclass
class ParsedWord:
    id: Id
    startPosition: Position
    direction: str


ParsedWords = list[ParsedWord]


@dataclass
class Word:
    id: Id
    question: Question
    startPosition: Position


@dataclass
class GenerateWord(Word):
    answer: Answer


@dataclass
class GenerateWords:
    across: list[GenerateWord]
    down: list[GenerateWord]


@dataclass
class GenerateResponse:
    words: GenerateWords | None


@dataclass
class SolveWords:
    across: list[Word]
    down: list[Word]


@dataclass
class SolveAnswer:
    id: Id
    answer: Answer


@dataclass
class SolveAnswers:
    across: list[SolveAnswer]
    down: list[SolveAnswer]


@dataclass
class SolveResponse:
    answers: SolveAnswers | None
