import requests

from app_types import Pattern, Question
from helpers import word_fits_pattern

__all__ = ['get_possible_word_answers', 'get_possible_word_answers_and_questions']

API_PATH = 'https://api.onelook.com/words'
END_OF_SENTENCE = '.'
WILDCARD_CHARACTER = '?'
PART_OF_SPEECH_ORDER = ['n', 'adj', 'v', 'adv', 'u']


def sort_by_part_of_speech(response: list[dict]) -> list[dict]:
    return sorted(
        response,
        key=lambda item: next((PART_OF_SPEECH_ORDER.index(tag) for tag in item.get('tags', [])
                               if tag in PART_OF_SPEECH_ORDER), len(PART_OF_SPEECH_ORDER))
    )


def filter_words(response: list[dict], pattern: Pattern) -> list[dict]:
    return [item for item in response if item['word'].isalpha() and
            # API can return words not actually fitting the pattern (e.g., with extra spaces)
            word_fits_pattern(item['word'], pattern)]


def get_api_pattern(raw_pattern: Pattern) -> str:
    return ''.join(letter if isinstance(letter, str) else WILDCARD_CHARACTER for letter in raw_pattern)


def api_request(path: str) -> list[dict]:
    res = requests.get(path)
    if res.status_code == 200:
        return res.json()
    else:
        raise Exception(
            f'API responded with code: {res.status_code} \nPath: {res.url}')


def get_api_response(path: str, pattern: Pattern) -> list[dict]:
    return sort_by_part_of_speech(filter_words(api_request(path), pattern))


def get_possible_word_answers(question: Question, pattern: Pattern) -> list[str]:
    api_pattern = get_api_pattern(pattern)
    answers_path = f'{API_PATH}?ml={question}&sp={api_pattern}&md=p'

    return [answer['word'] for answer in get_api_response(answers_path, pattern)]


def get_possible_word_answers_and_questions(pattern: Pattern) -> dict[str, str]:
    def normalize_question(question: str) -> str:
        part_of_speech, question = question.split('\t', 1)
        question = question.strip()
        return question.capitalize() + ('' if question.endswith(END_OF_SENTENCE) else END_OF_SENTENCE)

    def is_valid_question(question: str) -> bool:
        return question[:1].isalpha()

    api_pattern = get_api_pattern(pattern)
    generate_path = f'{API_PATH}?sp={api_pattern}&md=dp'

    return {item['word']: question for item in get_api_response(generate_path, pattern)
            if (question := next(filter(is_valid_question,
                                        (normalize_question(question) for question in item.get('defs', []))), None))}
