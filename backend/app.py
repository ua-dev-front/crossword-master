from flask import Flask, jsonify, request

from app_types import GenerateData, GenerateResponse, SolveData, SolveResponse

app = Flask(__name__)

API_PATH = 'https://api.datamuse.com/words'


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
    return {'answers': None}
