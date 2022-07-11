from dataclasses import dataclass
from enum import Enum
from typing import TypedDict, Callable

Table = list[list[int | str]]
Id = int
Answer = str
Question = str
PossibleAnswers = list[list[str]]
Pattern = list[str | None]  # Each element represents either a letter on its respective position or a wildcard(None)


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


# Function that receives word pattern, its id and returns PossibleAnswers with modified possible answers for passed
# word. If no pattern is passed returns not modified PossibleAnswers
LoadOptions = Callable[[Pattern, Id], list[str]]


class RawWord(TypedDict):
    id: Id
    startPosition: Position


class RawWords(TypedDict):
    across: list[RawWord]
    down: list[RawWord]


class ParsedWord(TypedDict):
    id: Id
    startPosition: Position
    direction: str


ParsedWords = list[ParsedWord]


class GenerateData(TypedDict):
    table: Table


class Word(TypedDict):
    id: Id
    question: Question
    startPosition: Position


class GenerateWord(Word):
    answer: Answer


class GenerateWords(TypedDict):
    across: list[GenerateWord]
    down: list[GenerateWord]


class GenerateResponse(TypedDict):
    words: GenerateWords | None


class SolveWords(TypedDict):
    across: list[Word]
    down: list[Word]


class SolveData(TypedDict):
    table: Table
    words: SolveWords


class SolveAnswer(TypedDict):
    id: Id
    answer: Answer


class SolveAnswers(TypedDict):
    across: list[SolveAnswer]
    down: list[SolveAnswer]


class SolveResponse(TypedDict):
    answers: SolveAnswers | None
