#!remote-logger/bin/python
import logging

from flask import Flask, request, abort, jsonify

app = Flask(__name__)

if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)


@app.route('/')
def index():
    return "Hello, World!"


@app.route('/log', methods=['POST'])
def add_record():
    if not request.json or 'content' not in request.json:
        abort(400)
    app.logger.info(request.json['content'])
    return '', 204


@app.errorhandler(400)
def bad_req_body(error):
    return jsonify({'message': 'No content!'}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0',
            port=5880,
            debug=True)
