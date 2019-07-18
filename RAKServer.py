
from flask import Flask, send_from_directory
app = Flask(__name__, static_url_path='/static')

@app.route('/foo')
def index():
    return 'Hello, World!'

@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('static', path)