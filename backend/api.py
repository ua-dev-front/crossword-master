import requests

from app_types import Pattern, Question

__all__ = ['get_possible_word_answers', 'get_possible_word_answers_and_questions']

API_PATH = 'https://api.datamuse.com/words'
WILDCARD_CHARACTER = '?'


def get_api_pattern(raw_pattern: Pattern) -> str:
    return ''.join(letter if isinstance(letter, str) else WILDCARD_CHARACTER for letter in raw_pattern)


def api_request(path: str):
    res = requests.get(path)
    if res.status_code == 200:
        return res.json()
    else:
        raise Exception(f'API responded with code: {res.status_code} \nPath: {res.url}')


def get_possible_word_answers(question: Question, pattern: Pattern) -> list[dict[str, str]]:
    api_pattern = get_api_pattern(pattern)
    answers_path = f'{API_PATH}?ml={question}&sp={api_pattern}'
    res = api_request(answers_path)

    return [{'answer': item['word']} for item in res]


def get_possible_word_answers_and_questions(pattern: Pattern) -> list[dict[str, str]]:
    api_pattern = get_api_pattern(pattern)
    generate_path = f'{API_PATH}?sp={api_pattern}&md=d'
    res = api_request(generate_path)

    return [{'answer': item['word'], 'question': item['defs'][0] if 'defs' in item else ''} for item in res]

