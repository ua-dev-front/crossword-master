import requests

from app_types import Pattern, Question

__all__ = ['get_possible_word_answers', 'get_possible_word_answers_and_questions']

API_PATH = 'https://api.datamuse.com/words'
WILDCARD_CHARACTER = '?'
PART_OF_SPEECH_ORDER = ['n', 'adj', 'v', 'adv', 'u']


def sort_by_part_of_speech(response: list[dict]) -> list[dict]:
    return sorted(
        response,
        key=lambda item: PART_OF_SPEECH_ORDER.index(item['tags'][0]) if 'tags' in item else len(PART_OF_SPEECH_ORDER),
    )


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
    answers_path = f'{API_PATH}?ml={question}&sp={api_pattern}&md=p'
    response = sort_by_part_of_speech(api_request(answers_path))

    return [answer['word'] for answer in response]


def get_possible_word_answers_and_questions(pattern: Pattern) -> dict[str, str]:
    def normalize_question(question: str) -> str:
        part_of_speech, question = question.split('\t', 1)
        return question

    api_pattern = get_api_pattern(pattern)
    generate_path = f'{API_PATH}?sp={api_pattern}&md=dp'
    response = filter(lambda item: item.get('defs') is not None, sort_by_part_of_speech(api_request(generate_path)))

    return {item['word']: normalize_question(item['defs'][0]) for item in response}
