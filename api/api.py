import time
from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder='../build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/')
def index():
    return {'time': time.time()}


@app.route('/api/time')
@cross_origin()
def get_current_time():
    return {'time': time.time()}
