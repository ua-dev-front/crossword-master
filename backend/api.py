import requests

from app_types import Pattern, Question

__all__ = ['get_possible_word_answers']

API_PATH = 'https://api.datamuse.com/words'
WILD_CARD_CHARACTER = '?'


def get_api_pattern(raw_pattern: Pattern) -> str:
    return ''.join(letter if isinstance(letter, str) else WILD_CARD_CHARACTER for letter in raw_pattern)


def get_possible_word_answers(question: Question, pattern: Pattern) -> list[str]:
    api_pattern = get_api_pattern(pattern)
    answers_path = f'{API_PATH}?ml={question}&sp={api_pattern}'
    res = requests.get(answers_path)
    if res.status_code == 200:
        return [answer['word'] for answer in res.json()]
    else:
        raise Exception(f'API responded with code: {res.status_code} \nPath: {res.url}')
