#!remote-logger/bin/python
from flask import Flask, request, abort, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return "Hello, World!"


@app.route('/log', methods=['POST'])
def add_record():
    if not request.json or 'content' not in request.json:
        abort(400)
    print request.json['content']
    return 'OK', 201


@app.errorhandler(400)
def bad_req_body(error):
    return jsonify({'message': 'No content!'}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0',
            port=5880,
            debug=True)
