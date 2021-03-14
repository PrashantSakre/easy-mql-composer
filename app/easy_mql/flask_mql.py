from app.easy_mql.view import View
from flask import Flask, render_template, request


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
    return view.get_docs(dbname, col_name)


@app.route('/dbs/<dbname>/collections/<col_name>/docs/<_id>', methods=['GET'])
def get_doc(dbname, col_name, _id):
    return view.get_doc(dbname, col_name, _id)
