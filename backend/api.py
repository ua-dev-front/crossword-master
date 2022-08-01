import requests

from app_types import Pattern, Question, GenerateApiResponse

__all__ = ['get_possible_word_answers', 'get_possible_word_answers_and_questions']

API_PATH = 'https://api.datamuse.com/words'
WILDCARD_CHARACTER = '?'


def get_api_pattern(raw_pattern: Pattern) -> str:
    return ''.join(letter if isinstance(letter, str) else WILDCARD_CHARACTER for letter in raw_pattern)


def api_request(path: str) -> list[dict]:
    res = requests.get(path)
    if res.status_code == 200:
        return res.json()
    else:
        raise Exception(f'API responded with code: {res.status_code} \nPath: {res.url}')


def get_possible_word_answers(question: Question, pattern: Pattern) -> list[str]:
    api_pattern = get_api_pattern(pattern)
    answers_path = f'{API_PATH}?ml={question}&sp={api_pattern}'
    response = api_request(answers_path)

    return [answer['word'] for answer in response]


def get_possible_word_answers_and_questions(pattern: Pattern) -> list[GenerateApiResponse]:
    def normalize_question(question: str) -> str:
        return question.split('\t', 1)[1]

    api_pattern = get_api_pattern(pattern)
    generate_path = f'{API_PATH}?sp={api_pattern}&md=d'
    response = filter(lambda item: item.get('defs') is not None, api_request(generate_path))

    return [GenerateApiResponse(item['word'], normalize_question(item['defs'][0])) for item in response]
