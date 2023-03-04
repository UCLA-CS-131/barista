import time
from flask import Flask, request
from flask_cors import CORS, cross_origin

from f22 import executor

app = Flask(__name__, static_folder='../build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.errorhandler(404)
def not_found(e):
    return "error"

@app.post('/f22')
def f22():
  data = request.json
  print(data)
  if (not "program" in data or not "version" in data):
    return {
        "res": "malformed req"
    }
  try:
    res = executor.run(data["version"], data["program"])
    return { "res": res }
  except Exception as e:
    return {
      "res": f'interpreter error: {str(e)}'
    }
