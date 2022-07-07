from typing import TypedDict, Callable

Table = list[list[int | str]]
Id = int
Answer = str
Question = str
DirectionPossibleAnswers = dict[int, list[str]]
Pattern = list[str | None]


class Position(TypedDict):
    row: int
    column: int


class PossibleAnswers(TypedDict):
    across: DirectionPossibleAnswers
    down: DirectionPossibleAnswers


LoadMore = Callable[[Pattern, str, int], PossibleAnswers]


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
