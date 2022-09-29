from dataclasses import asdict
from typing import TypedDict

from flask import Flask, jsonify, request
from flask_cors import CORS

from app_types import Answer, Direction, Position, Question, SolveResponse, SolveWord, Table
from generate import generate_words_and_questions
from solve import solve_questions


# types
class GenerateData(TypedDict):
    table: Table


class SolveDataPosition(TypedDict):
    row: int
    column: int


class SolveDataWord(TypedDict):
    id: int
    question: str
    startPosition: SolveDataPosition


class SolveDataWords(TypedDict):
    across: list[SolveDataWord]
    down: list[SolveDataWord]


class SolveData(TypedDict):
    table: Table
    words: SolveDataWords


class GenerateResponseWord(TypedDict):
    answer: Answer
    question: Question
    startPosition: Position


class GenerateResponseWords(TypedDict):
    across: list[GenerateResponseWord]
    down: list[GenerateResponseWord]


class GenerateResponse(TypedDict):
    words: GenerateResponseWords | None


# Endpoints
app = Flask(__name__)
CORS(app, resources={r'*': {'origins': ['http://localhost:3000', 'https://crossword-master.org']}})


def request_handler(func: callable):
    def wrapper():
        data = request.get_json()
        result = func(data)
        return jsonify(result)

    return wrapper


@app.route('/generate', methods=['POST'], endpoint='generate')
@request_handler
def generate(data: GenerateData) -> GenerateResponse:
    answer = generate_words_and_questions(data['table'])
    if answer is None:
        return {'words': None}

    return {'words': {direction: [
        {'answer': word['answer'],
         'question': word['question'],
         'startPosition': word['start_position']}
        for word in words] for direction, words in asdict(answer).items()}}


@app.route('/solve', methods=['POST'], endpoint='solve')
@request_handler
def solve(data: SolveData) -> SolveResponse:
    table = data['table']
    words = data['words']

    solve_words = [SolveWord(word['question'],
                             Position(word['startPosition']['row'], word['startPosition']['column']),
                             Direction(direction)) for direction, value in words.items() for word in value]

    return SolveResponse(solve_questions(table, solve_words))
