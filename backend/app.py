from flask import Flask, jsonify, request
from flask_cors import CORS
from typing import TypedDict

from app_types import Answer, Direction, GenerateResponse, Position, SolveWord, Table
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


class SolveResponseAnswer(TypedDict):
    id: int
    answer: Answer


class SolveResponseAnswers(TypedDict):
    across: list[SolveResponseAnswer]
    down: list[SolveResponseAnswer]


class SolveResponse(TypedDict):
    answers: SolveResponseAnswers | None


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
    return GenerateResponse(generate_words_and_questions(data['table']))


@app.route('/solve', methods=['POST'], endpoint='solve')
@request_handler
def solve(data: SolveData) -> SolveResponse:
    table = data['table']
    words = data['words']

    solve_words = [SolveWord(word['question'],
                             Position(word['startPosition']['row'], word['startPosition']['column']),
                             Direction(direction)) for direction, value in words.items() for word in value]
    answers = solve_questions(table, solve_words)

    if answers is None:
        return {"answers": None}

    parsed_answers = {}
    for direction, value in words.items():
        parsed_answers[direction] = []
        for index, word in enumerate(value):
            parsed_answers[direction].append({"answer": getattr(answers, direction)[index], "id": word['id']})

    return {"answers": parsed_answers}
