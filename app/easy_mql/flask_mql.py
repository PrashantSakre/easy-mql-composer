from bson import json_util
from easymql import EasyMQL
from easymql.exc import EasyMQLSyntaxError
from flask import Flask, render_template, request

from app.easy_mql.view import View

app = Flask(__name__, template_folder='../templates', static_folder='../static')

view = View()


@app.route('/')
@app.route('/home')
def home():
    return render_template('home/home.html')


@app.route('/about')
def about():
    return render_template('about/about.html', title='About')


@app.route('/documentation')
def documentation():
    return render_template('docs/documentation.html', title='Docs')


@app.route('/connect', methods=['POST'])
def connection():
    url = request.data.decode('utf-8')
    return view.connect(url)


@app.route('/disconnect', methods=['POST'])
def disconnect():
    view.disconnect()
    return '', 204


@app.route('/dbs', methods=['GET'])
def get_dbs():
    return view.get_dbs()


@app.route('/dbs/<dbname>/collections', methods=['GET'])
def get_collections(dbname):
    return view.get_collections(dbname)


@app.route('/dbs/<dbname>/collections/<col_name>/docs', methods=['GET'])
def get_docs(dbname, col_name):
    try:
        easy_mql_query = str(request.args['query'])
        app.logger.info(f'Easy MQL: {easy_mql_query}')
        pipeline = EasyMQL().parse(easy_mql_query)
        app.logger.info(f'MQL: {pipeline}')

    except EasyMQLSyntaxError as e:
        return str(e)[1:], 400

    except KeyError:
        pipeline = []

    return json_util.dumps(
        {'query': pipeline, 'result': view.get_docs(dbname, col_name, pipeline)},
        json_options=json_util.RELAXED_JSON_OPTIONS,
    )
