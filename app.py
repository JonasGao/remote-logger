#!remote-logger/bin/python
from flask import Flask, request, abort, jsonify

from collector_logger import logger

app = Flask(__name__)


@app.route('/')
def index():
    return "Hello, World!"


@app.route('/log', methods=['POST'])
def add_record():
    if not request.json or 'content' not in request.json:
        abort(400)
    content = request.json['content']
    logger.info(content)
    return '', 204


@app.errorhandler(400)
def bad_req_body(error):
    return jsonify({'message': 'No content!'}), 400


if __name__ == '__main__':
    app.run(port=5880,
            debug=True)
