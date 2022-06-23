from flask import Flask, jsonify, request
from app_types import GenerateData, GenerateResponse, SolveData, SolveResponse
from solve_questions import solve_questions


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
    return solve_questions(table, words)
