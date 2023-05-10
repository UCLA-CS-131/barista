from flask import Flask, request
from flask_cors import CORS

from interpreters.f22 import executor as executorf22
from interpreters.s23 import executor as executors23

app = Flask(__name__, static_folder="build", static_url_path="/")
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.errorhandler(404)
def not_found(e):
    return "404"


# this is the result from building CRA
@app.route("/")
def index():
    return app.send_static_file("index.html")


def parse_and_run(executor):
    data = request.json
    if not "program" in data or not "version" in data:
        return {"res": "malformed req"}
    stdin = data["stdin"] if "stdin" in data else None
    try:
        res = executor.run(data["version"], data["program"], stdin)
        return {"res": res}
    except Exception as err:
        return {"res": (str(err) if "ErrorType." in str(err) else "RuntimeError")}


@app.post("/f22")
def f22():
    return parse_and_run(executorf22)


@app.post("/s23")
def s23():
    return parse_and_run(executors23)
