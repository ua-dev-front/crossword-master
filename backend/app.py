from flask import Flask, request, jsonify
app = Flask(__name__)


@app.route('/')
def test():
    return 'Test successful'


def request_handler(func: callable):
    def wrapper():
        data = request.get_json()
        result = func(data)
        return jsonify(result)
    return wrapper


@app.route('/generate', methods=['POST'], endpoint='generate')
@request_handler
def generate(data: dict[str, list[list[int]]]) -> dict[str, dict[list[dict[str, str | int | list[int]]]] | None]:
    table = data['table']
    return {'words': None}


@app.route('/solve', methods=['POST'], endpoint='solve')
@request_handler
def solve(data: dict[str, list[list[int]] | dict[str, list[dict[str, str | int | list[int]]]]]) -> \
        dict[str, dict[str, list[dict[str, str | int | list[int]]]] | None]:
    table = data['table']
    words = data['words']
    return {'answers': None}
