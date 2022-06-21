from flask import Flask
app = Flask(__name__)

API_PATH = 'https://api.datamuse.com/words'


@app.route('/')
def test():
    return 'Test successful'
