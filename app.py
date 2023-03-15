from flask import Flask, request
from flask_cors import CORS

from interpreters.f22 import executor as executorf22

app = Flask(__name__, static_folder='build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.errorhandler(404)
def not_found(e):
    return "404"

# this is the result from building CRA
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.post('/f22')
def f22():
  data = request.json
  if (not "program" in data or not "version" in data):
    return {
        "res": "malformed req"
    }
  try:
    res = executorf22.run(data["version"], data["program"])
    return { "res": res }
  except Exception as e:
    return {
      "res": f'interpreter error: {str(e)}'
    }
