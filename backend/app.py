from flask import Flask, jsonify, request
from typing import TypedDict

from app_types import GenerateResponse, Position, SolveResponse, SolveWords, Table, Word


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


# Endpoints
app = Flask(__name__)


def request_handler(func: callable):
    def wrapper():
        data = request.get_json()
        result = func(data)
        return jsonify(result)

    return wrapper


@app.route('/generate', methods=['POST'], endpoint='generate')
@request_handler
def generate(data: GenerateData) -> GenerateResponse:
    table = data['table']

    return {'words': None}


@app.route('/solve', methods=['POST'], endpoint='solve')
@request_handler
def solve(data: SolveData) -> SolveResponse:
    table = data['table']
    words = data['words']

    parsed_words = {'across': [], 'down': []}
    for direction, value in words.items():
        for word in value:
            parsed_words[direction] = Word(word['id'], word['question'], Position(word['startPosition']['row'],
                                                                                  word['startPosition']['column']))

    solve_words = SolveWords(parsed_words['across'], parsed_words['down'])
    return {'answers': None}
