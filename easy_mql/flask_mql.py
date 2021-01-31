import json
import sys
import time
import pyparsing

from flask import Flask, render_template, request

sys.path.insert(1, '/Users/prashantsakre/Documents/Developer/easy-mql')
from easymql.expressions import Expression

app = Flask(__name__, template_folder='../templates', static_folder='../static')


@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')


@app.route("/about")
def about():
    return render_template('about.html', title='About')


@app.route("/documentation")
def documentation():
    return render_template('documentation.html', title='Docs')


@app.route("/convert", methods=['POST'])
def convert():
    exp = Expression()
    res = None
    try:
        res = exp.parse(request.data.decode("utf-8"))
        json_res = json.dumps(res)
    except pyparsing.ParseException as e:
        return json.dumps({
            "msg": "Error! Entered query is incorrect",
            "error": f"{e.args[2]} but{str(e)[1:]}"
        }), 400
    return json_res


if __name__ == '__main__':
    app.run(debug=True)
