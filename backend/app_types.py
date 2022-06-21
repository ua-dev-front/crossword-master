from typing import TypedDict

Table = list[list[int]]
StartPosition = list[int]  # length - 2
Id = int
Answer = str
Question = str


class GenerateData(TypedDict):
    table: Table


class Word(TypedDict):
    id: Id
    question: Question
    startPosition: StartPosition


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
